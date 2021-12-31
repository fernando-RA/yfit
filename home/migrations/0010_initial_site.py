from django.db import migrations


def update_site(apps, schema_editor):
    Site = apps.get_model("sites", "Site")
    custom_domain = "getrec.com"

    site_params = {
        "name": "Getrec",
    }
    if custom_domain:
        site_params["domain"] = custom_domain

    Site.objects.update_or_create(defaults=site_params, id=1)


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0009_auto_20201119_1603"),
    ]

    operations = [
        migrations.RunPython(update_site),
    ]
