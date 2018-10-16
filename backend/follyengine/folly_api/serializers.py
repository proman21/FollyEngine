from collections import OrderedDict

from django.contrib.auth.models import User, Group
from rest_framework import serializers as rf_serializers
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


class EntityExportSerializer(rf_serializers.ModelSerializer):
    class Meta:
        model = models.Entity
        fields = ('name', 'description', 'components')
<<<<<<< HEAD

=======
    
>>>>>>> 2a5bbff347adf203961d0a7598d8dfa9c06a916a
    components = serializers.SlugRelatedField(many=True, read_only=True,
                                              slug_field='name')


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


class ComponentExportSerializer(rf_serializers.ModelSerializer):
    class Meta:
        model = models.Component
        fields = ('name', 'description', 'attributes')


class FlowSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Flow
        fields = ('url', 'name', 'data')


class FlowExportSerializer(rf_serializers.ModelSerializer):
    class Meta:
        model = models.Flow
        fields = ('name', 'data')


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Project
        fields = ('url', 'title', 'description', 'slug', 'owner', 'entities',
                  'components')
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

    included_serializers = {
        'entities': EntitySerializer,
        'components': ComponentSerializer,
        'flows': FlowSerializer
    }


class ProjectCreateSerializer(ProjectSerializer):
    slug = serializers.SlugField(
        default=serializers.CreateOnlyDefault(SlugDefault('title'))
    )
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())


class ProjectExportSerializer(rf_serializers.ModelSerializer):
    class Meta:
        model = models.Project
        fields = ('title', 'description', 'created', 'modified', 'entities',
                  'components', 'flows')

    def to_representation(self, instance):
        data = super(ProjectExportSerializer, self).to_representation(instance)

        # Convert related lists to dictionaries
        data['entities'] = {e.pop('name'): e for e in data['entities']}
        data['components'] = {c.pop('name'): c for c in data['components']}
        data['flows'] = {f['name']: f['data'] for f in data['flows']}

        # Group all other fields under 'meta'
        data['meta'] = OrderedDict({
            k: data.pop(k)
            for k in list(data.keys())
            if not isinstance(data[k], dict)
        })
        data.move_to_end('meta', last=False)

        return data

    entities = EntityExportSerializer(many=True)
    components = ComponentExportSerializer(many=True)
    flows = FlowSerializer(many=True)
