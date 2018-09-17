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
        ret = []

        for prefix, viewset, basename in self.registry:
            lookup = self.get_lookup_regex(viewset)
            routes = self.get_routes(viewset)
            rel_name = self.relationships_route.name.format(basename=basename)

            for route in routes:
                name = route.name.format(basename=basename)

                if name == rel_name:
                    if prefix in self.relationship_registry:
                        relationship_view = self.relationship_registry[prefix]
                        rel_regex = route.url.format(
                            prefix=prefix,
                            lookup=lookup,
                            trailing_slash=self.trailing_slash,
                            rel_lookup='(?P<related_field>[^/.]+)'
                        )
                        ret.append(url(rel_regex, relationship_view.as_view(),
                                   name=name))
                    continue

                # Only actions which actually exist on the viewset will be
                # bound
                mapping = self.get_method_map(viewset, route.mapping)
                if not mapping:
                    continue

                # Build the url pattern
                regex = route.url.format(
                    prefix=prefix,
                    lookup=lookup,
                    trailing_slash=self.trailing_slash
                )

                # If there is no prefix, the first part of the url is probably
                # controlled by project's urls.py and the router is in an app,
                # so a slash in the beginning will (A) cause Django to give
                # warnings and (B) generate URLS that will require using '//'.
                if not prefix and regex[:2] == '^/':
                    regex = '^' + regex[2:]

                initkwargs = route.initkwargs.copy()
                initkwargs.update({
                    'basename': basename,
                    'detail': route.detail,
                })

                view = viewset.as_view(mapping, **initkwargs)
                ret.append(url(regex, view, name=name))

        return ret


class NestedDefaultRouter(NestedMixin, DefaultRouter):
    pass
