from django.conf import settings
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from sendgrid.helpers.mail import From
from sentry_sdk.api import capture_exception
from twilio.rest import Client


class NotificationTransportbackend:
    def send(self, *args, **kwargs):
        raise NotImplementedError("Please Implment it")


class EmailTransportBackend(NotificationTransportbackend):
    def __init__(self, *args, **kwargs):
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        self.client = sg
    
    def send(self, body, send_to, template_id="", subject="Rec confirmation"):
        try:
            message = Mail(
                from_email=From(settings.SENDGRID_IDENTITY, "Rec"),
                to_emails=send_to,
                subject=subject,
                html_content=body,
            )
            message.template_id = template_id
            response = self.client.send(message)
            return response
        except Exception as exc:
            print(exc)
            capture_exception(exc)


class SmsTranportBackend(NotificationTransportbackend):
    def send(self, body, send_to):
        try:
            twilio_client = Client(
                settings.TWILIO_SMS_ACCOUNT_SID, settings.TWILIO_SMS_AUTH_TOKEN
            )
            twilio_client.messages.create(
                to=send_to,
                from_=settings.TWILIO_SMS_FROM_PHONE,
                body=body,
            )
        except Exception as exc:
            print(exc)
            capture_exception(exc)
