from datetime import datetime

import pytz
import stripe
from django.contrib.auth.management.commands import createsuperuser
from django.db.models import Q

from home.api.v1.viewsets import ClientClassPaymentViewSet
from trainer_classes.models import ClientClassSignUp, PaymentLogs
from users.models import PaymentDetail, Price


class Command(createsuperuser.Command):
    help = "Create record about past client_class_sign_up"

    def handle(self, *args, **options):
        client_class_added = PaymentDetail.objects.exclude(
            client_class__isnull=True
        ).values_list("client_class", flat=True)
        client_class = ClientClassSignUp.objects.filter(
            ~Q(id__in=client_class_added) & Q(payment_status="paid")
        )
        queryset = PaymentLogs.objects.exclude(
            ~Q(event_type="checkout.session.completed")
        ).filter(client__in=client_class)

        self.stdout.write("Count -- %s " % queryset.count())

        for payment_log in queryset:
            self.stdout.write(
                "Payment_intent %s is added -- "
                % payment_log.event_data["payment_intent"],
                ending="",
            )
            try:
                payment_intent = stripe.PaymentIntent.retrieve(
                    payment_log.event_data["payment_intent"]
                )
            except:
                self.stdout.write(self.style.ERROR("Not found"))
            else:
                payment_intent_data = payment_intent["charges"]["data"][0]

                client_class = payment_log.client
                trainer = client_class.trainer_class.author

                if (
                    payment_intent["status"] == "succeeded"
                    and payment_intent_data["paid"]
                ):
                    payment_detail = (
                        ClientClassPaymentViewSet._create_payment_detail_classes(
                            client_class=client_class,
                            trainer=trainer,
                            payment_intent=payment_intent["id"],
                        )
                    )
                    price = payment_detail.create_price(
                        price=payment_intent_data["amount"],
                        currency=payment_intent_data["currency"],
                        success=True,
                    )
                    price.create_date_time = datetime.fromtimestamp(
                        payment_intent_data["created"], tz=pytz.UTC
                    )
                    Price.objects.filter(id=price.id).update(
                        updated_date_time=datetime.fromtimestamp(
                            payment_intent_data["created"], tz=pytz.UTC
                        )
                    )
                    price.save()
                    self.stdout.write(self.style.SUCCESS("OK"))
                else:
                    self.stdout.write(self.style.ERROR(payment_intent_data["status"]))
