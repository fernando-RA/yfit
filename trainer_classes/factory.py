import factory
from faker import Faker
from django.contrib.auth import get_user_model
import random
from trainer_classes.models import (
    TrainerClass,
    ClientClassSignUp,
)
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

def get_user_factories():
    from users import factory
    return factory

class TrainerClassFactory(FACTORY_BASE_CLASS):

    name = _a(lambda x: f"{fake.name()}'s class")
    start_time = _f(lambda: fake.date_time_this_year(tzinfo=TZINFO))
    duration = _a(lambda o: random.randint(1, 4))
    author = factory.RelatedFactory(
        get_user_factories().FakeClientFactory,
    )

    class Meta:
        model = TrainerClass


class ClientClassSignUpFactory(FACTORY_BASE_CLASS):
    class Meta:
        model = ClientClassSignUp
