from django.contrib.auth.models import User, Group
from rest_framework_json_api import serializers

from follyengine.folly_api import models


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
    owner = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault())


class ProjectCreateSerializer(ProjectSerializer):
    slug = serializers.SlugField(required=False)


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = ('name', 'description', 'components')


class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Component
        fields = ('name', 'description')
