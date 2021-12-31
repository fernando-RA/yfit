from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model

from users.forms import UserChangeForm, UserCreationForm

from .models import Payment, Price, ProfilePictures, WorkoutType

User = get_user_model()

admin.site.register(WorkoutType)


class PhotosAdmin(admin.TabularInline):
    model = ProfilePictures


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (
        (
            "User",
            {
                "fields": (
                    "name",
                    "user_type",
                    "phone_number",
                    "bio",
                    "profile_picture",
                    "stripe_customer_id",
                    "stripe_account_id",
                    "instagram_link",
                    "workout_types",
                    "referral_code",
                    "hash",
                )
            },
        ),
    ) + auth_admin.UserAdmin.fieldsets
    list_display = ["id", "username", "name", "email", "is_superuser"]
    search_fields = ["name", "email"]
    inlines = [PhotosAdmin]


class PriceAdmin(admin.TabularInline):
    model = Price


# @admin.register(PaymentDetail)
# class PaymentAdmin(admin.ModelAdmin):
#     inlines = [PriceAdmin]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["__str__", "payment_type", "convert_price", "success", "cancelled"]

    def convert_price(self, obj):
        return obj.price / 100
