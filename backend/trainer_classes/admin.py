from django.contrib import admin

from .forms import TrainerClassForm
from .models import ClientClassSignUp, PaymentLogs, PromoCode, Spot, TrainerClass


class PromoCodeInline(admin.TabularInline):
    model = TrainerClass.promo_code.through


class TrainerClassAdmin(admin.ModelAdmin):
    form = TrainerClassForm
    list_display = [
        "id",
        "name",
        "author",
        "details",
        "start_time",
        "created_at",
        "published_at",
    ]
    inlines = [PromoCodeInline]
    search_fields = ["name"]


class SpotInline(admin.TabularInline):
    model = ClientClassSignUp.spots.through


class ClientClassSignUpAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "first_name",
        "last_name",
        "email_address",
        "trainer_class",
        "spots_count",
        "payment_status",
        "created_at",
        "canceled_at",
        "first_name_referred",
        "last_name_referred",
    ]
    inlines = [SpotInline]
    search_fields = ["first_name", "last_name", "email_address"]


class PaymentLogsAdmin(admin.ModelAdmin):
    model = PaymentLogs
    search_fields = ["payment", "stripe_session_id"]
    list_filter = ("event_type",)
    list_display = ["payment", "stripe_session_id", "event_type", "created_at"]


class SpotAdmin(admin.ModelAdmin):
    model = Spot
    search_fields = [
        "email_address",
    ]
    list_display = ["email_address", "first_name"]


admin.site.register(ClientClassSignUp, ClientClassSignUpAdmin)
admin.site.register(TrainerClass, TrainerClassAdmin)
admin.site.register(PaymentLogs, PaymentLogsAdmin)
admin.site.register(Spot, SpotAdmin)
admin.site.register(PromoCode)
