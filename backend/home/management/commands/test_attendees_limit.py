import rest_framework
from django.core.management.base import BaseCommand

from home.api.v1.serializers import ClientClassSignUpSerializer
from trainer_classes.models import TrainerClass


class A:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)
        self.kwargs = kwargs
        self.user = None


class Command(BaseCommand):
    help = "Test limit for trainer class"

    def add_arguments(self, parser):
        parser.add_argument(
            "--hash",
            type=str,
            help="hash of the trainer_class",
            required=True,
        )
        parser.add_argument(
            "--count",
            type=int,
            help="count of iteration",
            required=True,
        )

    def handle(self, *args, **options):
        try:
            trainer_class = TrainerClass.objects.get(hash=options.get("hash"))
        except TrainerClass.DoesNotExist:
            print("Trainer class not found")
            return
        spots = []
        for i in range(1, int(options.get("count")) + 1):
            spots.append(
                {
                    "first_name": "test",
                    "last_name": "test",
                    "email_address": f"mail{i}@mail.ru",
                }
            )
        serializer = ClientClassSignUpSerializer(
            data={
                "spots_count": int(options.get("count")),
                "first_name": "test",
                "last_name": "test",
                "email_address": f"email{options.get('hash')}@hash.com",
                "spots": spots,
            },
            context={"view": A(trainer_class_id=trainer_class.id), "request": A()},
        )
        try:
            print(
                f"Test for training {options.get('hash')} with {options.get('count')} attendee(s) ... ",
                end="",
            )
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()
            instance.delete()
            self.stdout.write(self.style.SUCCESS("OK"))

        except rest_framework.exceptions.ValidationError as err:
            self.stdout.write(self.style.ERROR("ERROR"))
            print(err)
        except Exception as err:
            self.stdout.write(self.style.ERROR("ERROR"))
            print(err)
