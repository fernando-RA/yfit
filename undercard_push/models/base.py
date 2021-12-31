from datetime import datetime
import typing as T
from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from polymorphic.models import PolymorphicModel


from users.models import User as UserType

# UserType = T.Any

import logging

log = logging.getLogger(__name__)

User = get_user_model()


def is_client(user: UserType):
    return user.user_type == UserType.CLIENT


def is_trainer(user: UserType):
    return user.user_type == UserType.TRAINER


def _trainer_class_models():
    from trainer_classes import models

    return models


class PushLog(PolymorphicModel):

    when: datetime = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TrainerPushLog(PolymorphicModel):

    trainer: UserType = models.ForeignKey(
        User, on_delete=models.CASCADE, validators=[is_trainer]
    )

    class Meta:
        abstract = True


class ClientPushLog(PolymorphicModel):

    client: UserType = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        validators=[is_client],
    )

    class Meta:
        abstract = True


class ClassPushLog(PolymorphicModel):

    trainer_class = models.ForeignKey(
        "trainer_classes.TrainerClass",
        on_delete=models.CASCADE,
    )

    class Meta:
        abstract = True

class ClientClassSignupPushLog(PolymorphicModel):

    client_class_signup = models.ForeignKey(
        "trainer_classes.ClientClassSignUp",
        on_delete=models.CASCADE,
    )

    class Meta:
        abstract = True

class PreClassTrainerPushLog(PushLog, TrainerPushLog, ClassPushLog):
    pass


class PreClassClientPushLog(PushLog, ClientClassSignupPushLog):
    pass
