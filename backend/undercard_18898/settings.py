import os

import environ
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
import stripe

env = environ.Env()
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG", default=False)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("SECRET_KEY")

ALLOWED_HOSTS = env.list("HOST", default=["*"])
SITE_ID = 1

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env.bool("SECURE_REDIRECT", default=False)


# CORS settings
CORS_ALLOW_ALL_ORIGINS = env.list("CORS_ALLOW_ALL_ORIGINS", default=True)
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=())
CORS_ALLOWED_ORIGIN_REGEXES = env.list("CORS_ALLOWED_ORIGIN_REGEXES", default=())

# This helps django not freak out
# if an app is specified more than once.
unique = lambda x: list(set(x))

# Application definition

BASE_APPS = unique(
    [
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
        "django.contrib.sites",
        "dating",
        "debug_toolbar",
    ]
)
LOCAL_APPS = unique(
    [
        "home",
        "trainer_classes",
        "users",
        "undercard_push",
    ]
)
THIRD_PARTY_APPS = unique(
    [
        "rest_framework",
        "rest_framework.authtoken",
        "rest_auth",
        "rest_auth.registration",
        "bootstrap4",
        "allauth",
        "allauth.account",
        "allauth.socialaccount",
        "allauth.socialaccount.providers.google",
        "allauth.socialaccount.providers.apple",
        "django_extensions",
        "taggit",
        "imagekit",
        "drf_yasg",
        "corsheaders",
        "polymorphic",
        "django.contrib.contenttypes",
        # start fcm_django push notifications
        "fcm_django",
        "push_notifications",
        # end fcm_django push notifications
        "subscriptions",
        "django_celery_beat",
        "notification_app",
    ]
)

INSTALLED_APPS = unique(BASE_APPS + LOCAL_APPS + THIRD_PARTY_APPS)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
            "propagate": False,
        },
        "undercard_push": {
            "handlers": ["console"],
            "level": os.getenv("UNDERCARD_LOG_LEVEL", "DEBUG"),
            "propagate": False,
        },
    },
}

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

ROOT_URLCONF = "undercard_18898.urls"

CORS_ALLOW_ALL_ORIGINS = True

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "undercard_18898.wsgi.application"

INTERNAL_IPS = ["127.0.0.1", "localhost", "undercard-staging.herokuapp.com"]


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
    }
}

if env.str("DATABASE_URL", default=None):
    DATABASES = {"default": env.db()}

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = env.bool("USE_TZ", True)
CELERY_TIMEZONE = "UTC"

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = "/static/"

MIDDLEWARE += ["whitenoise.middleware.WhiteNoiseMiddleware"]

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
)

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# allauth / users
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_UNIQUE_EMAIL = True
LOGIN_REDIRECT_URL = "users:redirect"

ACCOUNT_ADAPTER = "users.adapters.AccountAdapter"
SOCIALACCOUNT_ADAPTER = "users.adapters.SocialAccountAdapter"
ACCOUNT_ALLOW_REGISTRATION = env.bool("ACCOUNT_ALLOW_REGISTRATION", True)
SOCIALACCOUNT_ALLOW_REGISTRATION = env.bool("SOCIALACCOUNT_ALLOW_REGISTRATION", True)

REST_AUTH_SERIALIZERS = {
    # Replace password reset serializer to fix 500 error
    "PASSWORD_RESET_SERIALIZER": "home.api.v1.serializers.PasswordSerializer",
}
REST_AUTH_REGISTER_SERIALIZERS = {
    # Use custom serializer that has no username and matches web signup
    "REGISTER_SERIALIZER": "home.api.v1.serializers.SignupSerializer",
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PAGINATION_CLASS": "undercard_18898.custom_pagination.CustomPagination",
    "EXCEPTION_HANDLER": "undercard_18898.utils.custom_exception_handler",
    "PAGE_SIZE": 100000,
    "NON_FIELD_ERRORS_KEY": "detail",
    "DATETIME_FORMAT": "%Y-%m-%dT%H:%M:%S.%fZ",
}

# Custom user model
AUTH_USER_MODEL = "users.User"

EMAIL_HOST = env.str("EMAIL_HOST", "smtp.sendgrid.net")
EMAIL_HOST_USER = env.str("SENDGRID_USERNAME", "")
EMAIL_HOST_PASSWORD = env.str("SENDGRID_PASSWORD", "")
EMAIL_PORT = 587
EMAIL_USE_TLS = True

