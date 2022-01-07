from push_notifications.models import APNSDevice, WebPushDevice, Device
from django.db import models
from django.contrib.postgres.fields import JSONField
from django.conf import settings
from collections import namedtuple
import typing as T


class DeviceCompatMixin(Device):
    """ Legacy settings were being used for adding application id.

    Don't send application id for send_message.
    """

    class Meta:
        proxy = True

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
