from django.contrib.auth.models import User, Group
from django.utils.text import slugify
from rest_framework_json_api import serializers

from follyengine.folly_api import models


class SlugDefault(object):
    def __init__(self, source):
        self.source = source

    def __call__(self):
        return slugify(self._field)

    def set_context(self, field):
        self._field = field.parent.initial_data[self.source]
        print(self._field)


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
        fields = ('name', 'slug', 'description',)
        read_only_fields = ('project',)

    slug = serializers.SlugField(
        default=serializers.CreateOnlyDefault(SlugDefault('name'))
    )


class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Component
        fields = ('name', 'description',)
        read_only_fields = ('project',)
