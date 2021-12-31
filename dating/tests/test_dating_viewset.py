# Create your tests here.
from datetime import datetime
from dating.models import Match

from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class TestCheckoutWorkflow(APITestCase):
    def setUp(self):
        # Signup
        new_user = self.client.post(
            '/api/v1/signup/', {
                "name": "Name Test",
                "email": "test@test.com",
                "password": "testPass1"
            }, format='json'
        )
        self.assertEquals(new_user.status_code, 201)

        # Authenticate
        user_login = self.client.post(
            '/api/v1/login/', {
                "username": "test@test.com",
                "password": "testPass1"
            }, format='json'
        )
        self.assertEquals(user_login.status_code, 200)
        
        self.token = user_login.data.get('token')
        self.user_uid = user_login.json().get('user').get('id')

    # test dating match model
    def test_dating_match_model(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        create_request = self.client.post(
            '/api/v1/profile/', {
                "email": "testemail@test.com",
                "first_name": "test_name",
                "last_name": "test_surname",
                "user_type": "client",
                "hash": "111",
            }, format='json'
        )
        self.assertEquals(create_request.status_code, 201)

        user = User.objects.get(id = create_request.json().get('id'))
        owner = User.objects.get(id = self.user_uid)
        
        Match.objects.create(
            user=user,
            owner=owner,
            created=datetime.now()
        )
        
        self.assertIsNot(0, Match.objects.count())
            