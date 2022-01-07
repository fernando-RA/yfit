# Create your views here.

from django.http.request import HttpRequest
from django.http.response import (
    JsonResponse,
    HttpResponseForbidden,
    HttpResponse,
)
from django.contrib.auth import get_user_model
from users.models import User as UCUser

User = get_user_model()

def get_notification(request: HttpRequest) -> HttpResponse:
    """ Get a notification depending on the status of the user. """
    if not request.user:
        return HttpResponseForbidden()
    user : UCUser = request.user
    if user.user_type == UCUser.TRAINER:
        get_next_trainer_notification()
    if user.user_type == UCUser.CLIENT:
        get_next_client_notification()
