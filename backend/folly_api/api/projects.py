from flask import MethodView
from flask_security import auth_token_required, current_user
from marshmallow_jsonapi import fields
from marshmallow_jsonapi.flask import Relationship, Schema

from . import api_resource
from folly_api.models.project import Project


class ProjectSchema(Schema):
    id = fields.Integer(as_string=True, dump_only=True)
    name = fields.Str(required=True, validate=lambda s: len(s) <= 64)
    description = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    last_modified = fields.DateTime(dump_only=True)
    owner = Relationship(
        related_view='users',
        related_view_kwargs={'user_id': '<user.id>'},
        include_resource_linkage=True,
        type_='users'
    )

    class Meta:
        type_ = 'projects'
        self_view = 'projects'
        self_view_kwargs = {'projects': '<id>'}
        self_view_many = 'projects'


@api_resource('/projects')
class Projects(MethodView):
    decorators = [auth_token_required]
    project_schema = ProjectSchema()

    def get(self, project_id):
        if project_id is None:
            return self.project_schema.dump(current_user.projects, many=True)
        return "Unimplemented", 404
