# Generated by Django 2.2.23 on 2021-05-27 08:27

from django.db import migrations

from undercard_18898.groups import Groups


def create_groups(apps, *args, **kwargs):
    Group = apps.get_model("auth", "Group")
    for group in Groups:
        Group.objects.get_or_create(name=group.name)


def setup_default_group(apps, *args, **kwargs):
    User = apps.get_model("users", "User")
    Group = apps.get_model("auth", "Group")
    default_group = Group.objects.get(name=Groups.NoFees.name)
    for user in User.objects.all():
        user.groups.add(default_group)


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0036_auto_20210527_0827"),
    ]

    operations = [
        migrations.RunPython(create_groups, reverse_code=migrations.RunPython.noop),
        migrations.RunPython(setup_default_group, reverse_code=migrations.RunPython.noop),
    ]