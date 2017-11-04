# Copyright (c) 2017 Nicolas Binette <loupceuxl@gmail.com>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

from abc import ABC, abstractmethod
from enum import Enum, unique


@unique
class NumericType(Enum):
    Integer = "integer"
    Number = "number"


class SchemaProperty(ABC):
    @abstractmethod
    def to_schema_dictionary(self):
        pass

    @abstractmethod
    def get_default_value(self):
        pass

    @abstractmethod
    def is_valid(self, value):
        pass

    @abstractmethod
    def is_valid_type(self, value):
        pass

    @staticmethod
    def generate_property(name: str, values: dict):
        property = None

        if values["class"] == "Numeric":
            property = Numeric.from_schema_dictionary(values)

        if values["class"] == "Boolean":
            property = Boolean.from_schema_dictionary(values)

        if values["class"] == "String":
            property = String.from_schema_dictionary(values)

        return Property(name, property)


class Numeric(SchemaProperty):
    def __init__(self, type: NumericType):
        self._type = type

    def to_schema_dictionary(self):
        return {"class": "Numeric", "type": self._type.value}

    def get_default_value(self):
        return 0

    def is_valid(self, value):
        return self.is_valid_type(value)

    def is_valid_type(self, value):
        if self._type == NumericType.Integer:
            return isinstance(value, int)

        # Go strict?
        if self._type == NumericType.Number:
            return isinstance(value, float) or isinstance(value, int)

        return False

    @staticmethod
    def from_schema_dictionary(d: dict):
        if d["type"] == NumericType.Integer.value:
            return Numeric(NumericType.Integer)

        if d["type"] == NumericType.Number.value:
            return Numeric(NumericType.Number)

        return None


class String(SchemaProperty):
    def to_schema_dictionary(self):
        return {"class": "String", "type": "string"}

    def get_default_value(self):
        return ""

    def is_valid(self, value):
        return self.is_valid_type(value)

    def is_valid_type(self, value):
        return isinstance(value, str)

    @staticmethod
    def from_schema_dictionary(d: dict):
        return String()


class Boolean(SchemaProperty):
    def to_schema_dictionary(self):
        return {"class": "Boolean", "type": "boolean"}

    def get_default_value(self):
        return False

    def is_valid(self, value):
        return self.is_valid_type(value)

    def is_valid_type(self, value):
        return isinstance(value, bool)

    @staticmethod
    def from_schema_dictionary(d: dict):
        return Boolean()


class Property(object):
    def __init__(self, name: str, schema_property: SchemaProperty):
        self._name = name
        self._schema_property = schema_property

    def get_name(self):
        return self._name

    def get_schema_property(self):
        return self._schema_property

    def to_schema_dictionary(self):
        return {self._name: self._schema_property.to_schema_dictionary()}
