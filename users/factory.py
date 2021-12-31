import factory
from faker import Faker
from django.contrib.auth import get_user_model
from users.models import User as UserType
from push_notifications.models import APNSDevice, WebPushDevice
import random

fake = Faker()

User = get_user_model()

class UserFactoryBase(factory.Factory):
    username = factory.LazyFunction(fake.user_name)
    password = factory.LazyFunction(fake.password)
    email = factory.LazyFunction(fake.email)

    class Meta:
        model = User
        abstract = True


class FakeTrainerFactory(UserFactoryBase):

    user_type = UserType.TRAINER


class FakeClientFactory(UserFactoryBase):

    user_type = UserType.CLIENT

class AnyUserFactory(UserFactoryBase):

    user_type = factory.LazyFunction(lambda : random.choice([UserType.TRAINER, UserType.CLIENT]))