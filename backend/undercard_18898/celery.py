import os

from celery import Celery
from celery.schedules import crontab
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "undercard_18898.settings")
app = Celery("undercard_18898")
app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks(settings.INSTALLED_APPS)

app.conf.beat_schedule = {
    "update_start_time": {
        "task": "trainer_classes.tasks.change_start_time",
        "schedule": crontab(minute="*/15"),
    },
    "delete_unpaid_client_class": {
        "task": "trainer_classes.tasks.delete_unpaid_client_class",
        "schedule": crontab(minute="*/5"),
    },
}