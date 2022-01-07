# Generated by Django 2.2.24 on 2021-09-04 21:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('push_notifications', '0007_uniquesetting'),
        ('trainer_classes', '0035_auto_20210904_2031'),
    ]

    operations = [
        migrations.CreateModel(
            name='MockAPNSDevice',
            fields=[
                ('apnsdevice_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='push_notifications.APNSDevice')),
            ],
            options={
                'abstract': False,
            },
            bases=('push_notifications.apnsdevice',),
        ),
        migrations.CreateModel(
            name='MockWebPushDevice',
            fields=[
                ('webpushdevice_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='push_notifications.WebPushDevice')),
            ],
            options={
                'abstract': False,
            },
            bases=('push_notifications.webpushdevice',),
        ),
    ]