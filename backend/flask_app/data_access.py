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

from . model import *


# Database wrapper.
# DONE: Resolve db vs self._db
# DONE: Add query to get a VE's topmost parent.
# TO DO: Add method to get level, 0 = topmost.
class Database(object):
    def __init__(self):
        self._db = db

    def wipe_database(self):
        self._db.drop_all('__all__')
        self._db.session.commit()

    # Load/create.
    def create_database(self):
        # !!!IMPORTANT: configure_mappers must be called first to account for AbstractConcreteBase deferring mapping.
        # Essentially, calling AbstractEntity.query.all() won't work unless configure_mappers is called beforehand.
        # The reason this 'bug' (not really a bug on their end as it is the expected behaviour) was never found
        # was because we must have called a query which in turn called configure_mappers under the hood, e.g.,
        # VirtualEntity.query.all() before AbstractEntity.query.all() will work.
        # To replicate the error uncomment the configure_mappers just below and call AbstractEntity.query.all()
        # as the very first database query.
        # More information here: https://stackoverflow.com/questions/40240358/flask-sqlalchemy-abstractconcretebase-not-mapped-until-subclass-is-queried
        # UPDATE: No longer need to call configure_mappers as there is no longer a AbstractConcretebase.
        self._db.create_all()
        # self._db.configure_mappers()

    def rollback(self):
        self._db.session.rollback()

    def commit(self):
        self._db.session.commit()

    def get_all_scenes(self):
        return Scene.query.all()

    def add_scene(self, scene: Scene):
        self._db.session.add(scene)
        self._db.session.commit()

    def delete_scene(self, scene: Scene):
        self._db.session.delete(scene)
        self._db.session.commit()

    def get_scene_by_id(self, scene_id: int):
        return Scene.query.get(scene_id)

    def get_all_models(self):
        return DeviceModel.query.all()

    def add_model(self, model: DeviceModel):
        self._db.session.add(model)
        self._db.session.commit()

    def get_all_devices(self):
        return PhysicalDevice.query.all()

    def get_device_by_id(self, device_id: int):
        return PhysicalDevice.query.get(device_id)

    def add_device(self, device: PhysicalDevice):
        self._db.session.add(device)
        self._db.session.commit()

    def delete_device(self, device: PhysicalDevice):
        self._db.session.delete(device)
        self._db.session.commit()

    def get_all_outputs(self):
        return DeviceOutput.query.all()

    def add_output(self, output: DeviceOutput):
        self._db.session.add(output)
        self._db.session.commit()

    def get_all_inputs(self):
        return DeviceInput.query.all()

    def add_input(self, input: DeviceInput):
        self._db.session.add(input)
        self._db.session.commit()

    def get_all_virtual_entities(self):
        return VirtualEntity.query.all()

    def get_virtual_entity(self, id: int):
        if not id:
            return None

        return VirtualEntity.query.get(id)

    def get_virtual_entity_by_id(self, id: int):
        return VirtualEntity.query.get(id)

    def get_virtual_entity_by_name(self, name: str):
        return VirtualEntity.query.filter_by(title=name).first()

    def get_topmost_virtual_entity(self, id: int):
        current = self.get_virtual_entity(id)

        while current:
            parent = self.get_virtual_entity(current.parent_id)

            if not parent:
                return current

            current = parent

        raise Exception("VirtualEntity with ID {} has no parent!".format(id))

    def is_topmost_virtual_entity(self, id: int):
        return self.get_topmost_virtual_entity(id).id == id

    # Prefer to have in wrapper (as opposed to model).
    def is_leaf_virtual_entity(self, id: int):
        ve = self.get_virtual_entity(id)

        if not ve:
            raise Exception("No virtual entity with ID {} located in the DB.".format(id))

        return len(VirtualEntity.query.get(id).children) == 0

    def add_virtual_entity(self, entity: VirtualEntity):
        parent = self.get_virtual_entity(entity.parent_id)

        if parent and parent.get_instance_count() > 0:
            raise Exception("Virtual entity cannot be added to the DB because its parent has instances.")

        self._db.session.add(entity)
        self._db.session.commit()

    def delete_virtual_entity(self, entity: VirtualEntity):
        self._db.session.delete(entity)
        self._db.session.commit()

    def add_virtual_entity_property(self, entity: VirtualEntity, property: Property):
        entity.add_property(property)
        self._db.session.commit()

    def get_all_instances(self):
        return InstanceEntity.query.all()

    def get_instance_entity(self, id: int):
        if not id:
            return None

        return InstanceEntity.query.get(id)

    def get_instance_entity_by_tag(self, tag: str):
        return InstanceEntity.query.filter_by(tag=tag).first()

    def add_instance_entity(self, entity: InstanceEntity):
        ve_id = entity.virtual_entity_id

        # Check if a virtual entity id has been set.
        if not ve_id:
            raise Exception("An instance must have a parent (virtual) entity.")

        # Check if parent has been inserted into db, i.e., a matching virtual entity is in the DB.
        if not self.get_virtual_entity(ve_id):
            raise Exception("The instance's parent (virtual) entity is not in the database.")

        if not self.is_leaf_virtual_entity(ve_id):
            raise Exception("The instance's parent (virtual) entity is not a leaf node.")

        self._db.session.add(entity)
        self._db.session.commit()

    def set_instance_entity_property(self, entity: InstanceEntity, key: str, value):
        entity.set_property_value(key, value)
        self._db.session.commit()

    # NOTE: Added for convenience.
    def get_instance_topmost_virtual_entity(self, id: int):
        instance = self.get_instance_entity(id)

        if not instance:
            raise Exception("Instance with ID {} is not in the database.".format(id))

        return self.get_topmost_virtual_entity(instance.virtual_entity_id)

    def get_all_actions(self):
        return Action.query.all()

    def add_action(self, action: Action):
        self._db.session.add(action)
        self._db.session.commit()

    def delete_action(self, action: Action):
        self._db.session.delete(action)
        self._db.session.commit()

    def get_action_by_id(self, action_id: int):
        return Action.query.get(action_id)

    def get_events_by_scene(self, scene_id: int):
        return Event.query.filter(Event.sceneID == scene_id).all()

    def get_all_events(self):
        return Event.query.all()

    def get_event_by_device(self, device_id: int):
        # There is a unique event for each device (or no event)
        return Event.query.filter(Event.deviceID == device_id).first()

    def get_event_by_id(self, event_id: int):
        return Event.query.get(event_id)

    def delete_event(self, event: Event):
        self._db.session.delete(event)
        self._db.session.commit()

    def add_event(self, event: Event):
        self._db.session.add(event)
        self._db.session.commit()

    def add_event_action(self, eventAction: EventActions):
        self._db.session.add(eventAction)
        self._db.session.commit()

    def delete_event_action(self, eventAction: EventActions):
        self._db.session.delete(eventAction)
        self._db.session.commit()

    def get_actions_per_event(self, eventID: int):
        return EventActions.query.filter(EventActions.eventID == eventID).all()

    def get_event_action_by_id(self, id: int):
        return EventActions.query.get(id)

    def get_all_event_actions(self):
        return EventActions.query.all()
