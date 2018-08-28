import os


# Flask-Security configuration
SECURITY_URL_PREFIX = "/admin"
SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authorization'
# SQLAlchemy uses the DB URI that's passed in from the environment
SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URI']
SQLALCHEMY_TRACK_MODIFICATIONS = False
