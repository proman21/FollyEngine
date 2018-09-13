from rest_framework.test import APITestCase
from follyengine.folly_api.models import Project
from django.contrib.auth.models import User
from datetime import datetime

class ProjectModelTest(APITestCase):
    url = '/api/projects'

    @classmethod
    def setupTestData(cls):
        cls.user = User.objects.create(username="projectOwner")
        cls.project = Project.objects.create(title="testProject",
                                             description="testFieldDescription",
                                             owner=cls.user)

        def test_project_timestamps(self):
            time = datetime.now()
            project = self.project
            project_created_time = project.created.datetime()
            project_modified_time = project.modified.datetime()
            delta = datetime.timedelta(seconds=2)
            self.assertTrue(time - project_created_time < delta)
            self.assertTrue(time - project_modified_time < delta)

        def test_successful_project_create(self):
            data = { 'data': {
                'type': 'Project',
                'attributes': {
                    'title': 'testProject',
                    'description': 'testFieldDescription'
                }
            }}
            response = self.client.post(self.url, data, format='vnd.api+json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.accepted_media_type, 'application/vnd.api+json')
            self.assertEqual(response.data, self.user.auth_token.key)

        def test_project_author(self):
            project = self.project
            user = self.user
            self.assertEquals(project.owner, user)

        def test_project_fields(self):
            project = self.project
            user = self.user
            self.assertEquals(project.title, "testProject")
            self.assertEquals(project.description, "testFieldDescription")
