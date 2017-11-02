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

# !IMPORTANT
# For this to run you will need to add Flask and Flask-SQLAlchemy.
# To install the above dependencies in PyCharm (2017.2) navigate to
# File-->Settings-->Project:[PROJECT_NAME]-->Project Interpreter-->[NAME_OF_DEPENDENCY]
# and install as required.

# RESOURCES
# Flask-SQLAlchemy: http://flask-sqlalchemy.pocoo.org/2.1/quickstart/
# Flask-SQLAlchemy configuration: http://flask-sqlalchemy.pocoo.org/2.1/config/
# SQLAlchemy: http://docs.sqlalchemy.org/en/latest/orm/tutorial.html

# REPO: https://source.eait.uq.edu.au/gitlist/deco3801-Real-Engine/
# CLONE: s344878@source.eait.uq.edu.au:deco3801-Real-Engine

from backend.flask_app.data_access import *
from backend.flask_app.schema import *
from backend.flask_app.data_access import *
import json

# 1) Commit
# 2) Pull = checkout + merge
# 3) Push
        # If merge conflict:
        # Commit again.
        # Lookup rebase: git pull --rebase
        # git stash / git stash pop
        # git diff -cached
        # git add -p

# return self._db.session.query(VirtualEntity).filter(VirtualEntity.id == id).scalar()
# VirtualEntity.query.join((parent, virtual_entity.id == InstanceEntity.parent_id))
# print(ves[0].properties)


# Add new ORM
# TO DO: Add test to see if deleting a virtual entity cascades properly, i.e., deletes all children VEs and
# connected IEs.
# TO DO: Add test on adding an identically named property to a child entity.
# DONE: Resolve InstanceEntity's VirtualEntity access (to initialise attributes).
# UPDATE: can pass in VirtualEntity (as opposed to using IE.virtual_entity, which relies on IE having been inserted...).
# TO DO: Enforce only leaf VE can have IEs.


