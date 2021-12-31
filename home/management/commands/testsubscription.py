from datetime import datetime

import pytz
import stripe
from dateutil.relativedelta import relativedelta
from django.contrib.auth.management.commands import createsuperuser

from users.models import PaymentDetail, Price, User


class Command(createsuperuser.Command):
    help = "Create record about past client_class_sign_up"

    def add_arguments(self, parser):
        parser.add_argument(
            "--client",
            dest="client",
            help="Specifies the client to make subscription.",
            required=True,
        )

        parser.add_argument(
            "--trainer",
            dest="trainer",
            help="Specifies the trainer destination",
            required=True,
        )

    def handle(self, *args, **options):
        customer = stripe.Customer.create(
            description="My First Test Customer (created for API docs)",
        )
        user = User.objects.get(pk=options.get("client"))
        user.stripe_customer_id = customer.id
        user.save()
        card = stripe.Customer.create_source(
            user.stripe_customer_id,
            source="tok_visa",
        )
        trainer = User.objects.get(pk=options.get("trainer"))
        payment_detail, _ = PaymentDetail.objects.get_or_create(
            client=user, trainer=trainer
        )
        product = stripe.Product.create(name=str(payment_detail))
        payment_detail.product_id = product.id
        print(product.id)
        payment_detail.save()

        amount = 6600
        currency = "usd"
        recurring = True
        price = stripe.Price.create(
            unit_amount=amount,
            currency=currency,
            recurring={"interval": "month"},
            product=payment_detail.product_id,
        )
        price_detail = payment_detail.create_price(amount, price.id, recurring, currency)
        now = datetime.now(tz=pytz.UTC)
        subscription_payload = {
            "customer": user.stripe_customer_id,
            "items": [
                {"price": price.id},
            ],
            "expand": ["latest_invoice.payment_intent"],
            "transfer_data": {
                "destination": trainer.stripe_account_id,  # acct_done
            },
            "backdate_start_date": int(
                datetime.timestamp(now + relativedelta(months=-1))
            ),
            "billing_cycle_anchor": int(
                datetime.timestamp(now + relativedelta(hours=+1))
            ),
            "default_payment_method": card.id,
        }
        subscription = stripe.Subscription.create(**subscription_payload)
        print(subscription.id)
        price_detail.subscription_id = subscription.id
        price_detail.create_date_time = now + relativedelta(months=-1)
        Price.objects.filter(id=price_detail.id).update(
            updated_date_time=now + relativedelta(months=-1)
        )
        price_detail.save()
