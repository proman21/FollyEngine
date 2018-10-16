import pyaml

from rest_framework.renderers import BaseRenderer

class PrettyYAMLRenderer(BaseRenderer):
    media_type = 'application/x-yaml'
    format = 'yaml'
    charset = 'utf-8'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if data is None:
            return ''

        return pyaml.dump(data, string_val_style="'", vspacing=[2, 1])
