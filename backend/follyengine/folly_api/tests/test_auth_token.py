from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthTokenTest(APITestCase):
    url = '/api/auth/token'

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user('testuser',
                                            password='thisisatestpassword')

    def test_successful_auth(self):
        data = {'username': 'testuser', 'password': 'thisisatestpassword'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.accepted_media_type, 'application/json')
        self.assertEqual(response.data['token'], self.user.auth_token.key)

    def test_empty_request_fails(self):
        response = self.client.post(self.url, data=None, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'username': ['This field is required.'],
            'password': ['This field is required.']
        })

    def test_blank_fields_fails(self):
        data = {'username': '', 'password': ''}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'username': ['This field may not be blank.'],
            'password': ['This field may not be blank.']
        })

    def test_invalid_user_fails(self):
        data = {'username': 'notauser', 'password': 'password'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'non_field_errors': ['Unable to log in with provided credentials.']
        })

    def test_incorrect_password_fails(self):
        data = {'username': 'testuser', 'password': 'password'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {
            'non_field_errors': ['Unable to log in with provided credentials.']
        })
