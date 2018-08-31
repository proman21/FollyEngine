from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# Create your models here.
class Project(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey('auth.User', related_name='projects',
                              on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Component(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField()


class Entity(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField()
    project = models.ForeignKey(Project, related_name='entities',
                                on_delete=models.CASCADE)
    components = models.ManyToManyField(Component, related_name='implementers')


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
