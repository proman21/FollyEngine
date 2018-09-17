from django.contrib.auth.models import User, Group
from rest_framework_json_api import serializers
from rest_framework_nested import relations
from voluptuous import Required, All, Length, Any, Optional

from follyengine.folly_api import models
from follyengine.folly_api.utils import SlugDefault, JSONSchemaField


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups', 'projects')


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class EntitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Entity
        fields = ('url', 'name', 'slug', 'description', 'components')

    url = relations.NestedHyperlinkedIdentityField(
        view_name='entity-detail',
        parent_lookup_kwargs={
            'project_pk': 'project__pk'
        }
    )
    slug = serializers.SlugField(
        default=serializers.CreateOnlyDefault(SlugDefault('name'))
    )
    components = serializers.ResourceRelatedField(
        queryset=models.Component.objects,
        many=True,
        related_link_view_name='component-list',
        related_link_url_kwarg='project_pk'
    )


class ComponentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Component
        fields = ('url', 'name', 'description', 'attributes')
        read_only_fields = ('project',)

    url = relations.NestedHyperlinkedIdentityField(
        view_name='component-detail',
        parent_lookup_kwargs={
            'project_pk': 'project__pk'
        }
    )
    attributes = serializers.JSONField()
    # attributes = JSONSchemaField([{
    #     Required('name'): All(str, Length(max=64)),
    #     Optional('description', default=''): str,
    #     Required('type'): All(
    #         str,
    #         Any('int', 'float', 'bool', 'str')
    #     )
    # }])


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Project
        fields = ('url', 'title', 'description', 'slug', 'owner', 'entities',
                  'components')
        read_only_fields = ('created', 'modified')

    class JSONAPIMeta:
        included_resources = ['entities', 'components']

    slug = serializers.SlugField(read_only=True)
    owner = serializers.ResourceRelatedField(
        read_only=True,
        related_link_view_name='user-detail',
        related_link_url_kwarg='pk'
    )
    entities = serializers.ResourceRelatedField(
        queryset=models.Entity.objects,
        many=True,
        related_link_view_name='entity-list',
        related_link_url_kwarg='project_pk'
    )
    components = serializers.ResourceRelatedField(
        queryset=models.Component.objects,
        many=True,
        related_link_view_name='component-list',
        related_link_url_kwarg='project_pk'
    )

    included_serializers = {
        'entities': EntitySerializer,
        'components': ComponentSerializer
    }


class ProjectCreateSerializer(ProjectSerializer):
    slug = serializers.SlugField(
        default=serializers.CreateOnlyDefault(SlugDefault('title'))
    )
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
