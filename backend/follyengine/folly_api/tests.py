from rest_framwork import TestCaseAPI
from follyengine.folly_api.models import Project
from django.contrib.auth.models import User
from datetime import datetime

class ProjectModelTest(TestCaseAPI):

    @classmethod
    def setupTestData(cls):
        cls.user = User.objects.create(username="projectOwner")
        cls.project = Project.objects.create(title="testProject", description="testFieldDescription", owner=cls.user)

        @TestCaseAPI
        def test_project_timestamps(self):
            time = datetime.now()
            project = Project.objects.get(title="testProject")
            project_created_time = project.created.datetime()
            project_modified_time = project.modified.datetime()
            delta = datetime.timedelta(seconds=2)
            TestCaseAPI.assertTrue(time - project_created_time < delta)
            TestCaseAPI.asserTrue(time - project_modified_time < delta)


        @TestCaseAPI
        def test_project_author(self):
            project = Project.objects.get(title="testProject")
            user = User.objects.get(username="projectOwner")
            TestCaseAPI.asserEquals(project.owner , user)