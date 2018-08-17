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


import json
import itertools
from enum import Enum, unique
from sqlalchemy import event
from . schema import Property, SchemaProperty
from . import db


# TO DO: Resolve 'make' for DeviceModels, PhysicalDevices, Outputs, Inputs.
# TO DO: Revise strict non-nullable enums related to DeviceModels, PhysicalDevices, Outputs, Inputs
# REGION: MODEL.
# NOTE: Using EER mapping -- base class to subclass method (1:1) by primary key.
# This currently applies to all classes inheriting from PhysicalDevice, [...].
# Reflected in Python as well (via inheritance) since it makes the code less verbose (and more intuitive).
# Documentation: http://docs.sqlalchemy.org/en/latest/orm/inheritance.html
class Scene(db.Model):
    __tablename__ = 'tb_scene'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(length=255))
    description = db.Column(db.String(length=255))

    def __repr__(self):
        return '<Scene(id={}, name={!r})>'.format(self.id, self.name)


# VirtualEntity is self-referential.
# Documentation: http://docs.sqlalchemy.org/en/latest/orm/self_referential.html
# Note: Currently all VEs can have properties (attributes) but only leaf VEs can have instances (InstanceEntities).
# DONE: Remove inheritance component from VE.
class VirtualEntity(db.Model):
    __tablename__ = 'tb_virtual_entity'

    # TODO: use title as primary key, no need for surrogate id?
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(length=100), nullable=False, unique=True)
    parent_id = db.Column(db.Integer, db.ForeignKey("tb_virtual_entity.id", onupdate="CASCADE", ondelete="CASCADE"))
    description = db.Column(db.String(length=255))
    # TODO: Review attribute_schema nullable property; too strict?
    json_schema = db.Column(db.Text, nullable=False)
    # !IMPORTANT: Remember that this relationship also gives you (implicit) access to the parent via VE.parent.
    children = db.relationship("VirtualEntity", backref=db.backref('parent', remote_side=id),
                               cascade='all, delete-orphan')
    # NOTE: back_populates vs backref --> explicit vs implicit.
    # There is some redundancy here, but on the flip side it is extensible.
    instances = db.relationship("InstanceEntity", back_populates="virtual_entity")

    # Not always called, hence the DB related events (see below [REGION: EVENTS]).
    def __init__(self, title: str, parent_id: int=None, description: str=None):
        self.title = title
        self.parent_id = parent_id
        self.description = description
        self.properties = {}

    def __repr__(self):
        return "<VirtualEntity(id={}, title={!r}, parent_id={}, description={!r}, has_properties={}, instances={})>".format(
            self.id,
            self.title,
            self.parent_id,
            self.description,
            self.has_properties(),
            self.instances
        )

    def get_child_count(self):
        return len(self.children)

    def get_instance_count(self):
        return len(self.instances)

    def get_properties(self):
        return self.properties

    def set_properties(self, d: dict):
        self.properties = d

    def has_properties(self):
        return len(self.properties) > 0

    def add_property(self, property: Property):
        self.properties[property.get_name()] = property
        self.update_json_schema()

        for instance in self.get_all_instances():
            instance.__add_property__(property)

    def get_leaves(self):
        return [el for el in self.children if el.is_leaf()]

    def get_all_leaves(self):
        local = self.get_leaves()

        for child in self.children:
            return local + child.get_all_leaves()

        return local

    def get_all_leaves_inclusive(self):
        return self.get_all_leaves() + ([self] if self.is_leaf() else [])

    def get_all_instances(self):
        return list(itertools.chain.from_iterable(
            [entity.instances for entity in self.get_all_leaves_inclusive()]))

    # !IMPORTANT: This method retrieves from the very top virtual entity relative to self.
    def get_all_instances_from_topmost(self):
        return list(itertools.chain.from_iterable(
            [entity.instances for entity in self.get_topmost().get_all_leaves_inclusive()]))

    def is_leaf(self):
        return len(self.children) == 0

    def get_topmost(self):
        current = self

        while current:
            parent = current.parent

            if not parent:
                return current

            current = parent

        return current

    # !IMPORTANT: Use this method to store the VE's properties in the database.
    def to_schema_dictionary(self):
        return {"type": "virtual_entity", "id": self.id, "title": self.title, "parent_id": self.parent_id, "description": self.description,
                "properties": {k: v.to_schema_dictionary()[k] for k, v in self.properties.items()}}

    # !IMPORTANT: Use this method to retrieve frontend relevant VE information.
    def to_complete_dictionary(self):
        d = self.to_schema_dictionary()
        d["instances"] = [instance.to_dictionary() for instance in self.instances]
        d["children"] = []

        for child in self.children:
            d["children"].append(child.to_schema_dictionary())

        return d

    def update_json_schema(self):
        self.json_schema = json.dumps(self.to_schema_dictionary(), indent=4)

    @staticmethod
    def generate_property_dictionary(d: dict):
        for k, v in d.items():
            d[k] = SchemaProperty.generate_property(k, v)

        return d

    # @staticmethod
    # def generate_property_dictionary(d: dict):
    #     for k, v in d["properties"].items():
    #         if isinstance(v, dict):
    #             d["properties"][k] = SchemaProperty.generate_property(k, v)
    #
    #     return d


