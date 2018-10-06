from django.contrib.auth.models import User, Group

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import FileUploadParser
from rest_framework_json_api import views

from follyengine.folly_api.models import (
    Entity,
    Project,
    Component,
    Flow,
    Asset
)
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


class ProjectViewSet(views.ModelViewSet):
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
    resource_name = 'projects'
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated,)
    prefetch_for_includes = {
        '__all__': [],
        'entities': ['__all__'],
        'components': ['__all__']
    }

    def get_serializer_class(self):
        serializer = self.serializer_class
        if self.request.method == 'POST':
            serializer = serializers.ProjectCreateSerializer
        return serializer

    def get_queryset(self):
        return self.request.user.projects.all().order_by('-modified')


class ProjectRelationshipView(views.RelationshipView):
    def get_queryset(self):
        return self.request.user.projects.all()


class EntityViewSet(viewsets.ModelViewSet):
    resource_name = 'entities'
    serializer_class = serializers.EntitySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Entity.objects.filter(project=self.kwargs['project_pk'])

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs['project_pk'])
        serializer.save(project=project)


class EntityRelationshipView(views.RelationshipView):
    def get_queryset(self):
        return Entity.objects.filter(project=self.kwargs['project_pk'])


class ComponentViewSet(viewsets.ModelViewSet):
    resource_name = 'components'
    serializer_class = serializers.ComponentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Component.objects.filter(project=self.kwargs['project_pk'])

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs['project_pk'])
        serializer.save(project=project)


class FlowViewSet(viewsets.ModelViewSet):
    resource_name = 'flows'
    serializer_class = serializers.FlowSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Flow.objects.filter(project=self.kwargs['project_pk'])

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs['project_pk'])
        serializer.save(project=project)


class AssetViewSet(viewsets.ModelViewSet):
    resource_name = 'assets'
    serializer_class = serializers.AssetSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Asset.objects.filter(project=self.kwargs['project_pk'])

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs['project_pk'])
        serializer.save(project=project)

    @action(methods=['POST'], detail=True, parser_classes=[FileUploadParser])
    def upload(self, request, pk=None):
        file = request.data['file']
        asset = self.get_object()
        asset.file.save(file.name, file)
        return Response(self.get_serializer(instance=asset).data)
