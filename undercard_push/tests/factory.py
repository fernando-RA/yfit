import factory
from faker import Faker
from django.contrib.auth import get_user_model
import random
from undercard_push.models.mock import (
    MockAPNSDevice,
    MockWebPushDevice,
)
import datetime

User = get_user_model()

fake = Faker()

_f = factory.LazyFunction
_a = factory.LazyAttribute
FACTORY_BASE_CLASS = factory.django.DjangoModelFactory
# TZINFO = datetime.tzinfo("utc")
TZINFO = None


class MockDeviceFactoryBase(FACTORY_BASE_CLASS):

    name = _a(lambda x: f"{fake.first_name()}'s {type(x).__name__}")
    device_id = _f(fake.uuid4)
    # Legacy Setting
    # application_id = _f(fake.sha256)
    # user = factory.RelatedFactory(
    #     get_user_factories().AnyUserFactory,
    # )

    class Meta:
        abstract = True


class APNSDeviceFactory(MockDeviceFactoryBase):

    registration_id = _f(fake.sha256)

    class Meta:
        model = MockAPNSDevice


class WebDeviceFactory(MockDeviceFactoryBase):

    registration_id = _f(fake.sha256)
    p256hd = _f(fake.sha256)
    auth = _f(fake.sha256)

    class Meta:
        model = MockWebPushDevice