# InstanceEntity
class InstanceEntity(db.Model):
    __tablename__ = 'tb_entity_instance'

    id = db.Column(db.Integer, primary_key=True)
    virtual_entity_id = db.Column(db.Integer, db.ForeignKey(VirtualEntity.id, onupdate="CASCADE", ondelete="CASCADE"), nullable=False)
    tag = db.Column(db.String, unique=True)
    json_values = db.Column(db.Text, nullable=False)
    virtual_entity = db.relationship("VirtualEntity", back_populates="instances")

    def __init__(self, virtual_entity: VirtualEntity, tag: str=None):
        if not virtual_entity:
            raise Exception("An instance entity requires a a valid (virtual) entity.")

        # DONE: Revise? There is some danger here if we lose awareness of VEs and their corresponding IEs,
        # e.g., a VE gets deleted before an attempt to insert a linked child IE which was instantiated (__init__).
        # Anyway, this will do for now.
        # UPDATE: Will check on IE insert in DB wrapper.
        # if not virtual_entity.id:
        #     raise Exception("The parent (virtual) entity must first be added to the database.")
        self.virtual_entity_id = virtual_entity.id
        self.tag = tag

        self.properties = {}

        self.set_property_defaults(virtual_entity)

    def __repr__(self):
        return "<InstanceEntity(id={}, virtual_entity_id={}, tag={!r}, json_values={})>".format(
            self.id,
            self.virtual_entity_id,
            self.tag,
            self.json_values
        )

    # Should only be called by a connected VE.
    def __add_property__(self, property: Property):
        self.properties[property.get_name()] = property.get_schema_property().get_default_value()
        self.update_json_values()

    def get_properties(self):
        return self.properties

    def set_properties(self, d: dict):
        self.properties = d

    def set_property_defaults(self, virtual_entity: VirtualEntity):
        # Resettable?
        # self.properties = {}

        properties = self.get_virtual_entity_properties(virtual_entity)

        for k, v in properties.items():
            self.properties[k] = properties[k].get_schema_property().get_default_value()

    def set_property_value(self, key: str, value):
        # DONE: Validate.
        if not self.virtual_entity:
            raise Exception("Setting a property requires a parent be present in the DB.")

        ve_all_properties = self.get_virtual_entity_properties(self.virtual_entity)

        if not ve_all_properties.get(key, None):
            raise Exception("This instance has no property '{}'.".format(key))

        # TO DO: Generate validation error message from SchemaProperty.
        if not ve_all_properties[key].get_schema_property().is_valid(value):
            raise Exception("Value '{}' is an invalid {}."
                            .format(value, type(ve_all_properties[key].get_schema_property()).__name__))

        self.properties[key] = value
        self.update_json_values()

    def get_virtual_entity_properties(self, virtual_entity: VirtualEntity):
        properties = {}
        current = virtual_entity

        while current:
            properties.update(current.get_properties())

            parent = current.parent

            if not parent:
                break

            current = parent

        return properties

    def to_dictionary(self):
        schema = self.get_virtual_entity_properties(self.virtual_entity)

        serializable_schema = {}
        for prop in schema.values():
            serializable_schema.update(prop.to_schema_dictionary())

        return {
            "type": "instance_entity",
            "id": self.id,
            "tag": self.tag,
            "virtual_entity_id": self.virtual_entity_id,
            "properties": self.get_properties(),
            "schema": serializable_schema,
        }

    def update_json_values(self):
        self.json_values = json.dumps(self.properties, indent=4)


