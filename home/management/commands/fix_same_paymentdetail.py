import stripe
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models import Count

from users.models import PaymentDetail, Price

stripe.api_key = (
    settings.STRIPE_LIVE_SECRET_KEY
    if settings.STRIPE_LIVE_MODE
    else settings.STRIPE_TEST_SECRET_KEY
)


class Command(BaseCommand):
    help = "Generate a json with all Models and URLs of the project."

    def handle(self, *args, **options):
        identical_client_trainer = (
            PaymentDetail.objects.values("client", "trainer")
            .annotate(Count("id"))
            .filter(client__isnull=False, id__count__gt=1)
        )
        for data in identical_client_trainer:
            queryset = PaymentDetail.objects.filter(
                client__id=data["client"], trainer__id=data["trainer"]
            )
            base_payment_detail = queryset.filter(product_id__startswith="prod").first()

            if not base_payment_detail:
                base_payment_detail = queryset.first()
                product = stripe.Product.create(name=str(base_payment_detail))
                base_payment_detail.product_id = product.id
                base_payment_detail.save()

            prices = Price.objects.filter(payment__in=queryset).update(
                payment=base_payment_detail
            )
            waste_payment = queryset.exclude(pk=base_payment_detail.pk)
            waste_payment.delete()
