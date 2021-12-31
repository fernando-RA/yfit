from django.urls import path, include
from push_notifications.api.rest_framework import (
    APNSDeviceAuthorizedViewSet,
    GCMDeviceAuthorizedViewSet,
)
from rest_framework.routers import DefaultRouter

push_router = DefaultRouter()
push_router.register(r"device/apns", APNSDeviceAuthorizedViewSet)
push_router.register(r"device/gcm", GCMDeviceAuthorizedViewSet)

from .views import (
    UserDetailView,
    UserUpdateView,
    user_detail_view,
    user_redirect_view,
    user_update_view,
)

app_name = "users"
urlpatterns = [
    path(r"", include(push_router.urls)),
    path("~redirect/", view=user_redirect_view, name="redirect"),
    path("~update/", view=user_update_view, name="update"),
    path("<str:username>/", view=user_detail_view, name="detail"),
    path(
        "users/<int:pk>/detail/",
        UserDetailView.as_view(),
        name="user_detail",
    ),
    path(
        "users/<int:pk>/update/",
        UserUpdateView.as_view(),
        name="update_user",
    ),
]
