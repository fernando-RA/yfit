from datetime import datetime

import pytz
import stripe
from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.contrib.auth.management.commands import createsuperuser
from stripe.error import InvalidRequestError

from users.models import Price

stripe.api_key = (
    settings.STRIPE_LIVE_SECRET_KEY
    if settings.STRIPE_LIVE_MODE
    else settings.STRIPE_TEST_SECRET_KEY
)


class Command(createsuperuser.Command):
    help = "Create past data about subscription"

    def handle(self, *args, **options):
        subscription_items = Price.objects.filter(
            subscription_id__isnull=False, subscription_id__startswith="sub"
        )

        subscriptions = []
        for subscription in subscription_items:
            self.stdout.write(
                "Subscription %s  -- " % subscription.subscription_id, ending=""
            )
            try:
                stripe_subscription = stripe.Subscription.retrieve(
                    subscription.subscription_id
                )
                stripe_subscription["start_date"] = datetime.timestamp(
                    datetime.fromtimestamp(stripe_subscription["start_date"])
                    + relativedelta(months=+1)
                )
                price = stripe_subscription["items"]["data"][0]["price"]
                while stripe_subscription["start_date"] <= stripe_subscription[
                    "current_period_start"
                ] or (
                    stripe_subscription["canceled_at"]
                    and stripe_subscription["start_date"]
                    < stripe_subscription["canceled_at"]
                ):
                    new_price = subscription.payment.create_price(
                        price=price["unit_amount"],
                        price_id=price["id"],
                        recurring=True if price["type"] == "recurring" else False,
                    )
                    new_price.subscription_id = subscription.subscription_id
                    new_price.create_date_time = datetime.fromtimestamp(
                        stripe_subscription["start_date"], tz=pytz.UTC
                    )
                    new_price.save()
                    Price.objects.filter(pk=new_price.id).update(
                        updated_date_time=new_price.create_date_time
                    )
                    stripe_subscription["start_date"] = datetime.timestamp(
                        datetime.fromtimestamp(stripe_subscription["start_date"])
                        + relativedelta(months=+1)
                    )
                subscriptions.append(stripe_subscription)
                self.stdout.write(self.style.SUCCESS("OK"))
            except InvalidRequestError as e:
                self.stdout.write(self.style.ERROR(e.user_message))
