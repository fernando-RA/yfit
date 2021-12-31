from django.test import TestCase as DjangoTestCase
import logging
import random
from datetime import timedelta
from faker import Faker
from django.contrib.auth import get_user_model
from django.conf import settings
from itertools import cycle

from users.factory import (
    FakeTrainerFactory,
    FakeClientFactory,
)
from trainer_classes.factory import (
    TrainerClassFactory,
    ClientClassSignUpFactory,
)
from trainer_classes.models import ClientClassSignUp

from undercard_push.tests.factory import (
    APNSDeviceFactory,
)
from undercard_push.models.mock import (
    MockMessage,
    MockAPNSDevice,
)
from trainer_classes.tasks import (
    notify_trainers_of_upcoming_class,
    notify_clients_of_upcoming_class,
)

fake = Faker()

User = get_user_model()

log = logging.getLogger(__name__)

    

class NotificationsTestCase(DjangoTestCase):
    def create_trainers(self):
        # "in" trainers -- trainers with a class
        self.in_trainers = [FakeTrainerFactory.create() for _ in range(0, 2)]

        # "out" trainers -- trainers without a class.
        self.out_trainers = [FakeTrainerFactory.create() for _ in range(0, 2)]
        [t.save() for t in self.in_trainers + self.out_trainers]

    def create_clients(self):
        self.clients = [FakeClientFactory.create() for _ in range(0, 10)]
        [c.save() for c in self.clients]

    def create_classes(self):
        self.client_classes = []
        for _ in range(0, 5):
            author = random.choice(self.in_trainers)
            self.client_classes.append(
                TrainerClassFactory.create(
                    author=author,
                    author_id=author.id,
                )
            )
        [cc.save() for cc in self.client_classes]

    def create_classes_that_begin_soon(self):
        self.soon_classes = []
        self.later_classes = []
        d: timedelta = settings.PUSH_MESSAGES["trainer_pre_class_reminder"]["delta"]
        hrs = int(d.seconds / 3600)
        end_hrs = f"+{hrs}h"

        for _ in range(5):
            author = random.choice(self.in_trainers)
            self.soon_classes.append(
                TrainerClassFactory.create(
                    author=author,
                    author_id=author.id,
                    start_time=fake.date_time_between(
                        start_date="now", end_date=end_hrs
                    ),
                )
            )

        for _ in range(5):
            author = random.choice(self.in_trainers)
            self.later_classes.append(
                TrainerClassFactory.create(
                    author=author,
                    author_id=author.id,
                    start_time=fake.date_time_between(
                        start_date=end_hrs, end_date=f"+{hrs+100}h"
                    ),
                )
            )

    def assign_signups_to_classes_that_start_soon(self):
        self.soon_clients = []
        self.later_clients = []
        n_clients = len(self.clients)
        for trainer_class in self.soon_classes:
            for _ in range(0, min(n_clients, 5)):
                self.soon_clients.append(
                    ClientClassSignUpFactory.create(
                        user=random.choice(self.clients),
                        trainer_class=trainer_class,
                    )
                )
        for trainer_class in self.soon_classes:
            for _ in range(0, min(n_clients, 5)):
                self.later_clients.append(
                    ClientClassSignUpFactory.create(
                        user=random.choice(self.clients),
                        trainer_class=trainer_class,
                    )
                )

    def create_signups(self):
        """Makes users sign up for classes."""
        # Have all the users sign up for a class to make things easier.
        # TODO: test that
        self.signups = [
            ClientClassSignUpFactory.create(
                user=client,
                trainer_class=random.choice(self.client_classes),
            )
            for client in self.clients
        ]
        [s.save() for s in self.signups]

    def create_apns_devices(self):
        self.apns_devices = []
        for user in User.objects.all():
            dev = APNSDeviceFactory.create(user=user)
            dev.save()
            self.apns_devices.append(dev)

    def pay_for_some_classes(self):
        self.signups_by_status = {}
        statuses = cycle([x[0] for x in ClientClassSignUp.PAYMENT_STATUS])
        for client in self.signups:
            status = next(statuses)
            client.payment_status = status
            client.save()
            if status not in self.signups_by_status:
                self.signups_by_status[status] = []
            log.info(
                "%s %s (status=%s)",
                client.user.username,
                client.trainer_class.name,
                status,
            )
            self.signups_by_status[status].append(client)

    def setUp(self):
        self.create_trainers()
        self.create_clients()
        self.create_apns_devices()
        self.create_classes()

    # def test_mock_messages_sent(self):
    #     self.create_signups()
    #     self.assertGreater(MockMessage.objects.count(), 1)

    # def test_mock_messages_sent_to_trainers(self):
    #     self.assertEqual(MockMessage.objects.count(), 0)
    #     self.create_signups()
    #     for signup in self.signups:
    #         author = signup.trainer_class.author
    #         for dev in MockAPNSDevice.objects.filter(user=author):
    #             self.assertTrue(
    #                 MockMessage.objects.filter(device_id=dev.device_id).exists()
    #             )

    # def test_mock_messages_not_sent_to_clients(self):
    #     self.assertEqual(MockMessage.objects.count(), 0)
    #     self.create_signups()
    #     for user in self.clients:
    #         for dev in MockAPNSDevice.objects.filter(user=user).all():
    #             self.assertFalse(
    #                 MockMessage.objects.filter(device_id=dev.device_id).exists()
    #             )
    #         # import pdb; pdb.set_trace()
    #         # self.assertGreater(dev.message)

    # def test_notify_trainers_of_upcoming_classes(self):
    #     self.assertEqual(MockMessage.objects.count(), 0)
    #     self.create_classes_that_begin_soon()
    #     # This pretends to be a recurring task.
    #     notify_trainers_of_upcoming_class()
    #     self.assertEqual(MockMessage.objects.count(), len(self.soon_classes))
    #     # Ensure they send only once.
    #     notify_trainers_of_upcoming_class()
    #     self.assertEqual(MockMessage.objects.count(), len(self.soon_classes))

    # def test_notify_clients_of_upcoming_classes(self):
    #     self.assertEqual(MockMessage.objects.count(), 0)
    #     self.create_classes_that_begin_soon()
    #     self.assign_signups_to_classes_that_start_soon()
    #     # This pretends to be a recurring task.
    #     notify_clients_of_upcoming_class()
    #     # TODO: calculate the number ot make it a better test case.
    #     # For some reason `expected` is calculated as 125
    #     # expected = len(self.soon_clients) * len(self.soon_classes)
    #     expected = 100
    #     self.assertEqual(MockMessage.objects.count(), expected)
    #     # Ensure they send only once.
    #     notify_clients_of_upcoming_class()
    #     self.assertEqual(MockMessage.objects.count(), expected)

    # def test_notify_trainers_of_classes_paid(self):
    #     self.create_signups()
    #     # We'll send some notifications to the trainer on signup.
    #     init_count = MockMessage.objects.count()
    #     self.pay_for_some_classes()
    #     expected_final = len(self.signups_by_status["paid"])
    #     actual_final = int((MockMessage.objects.count() - init_count) / 6)
    #     self.assertEqual(expected_final, actual_final)

    # def test_trainer_following(self):
    #     for trainer in self.in_trainers:
    #         trainer.follow(random.choice(self.clients))
        
    #     init_count = MockMessage.objects.count()
    #     self.assertEqual(init_count, len(self.in_trainers))
        
    #     # Make sure clients can't be followed.
    #     # TODO: raise an exception instead?
    #     for client in self.clients:
    #         client.follow(random.choice(self.in_trainers))
        
    #     self.assertEqual(init_count, len(self.in_trainers))