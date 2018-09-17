from django.utils.text import slugify


class SlugDefault(object):
    def __init__(self, source):
        self.source = source

    def __call__(self):
        return slugify(self._field)

    def set_context(self, field):
        self._field = field.parent.initial_data[self.source]
        print(self._field)
