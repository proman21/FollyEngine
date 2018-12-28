from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify
from rest_framework.authtoken.models import Token
from django.contrib.postgres.fields import JSONField
from ulid2 import generate_ulid_as_uuid


# Create your models here.
class Project(models.Model):
    id = models.UUIDField(default=generate_ulid_as_uuid, primary_key=True)
    title = models.CharField(max_length=64)
    slug = models.SlugField(max_length=64, allow_unicode=True)
    description = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey('auth.User', related_name='projects',
                              on_delete=models.CASCADE)

    class JSONAPIMeta:
        resource_name = 'projects'

    def save(self, *args, **kwargs):
        if not self.id and not kwargs.get('slug', None):
            self.slug = slugify(self.title)

        super(Project, self).save(*args, **kwargs)

    def __str__(self):
        return self.title


class Component(models.Model):
    id = models.UUIDField(default=generate_ulid_as_uuid, primary_key=True)
    name = models.CharField(max_length=64)
    slug = models.SlugField(max_length=64, allow_unicode=True)
    description = models.TextField(blank=True)
    attributes = JSONField(default=list)
    project = models.ForeignKey(Project, related_name='components',
                                on_delete=models.CASCADE)

    class Meta:
        unique_together = ('name', 'project')

    class JSONAPIMeta:
        resource_name = 'components'


class Entity(models.Model):
    id = models.UUIDField(default=generate_ulid_as_uuid, primary_key=True)
    name = models.CharField(max_length=64)
    slug = models.SlugField(max_length=64, allow_unicode=True)
    description = models.TextField(blank=True)
    project = models.ForeignKey(Project, related_name='entities',
                                on_delete=models.CASCADE)
    components = models.ManyToManyField(Component, related_name='components')

    class Meta:
        unique_together = ('name', 'project')

    class JSONAPIMeta:
        resource_name = 'entities'


class Flow(models.Model):
    id = models.UUIDField(default=generate_ulid_as_uuid, primary_key=True)
    name = models.CharField(max_length=64)
    graph = JSONField()
    project = models.ForeignKey(Project, related_name='flows',
                                on_delete=models.CASCADE)

    class Meta:
        unique_together = ('name', 'project')

    class JSONAPIMeta:
        resource_name = 'flows'

    def __str__(self):
        return self.name


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
