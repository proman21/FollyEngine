from django.contrib import admin

from .models import Project

# Register your models here.
class ProjectAdmin(admin.ModelAdmin):
    date_hierarchy = 'modified'
    readonly_fields = ('created', 'modified')
    list_display = ('title', 'owner', 'created', 'modified')
    search_fields = ['title', 'owner__username']

admin.site.register(Project, ProjectAdmin)
