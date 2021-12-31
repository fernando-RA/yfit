from push_notifications.models import APNSDevice, WebPushDevice, Device

# from trainer_classes.models import TrainerClass
from trainer_classes.utils import convert_time
from users.models import User as UserType
from dating.models import Match
from django.conf import settings
from .utils import jinjize
from onesignal_sdk.client import Client
from onesignal_sdk.error import OneSignalHTTPError
from datetime import datetime

DO_MOCK = settings.IS_RUNNING_TEST or settings.UNDERCARD_LOCAL
if DO_MOCK:
    from undercard_push.models.mock import (
        MockAPNSDevice,
        MockWebPushDevice,
    )
from undercard_push.models.base import (
    PreClassTrainerPushLog,
    PreClassClientPushLog,
)
from home.api.v1 import serializers as sz
import sys
import typing as T
import logging
from copy import deepcopy as dc

from json import dumps
import json

log = logging.getLogger(__name__)


TrainerClass: T.Type = "TrainerClass"
PaymentLogs: T.Type = "PaymentLogs"
ClientClassSignUp: T.Type = "PaymentLogs"

# IS_TESTING = "test" == sys.argv[1]

# Device is abstract so cannot be used in queries.
# Instead, this will be a shortcut so that we can easily
# add/remove devices that we'll want to filter for.
DEVICES_TO_FIND = [
    APNSDevice,
    WebPushDevice,
]
if DO_MOCK:
    TEST_DEVICES = [MockAPNSDevice, MockWebPushDevice]


def get_devices_for(user: UserType) -> T.Iterable[T.Union[APNSDevice, WebPushDevice]]:
    global DEVICES_TO_FIND
    # Used for testing (TODO: only include if test are run?)
    if DO_MOCK:
        DEVICES_TO_FIND = TEST_DEVICES
    for DevType in DEVICES_TO_FIND:
        for dev in DevType.objects.filter(user=user).all():
            yield dev


def get_msg(msg_tag: T.AnyStr, **format_args):
    print(f"UNDERCARD getting message for {msg_tag}")
    return jinjize(settings.PUSH_MESSAGES[msg_tag]["message"], **format_args)


def get_title(msg_tag: T.AnyStr, **format_args):
    print(f"UNDERCARD getting title for {msg_tag}")
    return jinjize(settings.PUSH_MESSAGES[msg_tag]["title"], **format_args)


def get_subtitle(msg_tag: T.AnyStr, **format_args):
    print(f"UNDERCARD getting subtitle for {msg_tag}")
    if "subtitle" not in settings.PUSH_MESSAGES[msg_tag]:
        return None
    return jinjize(settings.PUSH_MESSAGES[msg_tag]["title"], **format_args)


def get_onesignal_client():
    return Client(**settings.ONE_SIGNAL["client"])


def _dep_on_message(user: UserType, **kwargs):
    """@deprecated on_message"""
    for device in get_devices_for(user):
        device.send_message(**kwargs)


def _on_message(**kwargs):
    try:
        print("UNDERCARD: in on_message")
        client = get_onesignal_client()
        #kwargs["included_segments"] = ["Active Users"]
        message_args = {
            # "players": kwargs["players"],
            # "tags": [kwargs],
            "contents": {
                "en": kwargs["message"],
            },
            "include_external_user_ids": [
                str(player["id"]) for player in kwargs["players"]
            ],
        }
        if kwargs.get("subtitle", None):
            message_args["subtitle"] = {
                "en": kwargs["subtitle"], 
            }
        if kwargs.get("headings", None):
            message_args["headings"] = {
                "en": kwargs["headings"],
            }
        if kwargs.get("title", None):
            message_args["title"] = {
                "en": kwargs["title"],
            }
        import json

        print(f"ONESIGNAL: sending data {json.dumps(message_args)}")
        resp = client.send_notification(message_args)
        print(f"ONESIGNAL Response Status: {resp.status_code}")
        print(f"ONESIGNAL response: {resp.body}")
        print(f"ONESIGNAL HTTP response: {resp.http_response}")
    except OneSignalHTTPError as err:
        log.error(err.message)
        print(f"ERROR ONESIGNAL says: '{err.message}'")
        raise Exception(f"ONESIGNAL says: '{err.message}'")
    except Exception as err2:
        log.error(err2)
        print(f"ERROR General Exception says: '{err2}'")
        raise Exception(f"General Exception says: '{err2}'")


def on_attendee_signup(
    sender: T.Any,
    instance: ClientClassSignUp,
    created: bool,
    *args,
    **kwargs,
):
    """Triggered on a `post_save` signal for saving a ClientClassSignUp."""
    if not created:
        return

    try:
        print("UNDERCARD: start on_attendee_signup")
        signup = instance
        tag = "attendee_registration"

        start_time = convert_time(
            signup.trainer_class, 
            signup.trainer_class.start_time)
        time_str = start_time.strftime("%a, %b %-d at %-I:%M %p")
        print (f"adjusted start_time: {time_str}")
        message = get_msg(tag, attendee_signup=signup, start_time_str=time_str)
        title = get_title(tag, attendee_signup=signup)
        subtitle = get_subtitle(tag, attendee_signup=signup)
        print(f"UNDERCARD: on_attendee_signup (constructing trainer data)")
        trainer_data = sz.UserSerializer(signup.trainer_class.author).data
        print(
            f"UNDERCARD: on_attendee_signup, trainer_data={json.dumps(trainer_data)}"
        )
        print(f"UNDERCARD: on_attendee_signup (constructing message kwargs)")
        message_kwargs = {
            "message": message,
            "title": title,
            "subtitle": subtitle,
            "tag": tag,
            "tags": {
                "signup_id": signup.id,
                "signup_email_address": signup.email_address,
                "signup_first_name": signup.first_name,
                "signup_last_name": signup.last_name,
                "trainer_class_id": signup.trainer_class.author.id,
                "trainer_class_name": signup.trainer_class.name,
                "trainer_first_name": signup.trainer_class.author.first_name,
                "trainer_last_name": signup.trainer_class.author.last_name,
                "trainer_user_id": signup.trainer_class.author.id,
            },
            "players": [trainer_data],
        }
        print(
            f"UNDERCARD: on_attendee_signup message_kwargs={json.dumps(message_kwargs)}"
        )
        _on_message(**message_kwargs)
    except Exception as exc:
        print("UNDERCARD Error returned:")
        print(str(exc))


