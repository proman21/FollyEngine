from django.contrib.auth.models import User, Group
from rest_framework_json_api import serializers
from rest_framework_json_api.views import RelationshipView
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


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Project
        fields = ('url', 'title', 'description', 'slug', 'created', 'modified',
                  'owner')

    slug = serializers.SlugField(read_only=True)
    owner = serializers.ResourceRelatedField(read_only=True)


class ProjectCreateSerializer(ProjectSerializer):
    slug = serializers.SlugField(
        default=serializers.CreateOnlyDefault(SlugDefault('title'))
    )
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = ('name', 'slug', 'description', 'components')
        read_only_fields = ('project',)
        extra_kwargs = {'components': {'required': False}}

    slug = serializers.SlugField(
        default=serializers.CreateOnlyDefault(SlugDefault('name'))
    )


class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Component
