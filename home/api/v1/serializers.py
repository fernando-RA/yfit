import datetime
import hashlib
import re

import pytz
import requests
import rest_auth.serializers
import stripe
from allauth.account import app_settings as allauth_settings
from allauth.account.adapter import get_adapter
from allauth.account.forms import ResetPasswordForm
from allauth.account.utils import setup_user_email
from allauth.socialaccount.helpers import complete_social_login
from allauth.utils import email_address_exists, generate_unique_username
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.http import HttpRequest
from django.utils.translation import ugettext_lazy as _
from drf_extra_fields.fields import HybridImageField
from drf_writable_nested.serializers import WritableNestedModelSerializer
from requests.models import HTTPError
from rest_auth.models import TokenModel
from rest_auth.registration.serializers import SocialLoginSerializer
from rest_auth.serializers import PasswordResetSerializer
from notification_app.backend import EmailTransportBackend

# from .push_notifications import Messages
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ParseError
from sentry_sdk.api import capture_message

from home.models import CustomText, Event, HomePage, Message, Room
from trainer_classes.models import (
    ClientClassSignUp,
    PaymentLogs,
    PromoCode,
    Spot,
    TrainerClass,
)
from undercard_18898.groups import Groups
from users.models import Payment, PaymentDetail, Price, ProfilePictures, WorkoutType

from .user_utils import UserUtils

User = get_user_model()
stripe.api_key = (
    settings.STRIPE_LIVE_SECRET_KEY
    if settings.STRIPE_LIVE_MODE
    else settings.STRIPE_TEST_SECRET_KEY
)


class CustomTokenSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {"token": data["key"]}

    class Meta:
        model = TokenModel
        fields = ("key",)


rest_auth.serializers.TokenSerializer = CustomTokenSerializer


class CustomAppleSocialLoginSerializer(SocialLoginSerializer):
    first_name = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    last_name = serializers.CharField(allow_null=True, allow_blank=True, required=False)

    def validate(self, attrs):
        view = self.context.get("view")
        request = self._get_request()

        if not view:
            raise serializers.ValidationError(
                _("View is not defined, pass it as a context variable")
            )

        adapter_class = getattr(view, "adapter_class", None)
        if not adapter_class:
            raise serializers.ValidationError(_("Define adapter_class in view"))

        adapter = adapter_class(request)
        app = adapter.get_provider().get_app(request)

        # Case 1: We received the access_token
        if attrs.get("code"):
            code = attrs.get("code")
            token = {"code": code}

        # Case 2: We received the authorization code
        elif attrs.get("access_token"):
            self.callback_url = getattr(view, "callback_url", None)
            self.client_class = getattr(view, "client_class", None)

            if not self.callback_url:
                raise serializers.ValidationError(_("Define callback_url in view"))
            if not self.client_class:
                raise serializers.ValidationError(_("Define client_class in view"))

            code = attrs.get("access_token")

            provider = adapter.get_provider()
            scope = provider.get_scope(request)
            client = self.client_class(
                request,
                app.client_id,
                app.secret,
                adapter.access_token_method,
                adapter.access_token_url,
                self.callback_url,
                scope,
            )
            token = client.get_access_token(code)
            access_token = token["access_token"]

        else:
            raise serializers.ValidationError(
                _("Incorrect input. access_token or code is required.")
            )

        social_token = adapter.parse_token(token)  # The important change is here.
        social_token.app = app

        try:
            login = self.get_social_login(adapter, app, social_token, access_token)
            if all([attrs.get("first_name"), attrs.get("last_name")]):
                login.user.first_name = attrs.get("first_name")
                login.user.last_name = attrs.get("last_name")
            else:
                login.user.first_name = "null"
                login.user.last_name = "null"
            complete_social_login(request, login)
        except HTTPError:
            raise serializers.ValidationError(_("Incorrect value"))

        if not login.is_existing:
            # We have an account already signed up in a different flow
            # with the same email address: raise an exception.
            # This needs to be handled in the frontend. We can not just
            # link up the accounts due to security constraints
            if allauth_settings.UNIQUE_EMAIL:
                # Do we have an account already with this email address?
                if get_user_model().objects.filter(email=login.user.email).exists():
                    if (
                        get_user_model()
                        .objects.filter(email=login.user.email, last_login__isnull=True)
                        .exists()
                    ):
                        login.user = get_user_model().objects.get(
                            email=login.user.email, last_login__isnull=True
                        )
                    else:
                        print(login.user.email)
                        raise serializers.ValidationError(
                            _("Please use Google to sign in")
                        )
            login.lookup()
            login.save(request, connect=True)

        attrs["user"] = login.account.user
        return attrs


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "email", "password")
        extra_kwargs = {
            "password": {"write_only": True, "style": {"input_type": "password"}},
            "email": {
                "required": True,
                "allow_blank": False,
            },
        }

    def _get_request(self):
        request = self.context.get("request")
        if (
            request
            and not isinstance(request, HttpRequest)
            and hasattr(request, "_request")
        ):
            request = request._request
        return request

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address.")
                )
        return email

    def create(self, validated_data):
        user = User(
            email=validated_data.get("email"),
            name=validated_data.get("name"),
            username=generate_unique_username(
                [validated_data.get("name"), validated_data.get("email"), "user"]
            ),
        )
        user.set_password(validated_data.get("password"))
        user.save()
        request = self._get_request()
        setup_user_email(request, user, [])
        return user

    def save(self, request=None):
        """rest_auth passes request so we must override to accept it"""
        return super().save()


class CustomTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomText
        fields = "__all__"


class HomePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePage
        fields = "__all__"


class PhotoSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.picture:
            data["picture"] = instance.picture__thumbnail.url
        return data

    class Meta:
        model = ProfilePictures
        fields = ["id", "picture", "is_profile_picture"]


class WorkoutTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutType
        fields = ["id", "workout_type"]


class UserSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, required=False)
    workout_types = WorkoutTypeSerializer(many=True, required=False)
    profile_picture = HybridImageField(required=False, allow_null=True)
    slug = serializers.SerializerMethodField()
    fees = serializers.SerializerMethodField()
    trainer_link = serializers.SerializerMethodField()
    send_grid = EmailTransportBackend()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.profile_picture:
            data["profile_picture"] = instance.profile_picture__thumbnail.url
        return data

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "user_type",
            "last_login",
            "bio",
            "geotag",
            "phone_number",
            "trainer_link",
            "profile_picture",
            "social_profile_url",
            "photos",
            "workout_types",
            "stripe_customer_id",
            "stripe_account_id",
            "instagram_link",
            "referral_code",
            "slug",
            "hash",
            "fees",
            "verified_trainer",
        ]

    @staticmethod
    def get_slug(obj):
        return obj.slug if obj.slug else obj.hash

    @staticmethod
    def get_fees(obj):
        return True if obj.groups.filter(name=Groups.Free.name) else False

    def get_trainer_link(self, obj):
        return "{}/u/{}".format(settings.WEBAPP_URL, obj.slug)

class PasswordSerializer(PasswordResetSerializer):
    """Custom serializer for rest_auth to solve reset password error"""

    password_reset_form_class = ResetPasswordForm


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"


class RoomSerializer(serializers.ModelSerializer):
    user_1 = UserSerializer()
    user_2 = UserSerializer()

    class Meta:
        model = Room
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    organiser = UserSerializer(read_only=True)
    member = UserSerializer()

    class Meta:
        model = Event
        fields = "__all__"


class EventPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ["organiser"]


class AmbassadorSerializer(serializers.Serializer):
    last_name = serializers.CharField()
    first_name = serializers.CharField()
    email = serializers.CharField()
    phone_number = serializers.CharField()


class SocialSerializer(serializers.Serializer):
    access_token = serializers.CharField()

    def social_login(self, user_info, social_platform):
        social_id = user_info.pop("id")
        request = self.context.get("request")
        profile = UserUtils.get_profle_meta_details(
            request.META,
            social_id=str(social_id),
            social_platform=social_platform,
            user_info=user_info,
        )
        update_data = {"is_active": True, "profile": profile}
        if "name" in user_info and user_info["name"]:
            update_data.update({"name": user_info["name"]})
        try:
            user = User.objects.get(username__iexact=user_info["email"])
            try:
                if user.profile.profile_image.file:
                    del update_data["profile"]["profile_image"]
            except:
                pass
        except User.DoesNotExist:
            user_dict = UserUtils.get_user_social_dict(user_info)
            account_exists = (
                get_user_model()
                .objects.filter(
                    email=user_dict.get("email"),
                )
                .exists()
            )
            if account_exists:
                raise serializers.ValidationError(
                    {"non_field_errors": 'Please use "Sign in with Google"'}
                )
            user = UserSerializer().create(user_dict)
            token = Token.objects.create(user=user)
        except KeyError:
            raise serializers.ValidationError("Email not found")
        user = UserSerializer().update(instance=user, validated_data=update_data)

        return user


