import copy
import re

from django.contrib.auth.models import User, Group
from rest_framework.serializers import BaseSerializer
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


class ProjectConfigurationSerializer(BaseSerializer):
    def to_representation(self, obj):
        entities = {}
        components = {}
        nodes = {}
        
        for e in obj.entities.all():
            entities[e.slug] = {}
            entities[e.slug]['components'] = []
            for c in e.components.all():
                entities[e.slug]['components'].append(c.name)

        for c in obj.components.all():
            components[c.name] = {}
            components[c.name]['attributes'] = {}
            for a in c.attributes:
                components[c.name]['attributes'][a['name']] = {}
                components[c.name]['attributes'][a['name']]['type'] = a['type']

        node_keys = {}
        node_key = 0
        for f in obj.flows.all():
            elements = copy.deepcopy(f.data)
            for element in elements:
                if element['type'] == 'link':
                    continue
                node_keys[element['id']] = node_key

                nodes[node_key] = {}
                nodes[node_key]['type'] = re.search(r'folly\.(\w+)Node', element['type']).group(1).lower()
                
                element.pop('id', None)
                element.pop('name', None)
                element.pop('type', None)
                element.pop('attrs', None)
                element.pop('position', None)
                element.pop('z', None)

                # TODO
                if 'entity' in element:
                    element['entity'] = obj.entities.get(id=element['entity']).slug
                
                nodes[node_key]['args'] = element
                nodes[node_key]['go'] = []
                node_key += 1
            
            links = {}
            for n in f.data:
                if n['type'] != 'link':
                    continue

                source_key = node_keys[n['source']['id']]
                source_port = n['source']['port'].lower()
                target_key = node_keys[n['target']['id']]
                nodes[source_key]['go'].append({'from': source_port, 'to': target_key})

        return {
            'entities': entities,
            'components': components,
            'nodes': nodes
        }
