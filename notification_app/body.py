from django.template.loader import render_to_string


class MessageBody:
    def render(self, *args, **kwargs):
        raise NotImplementedError()


class HtmlMessageBody(MessageBody):
    template = None

    def render(self, data: dict) -> str:
        return render_to_string(self.template, context=data)


class SmsMessageBody(MessageBody):
    text = None

    def render(self, data: dict):
        return self.text.format(**data)


class ConfirmationHtmlMessageBody(HtmlMessageBody):
    template = "email/confirmation_email.html"

class ClassCancelationHtmlMessageBody(HtmlMessageBody):
    template = "email/class_cancelation_email.html"


class ReminderHtmlMessageBody(HtmlMessageBody):
    template = "email/notification_email.html"


class ConfirmationSmsMessageBody(SmsMessageBody):
    text = "[{site_name}] Your '{name}' reservation is confirmed. Get all details visit {class_link}"


class ReminderSmsMessageBody(SmsMessageBody):
    text = (
        "[{site_name}] Your '{name}' is coming up. Get all the details visit {class_link}"
    )


class ChangingSmsMessageBody(SmsMessageBody):
    text = "[{site_name}] Some details have changed for your upcoming class. Get all the details visit {class_link}"
