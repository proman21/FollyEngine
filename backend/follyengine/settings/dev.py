from follyengine.settings.common import *

DEBUG = True
SECRET_KEY = 'tk9e-!51ob+(t$4euygn9)dd@mo$-at#$3=jpmxv-1ee1_a3)h'

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'follyengine',
        'USER': 'follyengine',
        'PASSWORD': 'cameo-Knot-walt-Joint-meyer',
        'HOST': 'db',
        'PORT': ''
    }
}
