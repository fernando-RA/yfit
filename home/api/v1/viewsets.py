import datetime
from time import sleep
import urllib.parse as urlparse
from urllib.parse import parse_qs

import pytz
import stripe
from allauth.socialaccount.models import SocialToken
from allauth.socialaccount.providers.apple.client import AppleOAuth2Client
from allauth.socialaccount.providers.apple.views import AppleOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q, Sum
from rest_auth.registration.views import SocialLoginView
from rest_framework import status, viewsets
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from sentry_sdk import capture_exception
from twilio.base.exceptions import TwilioRestException
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import ChatGrant
from twilio.rest import Client
from users.models import User as UserType
from notification_app.backend import EmailTransportBackend

from home.api.v1.handlers import (
    charge_succeeded,
    checkout_session_async_payment_failed,
    checkout_session_completed,
    invoice,
    _send_success_notification,
    _send_class_cancelation_notification,
    _send_class_cancel_confirmation,
)
from home.models import CustomText, Event, HomePage, Message, Room
from notification_app.backend import SmsTranportBackend
from notification_app.body import ChangingSmsMessageBody
from notification_app.receiver import ConfirmationMessageDataReceiver
from notification_app.sender import Sender
from trainer_classes.models import ClientClassSignUp, PaymentLogs, TrainerClass
from dating.models import Match
from trainer_classes.utils import calc_amount, change_payment_status, create_log, create_reminder_task, payment_schedule
from users.models import User, Payment, ProfilePictures, WorkoutType

from .permissions import IsTrainer
from .serializers import (
    AmbassadorSerializer,
    CustomAppleSocialLoginSerializer,
    CustomTextSerializer,
    EventPostSerializer,
    EventSerializer,
    FeedbackSerializer,
    HomePageSerializer,
    MessageSerializer,
    MonthPriceSerializer,
    PaymentSerializer,
    PhotoSerializer,
    RoomSerializer,
    SignupSerializer,
    SocialGoogleSerializers,
    TrainerClassSerializer,
    UserSerializer,
    WorkoutTypeSerializer,
)

stripe.api_key = (
    settings.STRIPE_LIVE_SECRET_KEY
    if settings.STRIPE_LIVE_MODE
    else settings.STRIPE_TEST_SECRET_KEY
)

User = get_user_model()


class SignupViewSet(ModelViewSet):
    serializer_class = SignupSerializer
    http_method_names = ["post"]


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = AuthTokenSerializer

    def create(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user)
        return Response({"token": token.key, "user": user_serializer.data})


class CustomTextViewSet(ModelViewSet):
    serializer_class = CustomTextSerializer
    queryset = CustomText.objects.all()
    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "put", "patch"]


class HomePageViewSet(ModelViewSet):
    serializer_class = HomePageSerializer
    queryset = HomePage.objects.all()
    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = [IsAdminUser]
    http_method_names = ["get", "put", "patch"]


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)
    queryset = Message.objects.all()


class GoogleLogin(SocialLoginView):
    serializer_class = SocialGoogleSerializers
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = "https://developers.google.com/oauthplayground"


class AppleLogin(SocialLoginView):
    adapter_class = AppleOAuth2Adapter
    callback_url = "https://example.com"
    client_class = AppleOAuth2Client
    serializer_class = CustomAppleSocialLoginSerializer


class PostLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10

    def get_paginated_response(self, data):
        url = self.get_next_link()
        params = urlparse.urlparse(url)
        qs = parse_qs(params.query)
        offset = None
        limit = None

        if qs:
            offset = int(qs.get("offset")[0])
            limit = int(qs.get("limit")[0])

        return Response(
            {"count": self.count, "limit": limit, "offset": offset, "results": data}
        )


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = [IsAuthenticated]
    pagination_class = PostLimitOffsetPagination
    send_grid = EmailTransportBackend()

    def create(self, request, *args, **kwargs): 
        serializer = self.get_serializer(data=request.data, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        serializer.save()
        try:
            self.send_grid.send(
                send_to=request.data.get('email'),
                template_id=settings.SENDGRID_TEMPLATE_IDS.get("WELCOME"),
                subject="Welcome to Rec",
                body="Welcome")
        except Exception as exc:
            print(exc)
            capture_exception(exc)
        return Response(serializer.data, status=201)

    def update(self, request, pk=None, *args, **kwargs):
        instance = User.objects.get(pk=pk)
        old_type = instance.user_type
        serializer = self.get_serializer(instance=instance, data=request.data, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        instance_updated = serializer.save()
        try:
            if old_type == "client" and instance_updated.user_type == 'trainer':
                self.send_grid.send(
                    send_to=instance.email,
                    template_id=settings.SENDGRID_TEMPLATE_IDS.get("NEW_TRAINER"),
                    subject="Congrats on Becoming a Trainer At Rec",
                    body="Congratulations")
        except Exception as exc:
            print('error',exc, flush=True)
            capture_exception(exc)
        return Response(serializer.data)
    
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def retrieve(self, request, pk=None):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def search(self, request):
        """Allows to search users based on query arguments.

        Note
        ----
        Every `search parameter` can be skipped.
        By default response returns a list of all available users.

        Query parameters
        ----------------
        query (str, optional) -- Search string by first/last name and email

        filters (str, optional) -- Comma separated list of `workout_type` identifies

        user_type (str, optional) -- Filters by type of users  - `trainer` or `client`

        Response
        ----------
        List of users
        """
        search_string = request.GET.get("query")
        filters = request.GET.get("filters")
        user_type = request.GET.get("user_type")
        user_query = User.objects.all()

        if user_type:
            user_query = user_query.filter(user_type=user_type)
        if search_string:
            user_query = user_query.filter(
                Q(first_name__icontains=search_string)
                | Q(last_name__icontains=search_string)
                | Q(email__icontains=search_string)
            )
        if filters:
            user_query = user_query.filter(
                workout_types__in=[int(x) for x in filters.split(",")]
            ).distinct()

        serializer = self.get_serializer(user_query, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def followers(self, request):
        user_id = request.data.get("user_id", request.user.id)
        follower_matches = Match.objects.filter(user__id = user_id)
        follower_ids = [match.owner_id for match in follower_matches]
        user_query = User.objects.filter(Q(pk__in=follower_ids))
        
        paginator = PostLimitOffsetPagination()
        puser_query = paginator.paginate_queryset(user_query, request)
        serializer = self.get_serializer(puser_query, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, methods=["get"])
    def following(self, request):
        user_id = request.data.get("user_id", request.user.id)
        following_matches = Match.objects.filter(owner__id=user_id)
        following_ids = [match.user_id for match in following_matches]
        user_query = User.objects.filter(Q(pk__in=following_ids))
        
        paginator = PostLimitOffsetPagination()
        puser_query = paginator.paginate_queryset(user_query, request)
        serializer = self.get_serializer(puser_query, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, methods=["get"])
    def page_search(self, request):
        search_string = request.GET.get("query")
        filters = request.GET.get("filters")
        user_type = request.GET.get("user_type")
        user_query = (
            User.objects.all()
            .prefetch_related("workout_types")
            .prefetch_related("socialaccount_set")
            .prefetch_related("photos")
        )

        paginator = PostLimitOffsetPagination()
        if user_type:
            user_query = user_query.filter(user_type=user_type)
        if search_string:
            user_query = user_query.filter(
                Q(first_name__icontains=search_string)
                | Q(last_name__icontains=search_string)
                | Q(email__icontains=search_string)
            )
        if filters:
            user_query = user_query.filter(
                workout_types__in=[int(x) for x in filters.split(",")]
            ).distinct()
        puser_query = paginator.paginate_queryset(user_query, request)
        serializer = self.get_serializer(puser_query, many=True)
        return paginator.get_paginated_response(serializer.data)

    @action(detail=False, methods=["get"])
    def get_user_profile(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(methods=["post"], detail=False)
    def set_profile_picture(self, request, pk=None):
        serializer = self.get_serializer(
            instance=request.user, data={"profile_picture": request.data.get("image")}
        )
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=["post"], detail=False)
    def upload_photos(self, request, pk=None):
        serializer = PhotoSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
        else:
            return Response(serializer.errors)
        return Response(self.serializer_class(request.user).data)

    @action(methods=["post"], detail=False)
    def set_as_profile_picture(self, request, pk=None):
        id = request.data["photo_id"]
        request.user.photos.all().update(is_profile_picture=False)
        ProfilePictures.objects.get(id=id).set_is_profile_picture()
        return Response(self.serializer_class(request.user).data)

    @action(methods=["post"], detail=False)
    def delete_photo(self, request, pk=None):
        id = request.data["photo_id"]
        ProfilePictures.objects.get(id=id).delete()
        return Response(self.serializer_class(request.user).data)

    @action(methods=["post"], detail=False)
    def extend_workout_types(self, request, pk=None):
        serializer = WorkoutTypeSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors)
        return Response(WorkoutTypeSerializer(WorkoutType.objects.all(), many=True).data)

    @action(methods=["get"], detail=False)
    def list_workout_types(self, request, pk=None):
        return Response(WorkoutTypeSerializer(WorkoutType.objects.all(), many=True).data)

    @action(methods=["post"], detail=False)
    def delete_workout_type(self, request, pk=None):
        id = request.data["workout_type_id"]
        WorkoutType.objects.get(id=id).delete()
        return Response(WorkoutTypeSerializer(WorkoutType.objects.all(), many=True).data)

    @action(methods=["post"], detail=False)
    def update_workout_type(self, request, pk=None):
        id = request.data["workout_type_id"]
        wt = WorkoutType.objects.get(id=id)
        wt.workout_type = request.data["workout_type"]
        wt.save()
        return Response(WorkoutTypeSerializer(WorkoutType.objects.all(), many=True).data)

    @action(methods=["post"], detail=False)
    def add_workout_types(self, request, pk=None):
        ids = request.data["ids"]
        wts = WorkoutType.objects.filter(pk__in=[x.strip() for x in ids.split(",")])
        request.user.workout_types.add(*wts)
        return Response(self.serializer_class(request.user).data)

    @action(methods=["post"], detail=False)
    def remove_workout_types(self, request, pk=None):
        ids = request.data["ids"]
        wts = WorkoutType.objects.filter(pk__in=[x.strip() for x in ids.split(",")])
        request.user.workout_types.remove(*wts)
        return Response(self.serializer_class(request.user).data)

    @action(methods=["post"], detail=False)
    def set_profile_geotag(self, request):
        serializer = self.get_serializer(
            instance=request.user, data={"geotag": request.data.get("geotag")}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=["get"], detail=False)
    def get_social_token(self, request):
        user = request.user
        social_token = SocialToken.objects.filter(account__user=user).first()
        if social_token:
            token = social_token.token
            status_ = status.HTTP_200_OK
        else:
            token = "No token"
            status_ = status.HTTP_400_BAD_REQUEST
        return Response({"token": token}, status=status_)

class RoomViewSet(viewsets.ModelViewSet):
    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.filter(
            Q(user_1=self.request.user) | Q(user_2=self.request.user)
        )

    @action(detail=False, methods=["get"])
    def get_room(self, request):
        user_1 = User.objects.get(id=request.GET["user_1"])
        user_2 = User.objects.get(id=request.GET["user_2"])

        # get a room where user 1 and 2 are present, either as user_1 or user_2
        room = Room.objects.filter(
            (Q(user_1=user_1) | Q(user_2=user_1)) & (Q(user_1=user_2) | Q(user_2=user_2))
        ).first()

        # if no room found, create a room
        if not room:
            account_sid = settings.TWILIO_ACCOUNT_SID
            auth_token = settings.TWILIO_AUTH_TOKEN
            client = Client(account_sid, auth_token)

            room = Room.objects.create(user_1=user_1, user_2=user_2)
            try:
                channel = client.chat.services(
                    settings.TWILIO_CHAT_SERVICE_SID
                ).channels.create(unique_name=room.slug)
                member1 = (
                    client.chat.services(settings.TWILIO_CHAT_SERVICE_SID)
                    .channels(channel.sid)
                    .members.create(identity=user_1)
                )

                member2 = (
                    client.chat.services(settings.TWILIO_CHAT_SERVICE_SID)
                    .channels(channel.sid)
                    .members.create(identity=user_2)
                )
            except TwilioRestException as err:
                capture_exception(err)

        return Response(self.serializer_class(room).data)

    @action(detail=False, methods=["get"])
    def get_token(self, request):
        identity = request.GET.get("user_id")
        device_id = request.GET.get("device_id")  # unique device ID
        platform = request.GET.get("platform")

        account_sid = settings.TWILIO_ACCOUNT_SID
        api_key = settings.TWILIO_API_KEY
        api_secret = settings.TWILIO_API_SECRET
        chat_service_sid = settings.TWILIO_CHAT_SERVICE_SID

        token = AccessToken(account_sid, api_key, api_secret, identity=identity)

        # Create a unique endpoint ID for the device
        endpoint = "TruthItChat:{0}:{1}".format(identity, device_id)

        if chat_service_sid:
            chat_grant = ChatGrant(
                endpoint_id=endpoint,
                service_sid=chat_service_sid,
                push_credential_sid=settings.TWILIO_PUSH_SID_IOS
                if platform == "ios"
                else settings.TWILIO_PUSH_SID_ANDROID,
            )
            token.add_grant(chat_grant)

        response = {"identity": identity, "token": token.to_jwt().decode("utf-8")}

        return Response(response)


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return EventPostSerializer
        return EventSerializer

    def get_queryset(self):
        return Event.objects.filter(
            Q(organiser=self.request.user) | Q(member=self.request.user)
        )

    def perform_create(self, serializer):
        # The request user is set as organiser automatically.
        serializer.save(organiser=self.request.user)

    @action(detail=False, methods=["get"])
    def organiser(self, request):
        serializer = self.get_serializer_class()(
            Event.objects.filter(organiser=self.request.user), many=True
        )
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def member(self, request):
        serializer = self.get_serializer_class()(
            Event.objects.filter(member=self.request.user), many=True
        )
        return Response(serializer.data)


class PaymentViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def get_customer_id(self, request):
        if not request.user.stripe_customer_id:
            customer = stripe.Customer.create(
                description="Customer for {}".format(request.user.email),
                email=request.user.email,
            )
            request.user.stripe_customer_id = customer.id
            request.user.save()
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def get_cards(self, request):
        if not request.user.stripe_customer_id:
            self.create_customer_id(request.user)

        if request.user.stripe_customer_id:
            cards = stripe.Customer.list_sources(
                request.user.stripe_customer_id,
                object="card",
            )
            return Response(cards)
        return Response("User not a customer", status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def get_stripe_account(self, request):
        if not request.user.stripe_account_id:  # acct_done
            return Response(
                {"detail": "No account linked for this user"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            stripe.Account.retrieve(request.user.stripe_account_id)
        )  # acct_done

    @action(detail=False, methods=["post"], permission_classes=[])
    def payment_intent(self, request):
        """
        INPUTS:
            "trainer_stripe_customer_id" (required)
            "amount_cents" (required)
            "stripe_customer_id" (optional)
        OUTPUTS:
            "client_secret"
            "ephemeral_key"
            "customer_id"
        """
        trainer_stripe = request.data.get("trainer_stripe_customer_id", "")
        if trainer_stripe == "":
            return Response(
                "trainer_stripe_customer_id is required",
                status=status.HTTP_400_BAD_REQUEST,
            )

        amount_cents = request.data.get("amount_cents", 0)
        if amount_cents < 50:
            return Response(
                "amount_cents should be at least 50", status=status.HTTP_400_BAD_REQUEST
            )

        customer_id = request.data.get("stripe_customer_id", "")
        if customer_id == "":
            customer = stripe.Customer.create()
            customer_id = customer["id"]

        ephemeralKey = stripe.EphemeralKey.create(
            customer=customer_id, stripe_version="2020-08-27"
        )
        paymentIntent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency="usd",
            customer=customer_id,
            transfer_data={"destination": trainer_stripe},
        )

        return Response(
            {
                "client_secret": paymentIntent.client_secret,
                "ephemeral_key": ephemeralKey.secret,
                "customer_id": customer_id,
                "payment_intent_id": paymentIntent.id
            }
        )

    @action(detail=False, methods=["post"])
    def create_source(self, request):
        if not request.user.stripe_customer_id:
            self.create_customer_id(request.user)

        if request.user.stripe_customer_id:
            card = stripe.Customer.create_source(
                request.user.stripe_customer_id,
                source=request.data["token"],
            )
            return Response(card)
        return Response("User not a customer", status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"])
    def delete_source(self, request):
        if request.user.stripe_customer_id:
            response = stripe.Customer.delete_source(
                request.user.stripe_customer_id, request.data["id"]
            )
            return Response(response)
        return Response("User not a customer", status=status.HTTP_400_BAD_REQUEST)

    def get_product(self, product_id):
        return stripe.Product.retrieve(product_id)

    @action(detail=False, methods=["get"])
    def get_products(self, request):
        return Response(stripe.Product.list())

    @action(detail=False, methods=["get"])
    def get_plans(self, request):
        return Response(stripe.Plan.list())

    def get_subscription(self, customer_id):
        return stripe.Subscription.list(customer=customer_id, limit=1)

    def create_customer_id(self, user):
        customer = stripe.Customer.create(
            description="Customer for {}".format(user.email), email=user.email
        )
        user.stripe_customer_id = customer.id
        user.save()

    @action(detail=False, methods=["get"])
    def get_subs(self, request):
        if not request.user.stripe_customer_id:
            self.create_customer_id(request.user)
        return Response(self.get_subscription(request.user.stripe_customer_id))

    @action(detail=False, methods=["get"])
    def get_sub(self, request):
        id = request.GET.get("id")
        return Response(stripe.Subscription.retrieve(id))

    @action(detail=False, methods=["get"])
    def get_plan(self, request):
        id = request.GET.get("id")
        return Response(stripe.Plan.retrieve(id))

    @action(detail=False, methods=["get"])
    def get_product(self, request):
        id = request.GET.get("id")
        return Response(stripe.Product.retrieve(id))

    @action(detail=False, methods=["get"])
    def get_payment_details_trainer(self, request):
        trainer_id = request.data["trainer_id"]
        recurring = request.GET.get("recurring")
        trainer = User.objects.get(id=trainer_id)
        payments = Payment.objects.filter(
            client=request.user, trainer=trainer, recurring=recurring
        ).order_by("-updated_date_time")
        return Response(PaymentSerializer(payments, many=True).data)

    @action(detail=False, methods=["get"])
    def get_payment_details(self, request):
        recurring = request.GET.get("recurring", False)
        if recurring:
            details = Payment.objects.filter(
                client=request.user, recurring=recurring, success=True
            ).distinct("subscription_id")
        else:
            details = Payment.objects.filter(
                client=request.user, recurring=recurring, success=True
            ).order_by("-updated_date_time")
        return Response(
            PaymentSerializer(details, many=True, context={"recurring": recurring}).data
        )

    @action(detail=False, methods=["get"])
    def get_trainer_payment_details(self, request):
        recurring = request.GET.get("recurring")
        details = Payment.objects.filter(trainer=request.user, success=True).order_by(
            "-updated_date_time"
        )
        if recurring:
            details = details.filter(recurring=recurring)
        return Response(PaymentSerializer(details, many=True).data)

    @action(detail=False, methods=["get"])
    def get_trainer_payment_details_client(self, request):
        client_id = request.data["client_id"]
        client = User.objects.get(id=client_id)
        recurring = request.GET.get("recurring")
        detail = Payment.objects.filter(
            trainer=request.user, client=client, recurring=recurring
        ).order_by("-updated_date_time")
        return Response(
            PaymentSerializer(detail, many=True, context={"recurring": recurring}).data
        )

    @action(detail=False, methods=["get"])
    def payments_received_trainer(self, request):
        # Payments received by the trainer
        recurring = request.GET.get("recurring")
        date = request.GET.get("date")
        client_id = request.GET.get("client_id")
        client_class_id = request.GET.get("client_class_id")

        details = (
            Payment.objects.filter(
                success=True,
                trainer=request.user,
            )
            .prefetch_related("client")
            .prefetch_related("client__photos")
            .prefetch_related("client__workout_types")
            .prefetch_related("client__socialaccount_set")
            .prefetch_related("trainer")
            .prefetch_related("trainer__photos")
            .prefetch_related("trainer__workout_types")
            .prefetch_related("trainer__socialaccount_set")
            .prefetch_related("client_class")
            .prefetch_related("client_class__spots")
            .order_by("-updated_date_time")
        )

        if recurring is not None:
            details = details.filter(Q(recurring=recurring)).order_by(
                "-updated_date_time"
            )
        if date:
            date = datetime.datetime.strptime(date, "%Y-%m")
            details = details.filter(
                updated_date_time__month=date.month,
                updated_date_time__year=date.year,
            ).order_by("-updated_date_time")
            return Response(PaymentSerializer(details, many=True).data)
        if client_id:
            details = details.filter(client__id=client_id).order_by("-updated_date_time")
            return Response(PaymentSerializer(details, many=True).data)
        if client_class_id:
            details = details.filter(
                client_class__id=client_class_id,
            ).order_by("-updated_date_time")
            return Response(PaymentSerializer(details, many=True).data)
        result = []
        if details:
            last_date = details.last().updated_date_time
            now_time = datetime.datetime.now(tz=pytz.UTC)
            while now_time.year > last_date.year or (
                now_time.year == last_date.year and now_time.month >= last_date.month
            ):
                prices_by_month = (
                    details.filter(
                        updated_date_time__month=now_time.month,
                        updated_date_time__year=now_time.year,
                    )
                    .values(
                        "updated_date_time__month",
                        "updated_date_time__year",
                    )
                    .annotate(sum=Sum("price"))
                    .order_by("-updated_date_time__year", "-updated_date_time__month")
                )

                if not prices_by_month:
                    result += [
                        {
                            "date": datetime.datetime.strftime(now_time, "%B"),
                            "link": f"{now_time.year}-{now_time.month}",
                            "sum": 0,
                        }
                    ]
                else:
                    result += MonthPriceSerializer(prices_by_month, many=True).data
                now_time = now_time + relativedelta(months=-1)
        return Response(result)

    @action(detail=False, methods=["get"])
    def payments_received_client(self, request):
        # Payments received by the client
        recurring = request.GET.get("recurring")
        date = request.GET.get("date")
        trainer_id = request.GET.get("trainer_id")

        details = (
            Payment.objects.filter(
                Q(success=True)
                & (Q(client=request.user) | Q(client_class__user=request.user)),
            )
            .prefetch_related("client")
            .prefetch_related("client__photos")
            .prefetch_related("client__workout_types")
            .prefetch_related("client__socialaccount_set")
            .prefetch_related("trainer")
            .prefetch_related("trainer__photos")
            .prefetch_related("trainer__workout_types")
            .prefetch_related("trainer__socialaccount_set")
            .prefetch_related("client_class")
            .prefetch_related("client_class__spots")
            .order_by("-updated_date_time")
        )

        if recurring is not None:
            details = details.filter(Q(recurring=recurring)).order_by(
                "-updated_date_time"
            )
        if date:
            date = datetime.datetime.strptime(date, "%Y-%m")
            details = details.filter(
                Q(updated_date_time__month=date.month)
                & Q(updated_date_time__year=date.year)
            ).order_by("-updated_date_time")
            return Response(PaymentSerializer(details, many=True).data)
        if trainer_id:
            details = details.filter(
                payment__trainer__id=trainer_id,
            ).order_by("-updated_date_time")
            return Response(PaymentSerializer(details, many=True).data)
        result = []
        if details:
            last_date = details.last().updated_date_time
            now_time = datetime.datetime.now(tz=pytz.UTC)
            while now_time.year > last_date.year or (
                now_time.year == last_date.year and now_time.month >= last_date.month
            ):
                prices_by_month = (
                    details.filter(
                        updated_date_time__month=now_time.month,
                        updated_date_time__year=now_time.year,
                    )
                    .values(
                        "updated_date_time__month",
                        "updated_date_time__year",
                    )
                    .annotate(sum=Sum("price"))
                    .order_by("-updated_date_time__year", "-updated_date_time__month")
                )

                if not prices_by_month:
                    result += [
                        {
                            "date": datetime.datetime.strftime(now_time, "%B"),
                            "link": f"{now_time.year}-{now_time.month}",
                            "sum": 0,
                        }
                    ]
                else:
                    result += MonthPriceSerializer(prices_by_month, many=True).data
                now_time = now_time + relativedelta(months=-1)
        return Response(result)

    @action(detail=False, methods=["get"])
    def get_invoices(self, request):
        subscription_id = request.GET["subscription_id"]
        return Response(stripe.Invoice.list(subscription=subscription_id))

    @action(detail=False, methods=["post"])
    def create_subscription(self, request):
        if not request.user.stripe_customer_id:
            self.create_customer_id(request.user)

        recurring = request.data.get("recurring")
        amount = int(float(request.data["price"])) * 100
        trainer_id = request.data["trainer_id"]
        trainer = User.objects.get(id=trainer_id)
        token_id = request.data.get("token_id")
        currency = request.data.get("currency", "usd")
        card = None

        if token_id:
            card = stripe.Customer.create_source(
                request.user.stripe_customer_id,
                source=token_id,
            )

        if not trainer.stripe_account_id:  # acct_done
            return Response(
                {"detail": "No stripe account attached with the trainer"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        payment = Payment.objects.create(trainer=trainer, client=request.user)

        product = stripe.Product.create(name=str(payment))
        price = stripe.Price.create(
            unit_amount=amount,
            currency=currency,
            recurring={"interval": "month"},
            product=product.id,
        )
        payment.price = amount
        payment.recurring = recurring
        payment.currency = currency
        payment.payment_type = (
            Payment.SUBSCRIPTION_CREATION if recurring else Payment.CHARGE
        )

        try:
            if recurring:
                subscription_payload = {
                    "customer": request.user.stripe_customer_id,
                    "items": [
                        {"price": price.id},
                    ],
                    "expand": ["latest_invoice.payment_intent"],
                    "transfer_data": {
                        "destination": trainer.stripe_account_id,  # acct_done
                    },
                    "metadata": {"payment_id": payment.id},
                }
                if card:
                    subscription_payload["default_payment_method"] = card.id

                subscription = stripe.Subscription.create(
                    **subscription_payload,
                )
                payment.subscription_id = subscription.stripe_id
                payment.invoice_id = subscription.latest_invoice.get("id")
                print("I'm continue in subscription")
                create_log(
                    event_type="subscription.create",
                    event_data=subscription,
                    payment=payment.id,
                )
            else:
                charge_payload = {
                    "amount": amount,
                    "currency": currency,
                    "customer": request.user.stripe_customer_id,
                    "transfer_data": {
                        "destination": trainer.stripe_account_id,  # acct_done
                    },
                }
                if card:
                    charge_payload["source"] = card.id

                charge = stripe.Charge.create(**charge_payload)
                payment.charge_id = charge.id

                create_log(
                    event_type="charge.create",
                    event_data=charge,
                    payment=payment.id,
                )
            payment.save()
            print("I'm continue in subscription 2")
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(PaymentSerializer(payment).data)

    @action(detail=False, methods=["post"])
    def cancel_subscription(self, request):
        """
        Request body:

        `id` : Stripe Subscription id

        Response body:

        `Subscription cancelled` or `Error with subscription`

        """
        id = request.data["id"]
        response = stripe.Subscription.delete(id)
        if response.status == "canceled":
            Payment.objects.filter(subscription_id=id).update(cancelled=True)
            create_log(
                event_type="subscription.cancel",
                event_data={"subscription__id": id, "status": "success"},
            )
            return Response("Subscription cancelled")
        else:
            return Response(
                "Error with subscription %s".format(id),
                status=status.HTTP_400_BAD_REQUEST,
            )

    @staticmethod
    def is_country_valid(code):
        specs = stripe.CountrySpec.retrieve("US")
        if code in specs.supported_transfer_countries:
            return True
        return False

    @action(detail=False, methods=["get"])
    def get_country_specs(self, request):
        return Response(stripe.CountrySpec.retrieve("US"))

    @action(detail=False, methods=["post"])
    def create_stripe_account(self, request):
        country = request.data.get("country", "US")
        # if not self.is_country_valid(country):
        #     return Response("Country not supported", status=status.HTTP_400_BAD_REQUEST)
        account = stripe.Account.create(
            type="express",
            email=request.user.email,
            requested_capabilities=settings.STRIPE_CAPABILITIES,
            country=country,
            # tos_acceptance={
            #             'service_agreement': 'recipient',
            #         },
        )
        request.user.stripe_account_id = account.id  # acct_done
        request.user.save()
        link = stripe.AccountLink.create(
            account=account.id,
            refresh_url=f"{settings.WEBSITE_URL}/api/v1/payment/user_failed",
            return_url=f"{settings.WEBSITE_URL}/api/v1/payment/user_created",
            type="account_onboarding",
        )
        return Response(link)

    @action(detail=False, methods=["post"])
    def gen_auth_link(self, request):
        link = stripe.AccountLink.create(
            account=request.user.stripe_account_id,  # acct_done
            refresh_url=f"{settings.WEBSITE_URL}/api/v1/payment/user_failed",
            return_url=f"{settings.WEBSITE_URL}/api/v1/payment/user_created",
            type="account_onboarding",
        )
        return Response(link)

    @action(detail=False, methods=["get"])
    def user_created(self, request):
        return Response("Account created")

    @action(detail=False, methods=["get"])
    def user_failed(self, request):
        return Response("Account creation failed")

    @action(detail=False, methods=["post"])
    def delete_account(self, request):
        stripe.Account.delete(request.user.stripe_account_id)  # acct_done
        request.user.stripe_account_id = ""  # acct_done
        request.user.save()
        return Response("Account deleted")

    @action(detail=False, methods=["post"])
    def create_login_link(self, request):
        link = stripe.Account.create_login_link(
            request.user.stripe_account_id,  # acct_done
            redirect_url=f"{settings.WEBSITE_URL}/api/v1/payment/user_created",
        )
        return Response(link)

    @action(detail=False, methods=["get"])
    def hooks(self, request):
        pass


class TrainerClassViewSet(ModelViewSet):
    serializer_class = TrainerClassSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)
    permission_classes = [IsAuthenticatedOrReadOnly, IsTrainer]
    http_method_names = ["get", "post", "put", "patch"]

    def get_queryset(self):
        user = self.request.user
        queryset = (
            user.trainer_classes.prefetch_related("author")
            .prefetch_related("author__workout_types")
            .prefetch_related("author__socialaccount_set")
            .prefetch_related("author__photos")
            .prefetch_related("clients")
            .prefetch_related("tags")
            .prefetch_related("clients__spots")
            .order_by("start_time")
        )
        return queryset

    def retrieve(self, request, pk=None):
        trainer_class = TrainerClass.objects.get(pk=pk)
        serializer = TrainerClassSerializer(trainer_class, context={"request": request})
        return Response(serializer.data)

    def create (self, request, pk=None, *args, **kwargs):
        try:
            trainer_stripe_account_id = request.user.stripe_account_id
            print(f"trainer stripe account: {trainer_stripe_account_id}")
            account = stripe.Account.modify(
                trainer_stripe_account_id,
                settings={
                    'payouts': {
                      'schedule': {
                        'interval': 'manual',
                      },
                    },
                  }
                )
            print(f"set trainer stripe account {trainer_stripe_account_id} for manual payout")
        except: 
            print (f"Failed to set stripe account for trainer {request.user.id} to manual payout")
            return Response(
                {
                    "detail": f"Failed to set stripe account for trainer {request.user.id} to manual payout",
                    "redirectNeeded": False,
                },
                status=status.HTTP_400_BAD_REQUEST,
                )
        
        return super().create(request, *args, **kwargs)

    def update(self, request, pk=None, *args, **kwargs):
        trainer_class = TrainerClass.objects.get(pk=pk)
        sms_sender = Sender(SmsTranportBackend())
        sms_body = ChangingSmsMessageBody()
        receiver = ConfirmationMessageDataReceiver(trainer_class, None)

        trainer_class.create_or_update_calendar_ics()
        for client in trainer_class.clients.filter(payment_status=ClientClassSignUp.PAID):
            if client.phone_number:
                sms_sender.send(sms_body, receiver, send_to=client.phone_number)

        return super().update(request, *args, **kwargs)

    @action(methods=["post"], detail=True)
    def set_featured_photo(self, request, pk=None):
        serializer = self.get_serializer(
            instance=TrainerClass.objects.get(pk=pk),
            data={"featured_photo": request.data.get("image")},
        )
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)

    @action(methods=["post"], detail=True)
    def cancel_training(self, request, pk=None):
        trainer_class = TrainerClass.objects.get(pk=pk)
        if not bool(trainer_class.author_id == request.user.id):
            return Response(
                {"detail": "You are not an author of this training class"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sign_ups = ClientClassSignUp.objects.filter(trainer_class = trainer_class)
        for sign_up in sign_ups:
            if sign_up.payment_status not in [
                 ClientClassSignUp.PENDING_CAPTURE,
                 ClientClassSignUp.PAID,
                 ClientClassSignUp.NOT_PAID]:
                continue

            try:
                payment = Payment.objects.get(client_class = sign_up)

                if sign_up.payment_status == ClientClassSignUp.PENDING_CAPTURE:
                    try:
                        payment_intent = stripe.PaymentIntent.cancel(payment.payment_intent_id)
                        payment.update(cancelled = True)
                    except:
                        print ("failed to cancel PAID sign up")

                if sign_up.payment_status == ClientClassSignUp.PAID:
                    refund = stripe.Refund.create(
                            payment_intent=payment.payment_intent_id)
                    payment.update(cancelled = True)
                    
            except:
                print ("no payments to cancel")
                
            # sign_up.payment_status = ClientClassSignUp.CANCELED
            sign_up.canceled_at = datetime.datetime.now(tz=pytz.UTC)
            sign_up.save()

            _send_class_cancelation_notification(sign_up)
                    

        serializer = self.get_serializer(instance=TrainerClass.objects.get(pk=pk))
        if serializer.data["clients"]:
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
            message = Mail(
                from_email=settings.SENDGRID_IDENTITY,
                to_emails=settings.CANCEL_EMAIL_REQUEST,
                subject="Request to cancel payment",
                html_content=f"You receive this email because one of your trainer want to cancel the training class and he has some clients. Author - {trainer_class.author.email}, Username - {trainer_class.author.username}, link - {serializer.data['class_link']}",
            )
            try:
                email_response = sg.send(message)
            except Exception as exc:
                capture_exception(exc)
                return Response(
                    "Email was not sent (Error with email service)",
                    status=status.HTTP_200_OK,
                )
        
        _send_class_cancel_confirmation(trainer_class)

        trainer_class.canceled = True
        trainer_class.save()
        return Response("Class canceled", status=status.HTTP_200_OK)


class ClientClassPaymentViewSet(ViewSet):
    @staticmethod
    def _get_line_items(spots, amount, currency, quantity=1):
        return [
            {
                "name": "{} {} ({})".format(
                    item.get("first_name"),
                    item.get("last_name"),
                    item.get("email_address"),
                ),
                "amount": amount,
                "currency": currency,
                "quantity": quantity,
            }
            for item in spots
        ]

    @staticmethod
    def _change_payment_status(client_id, payment_status):
        client_class = ClientClassSignUp.objects.get(pk=client_id)

        if not client_class:
            raise NotFound("Client Class not found.")

        client_class.payment_status = payment_status
        if payment_status == ClientClassSignUp.CANCELED:
            client_class.canceled_at = datetime.datetime.now(tz=pytz.UTC)
        client_class.save()

        return Response("Status changed successfully.")

    @action(detail=True, methods=["get"])
    def get_stripe_session(self, request, pk=None):
        """Creates a stripe session for express payments.

        URL Arguments
        -------------
        id (int) -- Client Class Sign UP identifier

        Query parameters
        ----------------
        currency (str, optional) -- currency, by default USD, can be skipped

        Response
        --------
        Stripe session with unique payment id.
        """
        currency = request.data.get("currency", "usd")
        client_class = ClientClassSignUp.objects.select_related(
            "trainer_class__author"
        ).get(pk=pk)
        trainer_class = client_class.trainer_class
        trainer = trainer_class.author
        amount = calc_amount(client_class, trainer_class)
        payment_method = client_class.payment_method or "card"

        if not trainer.stripe_account_id:  # acct_done
            client_class.payment_status = ClientClassSignUp.CANCELED
            client_class.save()
            try:
                send_notify_us(
                    {
                        "error_detail": "One of the trainer doesn't setup stripe",
                        "client_class": client_class.id,
                        "class_link": TrainerClassSerializer().get_class_link(
                            trainer_class
                        ),
                        "client_email": client_class.email_address,
                        "client_name": client_class.first_name + client_class.last_name,
                    }
                )
            except Exception as exc:
                capture_exception(exc)
            return Response(
                {
                    "detail": "We're having some issues at the moment, please check back in a few moments.",
                    "redirectNeeded": False,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        line_items = self._get_line_items(client_class.get_spots(), amount, currency)
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=[payment_method],
                line_items=line_items,
                payment_intent_data={
                    "application_fee_amount": 0,
                    "transfer_data": {
                        "destination": trainer.stripe_account_id,  # acct_done
                    },
                    "capture_method": "manual",
                },
                success_url="{}/reserve-success".format(settings.WEBAPP_URL),
                cancel_url="{}/e/{}".format(settings.WEBAPP_URL, trainer_class.slug),
            )
        except Exception:
            client_class.payment_status = ClientClassSignUp.CANCELED
            client_class.save()
            try:
                send_notify_us(
                    {
                        "error_detail": "One of the trainer doesn't setup stripe",
                        "client_class": client_class.id,
                        "class_link": TrainerClassSerializer().get_class_link(
                            trainer_class
                        ),
                        "client_email": client_class.email_address,
                        "client_name": client_class.first_name + client_class.last_name,
                    }
                )
            except Exception as exc:
                capture_exception(exc)
            return Response(
                {
                    "detail": "We're having some issues at the moment, please check back in a few moments.",
                    "redirectNeeded": False,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        payment, _ = Payment.objects.get_or_create(
            client_class=client_class,
            trainer=trainer,
            price=session["amount_total"],
            currency=session["currency"],
            payment_type=Payment.CHECKOUT_PAYMENT,
            success=False,
        )

        payment.payment_intent_id = session.payment_intent
        payment.save()
        create_log(
            stripe_session_id=session.id,
            event_type="get_stripe_session",
            event_data=session,
            payment=payment.id,
        )
        client_class.payment_status = ClientClassSignUp.NOT_PAID
        client_class.save()
        return Response(session)

    def construct_stripe_event(self, request, secret="STRIPE_ENDPOINT_SECRET"):
        payload = request.body
        sig_header = request.headers.get("stripe-signature")
        event = None
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            getattr(settings, secret),
        )
        return event

    @action(detail=True, methods=["get"])
    def session_success(self, request, pk=None):
        """Call this endpoint on stripe session success response

        id (int) - client class id
        """
        payment = Payment.objects.get(client_class__id=pk)
        payment.success = True
        payment.save()

        create_log(
            event_type="session_success",
            event_data={"client_class__id": pk},
            payment=payment.id,
        )

        return Response("Successfully paid.")

    @action(detail=True, methods=["get"])
    def session_cancel(self, request, pk=None):
        """Call this endpoint on stripe session cancel response

        id (int) - client class id
        """

        payment = Payment.objects.get(client_class__id=pk)
        if payment.success:
            return Response(
                "Status can not be changed.", status=status.HTTP_400_BAD_REQUEST
            )

        payment.success = False
        payment.cancelled = True
        payment.save()

        create_log(
            payment=payment.id,
            event_type="session_cancel",
            event_data={"client_class__id": pk},
        )

        return self._change_payment_status(
            client_id=pk, payment_status=ClientClassSignUp.CANCELED
        )

    @action(detail=True, methods=["get"])
    def session_refunded(self, request, pk=None):
        """Call this endpoint on stripe session refund response

        id (int) - client class id
        """
        payment = Payment.objects.get(client_class__id=pk)
        payment.success = False
        payment.save()

        create_log(
            event_type="session_refunded",
            event_data={"client_class__id": pk},
            payment=payment.id,
        )

        return self._change_payment_status(
            client_id=pk, payment_status=ClientClassSignUp.REFUNDED
        )

    @action(detail=False, methods=["post"])
    def paymentintent_webhook(self, request):
        try: # parse event
            event = self.construct_stripe_event(
                request, "STRIPE_WEBHOOK_PAYMENTINTENT_SECRET")
        except ValueError:
            return Response({"details": "stripe construction value error"}, 
                    status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            return Response({"details": "stripe construction signature error"}, 
                    status=status.HTTP_400_BAD_REQUEST)
        
        try: # lookup payment
            sleep(1)
            payment_intent_id = event["data"]["object"]["id"]
            print(f"looking up payment by payment intent: {payment_intent_id}")
            payment = Payment.objects.get(payment_intent_id=payment_intent_id)
        except Payment.DoesNotExist:
            return Response({"details": "payment does not exist"}, 
                    status=status.HTTP_400_BAD_REQUEST)
        
        try: 
            if event["type"] == "payment_intent.payment_failed":
                return change_payment_status(
                    client_id=payment.client_class.id,
                    payment_status=ClientClassSignUp.FAILED
                )
        except:
            return Response({"details": "failed to handle event type payment failed"}, 
                    status=status.HTTP_400_BAD_REQUEST)

        try:
            if event["type"] == "payment_intent.succeeded":
                _send_success_notification(payment.client_class.id)
                return change_payment_status(
                    client_id=payment.client_class.id,
                    payment_status=ClientClassSignUp.PAID
                )
        except:
            return Response({"details": "failed to handle event type payment succeeded"}, 
                    status=status.HTTP_400_BAD_REQUEST)

        if event["type"] == "payment_intent.amount_capturable_updated":
            try:
                payment_schedule(payment.client_class.id)
            except:
                return Response({"details": "failed to schedule payment"}, 
                        status=status.HTTP_400_BAD_REQUEST)
            try:
                self._change_payment_status(
                    client_id=payment.client_class.id,
                    payment_status=ClientClassSignUp.PENDING_CAPTURE)
            except:
                return Response({"details": "failed to change payment status"}, 
                        status=status.HTTP_400_BAD_REQUEST)
            try:
                _send_success_notification(payment.client_class.id)
            except:
                print("failed to send success notification")

        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def session_webhook(self, request):
        try:
            event = self.construct_stripe_event(
                request,
            )
            event_object = event["data"]["object"]
            sign_up_statuses = dict(ClientClassSignUp.PAYMENT_STATUS)
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event["type"] == "checkout.session.async_payment_failed":
            payment_log = PaymentLogs.objects.filter(
                stripe_session_id=event_object["id"]
            ).first()
            client_id = payment_log.payment.client_class.id if payment_log else None
            checkout_session_async_payment_failed(event)
            return change_payment_status(
                client_id=client_id, payment_status=ClientClassSignUp.FAILED
            )

        if event["type"] in [
            "checkout.session.completed",
            "checkout.session.async_payment_succeeded",
        ]:
            payment_log = PaymentLogs.objects.filter(
                stripe_session_id=event_object["id"]
            ).first()
            client_id = payment_log.payment.client_class.id if payment_log else None
            checkout_session_completed(event, client_id)
            payment_schedule(client_id)
            create_reminder_task(client_id)
            if event_object["payment_status"] in sign_up_statuses:
                return self._change_payment_status(
                    client_id=client_id, payment_status=event_object["payment_status"]
                )

        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def charge_webhook(self, request):
        try:
            event = self.construct_stripe_event(request, "STRIPE_CHARGE_ENDPOINT_SECRET")
        except (ValueError, stripe.error.SignatureVerificationError):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            charge_succeeded(event)
        except Payment.DoesNotExist:
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def invoice_webhook(self, request):
        try:
            event = self.construct_stripe_event(request, "STRIPE_INVOICE_ENDPOINT_SECRET")
        except ValueError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        invoice(event)
        return Response(status=status.HTTP_200_OK)


class LandingPageViewSet(ViewSet):
    serializer_class = AmbassadorSerializer

    def get_serializer(self, *args, **kwargs):
        return self.serializer_class(*args, **kwargs)

    @action(detail=False, methods=["get"])
    def trainers_count(self, request):
        count = User.objects.filter(user_type=User.TRAINER).count()
        return Response({"trainers_count": ">1000" if count > 1000 else count})

    @action(detail=False, methods=["post"])
    def create_ambassador(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        message = Mail(
            from_email=settings.SENDGRID_IDENTITY,
            to_emails=settings.REGISTRATION_AMBASSADOR_EMAIL,
            subject="New ambassador",
            html_content=f"You have a new ambassador {serializer.data.get('first_name')} {serializer.data.get('last_name')} {serializer.data.get('email')} {serializer.data.get('phone_number')}",
        )
        sg.send(message)
        return Response(status=200)


def send_notify_us(data):
    sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
    message = Mail(
        from_email=settings.SENDGRID_IDENTITY,
        to_emails=settings.FEEDBACK_EMAIL,
        subject="Feedback error",
        html_content=f"""Error occured \'{data.get('error_detail')}\' in 
        {'client class id = ' + str(data.get('client_class')) +', ' if data.get('client_class') else ''}
        client email {data.get('client_email')},
        client name {data.get('client_name')},
        class link {data.get('class_link')}
        """,
    )
    sg.send(message)


class FeedbackViewSet(ViewSet):
    serializer_class = FeedbackSerializer

    def get_serializer(self, *args, **kwargs):
        return self.serializer_class(*args, **kwargs)

    @action(detail=False, methods=["post"])
    def notify_us(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            send_notify_us(serializer.data)
        except Exception as exc:
            capture_exception(exc)
            return Response(
                {"detail": "Some errors are occured with email service"}, status=200
            )
        else:
            return Response(
                {
                    "detail": "Thank you for notifying us. Our team is working quickly to resolve your issue and will contact you via email."
                },
                status=200,
            )
