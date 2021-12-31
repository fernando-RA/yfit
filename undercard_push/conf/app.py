from push_notifications.conf.app import AppConfig

class FixedAppConfig(AppConfig):

    has_token_creds = False
    has_credit_tokens = False