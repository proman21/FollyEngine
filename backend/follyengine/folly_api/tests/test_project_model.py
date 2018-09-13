from rest_framework.test import TestCaseAPI
from follyengine.folly_api.models import Project
from django.contrib.auth.models import User
from datetime import datetime


class ProjectModelTest(TestCaseAPI):

    @classmethod
    def setupTestData(cls):
        cls.user = User.objects.create(username="projectOwner")
        cls.project = Project.objects.create(title="testProject",
                                             description="testDescription",
                                             owner=cls.user)

        def test_project_timestamps(self):
            time = datetime.now()
            project = self.project
            project_created_time = project.created.datetime()
            project_modified_time = project.modified.datetime()
            delta = datetime.timedelta(seconds=2)
            self.assertTrue(time - project_created_time < delta)
            self.assertTrue(time - project_modified_time < delta)

        def test_project_author(self):
            project = self.project
            user = self.user
            self.assertEquals(project.owner, user)
