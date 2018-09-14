from django.utils.text import slugify
from voluptuous import Schema, MultipleInvalid
from rest_framework.serializers import ValidationError, JSONField


class SlugDefault(object):
    def __init__(self, source):
        self.source = source

    def __call__(self):
        return slugify(self._field)

    def set_context(self, field):
        self._field = field.parent.initial_data[self.source]
        print(self._field)


class JSONSchemaField(JSONField):
    def __init__(self, schema, **kwargs):
        self.schema = Schema(schema)
        super().__init__(self, **kwargs)

    def to_internal_value(self, data):
        parsed = super().to_internal_value(self, data)
        try:
            return self.schema(parsed)
        except MultipleInvalid as e:
            raise ValidationError(str(e))
