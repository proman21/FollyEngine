from django.contrib.auth.models import User, Group

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_json_api import views

from follyengine.folly_api.models import Entity, Project, Component, Flow
from follyengine.folly_api import renderers, serializers


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
    serializer_class = serializers.ProjectSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'slug'

    def get_serializer_class(self):
        serializer = self.serializer_class
        if self.request.method == 'POST':
            serializer = serializers.ProjectCreateSerializer
        return serializer

    def get_queryset(self):
        return self.request.user.projects.all().order_by('-modified')

    @action(detail=True, renderer_classes=[renderers.PrettyYAMLRenderer])
    def export(self, request, pk=None):
        project = self.get_object()
        serializer = serializers.ProjectExportSerializer(project)
        headers = {
            'Content-Disposition': f'attachment; filename="{project.slug}.yaml"'
        }
        return Response(serializer.data, headers=headers)


class ProjectRelationshipView(views.RelationshipView):
    def get_queryset(self):
        return self.request.user.projects.all()


class EntityViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.EntitySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Entity.objects.filter(project__slug=self.kwargs['project_slug'])

    def perform_create(self, serializer):
        project = Project.objects.get(slug=self.kwargs['project_slug'])
        serializer.save(project=project)


class EntityRelationshipView(views.RelationshipView):
    def get_queryset(self):
        return Entity.objects.filter(project__slug=self.kwargs['project_slug'])


class ComponentViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ComponentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Component.objects.filter(project__slug=self.kwargs['project_slug'])

    def perform_create(self, serializer):
        project = Project.objects.get(slug=self.kwargs['project_slug'])
        serializer.save(project=project)


class FlowViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.FlowSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Flow.objects.filter(project__slug=self.kwargs['project_slug'])

    def perform_create(self, serializer):
        project = Project.objects.get(slug=self.kwargs['project_slug'])
        serializer.save(project=project)
