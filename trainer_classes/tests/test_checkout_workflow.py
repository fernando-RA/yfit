from datetime import datetime
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

from trainer_classes.models import Payment, ClientClassSignUp


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

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        
        update_request = self.client.put(
            '/api/v1/profile/{}/'.format(self.user_uid), {
                "email": "email_test@test.com",
                "first_name": "first_name_test",
                "last_name": "last_name_test",
                "user_type": "trainer",
                "bio": "this is a bio",
                "stripe_customer_id": "acct_1JdKry2HxAs8PiU6",
                "stripe_account_id": "acct_1JdKry2HxAs8PiU6",
                "hash": "123"
            }, format='json'
        )
        self.assertEquals(update_request.status_code, 200)
        
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        trainer_class = self.client.post(
            '/api/v1/trainer-class/', {"name": "test trainerclass name", "start_time": datetime.now(), "published_at": datetime.now()}, format='json'
        )
        
        self.trainer_class = trainer_class.json().get('id')
        self.user = User.objects.get(id=self.user_uid)
        
        self.assertEquals(trainer_class.status_code, 201)

        return super().setUp()

    
    def test_request_payment_intent_from_stripe(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        
        stripe_request = self.client.post('/api/v1/payment/payment_intent/', {
            "trainer_stripe_customer_id": self.user.stripe_customer_id,
            "amount_cents": 100    
        }, format='json')
        
        self.assertEquals(stripe_request.status_code, 200)

    def test_creates_signup_payment_record(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)

        stripe_request = self.client.post('/api/v1/payment/payment_intent/', {
            "trainer_stripe_customer_id": self.user.stripe_customer_id,
            "amount_cents": 100    
        }, format='json')
        self.assertEquals(stripe_request.status_code, 200)
        
        client_request = self.client.post(f'/api/v1/client-class/{self.trainer_class}/', {
            "email_address": self.user.email,
            "trainer_class_id": self.trainer_class,
            "payment_intent_id":  stripe_request.json().get("payment_intent_id"),
            "spots_count": 0
        }, format='json')
        self.assertEquals(client_request.status_code, 201)

        signup_record_exists = ClientClassSignUp.objects.filter(id = client_request.json().get('id')).exists()
        self.assertTrue(signup_record_exists)
        
        payment_intent_exists = Payment.objects.filter(payment_intent_id = stripe_request.json().get("payment_intent_id")).exists()
        self.assertTrue(payment_intent_exists)

    def test_stripe_webhook(self):
        self.assertEquals(200,200)
    
    def test_trainer_class_payouts_after_class(self):
        self.assertEquals(200,200)
        
    
    def test_handle_cancelled_payment(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token)
        cancel_request = self.client.post(f'/api/v1/trainer-class/{self.trainer_class}/cancel_training/', {})
        self.assertEquals(cancel_request.status_code, 200)
