from push_notifications.models import APNSDevice, WebPushDevice, Device
from django.db import models
from django.contrib.postgres.fields import JSONField
from django.conf import settings
from collections import namedtuple
import typing as T


class MockDeviceMixin:
    """sending a message allows the notification to be "caught." """

    def __init__(self):
        self.basket = []

    def send_message(self, *args, **kwargs):
        self.basket.append(
            {
                "args": args,
                "kwargs": kwargs,
            }
        )


class MockMessage(models.Model):
    device_class = models.CharField(max_length=1024)
    device_id = models.UUIDField(Device)
    when = models.DateTimeField(auto_now=True)
    data = JSONField(encoder="")


class MockAPNSDevice(APNSDevice):

    def send_message(self, *args, **kwargs):
        MockMessage.objects.create(
            device_id=self.device_id,
            device_class=type(self).__name__,
            data={
                "args": args,
                "kwargs": kwargs,
            },
        )


class MockWebPushDevice(WebPushDevice):
    def send_message(self, *args, **kwargs):
        MockMessage.objects.create(
            device_id=self.device_id,
            device_class=type(self).__name__,
            data={
                "args": args,
                "kwargs": kwargs,
            },
        )
