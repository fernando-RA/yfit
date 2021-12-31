from django.contrib.auth import get_user_model
from django.db import models
from django.template.defaultfilters import slugify

# Create your models here.


User = get_user_model()


class CustomText(models.Model):
    title = models.CharField(
        max_length=150,
    )

    def __str__(self):
        return self.title

    @property
    def api(self):
        return f"/api/v1/customtext/{self.id}/"

    @property
    def field(self):
        return "title"


class HomePage(models.Model):
    body = models.TextField()

    @property
    def api(self):
        return f"/api/v1/homepage/{self.id}/"

    @property
    def field(self):
        return "body"


class Message(models.Model):
    "Generated Model"
    match = models.ForeignKey(
        "dating.Match",
        on_delete=models.CASCADE,
        related_name="message_match",
    )
    slug = models.SlugField(
        max_length=50,
    )
    created = models.DateTimeField(
        auto_now_add=True,
    )


class Room(models.Model):
    """Represents chat rooms that users can join"""

    slug = models.SlugField(max_length=500, unique=True)
    user_1 = models.ForeignKey(
        User, related_name="user_1_chat_room", on_delete=models.CASCADE
    )
    user_2 = models.ForeignKey(
        User, related_name="user_2_chat_room", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Returns human-readable representation of the model instance."""
        return self.slug

    def save(self, *args, **kwargs):
        if not self.id:
            # Newly created object, so set slug
            self.slug = slugify(f"{self.user_1.username} {self.user_2.username}")

        super().save(*args, **kwargs)


class Event(models.Model):
    description = models.TextField(null=True, blank=True)
    date_time = models.DateTimeField()
    start_time = models.PositiveIntegerField()
    end_time = models.PositiveIntegerField()
    lat = models.CharField(max_length=50, null=True, blank=True)
    long = models.CharField(max_length=50, null=True, blank=True)
    organiser = models.ForeignKey(
        User, related_name="event_organiser", on_delete=models.CASCADE
    )
    member = models.ForeignKey(
        User, related_name="event_member", on_delete=models.CASCADE
    )
