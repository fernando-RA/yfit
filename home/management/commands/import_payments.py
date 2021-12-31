import argparse
import sys
from datetime import datetime, timedelta
from pprint import pprint

import pandas as pd
import pytz
import stripe
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models import Q

from trainer_classes.models import PaymentLogs
from users.models import PaymentDetail, Price, User

stripe.api_key = (
    settings.STRIPE_LIVE_SECRET_KEY
    if settings.STRIPE_LIVE_MODE
    else settings.STRIPE_TEST_SECRET_KEY
)
stdoutOrigin = sys.stdout
sys.stdout = open("log5.txt", "w")


class Command(BaseCommand):
    help = "Sync earning price with stripe"

    def _create_charge(self, charge, trainer):
        """Save charge to trainer in the database"""

        customer = stripe.Customer.retrieve(charge.get("customer"))
        try:
            client = User.objects.get(Q(stripe_customer_id=customer.id))
        except User.DoesNotExist:
            client = User.objects.create(
                username=customer.id,
                password="test",
                first_name=customer.email,
                email=customer.email,
                stripe_customer_id=customer.id,
            )
        payment_detail = PaymentDetail.objects.create(client=client, trainer=trainer)
        try:
            product = stripe.Product.create(name=str(payment_detail))
            payment_detail.product_id = product.id
            payment_detail.save()

            price = payment_detail.create_price(price=charge.amount, price_id=charge.id)
        except Exception as e:
            print("Something went wrong")
            return None

        return price

    def _create_payment_intent(self, charge, trainer):
        """
        Save payment_intent to client_class_sign_up

        [Notes]
        Create client_class_sign_up if payment_log was not founded

        Create PaymentDetail objects every time
        """

        payment_log = PaymentLogs.objects.filter(
            event_data__payment_intent=charge.payment_intent
        ).first()
        client = None

        if not payment_log:
            client = User.objects.filter(Q(email=charge.billing_details.email)).first()
            if not client:
                client = User.objects.create(
                    username=charge.customer,
                    password="test",
                    first_name=charge.billing_details.email,
                    email=charge.billing_details.email,
                    stripe_customer_id=charge.customer,
                )

        payment_detail = PaymentDetail.objects.create(
            client=client,
            client_class=payment_log.client if payment_log else None,
            trainer=trainer,
            product_id=charge.payment_intent,
        )

        price = payment_detail.create_price(charge.amount)
        return price

    def _create_invoice(self, charge, trainer):
        customer = stripe.Customer.retrieve(charge.get("customer"))
        try:
            client = User.objects.get(Q(stripe_customer_id=customer.id))
        except User.DoesNotExist:
            client = User.objects.create(
                username=customer.id,
                password="test",
                first_name=customer.email,
                email=customer.email,
                stripe_customer_id=customer.id,
            )

        payment_detail = PaymentDetail.objects.create(client=client, trainer=trainer)

        try:
            invoice = stripe.Invoice.retrieve(charge.invoice)
            payment_detail.product_id = invoice.lines.data[0]["price"]["product"]
            payment_detail.save()

            price = payment_detail.create_price(
                price=invoice.amount_paid,
                recurring=True,
            )
            price.subscription_id = invoice.subscription
            price.save()
        except Exception as e:
            print("Something went wrong")
            return None
        return price

    def file_exist(self, path):
        import os

        if os.path.exists(path):
            return path
        else:
            raise argparse.ArgumentTypeError(f"File {path} does not exists")

    def add_arguments(self, parser):
        parser.add_argument(
            "--date",
            type=lambda s: datetime.strptime(s, r"%Y-%m-%d %H:%M"),
            help='date format "YYYY-MM-DD HH:MM"',
        )
        parser.add_argument(
            "--path",
            type=self.file_exist,
            help="path to csv file with payments from stripe",
            required=True,
        )

    def handle(self, *args, **options):
        data = pd.read_csv(options.get("path"))
        date = options.get("date")
        if not date:
            date = datetime.strptime(
                data["Created (UTC)"][0], r"%Y-%m-%d %H:%M"
            ) + timedelta(minutes=1)
        queryset = Price.objects.filter(
            create_date_time__lte=datetime(2021, 4, 16, 12, 22, tzinfo=pytz.UTC),
            success=True,
        )
        prices = {}
        for index, payment_data in data.iterrows():
            print("=================")
            print(index, payment_data["id"])

            # Get charge item from stripe
            charge = stripe.Charge.retrieve(payment_data["id"])

            # Find destination trainer
            trainer = User.objects.filter(
                stripe_account_id=charge.get("destination")
            ).first()

            # Add amount to prices
            if trainer:
                self.stdout.write(
                    self.style.SUCCESS(f"Trainer {charge.get('destination')} was founded")
                )
            else:
                self.stdout.write(
                    self.style.ERROR(f"Trainer {charge.get('destination')} not found")
                )
            if charge.get("destination") not in prices:
                prices[charge.get("destination")] = 0
            prices[charge.get("destination")] += charge.get("amount")

            # check for type of payment
            # if payment not contains payment_intent - charge
            # if payment contains invoice - subscription
            # if payment contains payment_intent but not contains invoice - payment for class
            if not charge.get("payment_intent"):
                print("It is charge")
                try:
                    price = Price.objects.get(price_id=charge.id)
                    if not trainer and price:
                        price.delete()
                        print("Price was deleted")
                        continue
                except Price.DoesNotExist:
                    if trainer:
                        price = self._create_charge(charge, trainer)
                        print("Charge was created")
                    else:
                        print("Trainer not founded")
                        continue
                print("Price id -- ", price.id)
                if not price.price == charge.get("amount"):
                    print("Amount does not match")
                    continue
                queryset = queryset.exclude(pk=price.id)
            elif charge.get("invoice"):
                print("It is invoice")
                invoice = stripe.Invoice.retrieve(charge.get("invoice"))
                price = queryset.filter(
                    subscription_id=invoice.get("subscription")
                ).first()
                if not trainer and price:
                    price.delete()
                    print("Price was deleted")
                    continue
                if not price:
                    print("Subscription invoice not founded", invoice.get("subscription"))
                    if trainer:
                        price = self._create_invoice(charge, trainer)
                        print("Invoice was created")
                    else:
                        print("Trainer not founded")
                        continue
                print("Price id -- ", price.id)
                if not price.price == charge.get("amount"):
                    print("Amount does not match")
                    continue
                price.invoice_id = invoice.id
                price.save()
                queryset = queryset.exclude(pk=price.id)
            else:
                print("It is payment for class")
                try:
                    price = Price.objects.get(
                        payment_id__product_id=charge.get("payment_intent")
                    )
                    if not trainer and price:
                        price.delete()
                        print("Price was deleted")
                        continue
                except Price.DoesNotExist:
                    print("Payment intent was not founded", charge.get("payment_intent"))
                    if trainer:
                        price = self._create_payment_intent(charge, trainer)
                        print("Payment intent was created\nPrice id --", price.id)
                    else:
                        print("Trainer now founded")
                        continue
                print("Price id -- ", price.id)
                if not price.price == charge.get("amount"):
                    print("Amount does not match")
                    continue
                queryset = queryset.exclude(pk=price.id)
            price.success = True
            price.canceled = False
            price.create_date_time = datetime.fromtimestamp(charge.created, tz=pytz.UTC)
            price.save()
            Price.objects.filter(id=price.id).update(
                updated_date_time=datetime.fromtimestamp(charge.created, tz=pytz.UTC)
            )
            print("Done")

        pprint(prices)
        print("==========\nExtra prices\n==========")
        for price in queryset:
            print(f"price id -- {price.id}")
            price.delete()
        sys.stdout.close()
        sys.stdout = stdoutOrigin
