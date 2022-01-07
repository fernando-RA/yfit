import os

from autoslug import AutoSlugField
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.urls import reverse
from imagekit.models import ImageSpecField
from pilkit.processors.resize import ResizeToFill



def custom_hash_code():
    return "".join("%02x" % x for x in os.urandom(8))


class User(AbstractUser):
    TRAINER = "trainer"
    CLIENT = "client"
    TYPE = [
        (TRAINER, "Trainer"),
        (CLIENT, "Client"),
    ]

    name = models.CharField(
        null=True,
        blank=True,
        max_length=255,
    )
    email = models.EmailField(
        null=True,
        blank=True,
        max_length=254,
    )
    user_type = models.CharField(max_length=10, choices=TYPE, default=CLIENT)
    profile_picture = models.ImageField(
        upload_to="user_photo", null=True, blank=True, max_length=200
    )
    profile_picture__thumbnail = ImageSpecField(
        source="profile_picture",
        options={"quality": 90},
        cachefile_strategy="imagekit.cachefiles.strategies.Optimistic",
        format="JPEG",
        processors=[ResizeToFill(960, 640)],
    )
    bio = models.TextField(null=True, blank=True, default="null")
    stripe_customer_id = models.CharField(max_length=150, null=True, blank=True)
    stripe_account_id = models.CharField(max_length=150, null=True, blank=True)
    instagram_link = models.CharField(max_length=500, null=True, blank=True)
    workout_types = models.ManyToManyField("WorkoutType", blank=True)
    geotag = JSONField(blank=True, null=True)
    phone_number = models.CharField(max_length=255, null=True, blank=True)
    referral_code = models.CharField(max_length=500, blank=True, null=True)
    hash = models.CharField(max_length=30, default=custom_hash_code)
    first_name = models.CharField(max_length=30, blank=True, default="null")
    last_name = models.CharField(max_length=150, blank=True, default="null")    
    slug = AutoSlugField(
        null=True,
        blank=True,
        populate_from="get_full_name",
        unique=True,
        always_update=True,
    )
    verified_trainer = models.BooleanField(default=False)

    def follow(self, followed_by: "User"):
        from undercard_push.receivers import on_trainer_followed
        # TODO: do the database work. For now a notification is sent to
        # the trainer.
        if self.user_type not in (self.TRAINER,):
            return
        on_trainer_followed(self, followed_by)
    
    def save(self, *args, **kwargs):
        """
        Overrides save, copy email to username field on creation
        """
        if not self.pk:
            self.username = self.email
        saved_instance = super(User, self).save(*args, **kwargs)
        return saved_instance
    
    class Meta:
        indexes = [
            models.Index(fields=["user_type"]),
        ]

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    def social_profile_url(self):
        if self.socialaccount_set.all():
            return self.socialaccount_set.all()[0].get_avatar_url()
        return ""


class WorkoutType(models.Model):
    workout_type = models.CharField(max_length=500)

    def __str__(self):
        return self.workout_type


class ProfilePictures(models.Model):
    user = models.ForeignKey(User, related_name="photos", on_delete=models.CASCADE)
    picture = models.ImageField(upload_to="user_photo", max_length=200)
    picture__thumbnail = ImageSpecField(
        source="picture",
        options={"quality": 90},
        cachefile_strategy="imagekit.cachefiles.strategies.Optimistic",
        format="JPEG",
        processors=[ResizeToFill(960, 640)],
    )
    is_profile_picture = models.BooleanField(default=False)

    def set_is_profile_picture(self):
        self.is_profile_picture = True
        self.save()

    def remove_is_profile_picture(self):
        self.is_profile_picture = False
        self.save()

    class Meta:
        indexes = [models.Index(fields=["user"])]


class PaymentDetail(models.Model):
    client = models.ForeignKey(
        User,
        related_name="payment_transferred",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    trainer = models.ForeignKey(
        User, related_name="payment_received", on_delete=models.CASCADE
    )
    product_id = models.CharField(max_length=250, null=True)
    client_class = models.ForeignKey(
        "trainer_classes.ClientClassSignUp",
        related_name="payment_client_class",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"{self.client.email if self.client else self.client_class.get_email_address()} -> {self.trainer.email}"

    def create_price(
        self, price, price_id=None, recurring=None, currency="usd", success=True
    ):
        return Price.objects.create(
            payment=self,
            price=price,
            price_id=price_id,
            currency=currency,
            recurring=True if recurring else False,
            success=success,
        )

    class Meta:
        indexes = [
            models.Index(fields=["client", "trainer"]),
            models.Index(fields=["trainer", "client_class"]),
        ]


class Price(models.Model):
    payment = models.ForeignKey(
        PaymentDetail, related_name="prices", on_delete=models.CASCADE
    )
    price = models.FloatField(default=0.0)
    currency = models.CharField(max_length=50, null=True)
    price_id = models.CharField(max_length=250, null=True, blank=True)
    subscription_id = models.CharField(max_length=250, null=True, blank=True)
    recurring = models.BooleanField(default=False)
    create_date_time = models.DateTimeField(auto_now_add=True)
    updated_date_time = models.DateTimeField(auto_now=True)
    success = models.BooleanField(default=True)
    cancelled = models.BooleanField(default=False)
    invoice_id = models.CharField(max_length=250, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["-updated_date_time"]),
            models.Index(fields=["recurring"]),
            models.Index(fields=["payment"]),
        ]


class Payment(models.Model):
    CHARGE = "charge"
    SUBSCRIPTION_CREATION = "subscription creation"
    SUBSCRIPTION_UPDATE = "subscription update"
    CHECKOUT_PAYMENT = "checkout payment"
    TYPE = [
        (CHARGE, "Charge"),
        (SUBSCRIPTION_CREATION, "Subscription creation"),
        (SUBSCRIPTION_UPDATE, "Subscription update"),
        (CHECKOUT_PAYMENT, "Checkout payment"),
    ]
    client = models.ForeignKey(
        User,
        related_name="transferred_payments",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )
    trainer = models.ForeignKey(
        User, related_name="received_payments", on_delete=models.CASCADE
    )
    client_class = models.ForeignKey(
        "trainer_classes.ClientClassSignUp",
        related_name="client_class_payments",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
    )

    create_date_time = models.DateTimeField(auto_now_add=True)
    updated_date_time = models.DateTimeField(auto_now=True)

    success = models.BooleanField(default=False)
    recurring = models.BooleanField(default=False)
    cancelled = models.BooleanField(default=False)

    price = models.FloatField(default=0.0)
    currency = models.CharField(max_length=50, null=True)

    subscription_id = models.CharField(max_length=250, null=True, blank=True)
    invoice_id = models.CharField(max_length=250, null=True, blank=True)
    payment_intent_id = models.CharField(max_length=250, null=True, blank=True)
    charge_id = models.CharField(max_length=250, null=True, blank=True)

    payment_type = models.CharField(
        max_length=50,
        choices=TYPE,
        default=CHARGE,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f"{self.client.email if self.client else self.client_class.email_address if self.client_class else 'Some user'} -> {self.trainer.email}"

    class Meta:
        indexes = [
            models.Index(fields=["-updated_date_time"]),
            models.Index(fields=["recurring"]),
            models.Index(fields=["subscription_id"]),
            models.Index(fields=["client", "trainer"]),
            models.Index(fields=["payment_type"]),
        ]