REGISTRATION_AMBASSADOR_EMAIL = env.str(
    "REGISTRATION_AMBASSADOR_EMAIL", "undercardteam@gmail.com"
)
SENDGRID_API_KEY = env.str("SENDGRID_API_KEY", "")
SENDGRID_IDENTITY = env.str("SENDGRID_IDENTITY", "")
SENDGRID_WEBHOOK_KEY = env.str("SENDGRID_WEBHOOK_KEY", "")
SENDGRID_TEMPLATE_IDS = {
    "WELCOME": env.str("SENDGRID_TEMPLATE_IDS_WELCOME", ""),
    "NEW_TRAINER": env.str("SENDGRID_TEMPLATE_IDS_NEW_TRAINER", "")
}
CANCEL_EMAIL_REQUEST = env.str("CANCEL_EMAIL_REQUEST", "")
FEEDBACK_EMAIL = env.str("FEEDBACK_EMAIL", "")

BROKER_URL = env.str("BROKER_URL", "")

# start fcm_django push notifications
FCM_DJANGO_SETTINGS = {
    "FCM_SERVER_KEY": env.str("FCM_API_KEY", ""),
}
# end fcm_django push notifications


if DEBUG:
    # output email to console instead of sending
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = env.str("EMAIL_HOST", "smtp.sendgrid.net")
EMAIL_HOST_USER = env.str("EMAIL_HOST_USER", "apikey")
EMAIL_HOST_PASSWORD = env.str("EMAIL_HOST_PASSWORD", SENDGRID_API_KEY)
EMAIL_PORT = env.int("EMAIL_PORT", 587)
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", True)
EMAIL_BACKEND = env.str("EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend")
DEFAULT_FROM_EMAIL = env.str("DEFAULT_FROM_EMAIL", SENDGRID_IDENTITY)

