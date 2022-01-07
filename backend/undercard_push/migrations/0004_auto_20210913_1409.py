# Generated by Django 2.2.24 on 2021-09-13 14:09

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import undercard_push.models.base


class Migration(migrations.Migration):

    dependencies = [
        ('undercard_push', '0003_auto_20210913_1405'),
    ]

    operations = [
        migrations.AlterField(
            model_name='preclassclientpushlog',
            name='client',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, validators=[undercard_push.models.base.is_client]),
        ),
    ]