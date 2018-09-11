from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions

from follyengine.folly_api import serializers


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = (permissions.IsAdminUser,)


class ProjectViewSet(viewsets.ModelViewSet):
    """
    retrieve:
    Get more details about a specific project. This includes entities,
    components, flows, and assets.

    list:
    Gets all projects owned by the authenticated user, ordered by modification
    date.

    create:
    Creates a new project, with the authenticated user as the owner.
    """
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_class(self):
        serializer = self.serializer_class
        if self.request.method == 'POST':
            serializer = serializers.ProjectCreateSerializer
        return serializer

    def get_queryset(self):
        return self.request.user.projects.all().order_by('-modified')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
