"""follyengine URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.urls import path
from rest_framework.authtoken import views as rest_views

from follyengine.folly_api import views
from follyengine.folly_api.routers import DefaultRouter, NestedDefaultRouter

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'projects', views.ProjectViewSet, base_name='project',
                relationship_view=views.ProjectRelationshipView)

project_router = NestedDefaultRouter(router, r'projects', lookup='project')
project_router.register(r'entities', views.EntityViewSet, base_name='entity',
                        relationship_view=views.EntityRelationshipView,)
project_router.register(r'components', views.ComponentViewSet,
                        base_name='component')

# project_router.register(r'flows', views.FlowViewSet, base_name='flow')

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^api/', include(router.urls)),
    url(r'^api/', include(project_router.urls)),
    url(r'^api/auth/token', rest_views.obtain_auth_token),
    url(r'^api/', include('rest_framework.urls', namespace='rest_framework'))
]