# Devices
@unique
class DeviceTypes(Enum):
    Headset = "headset"
    Scanner = "scanner"


# Pre-populate database for the time being. Create a new (front end) page eventually.
class DeviceModel(db.Model):
    __tablename__ = 'tb_device_model'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(length=255), nullable=False)
    type = db.Column(db.Enum(DeviceTypes), nullable=False)
    part_name = db.Column(db.String(length=255))
    description = db.Column(db.String(length=255))
    physical_devices = db.relationship("PhysicalDevice", back_populates="model")

    def __init__(self, name: str, type: DeviceTypes, part_name: str=None, description: str=None):
        self.name = name
        self.type = type
        self.part_name = part_name
        self.description = description

    def __repr__(self):
        return "<DeviceModel(id={}, name={!r}, type={!r}, part_name={!r}, description={!r})>".format(
            self.id,
            self.name,
            self.type.value,
            self.part_name,
            self.description
        )


class PhysicalDevice(db.Model):
    __tablename__ = 'tb_physical_device'

    id = db.Column(db.Integer, primary_key=True)
    model_id = db.Column(db.Integer, db.ForeignKey(DeviceModel.id, onupdate="CASCADE", ondelete="CASCADE"), nullable=False)
    ip = db.Column(db.Text(length=2083), nullable=False, unique=True)
    purpose = db.Column(db.String(length=255))
    model = db.relationship("DeviceModel", back_populates="physical_devices")
    device_outputs = db.relationship("DeviceOutput", back_populates="device", passive_deletes=True)
    device_inputs = db.relationship("DeviceInput", back_populates="device", passive_deletes=True)

    def __init__(self, id: int, model_id: int, ip: str, purpose: str=None):
        self.id = id
        self.ip = ip
        self.model_id = model_id
        self.purpose = purpose

    def __repr__(self):
        return "<PhysicalDevice(id={}, model_id={}, ip={!r}, purpose={!r})>".format(
            self.id,
            self.model_id,
            self.ip,
            self.purpose
        )


@unique
class OutputTypes(Enum):
    Text2Speech = "Text-to-speech"


class DeviceOutput(db.Model):
    __tablename__ = 'tb_device_output'

    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey(PhysicalDevice.id, onupdate="CASCADE", ondelete="CASCADE"), nullable=False)
    type = db.Column(db.Enum(OutputTypes), nullable=False)
    # TO DO: Resolve --> what is name? Enum(OutputTypes) can replace?
    name = db.Column(db.String(length=50))
    description = db.Column(db.String(length=255))
    device = db.relationship("PhysicalDevice", back_populates="device_outputs")

    def __init__(self, device_id: int, type: OutputTypes, name: str=None, description: str=None):
        self.device_id = device_id
        self.type = type
        self.name = name
        self.description = description

    def __repr__(self):
        return "<DeviceOutput(id={}, device_id={}, type={!r}, name={!r}, description={!r})>".format(
            self.id,
            self.device_id,
            self.type.value,
            self.name,
            self.description
        )


@unique
class InputTypes(Enum):
    Rfid = "RFID"


class DeviceInput(db.Model):
    __tablename__ = 'tb_device_input'

    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey(PhysicalDevice.id, onupdate="CASCADE", ondelete="CASCADE"), nullable=False)
    type = db.Column(db.Enum(InputTypes), nullable=False)
    # TO DO: Resolve --> what is name? Enum(InputTypes) can replace?
    name = db.Column(db.String(length=50))
    description = db.Column(db.String(length=255))
    device = db.relationship("PhysicalDevice", back_populates="device_inputs")

    def __init__(self, device_id: int, type: InputTypes, name: str=None, description: str=None):
        self.device_id = device_id
        self.type = type
        self.name = name
        self.description = description

    def __repr__(self):
        return "<DeviceInput(id={}, device_id={}, type={!r}, name={!r}, description={!r})>".format(
            self.id,
            self.device_id,
            self.type.value,
            self.name,
            self.description
        )


