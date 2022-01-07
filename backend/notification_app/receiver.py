from datetime import timedelta

import stripe
from django.contrib.sites.models import Site
from sentry_sdk.api import capture_exception

from home.api.v1.serializers import TrainerClassSerializer
from trainer_classes.models import ClientClassSignUp, TrainerClass
from trainer_classes.utils import convert_time
from users.models import Payment


class MessageDataReceiver:
    def compile_data(self) -> dict:
        raise NotImplementedError

class ClassCancelationMessageDataReceiver(MessageDataReceiver):
    def __init__(
        self, trainer_class: TrainerClass
    ) -> None:
        self.trainer_class = trainer_class

    @property
    def compile_data(self) -> dict:
        start_time = convert_time(self.trainer_class, self.trainer_class.start_time)
        end_time = start_time + timedelta(minutes=self.trainer_class.duration)
        data = {
            "name": self.trainer_class.name,
            "trainer_name": f"{self.trainer_class.author.first_name} {self.trainer_class.author.last_name}",
            "time": "{0:%B %d, %Y %I:%M%p} - {1:%I:%M%p}".format(start_time, end_time),
            "location": self.trainer_class.location.get("location_name")
            if self.trainer_class.location
            else None,
            }
        return data


class ConfirmationMessageDataReceiver(MessageDataReceiver):
    def __init__(
        self, trainer_class: TrainerClass, client_class: ClientClassSignUp
    ) -> None:
        self.trainer_class = trainer_class
        self.client_class = client_class

    @property
    def compile_data(self) -> dict:
        start_time = convert_time(self.trainer_class, self.trainer_class.start_time)
        end_time = start_time + timedelta(minutes=self.trainer_class.duration)
        data = {
            "site_name": Site.objects.get_current().name,
            "featured_photo": self.trainer_class.featured_photo,
            "name": self.trainer_class.name,
            "trainer_name": f"{self.trainer_class.author.first_name} {self.trainer_class.author.last_name}",
            "time": "{0:%B %d, %Y %I:%M%p} - {1:%I:%M%p}".format(start_time, end_time),
            "link": self.trainer_class.link,
            "password": self.trainer_class.password,
            "location": self.trainer_class.location.get("location_name")
            if self.trainer_class.location
            else None,
            "class_link": TrainerClassSerializer().get_class_link(self.trainer_class),
            "ics_link": self.trainer_class.ics_calendar,
            "google_link": self.trainer_class.google_calendar,
        }
        try:
            payment: Payment = Payment.objects.get(
                client_class=self.client_class, cancelled=False, success=True
            )
            stripe_payment_intent = stripe.PaymentIntent.retrieve(
                payment.payment_intent_id
            ).to_dict_recursive()
            payment_data = stripe_payment_intent["charges"]["data"][0]
            spots_data = {
                "spots": self.client_class.spots.all(),
                "all_price": len(self.client_class.spots.all())
                * self.trainer_class.price,
                "price_by_one": self.trainer_class.price,
            }
            data = {**data, **payment_data, **spots_data}
        except Exception as exc:
            capture_exception(exc)
        return data
