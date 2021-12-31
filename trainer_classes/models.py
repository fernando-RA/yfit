import json
import os
import urllib
from datetime import datetime, timedelta
from typing import List

import pytz
from autoslug import AutoSlugField
from django.contrib.postgres.fields import ArrayField, JSONField
from django.core.files.storage import default_storage
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.forms.models import model_to_dict
from django.db.models import Q, Count
from django.utils.translation import ugettext_lazy as _
from django_celery_beat.models import ClockedSchedule, PeriodicTask
from ics import Calendar, Event
from arrow import Arrow
from imagekit.models import ImageSpecField
from taggit.managers import TaggableManager

from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import Payment, User

def custom_hash_code():
    return "".join("%02x" % x for x in os.urandom(8))

class PromoCode(models.Model):
    """Promo codes for trainer class"""

    promo = models.CharField(max_length=256)
    discount = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)]
    )

    def save(self, *args, **kwargs) -> None:
        self.promo = self.promo.lower().strip()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.promo} -> {self.discount}%"


class TrainerClassQueryset(models.QuerySet):
    def upcoming_within(self, delta: timedelta, refdate=datetime.now()):
        """Filters for trainer classes that start within a certain timeframe."""
        return self.filter(start_time__lt=(refdate + delta)) & self.filter(
            start_time__gt=(refdate)
        )

    def not_notified_pre_trainer(self):
        """All trainer classes that have not been sent a push notification."""
        return self.annotate(
            preclasstrainerpushlog_count=Count("preclasstrainerpushlog")
        ).filter(preclasstrainerpushlog_count=0)


