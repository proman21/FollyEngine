from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions

from follyengine.folly_api.models import Entity, Project, Component
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
    permission_classes = (permissions.IsAuthenticated,)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return self.request.user.projects.all().order_by('-modified')


class EntityViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.EntitySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Entity.objects.filter(project=self.kwargs['project_pk'])

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs['project_pk'])
        serializer.save(project=project)


class ComponentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ComponentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Component.objects.filter(project=self.kwargs['project_pk'])

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs['project_pk'])
        serializer.save(project=project)
