from django.urls import include, path, re_path
from fcm_django.api.rest_framework import FCMDeviceAuthorizedViewSet
from rest_framework.routers import DefaultRouter

from .views import (
    ClientClassSignUpAttendeesListView,
    ClientClassSignUpListView,
    SpotView,
    ClientClassSignUpView,
    FileUploadView,
    TrainerClassActiveListView,
    TrainerClassActiveListViewPage,
    TrainerClassUpcomingListViewPage,
    FollowingTrainerClassUpcomingListViewPage,
    TrainerClassMoreListView,
    TrainerClassView,
    UserRetrieveView,
    UserTrainerClassRetrieveView,
)
from .viewsets import (
    AppleLogin,
    ClientClassPaymentViewSet,
    CustomTextViewSet,
    EventViewSet,
    FeedbackViewSet,
    GoogleLogin,
    HomePageViewSet,
    LandingPageViewSet,
    LoginViewSet,
    MessageViewSet,
    PaymentViewSet,
    RoomViewSet,
    SignupViewSet,
    TrainerClassViewSet,
    UserViewSet,
)

router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register("customtext", CustomTextViewSet)
router.register("homepage", HomePageViewSet)
router.register("message", MessageViewSet)
router.register("profile", UserViewSet, basename="profile")
router.register("chat", RoomViewSet, basename="chat")
router.register("event", EventViewSet, basename="event")
router.register("payment", PaymentViewSet, basename="payment")
router.register("trainer-class", TrainerClassViewSet, basename="trainer_class")
router.register("client-class-payment", ClientClassPaymentViewSet, basename="payment")
router.register("landing_page", LandingPageViewSet, basename="landing_page")
router.register("device/fcm", FCMDeviceAuthorizedViewSet, basename="device_fcm")
router.register("feedback", FeedbackViewSet, basename="feedback")

urlpatterns = [
    path("", include(router.urls)),
    re_path(r"^login/google/$", GoogleLogin.as_view(), name="google_login"),
    path("login/apple/", AppleLogin.as_view()),
    path(
        "trainer-classes/",
        TrainerClassActiveListView.as_view(),
        name="trainer_classes_active",
    ),
    path("trainer/<str:slug>/", UserRetrieveView.as_view(), name="user_view"),
    path(
        "trainer-classes/<str:slug>/",
        UserTrainerClassRetrieveView.as_view(),
        name="trainer_class_view",
    ),
    path(
        "trainer/<str:hash>/<str:slug>/more/",
        TrainerClassMoreListView.as_view(),
        name="trainer_class_more",
    ),
    path(
        "trainer-classes-page/",
        TrainerClassActiveListViewPage.as_view(),
        name="trainer_classes_active",
    ),
    path(
        "trainer-classes-upcoming-page/",
        TrainerClassUpcomingListViewPage.as_view(),
        name="trainer_classes_upcoming",
    ),
    path(
        "following-trainer-classes-upcoming-page/",
        FollowingTrainerClassUpcomingListViewPage.as_view(),
        name="following_trainer_classes_upcoming",
    ),
    path(
        "trainer-class/<str:hash>/<str:slug>/",
        TrainerClassView.as_view(),
        name="trainer_class_open",
    ),
    path(
        "client-class/<int:trainer_class_id>/",
        ClientClassSignUpListView.as_view(),
        name="client_class_list",
    ),
    path(
        "client-class/spot/<int:pk>/",
        SpotView.as_view(),
        name="client_class_sign_up_spots",
    ),
    path(
        "client-class/<int:trainer_class_id>/attendees/",
        ClientClassSignUpAttendeesListView.as_view(),
        name="client_class_list",
    ),
    path(
        "client-class/<int:trainer_class_id>/<int:pk>/",
        ClientClassSignUpView.as_view(),
        name="client_class_sign_up",
    ),
    path("file-upload/", FileUploadView.as_view()),
]
