# Generated by Django 2.2.16 on 2020-12-17 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0015_auto_20201217_0928"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="workouttype",
            name="user",
        ),
        migrations.AddField(
            model_name="user",
            name="workout_types",
            field=models.ManyToManyField(to="users.WorkoutType"),
        ),
    ]
