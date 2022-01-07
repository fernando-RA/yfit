from django.conf import settings
from django.core.management.base import BaseCommand
from sentry_sdk import capture_exception
from twilio.base.exceptions import TwilioRestException
from twilio.rest import Client

from trainer_classes.models import TrainerClass


class Command(BaseCommand):
    help = "Send custom SMS reminder to clients"

    def add_arguments(self, parser):
        parser.add_argument("--hash", type=str, help="hash of the trainer_class")
        parser.add_argument(
            "--text",
            type=str,
            help="test of sms reminder",
            required=True,
        )
        parser.add_argument("--phone", action="append", default=[])

    def handle(self, *args, **options):
        trainer_class = None
        try:
            if options.get("hash"):
                trainer_class = TrainerClass.objects.get(hash=options.get("hash"))
        except TrainerClass.DoesNotExist:
            print("Trainer class not found")
            return
        twilio_client = Client(
            settings.TWILIO_SMS_ACCOUNT_SID, settings.TWILIO_SMS_AUTH_TOKEN
        )
        phones = options.get("phone")
        if trainer_class:
            for client in trainer_class.clients.all():
                if client.phone_number:
                    phones.append(client.phone_number)
        for phone in phones:
            try:
                twilio_client.messages.create(
                    to=phone,
                    from_=settings.TWILIO_SMS_FROM_PHONE,
                    body=options.get("text"),
                )
            except TwilioRestException as e:
                with open("log_custom_sms.txt", mode="w", encoding="utf-8") as f:
                    f.write(str(e))
                capture_exception(e)