class TagListSerializer(serializers.Field):
    def to_internal_value(self, data):
        if isinstance(data, str):
            data = [t.strip(" []'\"") for t in data.split(",")]
        if type(data) is not list:
            raise ParseError("expected a list of data")
        return data

    def to_representation(self, obj):
        if type(obj) is not list:
            return [tag.name for tag in obj.all()]
        return obj


class PromoCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoCode
        fields = "__all__"


class TrainerClassSerializer(serializers.ModelSerializer):
    class_link = serializers.SerializerMethodField()
    tags = TagListSerializer(required=False)
    author = UserSerializer(required=False, read_only=True)
    clients = serializers.SerializerMethodField()
    promo_code = PromoCodeSerializer(many=True, required=False, write_only=True)
    featured_photo = HybridImageField(required=False, allow_null=True, use_url=True)
    featured_video = serializers.URLField(
        max_length=500, allow_blank=True, allow_null=True, required=False
    )
    earned = serializers.SerializerMethodField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.featured_photo:
            data["featured_photo"] = instance.featured_photo__thumbnail.url
        if "request" in self.context and self.context["request"].user.id == instance.author.id:
            data["promo_code"] = PromoCodeSerializer(instance.promo_code, many=True).data
        if data["free"] or data["price"] == "0.00":
            data["price"] = "0.00"
            data["free"] = True

        return data

    def validate(self, attrs):
        attrs = super().validate(attrs)
        self._validate_author(self.context["request"].user, attrs.get("free", False))
        if attrs.get("promo_code", ""):
            self._validate_promo_code(attrs.get("promo_code"))
        return attrs

    def _validate_author(self, author: User, is_free: bool):
        if not is_free:
            if author.stripe_account_id:
                try:
                    stripe_account = stripe.Account.retrieve(author.stripe_account_id)
                except Exception as exc:
                    capture_message(exc)
                    raise serializers.ValidationError("Raise some errors with stripe")
                if not stripe_account.charges_enabled:
                    raise serializers.ValidationError(
                        "Your Stripe account can't receive payments, please enable payments on www.stripe.com. If problems persist, please contact customer service."
                    )
            else:
                raise serializers.ValidationError("Setup your stripe account")

    def to_internal_value(self, data):
        try:
            super().to_internal_value(data)
        except serializers.ValidationError as e:
            if self.context["request"].method == "POST" and e.detail.get(
                "featured_photo"
            ):
                trainer_classes = TrainerClass.objects.all()
                for training in trainer_classes:
                    if (
                        training.featured_photo
                        and training.featured_photo__thumbnail.url
                        == data.get("featured_photo")
                    ):
                        if requests.get(training.featured_photo.url).status_code == 200:
                            data["featured_photo"] = training.featured_photo
                        else:
                            data.pop("featured_photo")
                        break
                else:
                    data.pop("featured_photo")
            else:
                if e.detail.get("featured_photo"):
                    data.pop("featured_photo")
        return super().to_internal_value(data)

    def _validate_promo_code(self, attrs):
        promos = [promo.get("promo") for promo in attrs]
        if not len(promos) == len(set(promos)):
            raise serializers.ValidationError(
                {"detail": "Can't create a duplicate of the promo codes"}
            )
        return attrs

    class Meta:
        model = TrainerClass
        fields = "__all__"
        extra_kwargs = {
            "password": {
                "write_only": True,
                "min_length": 4,
                "required": False,
                "allow_blank": True,
            },
            "name": {"required": False},
        }
        read_only_fields = [
            "created_at",
            "class_link",
            "author",
            "hash",
            "slug",
            "clients",
        ]

    def get_class_link(self, obj):
        return "{}/e/{}".format(settings.WEBAPP_URL, obj.slug)

    def get_earned(self, obj):
        price = (
            obj.clients.prefetch_related("client_class_payments")
            .filter(
                client_class_payments__success=True,
                client_class_payments__cancelled=False,
            )
            .aggregate(price=Sum("client_class_payments__price"))
        )
        return price["price"] or 0.0

    @staticmethod
    def get_clients(obj):
        return obj.get_clients_count()

    def create(self, validated_data):
        tags = validated_data.pop("tags", [])
        validated_data.update(
            {
                "author": self.context["request"].user,
            }
        )
        promo_codes = []
        for promo in validated_data.pop("promo_code", []):
            promo_codes.append(PromoCode.objects.create(**promo))
        instance = TrainerClass.objects.create(**validated_data)
        instance.tags.set(*tags)
        instance.promo_code.set(promo_codes)

        # TODO push-notifications 1
        # author = instance.author
        # devices = author.fcmdevice_set.all()
        # devices.send_message(title="Undercard", body=Messages.NEW_CLASS)

        return super(TrainerClassSerializer, self).update(
            instance, {"hash": hashlib.shake_256(str(instance.id).encode()).hexdigest(5)}
        )

    def update(self, instance, validated_data):
        if "tags" in validated_data:
            instance.tags.set(*validated_data.pop("tags"))
        if "promo_code" in validated_data:
            promo_codes = []
            for promo in validated_data.pop("promo_code", []):
                promo_codes.append(PromoCode.objects.create(**promo))
            instance.promo_code.set(promo_codes)

        return super(TrainerClassSerializer, self).update(instance, validated_data)


class SpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spot
        fields = ["id", "first_name", "last_name", "email_address", "did_attend"]
        extra_kwargs = {
            "first_name": {
                "required": True,
            },
            "last_name": {
                "required": True,
            },
            "email_address": {
                "required": True,
            },
        }


class SocialGoogleSerializers(SocialLoginSerializer):
    def validate(self, attrs):
        try:
            attrs = super().validate(attrs)
        except serializers.ValidationError as e:
            print(e.detail[0])
            if e.detail[0] == _("User is already registered with this e-mail address."):
                raise serializers.ValidationError(
                    {"non_field_errors": 'Please use "Sign in with Apple"'}
                )
            else:
                raise e
        return attrs


class ClientClassSignUpSerializer(serializers.ModelSerializer):
    spots = SpotSerializer(many=True, required=False)
    trainer_class = serializers.PrimaryKeyRelatedField(
        queryset=TrainerClass.objects.all(), required=False, allow_null=True, default=None
    )

    class Meta:
        model = ClientClassSignUp
        fields = "__all__"

    def create(self, validated_data):
        print ("in sign up create()")
        user = self.context["request"].user
        validated_data["user"] = user if user and user.is_authenticated else None
        spots_data = validated_data.pop("spots")
        spots = []
        if isinstance(spots_data, list) and len(spots_data) > 0:
            print ("copying spots from request")
            spots = Spot.objects.bulk_create(
                [Spot(**spot) for spot in spots_data]
            )
        else:
            print ("creating spots from count")
            """
            spots = Spot.objects.bulk_create(
                [Spot(
                    first_name=validated_data["first_name"],
                    last_name=validated_data["last_name"],
                    email_address=validated_data["email_address"],
                    did_attend=False,)
                    for _ in range(validated_data.spots_count)
                ])
            """
            for _ in range(validated_data.get('spots_count', 0)):
                spots.append(Spot.objects.create(
                        first_name=validated_data["first_name"],
                        last_name=validated_data["last_name"],
                        email_address=validated_data["email_address"],
                        did_attend=False,
                    )
                )

        print (f"spots: {spots}")
        instance = ClientClassSignUp.objects.create(**validated_data)
        instance.spots.set(spots)
        print ("created signup and set signups")
        return instance

    def update(self, instance, validated_data):
        spot_dicts = validated_data.get("spots")
        print ("updating sign up spots: {spot_dicts}")
        spots = Spot.objects.bulk_create([Spot(**spot) for spot in spot_dicts])
        instance.spots.set(spots)
        instance.save()
        return instance

    def validate(self, attrs):
        print ("validating signup")
        attrs["spots"] = self._validate_spots(attrs.get("spots"), attrs.get("spots_count"))
        attrs["trainer_class"] = self._validate_trainer_class()
        self._validate_email_address(attrs.get("spots"))
        print ("validating super")
        return super().validate(attrs)

    def _validate_trainer_class(self):
        trainer_class = TrainerClass.objects.get(
            pk=self.context["view"].kwargs.get("trainer_class_id")
        )
        date_now = datetime.datetime.now(tz=pytz.UTC)
        spots_data = self.initial_data.get("spots")
        spots_count_data = self.initial_data.get("spots_count")
        spots_count = len(spots_data) if isinstance(spots_data, list) else spots_count_data

        if trainer_class.end_repeat and trainer_class.end_repeat < date_now:
            raise serializers.ValidationError(code=401)
        elif trainer_class.published_at is None or trainer_class.published_at > date_now:
            raise serializers.ValidationError(code=402)
        if not trainer_class.client_can_join(peoples_count=spots_count):
            raise serializers.ValidationError(code=403)
        print ("validated trainer class in signup!")
        return trainer_class

    def __get_spots(self, trainer_class, payment_status):
        return Spot.objects.filter(
            clientclasssignup__trainer_class=trainer_class.id,
            clientclasssignup__payment_status=payment_status,
        )

    def _validate_spots(self, spots, spots_count):
        print ("validating spots")
        if (isinstance(spots, list) and len(spots) == 0 
                and isinstance(spots_count, int) and spots_count == 0):
            print (f"invalid class, with neither spots nor spots_count")
            raise serializers.ValidationError(code=407)
        if isinstance(spots, list):
            print (f"validating list of give spots")
            for spot in spots:
                serializer = SpotSerializer(data=spot)
                serializer.is_valid(raise_exception=True)
                if not all(spot.values()):
                    raise serializers.ValidationError(code=406)
        else:
            print(f"creating {spots_count} identical spots")
            spots = []
            if spots_count:
                for _ in range(spots_count):
                    spots.append({
                        "first_name": self.initial_data.get("first_name"),
                        "last_name": self.initial_data.get("last_name"),
                        "email_address": self.initial_data.get("email_address"),
                        "did_attend":False,})

        return spots

    def _validate_email_address(self, value):
        print ("validating email address")
        trainer_class = TrainerClass.objects.get(
            pk=self.context["view"].kwargs.get("trainer_class_id")
        )

        paid_spots = self.__get_spots(trainer_class, ClientClassSignUp.PAID)
        not_paid_spots = self.__get_spots(trainer_class, ClientClassSignUp.NOT_PAID)
        print(paid_spots, not_paid_spots)

        for spot in value:
            if paid_spots.filter(
                email_address__iexact=spot.get("email_address")
            ).exists():
                client_class = paid_spots.get(
                    email_address__iexact=spot.get("email_address")
                ).clientclasssignup_set.first()
                raise serializers.ValidationError(code=404)
            if not_paid_spots.filter(
                email_address__iexact=spot.get("email_address")
            ).exists():
                client_class = not_paid_spots.get(
                    email_address__iexact=spot.get("email_address")
                ).clientclasssignup_set.first()
                raise serializers.ValidationError(code=405)
        return value


