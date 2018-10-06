from django.contrib.auth.models import User, Group
from rest_framework_json_api import serializers
from rest_framework_nested import relations

from follyengine.folly_api import models
from follyengine.folly_api.utils import SlugDefault


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
        read_only=True,
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


class FlowSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Flow
        fields = ('name', 'data')


class AssetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Asset
        fields = ('name',)
        read_only_fields = ('file',)


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Project
        fields = ('url', 'title', 'description', 'slug', 'owner', 'entities',
                  'components', 'assets')
        read_only_fields = ('created', 'modified',)

    slug = serializers.SlugField(read_only=True)
    owner = serializers.ResourceRelatedField(
        read_only=True,
        related_link_view_name='user-detail',
        related_link_url_kwarg='pk'
    )
    entities = serializers.ResourceRelatedField(
        read_only=True,
        many=True,
        related_link_view_name='entity-list',
        related_link_url_kwarg='project_pk'
    )
    components = serializers.ResourceRelatedField(
        read_only=True,
        many=True,
        related_link_view_name='component-list',
        related_link_url_kwarg='project_pk'
    )
    assets = serializers.ResourceRelatedField(
        read_only=True,
        many=True,
        related_link_view_name='asset-list',
        related_link_url_kwarg='project_pk'
    )

    included_serializers = {
        'entities': EntitySerializer,
        'components': ComponentSerializer,
        'flows': FlowSerializer,
        'assets': AssetSerializer,
    }


class ProjectCreateSerializer(ProjectSerializer):
    slug = serializers.SlugField(
        default=serializers.CreateOnlyDefault(SlugDefault('title'))
    )
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
