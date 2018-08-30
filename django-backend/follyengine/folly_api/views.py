from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions

from follyengine.folly_api.models import Project
from follyengine.folly_api.serializers import UserSerializer, GroupSerializer, ProjectSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return self.request.user.projects.all().order_by('-modified')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
