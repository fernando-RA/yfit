# Generated by Django 2.2.19 on 2021-03-05 08:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("trainer_classes", "0008_auto_20210302_1303"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="spot",
            options={},
        ),
        migrations.RemoveField(
            model_name="spot",
            name="sms_delivered",
        ),
        migrations.RemoveField(
            model_name="spot",
            name="sms_twilio_sid",
        ),
        migrations.RemoveField(
            model_name="clientclasssignup",
            name="sms_delivered",
        ),
        migrations.RemoveField(
            model_name="clientclasssignup",
            name="sms_twilio_sid",
        ),
        migrations.AddField(
            model_name="clientclasssignup",
            name="client_sms_delivered",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="clientclasssignup",
            name="confirmation_email_delivered",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="clientclasssignup",
            name="confirmation_email_id",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="trainerclass",
            name="trainer_sms_delivered",
            field=models.BooleanField(default=False),
        ),
    ]