def _generic_pre_class_notification(
    trainer_class: TrainerClass, recipient: UserType, tag: T.AnyStr
):
    trainer_data = sz.UserSerializer(trainer_class.author).data
    clients_data = [sz.UserSerializer(c).data for c in trainer_class.clients.all()]
    message = get_msg(tag, trainer_class=trainer_class)
    title = get_title(tag, trainer_class=trainer_class)
    subtitle = get_title(tag, trainer_class=trainer_class)
    message_kwargs = {
        "tag": tag,
        "message": message,
        "title": title,
        "subtitle": subtitle,
        "tags": {
            "trainer_class_id": trainer_class.id,
            "trainer_class_name": trainer_class.name,
            "trainer_first_name": trainer_class.author.first_name,
            "trainer_last_name": trainer_class.author.first_name,
            "trainer_user_id": trainer_class.author.id,
        },
        "players": [trainer_data] + clients_data,
    }
    _on_message(**message_kwargs)
    # Create a push log entry so we don't re-send it.


def on_trainer_pre_class_notification(trainer_class: TrainerClass):
    tag = "trainer_pre_class_reminder"
    _generic_pre_class_notification(
        trainer_class,
        trainer_class.author,
        tag,
    )
    PreClassTrainerPushLog.objects.create(
        trainer_class=trainer_class, trainer=trainer_class.author
    )


def on_client_pre_class_notification(client: ClientClassSignUp):
    tag = "trainer_pre_class_reminder"
    _generic_pre_class_notification(client.trainer_class, client, tag)
    created: PreClassClientPushLog = PreClassClientPushLog.objects.create(
        client_class_signup=client
    )
    log.info(
        "ClientPushLog %d : %s - %s",
        created.id,
        created.client_class_signup.user,
        created.client_class_signup.trainer_class,
    )


def on_payment_confirmation(
    sender: T.Any,
    instance: ClientClassSignUp,
    created: bool,
    *args,
    **kwargs,
):
    print("UNDERCARD: in on_payment_confirmation")
    client = instance
    message_key = "class_payment_notification"
    config: dict = dc(settings.PUSH_MESSAGES[message_key])
    trigger_status = config["trigger_status"]
    signup = instance
    # Exit if the trainer was notified
    if client.trainer_notified:
        return
    # Exit if the user has not paid.
    if client.payment_status != trigger_status:
        return
    message = jinjize(
        config["message"],
        signup=client,
    )
    trainer_data = sz.UserSerializer(client.trainer_class.author).data
    message_kwargs = {
        "tag": "payment_confirmation",
        "tags": {
            "signup_id": signup.id,
            "signup_email_address": signup.email_address,
            "signup_first_name": signup.first_name,
            "signup_last_name": signup.last_name,
            "trainer_class_id": signup.trainer_class.id,
            "trainer_class_name": signup.trainer_class.name,
            "trainer_first_name": signup.trainer_class.author.first_name,
            "trainer_last_name": signup.trainer_class.author.first_name,
            "trainer_user_id": signup.trainer_class.author.id,
        },
        "players": [
            trainer_data,
        ],
    }
    _on_message(**message_kwargs)
    client.trainer_notified = True
    client.save()


def on_trainer_followed(
    trainer: UserType,
    followed_by: UserType,
):
    """
    TODO not connected
    """
    tag = "trainer_following"
    title = get_title(tag)
    message = get_msg(
        tag,
        trainer=trainer,
        followed_by=followed_by,
    )
    print("UNDERCARD: in on_trainer_followed")
    followed_by_data = sz.UserSerializer(followed_by).data
    message_kwargs = {
        "tag": "trainer_following",
        "title": title,
        "message": message,
        "tags": {
            "trainer_first_name": trainer.first_name,
            "trainer_last_name": trainer.last_name,
            "trainer_user_id": trainer.id,
            "follower_user_id": followed_by.id,
            "follower_first_name": followed_by.first_name,
            "follower_last_name": followed_by.last_name,
            "follower_email": followed_by.email,
        },
        "players": [followed_by_data],
    }
    _on_message(**message_kwargs)



def on_class_creation(
    sender: T.Any,
    created: bool,
    *args,
    **kwargs,
):
    trainer_class = kwargs["instance"]
    if created: 
        try:
            tag = "notify_followers_about_class_creation"
            print (f"in {tag}")

            start_time = convert_time(
                trainer_class, 
                trainer_class.start_time)
            time_str = start_time.strftime("%a, %b %-d at %-I:%M %p")
            title = get_title(tag)
            message = get_msg(
                tag,
                trainer_class=trainer_class,
                time_str= time_str,
            )

            follower_matches = Match.objects.filter(user = trainer_class.author)
            followers = [match.owner for match in follower_matches]
            message_kwargs = {
                "tag": tag,
                "title": title,
                "message": message,
                "players": [followers],
            }
            _on_message(**message_kwargs)
        except Exception as err:
            print(f"Exception sending push notification: '{err}'")
    else:
        pass 
# in the future, when sending push notifications for class updates, use:
# https://django-model-utils.readthedocs.io/en/latest/utilities.html#field-tracker



