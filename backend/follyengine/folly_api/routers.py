from django.conf.urls import url

from rest_framework import routers
from rest_framework_nested.routers import NestedMixin


class DefaultRouter(routers.DefaultRouter):
    relationships_route = routers.Route(
        url=r'^{prefix}/{lookup}/relationships/{rel_lookup}{trailing_slash}$',
        name='{basename}-relationships',
        detail=True,
        mapping={},
        initkwargs={}
    )

    def __init__(self, *args, **kwargs):
        self.routes.append(self.relationships_route)
        self.relationship_registry = dict()
        super().__init__(*args, **kwargs)

    def register(self, prefix, viewset, base_name=None,
                 relationship_view=None):
        if base_name is None:
            base_name = self.get_default_base_name(viewset)
        if relationship_view:
            self.relationship_registry[prefix] = relationship_view
        self.registry.append((prefix, viewset, base_name))

    def get_urls(self):
        self.routes.remove(self.relationships_route)
        urls = super().get_urls()

        for prefix, viewset, basename in self.registry:
            lookup = self.get_lookup_regex(viewset)
            rel_name = self.relationships_route.name.format(basename=basename)

            if prefix in self.relationship_registry:
                relationship_view = self.relationship_registry[prefix]
                rel_regex = self.relationships_route.url.format(
                    prefix=prefix,
                    lookup=lookup,
                    trailing_slash=self.trailing_slash,
                    rel_lookup='(?P<related_field>[^/.]+)'
                )
                urls.append(url(rel_regex, relationship_view.as_view(),
                            name=rel_name))

        return urls


class NestedDefaultRouter(NestedMixin, DefaultRouter):
    pass
