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
        fields = ('title', 'description', 'slug', 'created', 'modified')


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = ('name', 'slug', 'description', 'project')