def main():
    dbw = Database()

    # dbw.wipe_database()

    dbw.create_database()

    # print("ALL VIRTUAL ENTITIES: {}\n".format(VirtualEntity.query.all()))
    print("ALL INSTANCE ENTITIES: {}\n".format(InstanceEntity.query.all()))

    # ve1 = VirtualEntity("ve1", description="Description 1")
    # dbw.add_virtual_entity(ve1)
    # ve2 = VirtualEntity("ve2", parent_id=ve1.id, description="Description 2")
    # dbw.add_virtual_entity(ve2)
    # ve3 = VirtualEntity("ve3")
    # dbw.add_virtual_entity(ve3)
    # ve4 = VirtualEntity("ve4", parent_id=ve2.id)
    # dbw.add_virtual_entity(ve4)
    # ve5 = VirtualEntity("ve5", parent_id=ve2.id)
    # dbw.add_virtual_entity(ve5)
    # ve6 = VirtualEntity("ve6", parent_id=ve1.id)
    # dbw.add_virtual_entity(ve6)
    # ve7 = VirtualEntity("ve7", parent_id=ve5.id)
    # dbw.add_virtual_entity(ve7)
    #
    # ve1 = dbw.get_virtual_entity(1)
    # ve6 = dbw.get_virtual_entity(6)
    # ve7 = dbw.get_virtual_entity(7)
    #
    # attribute1 = Property("id", Numeric(NumericType.Integer))
    # attribute2 = Property("name", String())
    # attribute3 = Property("inherited", String())
    #
    # dbw.add_virtual_entity_property(ve1, attribute1)
    # dbw.add_virtual_entity_property(ve1, attribute2)
    # dbw.add_virtual_entity_property(ve1, attribute3)
    #
    # print("ALL VIRTUAL ENTITIES: {}:\n".format(VirtualEntity.query.all()))
    #
    # # Add instances.
    # ie1 = InstanceEntity(dbw.get_virtual_entity(6))
    # dbw.add_instance_entity(ie1)
    # ie2 = InstanceEntity(dbw.get_virtual_entity(7))
    # dbw.add_instance_entity(ie2)
    # ie3 = InstanceEntity(dbw.get_virtual_entity(7))
    # dbw.add_instance_entity(ie3)

    # ve5ie1 = dbw.get_instance_entity(1)
    # ve6ie1 = dbw.get_instance_entity(2)
    #
    # dbw.set_instance_entity_property(ve5ie1, "id", 2)
    # dbw.set_instance_entity_property(ve5ie1, "name", "new_name")
    # dbw.set_instance_entity_property(ve6ie1, "id", 3)

    # print("INSTANCE #{}: {}".format(ve5ie1.id, ve5ie1.get_properties()))
    # print("INSTANCE #{}: {}".format(ve6ie1.id, ve6ie1.get_properties()))

    # Attempt to insert VE whose parent has instances.
    # ve7, ve8 should pass, ve9 should fail.
    # ve7 = VirtualEntity("ve7", parent_id=1, description="Description 1")
    # dbw.add_virtual_entity(ve7)
    #
    # ve8 = VirtualEntity("ve8", parent_id=4, description="Description 1")
    # dbw.add_virtual_entity(ve8)
    #
    # ve9 = VirtualEntity("ve9", parent_id=5, description="Description 1")
    # dbw.add_virtual_entity(ve9)





    # print(ve1.get_all_leaves())
    # print(ve2.get_all_leaves())
    # print(ve4.get_all_leaves())
    # print(ve1.get_all_leaves_inclusive())
    # print(ve2.get_all_leaves_inclusive())
    # print(ve4.get_all_leaves_inclusive())

    # attribute4 = Property("attr4", String())
    # ve1.add_property(attribute4)
    #
    # instance1 = dbw.get_instance_entity(1)
    # instance2 = dbw.get_instance_entity(2)
    #
    # instance1.set_property_value("id", 2)
    # instance2.set_property_value("attr4", "attr4_val")
    #
    # print(ve5ie1.properties)
    # print(ve6ie1.properties)

    # print([instance.id for instance in ve1.get_all_instances_from_topmost()])
    # print([instance.id for instance in ve5.get_all_instances()])
    # print([instance for instance in ve1.get_all_instances_from_topmost()])
    # print([instance for instance in ve5.get_all_instances()])

    # print("ALL VIRTUAL ENTITIES: {}:\n".format(VirtualEntity.query.all()))

    # ve1 = VirtualEntity.query.all()[0]
    # ve2 = VirtualEntity.query.all()[1]
    # ve3 = VirtualEntity.query.all()[2]

    # Add to unit tests.
    # print(dbw.is_topmost_virtual_entity(None))
    # print(dbw.is_topmost_virtual_entity(0))
    # print(dbw.is_topmost_virtual_entity(1))
    # print(dbw.is_topmost_virtual_entity(2))
    # print(dbw.is_topmost_virtual_entity(3))
    #
    # print(dbw.get_instance_topmost_virtual_entity(-1))
    # print(dbw.get_instance_topmost_virtual_entity(1)

    # with open('test_data2.json', 'w') as outfile:
    #     json.dump(ve1.to_schema_dictionary(), outfile, indent=4)
    # schema = open("test_schema.json").read()
    # data = open("test_data.json").read()
    #
    # try:
    #     jsonschema.validate(json.loads(schema), json.loads(data))
    # except jsonschema.ValidationError as e:
    #     print(e.message)
    # except jsonschema.SchemaError as e:
    #     print(e)
    #
    # try:
    #     jsonschema.Draft4Validator(json.loads(schema)).validate(json.loads(data))
    # except jsonschema.ValidationError as e:
    #     print(e.message)

    # model1 = DeviceModel(name="ESP32", type=DeviceTypes.Scanner)
    # dbw.add_model(model1)
    # print(dbw.get_all_models())
    #
    # device1 = PhysicalDevice(1, "127.0.0.0")
    # dbw.add_device(device1)
    # print(dbw.get_all_devices())
    # # print(device1.model)
    #
    # output1 = DeviceOutput(1, OutputTypes.Text2Speech)
    # dbw.add_output(output1)
    # print(dbw.get_all_outputs())
    #
    # input1 = DeviceInput(1, InputTypes.Rfid)
    # dbw.add_input(input1)
    # print(dbw.get_all_inputs())
    #
    # print(device1.device_outputs)
    # print(device1.device_inputs)

if __name__ == '__main__':
    main()
