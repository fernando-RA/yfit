from rest_framework.response import Response
from rest_framework.views import exception_handler
from sentry_sdk import capture_exception
import typing as T


def custom_exception_handler(exc, context):
    if hasattr(exc, "detail") and isinstance(exc.detail, dict):
        for key, item in exc.detail.items():
            if isinstance(item, list):
                try:
                    exc.detail[key] = " ".join(item)
                except TypeError:
                    pass

    response = exception_handler(exc, context)
    # status_code = getattr(exc, "status_code", None) or getattr(exc, "http_status", None)
    capture_exception(exc)
    return response or Response({"detail": str(exc)}, status=400)



