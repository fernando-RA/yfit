from django.db import models


class Match(models.Model):
    "Generated Model"
    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="match_user",
    )
    owner = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="match_owner",
    )
    created = models.DateTimeField(
        auto_now_add=True,
    )


# Create your models here.
