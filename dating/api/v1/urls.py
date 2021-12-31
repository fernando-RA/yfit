from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .viewsets import (
    MatchViewSet,
)

router = DefaultRouter()
router.register("match", MatchViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
