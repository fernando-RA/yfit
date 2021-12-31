from datetime import datetime
from django_celery_beat.models import ClockedSchedule, PeriodicTask

import json
import pytz
from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.response import Response
from timezonefinder import TimezoneFinder
import typing as T
from home.api.v1.serializers import PaymentLogsSerializer
from trainer_classes.models import ClientClassSignUp, TrainerClass


def convert_time(trainer_class: TrainerClass, time: datetime):
    tf = TimezoneFinder()
    zone_name = "America/New_York"
    if trainer_class.location:
        latitude, longitude = trainer_class.location["lat"], trainer_class.location["lng"]
        zone_name = tf.timezone_at(lng=longitude, lat=latitude)
    zone = pytz.timezone(zone_name)
    return time.astimezone(zone)


def create_log(**kwargs):
    serializer = PaymentLogsSerializer(data=kwargs)
    if serializer.is_valid(raise_exception=True):
        serializer.save()


def calc_amount(client_class: ClientClassSignUp, trainer_class: TrainerClass):
    amount = int(trainer_class.price * 100)
    if client_class.promo_code:
        promo_code = trainer_class.promo_code.filter(
            promo=client_class.promo_code.lower().strip()
        ).first()
        if promo_code:
            amount -= int(amount * promo_code.discount / 100)
    return amount


def change_payment_status(client_id, payment_status):
    client_class : ClientClassSignUp = ClientClassSignUp.objects.get(pk=client_id)

    client_class.payment_status = payment_status
    if payment_status == ClientClassSignUp.CANCELED:
        client_class.canceled_at = datetime.datetime.now(tz=pytz.UTC)
    client_class.save()

    return Response({"detail": "payment status updated"},
            status=status.HTTP_200_OK)

def payment_schedule(client_class_id: int):
    client_class : ClientClassSignUp = ClientClassSignUp.objects.get(pk=client_class_id)

    if not client_class.trainer_class.free and not client_class.capture_payment_task:
        clocked_time = ClockedSchedule.objects.create(
            clocked_time=client_class.trainer_class.start_time,
        )
        task = PeriodicTask.objects.create(
            name=f"Capture payment for the client_class with id {client_class.id}",
            task="trainer_classes.tasks.capture_payment_intent",
            kwargs=json.dumps({"client_class__id": client_class.id}),
            clocked=clocked_time,
            one_off=True,
            start_time=datetime.now(pytz.UTC),
            enabled=True,
        )
        ClientClassSignUp.objects.filter(pk=client_class.id).update(
            capture_payment_task=task,
        )

def create_payout_task(trainer_class_id: int): 
    trainer_class = TrainerClass.objects.get(pk=trainer_class_id)
    if not trainer_class.payout_task:
        clocked_time = ClockedSchedule.objects.create(
            clocked_time=trainer_class.start_time,
        )
        task = PeriodicTask.objects.create(
            name=f"capture payout task for class id {trainer_class.id}",
            task="trainer_classes.tasks.payout_class_earnings",
            kwargs=json.dumps({"trainer_class__id": trainer_class.id}),
            clocked= clocked_time,
            one_off=True,
            start_time=datetime.now(pytz.UTC),
            enabled=True,
            )
        trainer_class = TrainerClass.objects.get(pk=trainer_class.id)
        trainer_class.payout_task = task
        trainer_class.save()

def create_reminder_task(client_class_id: int):
    client_class : ClientClassSignUp = ClientClassSignUp.objects.get(pk=client_class_id)

    if not client_class.reminder_task:
        clocked_time = ClockedSchedule.objects.create(
            clocked_time=client_class.trainer_class.start_time
            - client_class.trainer_class.REMINDER_HOURS
        )
        task = PeriodicTask.objects.create(
            name=f"Reminder notifications for client_class with id {client_class.id}",
            task="trainer_classes.tasks.send_reminder_notifications",
            kwargs=json.dumps({"client_class__id": client_class.id}),
            clocked=clocked_time,
            one_off=True,
            start_time=datetime.now(pytz.UTC),
            enabled=True,
        )
        ClientClassSignUp.objects.filter(pk=client_class.pk).update(reminder_task=task)