class VirtualOutput(db.Model):
    __tablename__ = 'tb_virtual_output'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(length=255))
    device_output_id = db.Column(db.Integer, db.ForeignKey(DeviceOutput.id, onupdate="CASCADE", ondelete="SET NULL"))
    device_output = db.relationship(DeviceOutput)

    def __repr__(self):
        return "<VirtualOutput(id={}, name={!r}, device_output_id={})>".format(self.id, self.name, self.device_output_id)


class VirtualInput(db.Model):
    __tablename__ = 'tb_virtual_input'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(length=255))
    device_input_id = db.Column(db.Integer, db.ForeignKey(DeviceInput.id, onupdate="CASCADE", ondelete="SET NULL"))
    device_input = db.relationship(DeviceInput)

    def __repr__(self):
        return "<VirtualInput(id={}, name={!r}, device_input_id={})>".format(self.id, self.name, self.device_input_id)


class Action(db.Model):
    __tablename__ = 'tb_action'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(length=255))
    ast = db.Column(db.Text, nullable=False)

    wants_entity_id = db.Column(db.Integer, db.ForeignKey(VirtualEntity.id))
    wants_entity = db.relationship(VirtualEntity)

    def __repr__(self):
        return "<Action(id={}, name={!r}, wants_entity_id={})>".format(self.id, self.name, self.wants_entity_id)


@unique
class EventTypes(Enum):
    time = "Time"
    scan = "Scan"


class Event(db.Model):
    __tablename__ = 'tb_events'

    id = db.Column(db.Integer, primary_key=True)
    scene_id = db.Column(db.Integer, db.ForeignKey(Scene.id, onupdate="CASCADE", ondelete="CASCADE"), nullable=False)
    name = db.Column(db.String(length=255))
    type = db.Column(db.Enum(EventTypes))
    time = db.Column(db.String(length=255))
    device_id = db.Column(db.Integer, db.ForeignKey(PhysicalDevice.id, onupdate="CASCADE", ondelete="SET NULL"))
    tag_id = db.Column(db.Integer, db.ForeignKey(VirtualEntity.id, onupdate="CASCADE", ondelete="SET NULL"))

    def __repr__(self):
        return "<Event(id={}, scene_id={}, name={!r}, type={!r}), time={!r}, device_id={}, tag_id={})>".format(
            self.id,
            self.scene_id,
            self.name,
            self.type.value,
            self.time,
            self.device_id,
            self.tag_id
        )


class EventActions(db.Model):
    __tablename__ = 'tb_event_actions'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey(Event.id, onupdate="CASCADE", ondelete="CASCADE"), nullable=False)
    action_id = db.Column(db.Integer, db.ForeignKey(Action.id, onupdate="CASCADE", ondelete="CASCADE"), nullable=False)

    def __repr__(self):
        return "<EventActions(id={}, event_id={}, action_id={})>".format(self.id, self.event_id, self.action_id)


# REGION: EVENTS
# RESOURCE: http://docs.sqlalchemy.org/en/latest/orm/events.html
@event.listens_for(VirtualEntity, 'before_insert')
def virtual_entity_before_insert(mapper, connect, target: VirtualEntity):
    target.update_json_schema()


@event.listens_for(VirtualEntity, 'before_update')
def virtual_entity_before_update(mapper, connection, target: VirtualEntity):
    target.update_json_schema()


@event.listens_for(VirtualEntity, 'load')
def virtual_entity_load(target: VirtualEntity, context):
    # DONE: Fix deserialize issue.
    d = json.loads(target.json_schema)

    for k, v in d["properties"].items():
        if isinstance(v, dict):
            d["properties"][k] = SchemaProperty.generate_property(k, v)

    target.set_properties(d["properties"])


@event.listens_for(InstanceEntity, 'before_insert')
def instance_entity_before_insert(mapper, connect, target: InstanceEntity):
    target.update_json_values()


@event.listens_for(InstanceEntity, 'before_update')
def instance_entity_before_update(mapper, connection, target: InstanceEntity):
    target.update_json_values()


@event.listens_for(InstanceEntity, 'load')
def instance_entity_load(target: InstanceEntity, context):
    d = json.loads(target.json_values)
    target.set_properties(d)
