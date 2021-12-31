from django.db.models.query_utils import Q

from notification_app.backend import EmailTransportBackend
from notification_app.body import ConfirmationHtmlMessageBody, ClassCancelationHtmlMessageBody
from notification_app.receiver import ConfirmationMessageDataReceiver, ClassCancelationMessageDataReceiver
from notification_app.sender import Sender
from trainer_classes.models import ClientClassSignUp, Spot, TrainerClass
from trainer_classes.utils import create_log
from users.models import Payment


def checkout_session_async_payment_failed(event):
    event_object = event["data"]["object"]
    payment = Payment.objects.get(payment_intent_id=event_object["payment_intent"])
    payment.success = False
    payment.save()

    create_log(
        stripe_session_id=event_object["id"],
        event_type=event["type"],
        event_data=event_object,
        payment=payment.id,
    )

def _send_class_cancelation_notification(sign_up: ClientClassSignUp):
    email_sender = Sender(EmailTransportBackend())
    email_body = ClassCancelationHtmlMessageBody()
    receiver = ClassCancelationMessageDataReceiver(sign_up.trainer_class)
    for spot in sign_up.spots.all():
        if spot.email_address:
            email_sender.send(
                body=email_body, 
                receiver=receiver, 
                send_to=spot.email_address,
                subject="Rec: Class Cancelation")

def _send_class_cancel_confirmation(trainer_class: TrainerClass):
    email_sender = Sender(EmailTransportBackend())
    email_body = ClassCancelationHtmlMessageBody()
    receiver = ClassCancelationMessageDataReceiver(trainer_class)
    email_sender.send(
        body=email_body, 
        receiver=receiver, 
        send_to=trainer_class.author.email,
        subject="Rec: Class Canceled")


def _send_success_notification(client_class__id: int):
    client_class = ClientClassSignUp.objects.get(pk=client_class__id)
    trainer_class = client_class.trainer_class
    email_sender = Sender(EmailTransportBackend())
    email_body = ConfirmationHtmlMessageBody()
    receiver = ConfirmationMessageDataReceiver(trainer_class, client_class)

    email_sender.send(email_body, receiver, send_to=client_class.email_address)


def checkout_session_completed(event, client_id):
    event_object = event["data"]["object"]
    payment = Payment.objects.get(payment_intent_id=event_object["payment_intent"])

    create_log(
        stripe_session_id=event_object["id"],
        event_type=event["type"],
        event_data=event_object,
        payment=payment.id,
    )

    if event_object["payment_status"] == ClientClassSignUp.PAID:
        print("I'm sending")
        _send_success_notification(payment.client_class.id)
        payment.success = True
        payment.save()


def charge_succeeded(event):
    event_object = event["data"]["object"]
    payment = Payment.objects.get(charge_id=event_object["id"])
    create_log(
        event_type=event["type"],
        event_data=event_object,
        payment=payment.id,
    )
    if event["type"] == "charge.succeeded":
        "Processing charge succeeded"
        payment.success = True
        payment.save()


def _invoice_paid(event):
    """Processing a payment of invoice"""
    DEFAULT_PK = -1
    event_object = event["data"]["object"]
    metadata = event_object["lines"]["data"][0]["metadata"]
    payment = Payment.objects.get(
        Q(pk=int(metadata.get("payment_id", DEFAULT_PK)))
        | Q(invoice_id=event_object["id"])
    )
    if event_object["status"] == ClientClassSignUp.PAID:
        payment.success = True

    payment.save()

    create_log(
        event_type=event["type"],
        event_data=event_object,
        payment=payment.id,
    )


def _invoice_created(event):
    """Processing a new invoice for created subscription"""
    event_object = event["data"]["object"]
    price = event_object["lines"]["data"][0]["price"]
    recurring = True if price["type"] == "recurring" else False
    currency = event_object["currency"]
    subscription_id = event_object["subscription"]
    amount_due = event_object["amount_due"]

    past_subscription = Payment.objects.filter(subscription_id=subscription_id).first()
    payment = Payment.objects.create(
        client=past_subscription.client,
        trainer=past_subscription.trainer,
        success=False,
        recurring=recurring,
        price=amount_due,
        currency=currency,
        subscription_id=subscription_id,
        invoice_id=event_object["id"],
        payment_type=Payment.SUBSCRIPTION_UPDATE,
    )
    create_log(
        event_type=event["type"],
        event_data=event_object,
        payment=payment.id,
    )


def invoice(event):
    event_object = event["data"]["object"]
    if (
        event["type"] == "invoice.created"
        and event_object["billing_reason"] == "subscription_cycle"
    ):
        _invoice_created(event)
    elif event["type"] == "invoice.paid":
        _invoice_paid(event)
