# Generated by Django 2.2.19 on 2021-03-01 12:28

from django.db import migrations, models

tmp_data = []


def save_spots_details(apps, *args, **kwargs):
    Spot = apps.get_model("trainer_classes", "Spot")
    ClientClassSignUp = apps.get_model("trainer_classes", "ClientClassSignUp")

    for client_class in ClientClassSignUp.objects.all():
        if client_class.spots:
            tmp_data.append(
                {
                    "client_class": client_class.id,
                    "spots": [
                        spot.id
                        for spot in Spot.objects.bulk_create(
                            [
                                Spot(
                                    first_name=spot.get("first_name"),
                                    last_name=spot.get("last_name"),
                                    email_address=spot.get("email_address"),
                                )
                                for spot in client_class.spots
                            ]
                        )
                    ],
                }
            )


def transfer_spot(apps, *args, **kwargs):
    ClientClassSignUp = apps.get_model("trainer_classes", "ClientClassSignUp")
    Spot = apps.get_model("trainer_classes", "Spot")
    for data in tmp_data:
        client_class = ClientClassSignUp.objects.get(pk=data.get("client_class"))
        for spot in data.get("spots"):
            client_class.spots.add(Spot.objects.get(pk=spot))


class Migration(migrations.Migration):

    dependencies = [
        ("trainer_classes", "0006_auto_20210225_1113"),
    ]

    operations = [
        migrations.CreateModel(
            name="Spot",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("first_name", models.CharField(blank=True, max_length=255, null=True)),
                ("last_name", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "email_address",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                (
                    "sg_message_id",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("delivered", models.BooleanField(default=False)),
            ],
            options={
                "verbose_name": "Client Class spot",
                "verbose_name_plural": "Client Class spots",
            },
        ),
        migrations.RunPython(save_spots_details),
        migrations.AlterModelOptions(
            name="paymentlogs",
            options={
                "verbose_name": "Client Class Payment Log",
                "verbose_name_plural": "Client Class Payment Logs",
            },
        ),
        migrations.RemoveField(
            model_name="clientclasssignup",
            name="spots",
        ),
        migrations.AddField(
            model_name="clientclasssignup",
            name="spots",
            field=models.ManyToManyField(blank=True, to="trainer_classes.Spot"),
        ),
        migrations.RunPython(transfer_spot),
    ]