TWILIO_ACCOUNT_SID = env.str("TWILIO_ACCOUNT_SID", "")
TWILIO_API_KEY = env.str("TWILIO_API_KEY", "")
TWILIO_API_SECRET = env.str("TWILIO_API_SECRET", "")
TWILIO_CHAT_SERVICE_SID = env.str("TWILIO_CHAT_SERVICE_SID", "")
TWILIO_PUSH_SID = env.str("TWILIO_PUSH_SID", "")
TWILIO_PUSH_SID_IOS = env.str("TWILIO_PUSH_SID_IOS", "")
TWILIO_PUSH_SID_ANDROID = env.str("TWILIO_PUSH_SID_ANDROID", "")
TWILIO_AUTH_TOKEN = env.str("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_PHONE = env.str("TWILIO_FROM_PHONE", "")

TWILIO_SMS_ACCOUNT_SID = env.str("TWILIO_SMS_ACCOUNT_SID", "")
TWILIO_SMS_AUTH_TOKEN = env.str("TWILIO_SMS_AUTH_TOKEN", "")
TWILIO_SMS_FROM_PHONE = env.str("TWILIO_SMS_FROM_PHONE", "")
TWILIO_SMS_URL_CALLBACK = env.str("TWILIO_SMS_URL_CALLBACK", "")

AWS_STORAGE_REGION = env.str("AWS_STORAGE_REGION", "us-east-2")
AWS_STORAGE_BUCKET_NAME = env.str("AWS_STORAGE_BUCKET_NAME", "")
AWS_ACCESS_KEY_ID = env.str("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = env.str("AWS_SECRET_ACCESS_KEY", "")

AWS_S3_CUSTOM_DOMAIN = "%s.s3.amazonaws.com" % AWS_STORAGE_BUCKET_NAME
AWS_LOCATION = "static"
AWS_DEFAULT_ACL = None
AWS_S3_FILE_OVERWRITE = False

APPLICATION_FEE_PERCENT = env.int("APPLICATION_FEE_PERCENT", 10)

IMAGEKIT_DEFAULT_IMAGE_CACHE_BACKEND = (
    "imagekit.imagecache.NonValidatingImageCacheBackend"
)
IMAGEKIT_CACHE_TIMEOUT = None

DEFAULT_FILE_STORAGE = "undercard_18898.storage_backends.MediaStorage"


STRIPE_LIVE_PUBLIC_KEY = env.str("STRIPE_LIVE_PUBLIC_KEY", "")
STRIPE_LIVE_SECRET_KEY = env.str("STRIPE_LIVE_SECRET_KEY", "")
STRIPE_TEST_PUBLIC_KEY = env.str("STRIPE_TEST_PUBLIC_KEY", "sk_test_51Gx2uDFx3mptEQEdsc2NaMdxqEibRKkZsmho6YdUTavnziIKEPWvYNmuqH5pxDfzQoPKJjy0LJPD1QS2BCnFX2TA007koT5PBQ")
STRIPE_TEST_SECRET_KEY = env.str("STRIPE_TEST_SECRET_KEY", "sk_test_51Gx2uDFx3mptEQEdsc2NaMdxqEibRKkZsmho6YdUTavnziIKEPWvYNmuqH5pxDfzQoPKJjy0LJPD1QS2BCnFX2TA007koT5PBQ")
STRIPE_ENDPOINT_SECRET = env.str("STRIPE_ENDPOINT_SECRET", "")



STRIPE_INVOICE_ENDPOINT_SECRET = env.str("STRIPE_INVOICE_ENDPOINT_SECRET", "")
STRIPE_CHARGE_ENDPOINT_SECRET = env.str("STRIPE_CHARGE_ENDPOINT_SECRET", "")
STRIPE_WEBHOOK_PAYMENTINTENT_SECRET = env.str("STRIPE_WEBHOOK_PAYMENTINTENT_SECRET", "")
STRIPE_LIVE_MODE = env.bool("STRIPE_LIVE_MODE", default=False)
STRIPE_CAPABILITIES = env.list(
    "STRIPE_CAPABILITIES", default=["card_payments", "transfers"]
)

print(env.str("STRIPE_TEST_SECRET_KEY", ""), flush=True)

stripe.api_key = (
    STRIPE_LIVE_SECRET_KEY
    if STRIPE_LIVE_MODE
    else STRIPE_TEST_SECRET_KEY
)


WEBSITE_URL = env.str("WEBSITE_URL", "http://localhost:8000")

WEBAPP_URL = env.str("WEBAPP_URL", "https://undercard.app")

APPLE_KEY_ID = os.environ.get("APPLE_KEY_ID", "")
APPLE_TEAM_ID = os.environ.get("APPLE_TEAM_ID", "")
APPLE_CLIENT_ID = os.environ.get("APPLE_CLIENT_ID", "")
try:
    APPLE_SECRET_KEY = os.environ.get("APPLE_SECRET_KEY").replace("||n||", "\n")
except:
    APPLE_SECRET_KEY = ""

CELERY_BEAT_SCHEDULER = env.str(
    "CELERY_BEAT_SCHEDULER", "django_celery_beat.schedulers:DatabaseScheduler"
)
CELERY_BROKER_URL = env.str("CELERY_BROKER_URL", BROKER_URL)
CELERY_RESULT_BACKEND = env.str("CELERY_RESULT_BACKEND", BROKER_URL)

SOCIALACCOUNT_PROVIDERS = {
    "apple": {
        "APP": {
            "client_id": APPLE_CLIENT_ID,  # APPLE_CLIENT_ID
            "key": APPLE_TEAM_ID,  # APPLE_TEAM_ID
            "secret": APPLE_KEY_ID,  # APPLE_KEY_ID
            "certificate_key": APPLE_SECRET_KEY,  # APPLE_SECRET_KEY
        }
    }
}
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800
DFS_ENABLE_ADMIN = True

SENTRY_DSN = env.str("SENTRY_DSN", "")
sentry_sdk.init(
    dsn=SENTRY_DSN,
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
    send_default_pii=True,
)

import sys
from datetime import timedelta

IS_RUNNING_TEST = sys.argv[1] == "test"
# UNDERCARD_LOCAL = (os.getenv("UNDERCARD_LOCAL", "0") == "1")
UNDERCARD_LOCAL = 1
# import ipdb; ipdb.set_trace()
if UNDERCARD_LOCAL or IS_RUNNING_TEST:
    IS_RUNNING_TEST = True
    TESTASSETS = os.path.join(BASE_DIR, "testassets")
    APNS_CERTIFICATE = os.path.join(TESTASSETS, "localhost.pem")
    WP_PRIVATE_KEY = os.path.join(TESTASSETS, "localhost.pem")
if UNDERCARD_LOCAL:
    APNS_CERTIFICATE = os.path.join(TESTASSETS, "localhost.pem")
    WP_PRIVATE_KEY = os.path.join(TESTASSETS, "localhost.pem")
else:
    import re

    target_dir = os.path.expandvars(os.path.join("$HOME", "certs"))
    os.makedirs(target_dir, exist_ok=True)
    APNS_CERTIFICATE = os.path.join(target_dir, "apns.cert")
    raw = os.getenv("APNS_CERTIFICATE", None)
    raw = re.sub(r"\|{2}[\s\n]*", "\n", raw)
    with open(APNS_CERTIFICATE, "w+") as f:
        f.write(raw)
    WP_PRIVATE_KEY = None

try:
    with open(APNS_CERTIFICATE) as f:
        assert f.read()
except Exception as err:
    print("Could not read APNS Certificate")
    print("Ensure APNS_CERTIFICATE is set")
    raise err

# TODO: Get proper settings from Samar
PUSH_NOTIFICATIONS_SETTINGS = {
    # "CONFIG": "push_notifications.conf.AppConfig",
    "CONFIG": "undercard_push.conf.app.FixedAppConfig",
    "APPLICATIONS": {
        "71b8302bb999c2a649156cdc86b67d076e48de668a961e7a4e1896e912a0d569": {
            "PLATFORM": "APNS",
            # "FCM_API_KEY": os.environ.get("FCM_API_KEY", None),
            # "GCM_API_KEY": os.environ.get("GCM_API_KEY", None),
            "CERTIFICATE": APNS_CERTIFICATE,
            "TOPIC": os.environ.get("GCM_API_KEY", "com.undercard.fitnessapp"),
            # "WNS_PACKAGE_SECURITY_ID": "[your package security id, e.g: 'ms-app://e-3-4-6234...']",
            # "WNS_SECRET_KEY": "[your app secret key, e.g.: 'KDiejnLKDUWodsjmewuSZkk']",
            # "WP_PRIVATE_KEY": WP_PRIVATE_KEY,
            # "WP_CLAIMS": {"sub": "mailto: development@example.com"},
        },
    },
}

# Custom notification settings
# Each "message" argument is a jinja2 template, so it can be formatted
# based on parameters passed in (depending on the model trigering the
# notification).
# - attendee_registration
#   - attendee_signup: The signup that has occurred.
# - trainer_pre_class_reminder
#   - trainer_class: The class that's scheduled.
# - client_pre_class_reminder
#   - trainer_class: The class that's scheduled.
# - class_payment_notification
#   - signup: ClientClassSignUp object associated with the user.
# - trainer_following
#   - client
#   - followed_by

DEFAULT_TITLE = None

PUSH_MESSAGES = {
    "attendee_registration": {
        "title": DEFAULT_TITLE,
        "subtitle": "",
        "message": "{{ attendee_signup.first_name }} {{ attendee_signup.last_name }} reserved {{ attendee_signup.trainer_class.name}} on {{ start_time_str }}",
    },
    "trainer_pre_class_reminder": {
        "title": DEFAULT_TITLE,
        "subtitle": "" or DEFAULT_TITLE,
        "delta": timedelta(hours=12),
        "message": "Reminder: Your class {{trainer_class.name}} begins in 12 hours.",
    },
    "client_pre_class_reminder": {
        "title": "Ready to Rec",
        "subtitle": "",
        "delta": timedelta(hours=12),
        "message": "{{trainer_class.name}} starts in 12 hours. Still time to invite a friend!",
    },
    "class_payment_notification": {
        "title": DEFAULT_TITLE,
        "subtitle": "",
        "message": "A new client has paid for your class {{ signup.trainer_class.name }}.",
        # At what point the notitifcation will send
        "trigger_status": "paid",
    },
    "trainer_following": {
        "title": DEFAULT_TITLE,
        "subtitle": "",
        "message": "{{ client.first_name }} {{ client.lastname }} just followed you!",
    },
    "notify_followers_about_class_creation": {
        "title": DEFAULT_TITLE,
        "subtitle": "",
        "message": "{{trainer_class.author.first_name}} {{trainer_class.author.lastname}} just added {{trainer_class.name}} at {{time_str}}! Sign up before it fills up!",
    },
}

# Workaround for AssertionError: database connection isn't set to UTC
# https://stackoverflow.com/a/68191118
USE_TZ = bool(int(os.environ.get("DJANGO_USE_TZ", "1")))

# OneSignal
ONE_SIGNAL = {
    "client": {
        "app_id": os.getenv("ONESIGNAL_APP_ID"),
        "rest_api_key": os.getenv("ONESIGNAL_REST_API_KEY"),
        "user_auth_key": os.getenv("ONESIGNAL_USER_AUTH_KEY"),
    },
}
