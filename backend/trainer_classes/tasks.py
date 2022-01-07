from datetime import datetime, timedelta

import pytz
import stripe
from celery import shared_task
from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.db.models import Q

from notification_app.backend import EmailTransportBackend, SmsTranportBackend
from notification_app.body import ReminderHtmlMessageBody, ReminderSmsMessageBody
from notification_app.receiver import ConfirmationMessageDataReceiver
from notification_app.sender import Sender
from trainer_classes.models import ClientClassSignUp, TrainerClass
from users.models import Payment
from push_notifications.models import APNSDevice, GCMDevice
from undercard_push.receivers import (
    on_attendee_signup,
    on_trainer_pre_class_notification,
    on_client_pre_class_notification,
)

if settings.STRIPE_LIVE_MODE:
    stripe.api_key = settings.STRIPE_LIVE_SECRET_KEY
else:
    stripe.api_key = settings.STRIPE_TEST_SECRET_KEY


@shared_task
def change_start_time():
    now_time = datetime.now(tz=pytz.UTC)
    queryset = (
        TrainerClass.objects.all()
        .exclude(repeat=TrainerClass.NEVER)
        .filter(
            Q(end_repeat__isnull=False)
            & Q(published_at__isnull=False)
            & Q(start_time__lte=now_time)
        )
    )
    for trainer_class in queryset:
        if trainer_class.repeat == TrainerClass.DAILY:
            time_delta = trainer_class.start_time + timedelta(days=1)
        elif trainer_class.repeat == TrainerClass.WEEKLY:
            time_delta = trainer_class.start_time + timedelta(weeks=1)
        elif trainer_class.repeat == TrainerClass.MONTHLY:
            time_delta = trainer_class.start_time + relativedelta(months=+1)
        if time_delta <= trainer_class.end_repeat:
            print(trainer_class.name + " - changed")
            trainer_class.start_time = time_delta
            trainer_class.save()


@shared_task
def delete_unpaid_client_class():
    d_minutes = 5
    now_time = datetime.now(tz=pytz.UTC)
    past_time_d_time = now_time - timedelta(minutes=d_minutes)
    queryset = ClientClassSignUp.objects.filter(
        Q(payment_status=ClientClassSignUp.NOT_PAID)
        & Q(created_at__lte=past_time_d_time)
    )

    for client_class in queryset:
        try:
            payment = Payment.objects.filter(client_class=client_class).first()
            if not payment:
                client_class.payment_status = ClientClassSignUp.CANCELED
                client_class.save()
                continue
            else:
                stripe.PaymentIntent.cancel(payment.payment_intent_id)
        except Exception:
            pass
        client_class.payment_status = ClientClassSignUp.CANCELED
        payment.cancelled = True
        client_class.save()
        payment.save()


@shared_task
def send_reminder_notifications(client_class__id: int):
    client_class = ClientClassSignUp.objects.get(pk=client_class__id)
    email_sender = Sender(EmailTransportBackend())
    sms_sender = Sender(SmsTranportBackend())
    sms_body = ReminderSmsMessageBody()
    email_body = ReminderHtmlMessageBody()

    receiver = ConfirmationMessageDataReceiver(client_class.trainer_class, client_class)
    if client_class.phone_number:
        sms_sender.send(sms_body, receiver, send_to=client_class.phone_number)
    if client_class.email_address:
        email_sender.send(
            email_body,
            receiver,
            send_to=client_class.email_address,
            subject="Rec reminder",
        )


@shared_task
def capture_payment_intent(client_class__id: int):
    try:
        client_class = ClientClassSignUp.objects.get(
            pk=client_class__id,
        )
        if (
            client_class.payment_status != ClientClassSignUp.PENDING_CAPTURE
            or client_class.trainer_class.canceled
        ):
            return
        payment = Payment.objects.get(client_class=client_class)
    except ClientClassSignUp.DoesNotExist:
        raise Exception("ClientClass not found")
    except Payment.DoesNotExist:
        raise Exception("Payment not found")
    
    stripe.PaymentIntent.capture(
        payment.payment_intent_id,
    )
    client_class.payment_status = ClientClassSignUp.PAID
    client_class.save()


@shared_task
def payout_class_earnings(trainer_class__id: int):
    try:
        trainer_class = TrainerClass.objects.get(pk=trainer_class__id)
        payments = Payment.objects.filter(client_class__in = 
                ClientClassSignUp.objects.filter (
                    trainer_class = trainer_class,
                    payment_status = ClientClassSignUp.PAID,))
        
        # adding up total, ASSUMPTION: currency is USD
        total_payout_amount = 0.0
        for payment in payments:
            total_payout_amount += payment.price
        if total_payout_amount == 0.0:
            print (str(trainer_class__id) + 
                    " (class id) has no total payouts to make")
            return

        stripe_account = stripe.Account.retrieve(trainer_class.author.stripe_account_id)
        if len(stripe_account.external_accounts.data) == 0:
            print (trainer_class.author.stripe_account_id + 
                    " for trainer has no external account to payout to!")
            return
        # ASSUMPTION: always paying out to the FIRST external account connected
        trainer_bank_account_id = stripe_account.external_accounts.data.first().id
        
        # TODO: check if account has the balance available

        # payout
        payout = stripe.Payout.create(
            amount=100*total_payout_amount, #convert USD to cents
            currency = 'usd',
            destination = trainer_bank_account_id, )

        # TODO: create payout audit with payout info

    except TrainerClass.DoesNotExist:
        raise Exception("TrainerClass not found")
    except ClientClassSignUp.DoesNotExist:
        raise Exception("ClientClass not found")
    except Payment.DoesNotExist:
        raise Exception("Payment not found")
    


@shared_task
def notify_trainers_of_upcoming_class(refdate=datetime.now()):
    """For any trainer class, notify the trainer that the class begins in 12 hours.
    This also checks to make sure the trainer has not been notified already.
    """
    delta = settings.PUSH_MESSAGES["trainer_pre_class_reminder"]["delta"]
    for trainer_class in (
        TrainerClass.objects.upcoming_within(delta, refdate=refdate)
        .not_notified_pre_trainer()
        .all()
    ):
        on_trainer_pre_class_notification(trainer_class)


@shared_task
def notify_clients_of_upcoming_class(refdate=datetime.now()):
    """For any trainer class, notify the clients that the class begins in 12 hours.
    This also checks to make sure the client has not been notified already.
    """
    delta = settings.PUSH_MESSAGES["client_pre_class_reminder"]["delta"]
    for trainer_class in (
        TrainerClass.objects.upcoming_within(delta, refdate=refdate)
        .not_notified_pre_trainer()
        .all()
    ):
        for client in trainer_class.clients.not_notified_pre_clients().all():
            on_client_pre_class_notification(client)
