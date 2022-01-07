import datetime
import os

import stripe
import pytz
from django.core.files.storage import default_storage
from django.db import IntegrityError
from django.db.models import Q
from rest_framework import serializers, status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.permissions import AllowAny
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from trainer_classes.models import ClientClassSignUp, Spot, TrainerClass
from trainer_classes.utils import calc_amount, create_payout_task
from users.models import User, Payment
from dating.models import Match

from .serializers import (
    ClientClassSignUpSerializer,
    SpotSerializer,
    TrainerClassSerializer,
    UserSerializer,
    PaymentSerializer, 
)
from .viewsets import PostLimitOffsetPagination


class TrainerClassView(RetrieveAPIView):
    """
    This endpoint allows to get Trainer Class information for all guests

    You can get data just by query string you already have - /{hash}/{slug}/
    """

    queryset = TrainerClass.objects.all()
    serializer_class = TrainerClassSerializer
#    authentication_classes = (TokenAuthentication, SessionAuthentication)
    authentication_classes = []
    permission_classes = [AllowAny,]
    lookup_field = "hash"

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class TrainerClassMoreListView(ListAPIView):
    """
    This endpoint allows to get more Classes for trainer
    """

    queryset = (
        TrainerClass.objects.all()
        .prefetch_related("author")
        .prefetch_related("author__workout_types")
        .prefetch_related("author__socialaccount_set")
        .prefetch_related("author__photos")
        .prefetch_related("clients")
        .prefetch_related("tags")
        .prefetch_related("clients__spots")
    )
    serializer_class = TrainerClassSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)

    def list(self, request, hash, slug, *args, **kwargs):
        date_now = datetime.datetime.now(tz=pytz.UTC)
        queryset = self.get_queryset()
        author = queryset.get(slug=slug).author
        queryset = (
            queryset.exclude(
                published_at__isnull=True,
            )
            .filter(
                Q(published_at__lte=date_now)
                & Q(start_time__gte=date_now)
                & (Q(end_repeat__isnull=True) | Q(end_repeat__gte=date_now))
            )
            .order_by("start_time")
        )
        queryset = queryset.exclude(slug=slug).filter(author=author)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ClientClassSignUpView(RetrieveUpdateAPIView):
    """Allows to get and update information about client

    Note
    ----
    There is not safe to allow instance `update` just by query args. We have to `protect it` or `remove update`

    URL Arguments
    -------------
    trainer_class_id (int) -- Identifier of selected Trainer Class

    id (int) -- Identifier of current Client

    Response
    --------
    Updated object of client

    """

    queryset = ClientClassSignUp.objects.all()
    serializer_class = ClientClassSignUpSerializer
    #authentication_classes = (TokenAuthentication, SessionAuthentication)
    authentication_classes = []
    permission_classes = []
    lookup_field = "pk"

    def filter_queryset(self, queryset):
        queryset = queryset.filter(trainer_class=self.kwargs.get("trainer_class_id"))
        return super(ClientClassSignUpView, self).filter_queryset(queryset)


