# Generated by Django 2.2.23 on 2021-06-02 08:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("trainer_classes", "0025_auto_20210601_2321"),
    ]

    operations = [
        migrations.AlterField(
            model_name="clientclasssignup",
            name="promo_code",
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]