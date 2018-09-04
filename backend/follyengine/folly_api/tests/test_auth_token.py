from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthTokenTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create(username='testuser',
                                       email='test@test.com',
                                       password='thisisatestpassword')

    def test_successful_auth(self):
        url = '/api/auth/token'
        data = {'username': 'testuser', 'password': 'thisisatestpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.accepted_media_type, 'application/json')
        self.assertIn(response.content, 'token')
        self.assertEqual(response.content['token'], self.user.token)

    def test_empty_request_fails(self):
        pass

    def test_blank_fields_fails(self):
        pass

    def test_invalid_user_fails(self):
        pass
