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
    owner = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = models.Project
        fields = ('title', 'description', 'slug', 'created', 'modified')


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = ('name', 'slug', 'description',)
        read_only_fields = ('project',)

    slug = serializers.SlugField(
        default=serializers.CreateOnlyDefault(SlugDefault('name'))
    )
