from datetime import timedelta

import jwt
import requests
from django.conf import settings
from django.utils import timezone
from django.utils.crypto import get_random_string


class UserUtils:
    @classmethod
    def get_profle_meta_details(
        cls, meta_data, social_id=None, social_platform=None, user_info=None
    ):
        profile = {
            "device": meta_data.get("HTTP_OSTYPE"),
            "device_uuid": meta_data.get("HTTP_UNIQUEID"),
            "os_version": meta_data.get("HTTP_OSVERSION"),
            "app_version": meta_data.get("HTTP_APPVERSION"),
            "longitude": meta_data.get("HTTP_CURRENT_LONG"),
            "latitude": meta_data.get("HTTP_CURRENT_LAT"),
        }
        if social_id or social_platform:
            profile.update(
                {
                    "social_login": True,
                    "social_platform": social_platform,
                    "social_id": social_id,
                }
            )
            if social_platform == "Google":
                profile.update({"profile_image": user_info["picture"]})
            elif social_platform == "Facebook":
                if user_info["picture"]:
                    profile.update({"profile_image": user_info["picture"]["data"]["url"]})
        return profile

    @classmethod
    def verify_apple_details(cls, access_token):
        resp = None
        response_data = {}
        client_id, client_secret = cls.generate_object("a")

        headers = {"content-type": "application/x-www-form-urlencoded"}
        data = {
            "client_id": client_id,
            "client_secret": client_secret,
            "code": access_token,
            "grant_type": "authorization_code",
        }

        res = requests.post(
            "https://appleid.apple.com/auth/token", data=data, headers=headers
        )
        return res

    def generate_object(self):
        CLIENT_ID = settings.APPLE_CLIENT_ID
        headers = {"alg": "ES256", "kid": settings.APPLE_KEY_ID}
        payload = {
            "iss": settings.APPLE_TEAM_ID,
            "iat": timezone.now(),
            "exp": timezone.now() + timedelta(days=180),
            "aud": "https://appleid.apple.com",
            "sub": CLIENT_ID,
        }
        client_secret = jwt.encode(
            payload, settings.APPLE_SECRET_KEY, algorithm="ES256", headers=headers
        )
        return CLIENT_ID, client_secret

    @classmethod
    def get_user_social_dict(cls, user):
        user_dict = {"email": user.get("email")}
        user_dict.update({"password": get_random_string()})
        if user.get("first_name"):
            user_dict.update({"first_name": user.get("first_name")})
        if user.get("last_name"):
            user_dict.update({"last_name": user.get("last_name")})
        if user.get("name"):
            name = user.get("name").split(" ")
            user_dict.update({"first_name": name[0]})
            if len(name) > 1:
                user_dict.update({"last_name": name[1]})
        user_dict["username"] = user.get("email")
        return user_dict