class ClientClassSignUpListView(ListCreateAPIView):
    """
    This endpoint allows to get a list of clients already signed up to selected Trainer class.

    Post request allows to add new client to selected class.

    Notes
    ----
    Please complete spots - there is important for order creation.

    URL Arguments
    --------------
    trainer_class_id (int) -- Identifier of selected Trainer Class

    Response
    --------
    List of Clients.
    """

    queryset = ClientClassSignUp.objects.all()
    serializer_class = ClientClassSignUpSerializer
    #authentication_classes = (TokenAuthentication, SessionAuthentication)
    authentication_classes = []
    permission_classes = []
    lookup_field = "trainer_class_id"

    def filter_queryset(self, queryset):
        queryset = queryset.filter(trainer_class=self.kwargs.get("trainer_class_id"))
        return super(ClientClassSignUpListView, self).filter_queryset(queryset)

    def _get_error_response(self, code):
        if code == 401:
            return Response(
                {
                    "detail": "This class is no longer open. If you believe this is incorrect please",
                    "redirectNeeded": True,
                },
                status=400,
            )
        elif code == 402:
            return Response(
                {
                    "detail": "Trainer Class is in draft mode. If you believe this is incorrect please",
                    "redirectNeeded": True,
                },
                status=400,
            )
        elif code == 403:
            return Response(
                {
                    "detail": "This class is sold out. If you believe this is incorrect please",
                    "redirectNeeded": True,
                },
                status=400,
            )
        elif code == 404:
            return Response(
                {
                    "detail": "You have already signed up fo this class. If you believe this is incorrect please",
                    "redirectNeeded": True,
                },
                status=400,
            )
        elif code == 405:
            return Response(
                {
                    "detail": "There's been an error. Please go back to the class page and try again. If the problem persist",
                    "redirectNeeded": True,
                },
                status=400,
            )
        elif code == 406:
            return Response(
                {"detail": "Fill all spots", "redirectNeeded": False}, status=400
            )

    def create(self, request, *args, **kwargs):
        instance = ClientClassSignUp.objects.filter(
            email_address=request.data.get("email_address"),
            trainer_class__id=self.kwargs.get("trainer_class_id"),
            payment_status=ClientClassSignUp.CANCELED,
        ).first()
        serializer = self.get_serializer(
            instance=instance, data=request.data, context={"request": request}
        )
        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as exc:
            error_code = exc.get_codes().get("detail")[0]
            response = self._get_error_response(error_code)
            return response
        try:
            print ("calling perform_create for signup")
            self.perform_create(serializer)
        except IntegrityError:
            return Response(
                {
                    "detail": "You already registered some spots with email address {}".format(
                        request.data.get("email_address")
                    ),
                    "redirectNeeded": False,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            print (f"serialized data: {serializer.data}")
            return Response(
                {
                    "detail": "We're having some issues, please check back in a few moments",
                    "redirectNeeded": False,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        client_class = ClientClassSignUp.objects.get(pk=serializer.data["id"])
        if (client_class.trainer_class.free and not instance) or (
            calc_amount(
                client_class=client_class, trainer_class=client_class.trainer_class
            )
            == 0
        ):
            client_class.payment_status = ClientClassSignUp.PAID
            client_class.save()
        
        payment_intent_id= request.data.get("payment_intent_id", "")
        if payment_intent_id != "":
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            if payment_intent:
                Payment.objects.create(
                    client = client_class.user,
                    trainer = client_class.trainer_class.author,
                    client_class = client_class,
                    price = payment_intent.amount,
                    currency = payment_intent.currency,
                    payment_intent_id = payment_intent.id,
                    payment_type = Payment.CHECKOUT_PAYMENT
                )
            else:
                print("Invalid client secret!")

        create_payout_task(client_class.trainer_class.id)

        headers = self.get_success_headers(serializer.data)
        return Response(
            self.get_serializer(instance=client_class).data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

class SpotView(RetrieveUpdateAPIView):
    queryset = Spot.objects.all()
    serializer_class = SpotSerializer
    authentication_classes = (TokenAuthentication, SessionAuthentication)



class ClientClassSignUpAttendeesListView(ListAPIView):
    queryset = Spot.objects.all()
    serializer_class = SpotSerializer
    lookup_field = "trainer_class_id"
    authentication_classes = (TokenAuthentication, SessionAuthentication)

    def filter_queryset(self, queryset):
        queryset = queryset.filter(
            clientclasssignup__trainer_class=self.kwargs.get("trainer_class_id"),
            clientclasssignup__payment_status__in=[
                ClientClassSignUp.NOT_PAID,
                ClientClassSignUp.PAID,
                ClientClassSignUp.PENDING_CAPTURE,
            ],
        )
        return super(ClientClassSignUpAttendeesListView, self).filter_queryset(queryset)


class TrainerClassActiveListView(ListAPIView):
    """list of active Trainer classes for current date.

    Endpoint provides a list of all active classes.
    """

    queryset = (
        TrainerClass.objects.all()
        .prefetch_related("author")
        .prefetch_related("author__workout_types")
        .prefetch_related("author__socialaccount_set")
        .prefetch_related("author__photos")
        .prefetch_related("clients")
        .prefetch_related("tags")
        .prefetch_related("clients__spots")
    )
    serializer_class = TrainerClassSerializer

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def filter_queryset(self, queryset):
        date_now = datetime.datetime.now(tz=pytz.UTC)
        queryset = (
            queryset.exclude(Q(published_at__isnull=True) | Q(canceled=True))
            .filter(
                Q(published_at__lte=date_now)
                & (Q(end_repeat__isnull=True) | Q(end_repeat__gte=date_now))
            )
            .order_by("start_time")
        )
        return super(TrainerClassActiveListView, self).filter_queryset(queryset)

class GetClassPaymentsListView(ListAPIView):
    """ list all payments given a class
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    authentication_classes = []

    def filter_queryset(self, queryset):
        classid= self.request.query_params.get("class_id", None)
        # lookup trainer class
        trainer_class = TrainerClass.objects.get(
                pk=trainer_class__id)

        # get signups + payments
        signups = ClientClassSignUp.objects.filter(
                trainer_class=client_class)
        # payments = Payment.objects.filter(client_class in signups)
        queryset = queryset.filter(client_class in signups)
        
        return super(GetClassPaymentsListView, self).filter_queryset(queryset)



class TrainerClassUpcomingListViewPage(ListAPIView):
    """list of active & upcoming Trainer classes

    Endpoint provides a list of all active classes.
    """

    queryset = (
        TrainerClass.objects.all()
        .prefetch_related("author")
        .prefetch_related("author__workout_types")
        .prefetch_related("author__socialaccount_set")
        .prefetch_related("author__photos")
        .prefetch_related("clients")
        .prefetch_related("tags")
        .prefetch_related("clients__spots")
    )
    serializer_class = TrainerClassSerializer
    pagination_class = PostLimitOffsetPagination

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def filter_queryset(self, queryset):
        trainer_id = self.request.query_params.get("trainer_id", None)
        query = self.request.query_params.get("query", "")

        date_now = datetime.datetime.now(tz=pytz.UTC)
        max_date = date_now + datetime.timedelta(days=20)
        queryset = (
            queryset.exclude(Q(published_at__isnull=True) | Q(canceled=True))
            .filter(
                Q(published_at__lte=date_now)
                & Q(start_time__gte=date_now) 
                & Q(start_time__lte=max_date) 
                & (Q(end_repeat__isnull=True) | Q(end_repeat__gte=date_now))
                & Q(name__icontains=query)
            )
            .order_by("start_time")
        )
        if trainer_id:
            queryset = queryset.filter(Q(author__id=trainer_id))
        return super(TrainerClassUpcomingListViewPage, self).filter_queryset(queryset)

class FollowingTrainerClassUpcomingListViewPage(ListAPIView):
    """list of upcoming Trainer classes 
        for trainers that the loaded user is following

    Endpoint provides a list of all active classes.
    """
    authentication_classes = (TokenAuthentication, SessionAuthentication)

    queryset = (
        TrainerClass.objects.all()
        .prefetch_related("author")
        .prefetch_related("author__workout_types")
        .prefetch_related("author__socialaccount_set")
        .prefetch_related("author__photos")
        .prefetch_related("clients")
        .prefetch_related("tags")
        .prefetch_related("clients__spots")
    )
    serializer_class = TrainerClassSerializer
    pagination_class = PostLimitOffsetPagination

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def filter_queryset(self, queryset):
        user_id = self.request.data.get("user_id", self.request.user.id)
        following_matches = Match.objects.filter(owner__id = user_id)
        following_trainer_ids = [match.user_id for match in following_matches]
        date_now = datetime.datetime.now(tz=pytz.UTC)
        max_date = date_now + datetime.timedelta(days=20)
        queryset = (
            queryset.exclude(Q(published_at__isnull=True) | Q(canceled=True))
            .filter(
                Q(published_at__lte=date_now)
                & Q(start_time__gte=date_now) 
                & Q(start_time__lte=max_date) 
                & (Q(end_repeat__isnull=True) | Q(end_repeat__gte=date_now))
                & (Q(author__in=following_trainer_ids))
            )
            .order_by("start_time")
        )
        return super(FollowingTrainerClassUpcomingListViewPage, self).filter_queryset(queryset)


class TrainerClassActiveListViewPage(ListAPIView):
    """list of active Trainer classes for current date.

    Endpoint provides a list of all active classes.
    """

    queryset = (
        TrainerClass.objects.all()
        .prefetch_related("author")
        .prefetch_related("author__workout_types")
        .prefetch_related("author__socialaccount_set")
        .prefetch_related("author__photos")
        .prefetch_related("clients")
        .prefetch_related("tags")
        .prefetch_related("clients__spots")
    )
    serializer_class = TrainerClassSerializer
    pagination_class = PostLimitOffsetPagination

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def filter_queryset(self, queryset):
        trainer_id = self.request.query_params.get("trainer_id", None)
        query = self.request.query_params.get("query", "")

        date_now = datetime.datetime.now(tz=pytz.UTC)
        queryset = (
            queryset.exclude(Q(published_at__isnull=True) | Q(canceled=True))
            .filter(
                Q(published_at__lte=date_now)
                & (Q(end_repeat__isnull=True) | Q(end_repeat__gte=date_now))
                & Q(name__icontains=query)
            )
            .order_by("start_time")
        )
        if trainer_id:
            queryset = queryset.filter(Q(author__id=trainer_id))
        return super(TrainerClassActiveListViewPage, self).filter_queryset(queryset)


class UserRetrieveView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "slug"

    def filter_queryset(self, queryset):
        queryset = queryset.filter(Q(slug=self.kwargs.get("slug")))
        return super().filter_queryset(queryset)


class UserTrainerClassRetrieveView(RetrieveAPIView):
    """
    This endpoint allows to get Trainer Class information for all guests

    You can get data just by query string you already have - /{slug}/
    """

    queryset = TrainerClass.objects.all()
    serializer_class = TrainerClassSerializer
    lookup_field = "slug"


class FileUploadView(APIView):
    link = None
    parser_classes = (MultiPartParser, FormParser)

    def default_video_id(self):
        return "".join("%02x" % x for x in os.urandom(8))

    @property
    def mode(self):
        mode = None
        if self.videoId:
            mode = "ab"
        else:
            mode = "wb"
        return mode

    def update_or_create_local_file(self):
        with open(self.videoId, self.mode) as f:
            for chunk in self.file_obj.chunks():
                f.write(chunk)

    def upload_file(self):
        with default_storage.open(f"featured_video/{self.videoId}", "wb") as f:
            f.write(open(self.videoId, "rb").read())
        self.link = default_storage.url(f"featured_video/{self.videoId}")

    def delete_local_file(self):
        os.remove(self.videoId)

    def save_local_file(self, request):
        self.videoId = request.data.get("videoId", self.default_video_id())
        self.file_obj = request.data.get("file")

        if not self.file_obj:
            raise Exception("'file' is required")

        self.update_or_create_local_file()

    def post(self, request, *args, **kwargs):
        self.save_local_file(request)

        if request.data.get("last_chunk", False):
            self.upload_file()
            self.delete_local_file()
        return Response({"videoId": self.videoId, "link": self.link})