class TrainerClass(models.Model):
    """Trainer Classes for multiple joins"""

    NEVER = "never"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    REPEAT_TYPE = (
        (NEVER, _("Never")),
        (DAILY, _("Daily")),
        (WEEKLY, _("Weekly")),
        (MONTHLY, _("Monthly")),
    )

    IN_PERSON = "in_person"
    VIRTUAL = "virtual"
    TYPE = [
        (IN_PERSON, _("In Person")),
        (VIRTUAL, _("Virtual")),
    ]

    FLEXIBLE = "flexible"
    MODERATE = "moderate"
    STRICT = "strict"
    POLICY = [
        (FLEXIBLE, _("Flexible")),
        (MODERATE, _("Moderate")),
        (STRICT, _("Strict")),
    ]
    REMINDER_HOURS = timedelta(hours=6)

    ########
    ### Object manager
    ########
    objects = TrainerClassQueryset.as_manager()

    name = models.CharField(null=True, blank=True, max_length=255)
    author: User = models.ForeignKey(
        "users.User",
        related_name="trainer_classes",
        on_delete=models.CASCADE,
    )
    start_time = models.DateTimeField(null=True, blank=True)
    duration = models.PositiveIntegerField(default=0)
    repeat = models.CharField(
        max_length=10,
        choices=REPEAT_TYPE,
        default=NEVER,
    )
    end_repeat = models.DateTimeField(null=True, blank=True)
    featured_photo = models.ImageField(
        upload_to="featured_photo", max_length=200, null=True, blank=True
    )
    featured_photo__thumbnail = ImageSpecField(
        source="featured_photo",
        options={"quality": 90},
        format="JPEG",
    )
    featured_video = models.FileField(upload_to="featured_video", null=True, blank=True)
    free = models.BooleanField(default=False)
    details = models.TextField(null=True, blank=True)
    equipment = models.CharField(null=True, blank=True, max_length=255)
    tags = TaggableManager(
        blank=True,
    )
    type = models.CharField(
        max_length=10,
        choices=TYPE,
        default=IN_PERSON,
    )
    location = JSONField(blank=True, null=True)
    suggested_locations = ArrayField(JSONField(null=True), blank=True, null=True)
    location_notes = models.TextField(null=True, blank=True)
    safety_protocol = models.TextField(null=True, blank=True)
    link = models.CharField(null=True, blank=True, max_length=255)
    password = models.CharField(max_length=128, null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    is_attendee_limit = models.BooleanField(default=False)
    attend_limit_count = models.PositiveIntegerField(
        validators=[MaxValueValidator(250)], default=0
    )
    promo_code = models.ManyToManyField(PromoCode, blank=True)
    cancellation_policy = models.CharField(
        max_length=10,
        choices=POLICY,
        default=FLEXIBLE,
    )
    slug = AutoSlugField(
        null=True, blank=True, populate_from="name", unique=True, always_update=False
    )
    hash = models.CharField(max_length=30, default=custom_hash_code)
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True, blank=True)
    geotag = JSONField(blank=True, null=True)
    canceled = models.BooleanField(default=False)
    payout_task = models.ForeignKey(
        PeriodicTask, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    trending_override = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "trainer_class"
        unique_together = (
            "name",
            "hash",
        )
        verbose_name = "Trainer Class"
        verbose_name_plural = "Trainer Classes"
        indexes = [
            models.Index(fields=["hash"]),
            models.Index(fields=["start_time"]),
            models.Index(fields=["published_at"]),
            models.Index(fields=["type"]),
            models.Index(fields=["free"]),
            models.Index(fields=["author"]),
        ]

    def get_clients_count(self):
        return sum(
            [
                len(item.get_spots())
                for item in self.clients.all()
                if item.payment_status
                in [
                    ClientClassSignUp.NOT_PAID,
                    ClientClassSignUp.PAID,
                    ClientClassSignUp.PENDING_CAPTURE,
                ]
            ]
        )

    def client_can_join(self, peoples_count=1):
        if self.is_attendee_limit and (
            self.attend_limit_count < (self.get_clients_count() + peoples_count)
        ):
            return False
        return True

    @property
    def ics_calendar(self):
        if not default_storage.exists(f"{self.hash}.ics"):
            self.create_or_update_calendar_ics()
        return default_storage.url(f"{self.hash}.ics")

    @property
    def google_calendar(self):
        """
        https://www.google.com/calendar/render?action=TEMPLATE&text=Title&details=SomeDescription&location=NYC%2C+NY%2C+USA&dates=20210402T142000Z/20210416T142000Z
        """
        CALENDAR_LINK = "https://www.google.com/calendar/render?"
        start_time = self.start_time
        class_end_time = start_time + timedelta(
            minutes=self.duration if self.duration else 0
        )

        query = urllib.parse.urlencode(
            {
                "action": "TEMPLATE",
                "text": self.name,
                "details": f"Join zoom meeting: {self.link} \nPasscode: {self.password}"
                if self.type == self.VIRTUAL
                else "",
                "location": "zoom"
                if self.type == self.VIRTUAL
                else self.location.get("location_name")
                if self.location
                else "",
                "dates": "{0:%Y%m%dT%H%M%SZ}/{1:%Y%m%dT%H%M%SZ}".format(
                    start_time, class_end_time
                ),
            }
        )
        return CALENDAR_LINK + query

    def create_or_update_event(self) -> Event:
        event = Event()

        event.name = self.name
        event.begin = self.start_time
        event.duration = timedelta(minutes=self.duration if self.duration else 0)
        if self.type == self.IN_PERSON:
            if self.location:
                event.geo = {
                    "latitude": self.location.get("lat"),
                    "longitude": self.location.get("lng"),
                }
                event.location = self.location.get("location_name")
            else:
                return
        else:
            event.description = (
                f"Join zoom meeting: {self.link} \nPasscode: {self.password}"
            )
        return event

    @property
    def event(self) -> Event:
        return self.create_or_update_event()

    @property
    def next_ocurrence(self) -> datetime:
        return self.event.begin.native

    @property
    def time_until(self, ref=datetime.utcnow()):
        return

    def create_or_update_calendar_ics(self):
        cal = Calendar()
        cal.events.add(self.event)
        with default_storage.open(f"{self.hash}.ics", "w") as f:
            f.write(str(cal))
        return cal

    def save(self, *args, **kwargs) -> None:
        queryset: List[ClientClassSignUp] = self.clients.all()
        for client_class in queryset:
            if client_class.reminder_task:
                client_class.reminder_task.clocked.clocked_time = (
                    self.start_time - self.REMINDER_HOURS
                )
                client_class.reminder_task.clocked.save()
            if client_class.capture_payment_task:
                client_class.capture_payment_task.clocked.clocked_time = self.start_time
                client_class.capture_payment_task.clocked.save()
        super().save(*args, **kwargs)




class ClientClassSignUpQuerySet(models.QuerySet):
    def upcoming_within(self, delta: timedelta, refdate=datetime.now()):
        """Filters for trainer classes that start within a certain timeframe."""
        return self.filter(
            client_class__start_time__lt=(refdate + delta)
        ) & self.filter(client_class__start_time__gt=(refdate))

    def not_notified_pre_clients(self):
        """All trainer classes that have not notified the client."""
        return self.annotate(
            preclassclientpushlog_count=Count("preclassclientpushlog")
        ).filter(preclassclientpushlog_count=0)


class ClientClassSignUp(models.Model):
    """Client Sign Ups to Trainer Classes"""

    NOT_PAID = "not_paid"
    PAID = "paid"
    CANCELED = "canceled"
    FAILED = "failed"
    REFUNDED = "refunded"
    PENDING_CAPTURE = "pending_capture"
    PAYMENT_STATUS = (
        (NOT_PAID, _("Not Yet Paid")),
        (PAID, _("Paid")),
        (CANCELED, _("Canceled")),
        (FAILED, _("Failed")),
        (REFUNDED, _("Refunded")),
        (PENDING_CAPTURE, _("Pending Capture")),
    )

    objects = ClientClassSignUpQuerySet.as_manager()

    user: User = models.ForeignKey(
        "users.User",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="class_sign_ups",
    )
    trainer_class: TrainerClass = models.ForeignKey(
        TrainerClass,
        related_name="clients",
        on_delete=models.CASCADE,
    )
    spots_count = models.PositiveIntegerField(default=1)
    first_name = models.CharField(null=True, blank=True, max_length=255)
    last_name = models.CharField(null=True, blank=True, max_length=255)
    first_name_referred = models.CharField(null=True, blank=True, max_length=255)
    last_name_referred = models.CharField(null=True, blank=True, max_length=255)
    email_address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    promo_code = models.CharField(max_length=256, blank=True, null=True)
    spots = models.ManyToManyField("Spot", blank=True)
    subscribe_to_emails = models.BooleanField(default=False)
    agree_to_safety_waver = models.BooleanField(default=False)
    payment_method = models.CharField(max_length=20, blank=True, null=True)
    payment_status = models.CharField(
        max_length=16,
        choices=PAYMENT_STATUS,
        default=NOT_PAID,
    )
    reminder_task = models.ForeignKey(
        PeriodicTask,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    capture_payment_task = models.ForeignKey(
        PeriodicTask,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="client",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    canceled_at = models.DateTimeField(null=True, blank=True)
    geotag = JSONField(blank=True, null=True)

    # Notification settings
    trainer_notified = models.BooleanField(default=False)

    class Meta:
        db_table = "client_class_sign_up"
        verbose_name = "Client Class Sign Up"
        verbose_name_plural = "Client Class Sign Ups"
        unique_together = (
            "trainer_class",
            "email_address",
        )
        indexes = [
            models.Index(fields=["trainer_class"]),
            models.Index(fields=["-created_at"]),
        ]

    def get_spots(self):
        spots = [
            model_to_dict(spot, fields=["first_name", "last_name", "email_address"])
            for spot in self.spots.all()
        ]
        return spots or [
            {
                "first_name": self.first_name,
                "last_name": self.last_name,
                "email_address": self.email_address,
            }
        ]

    def get_email_address(self):
        email = None
        if self.user:
            email = self.user.email
        else:
            email = self.email_address
        return email


class Spot(models.Model):
    """
    Spots for Client Class Sign Ups
    """

    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    email_address = models.CharField(max_length=255, null=True, blank=True)
    did_attend = models.BooleanField(null=True)

    def __str__(self):
        return self.email_address or f"{self.last_name} {self.first_name}"


class PaymentLogs(models.Model):
    """Client Sign Ups Payment Logs"""

    stripe_session_id = models.CharField(null=True, blank=True, max_length=255)
    event_type = models.CharField(null=True, blank=True, max_length=255)
    event_data = JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    payment: Payment = models.ForeignKey(
        "users.Payment",
        related_name="logs",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Client Class Payment Log"
        verbose_name_plural = "Client Class Payment Logs"

    @classmethod
    def get_actual_log(cls, **kwargs):
        """Get last created log by arguments. Every argument is used to filter query"""
        return cls.objects.filter(**kwargs).order_by("-created_at").first()


def connect_signals():
    from undercard_push.receivers import (
        on_class_creation,
        on_attendee_signup,
    )
    post_save.connect(on_class_creation, sender=TrainerClass)
    post_save.connect(on_attendee_signup, sender=ClientClassSignUp)
    #post_save.connect(on_payment_confirmation, sender=ClientClassSignUp)

connect_signals()



