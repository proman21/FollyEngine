from flask import Blueprint, request
from flask_security.utils import verify_and_update_password, login_user

from folly_api.models import user_datastore

blueprint = Blueprint('api_v1', __name__, url_prefix='/api/v1')


@blueprint.route('/')
def root():
    return "No", 501


@blueprint.route('/auth/token', methods=('POST',))
def user_token():
    data = request.get_json()
    if data is None:
        return "Request must have a body.", 400

    if 'username' not in data or 'password' not in data:
        return "Invalid request body", 400

    user = user_datastore.get_user(data['username'])
    if user is None:
        return "Unable to authenticate user", 403

    if not verify_and_update_password(data['password'], user):
        return "Unable to authenticate user", 403

    login_user(user)
    return user.get_auth_token()


def api_resource(cls):
    def decorator(*args, **kwargs):
        pk = kwargs.pop('pk', 'id')
        pk_type = kwargs.pop('pk_type', 'int')
        endpoint = kwargs.pop('endpoint', cls.__name__.lower())
        view_func = cls.as_view(endpoint)

        for url in args:
            blueprint.add_url_rule(url, defaults={pk: None},
                                   view_func=view_func, methods=['GET'])
            blueprint.add_url_rule(url, view_func=view_func, methods=['POST'])
            blueprint.add_url_rule('%s<%s:%s>' % (url, pk_type, pk), view_func=view_func,
                                   methods=['GET', 'PUT', 'DELETE'])
    return decorator
