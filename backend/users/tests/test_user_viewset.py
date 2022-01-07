from rest_framework.test import APITestCase


class TestUserViewSet(APITestCase):
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

        # Get Token
        self.token = user_login.json().get('token')
        self.user_uid = user_login.json().get('user').get('id')

        return super().setUp()

    def test_create_user(self):
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

    def test_change_users_type(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        create_request = self.client.put(
            '/api/v1/profile/{}/'.format(self.user_uid), {
                "user_type": "trainer",
            }, format='json'
        )
        self.assertEquals(create_request.status_code, 200)

    def test_breaking_when_creating_without_sending_required_fields(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        create_request = self.client.post(
            '/api/v1/profile/', {
                "first_name": "test_name",
                "last_name": "test_surname",
            }, format='json'
        )
        self.assertEquals(create_request.status_code, 400)

    def test_permissions_fail_unauthorized(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + 'wrong token')
        create_request = self.client.post(
            '/api/v1/profile/', {
                "email": "test@test.com",
                "first_name": "test_name",
                "last_name": "test_surname",
                "user_type": "client",
                "hash": "111",
            }, format='json'
        )
        self.assertEquals(create_request.status_code, 401)