class PaymentDetailSerializer(serializers.ModelSerializer):
    # prices = serializers.SerializerMethodField()
    trainer = UserSerializer()
    client = UserSerializer()
    client_class = ClientClassSignUpSerializer()

    class Meta:
        model = PaymentDetail
        fields = "__all__"

    def get_prices(self, payment):
        recurring = self.context.get("recurring")
        return PriceSerializer(
            payment.prices.all()
            .filter(success=True, recurring=recurring)
            .order_by("-create_date_time"),
            many=True,
        ).data


class PriceSerializer(serializers.ModelSerializer):
    payment = PaymentDetailSerializer()
    stripe_subscription = serializers.SerializerMethodField()

    def get_stripe_subscription(self, obj):
        if obj.subscription_id and re.match(r"^sub", obj.subscription_id):
            return {"id": obj.subscription_id}
        else:
            return None

    class Meta:
        model = Price
        fields = "__all__"


class MonthPriceSerializer(serializers.Serializer):
    updated_date_time__month = serializers.IntegerField()
    updated_date_time__year = serializers.IntegerField()
    sum = serializers.FloatField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        year = data.get("updated_date_time__year")
        month = data.get("updated_date_time__month")
        date = datetime.datetime(year, month, 1)
        return {
            "date": datetime.datetime.strftime(date, "%B"),
            "link": f"{year}-{month}",
            "sum": int(data.get("sum")),
        }


class PaymentSerializer(serializers.ModelSerializer):
    trainer = UserSerializer()
    client = UserSerializer()
    client_class = ClientClassSignUpSerializer()
    stripe_subscription = serializers.SerializerMethodField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["payment"] = {
            "trainer": data["trainer"],
            "client": data["client"],
            "client_class": data["client_class"],
        }
        del data["trainer"]
        del data["client"]
        del data["client_class"]
        return data

    def get_stripe_subscription(self, obj):
        if obj.subscription_id and re.match(r"^sub", obj.subscription_id):
            return {"id": obj.subscription_id}
        else:
            return None

    class Meta:
        model = Payment
        exclude = [
            "subscription_id",
        ]


class PaymentLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentLogs
        fields = "__all__"


class FeedbackSerializer(serializers.Serializer):
    client_class = serializers.PrimaryKeyRelatedField(
        queryset=ClientClassSignUp.objects.all(), allow_null=True, required=False
    )
    error_detail = serializers.CharField()
    client_email = serializers.EmailField(allow_null=True, allow_blank=True)
    client_name = serializers.CharField(allow_null=True, allow_blank=True)
    class_link = serializers.CharField(allow_null=True, allow_blank=True)
