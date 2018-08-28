from flask import Flask
from flask_security import Security


def create_app():
    app = Flask(__name__)

    app.config.from_pyfile('config.py')
    app.config.from_envvar('FOLLYAPI_SETTINGS')

    # Initialize the database ORM
    from folly_api.models import db, migrate
    db.init_app(app)
    migrate.init_app(app, db)

    # Initialize security extension
    from folly_api.models import user_datastore
    auth = Security()
    auth.init_app(app, user_datastore, register_blueprint=False)

    # Register the api
    from folly_api.api import blueprint as api_bp
    app.register_blueprint(api_bp)

    return app
