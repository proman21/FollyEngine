# Copyright (c) 2017 Ned Hoy <nedhoy@gmail.com>
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

import unittest

from flask_app import app
from flask_app import model
from flask_app.data_access import Database
from sqlalchemy.exc import IntegrityError


class DatabaseTest(unittest.TestCase):
    """Base class for database tests"""

    @classmethod
    def setUpClass(cls):
        # 'sqlite://' defaults to using :memory:, an in-memory database useful for testing
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'

    def setUp(self):
        self.db = Database()
        self.db.create_database()

    def tearDown(self):
        self.db.wipe_database()


class VirtualEntityTest(DatabaseTest):
    def test_virtual_entity_insert(self):
        """Test that a virtual entity can be added to the database."""

        entities = [
            model.VirtualEntity(title="VE1", description="virtual entity 1"),
        ]

        for entity in entities:
            self.db.add_virtual_entity(entity)

        db_entities = self.db.get_all_virtual_entities()
        self.assertEqual(len(db_entities), len(entities))

        # Check there are no InstanceEntities.
        self.assertEqual(len(self.db.get_all_instances()), 0)

        for i, entity in enumerate(entities):
            self.assertEqual(db_entities[i].parent_id, entity.parent_id)
            self.assertEqual(db_entities[i].description, entity.description)
            self.assertEqual(db_entities[i].properties, entity.properties)


class InstanceEntityTest(DatabaseTest):
    def test_instance_entity_fails(self):
        """Test that an instance entity cannot be added before its virtual entity"""

        parent = model.VirtualEntity(title="VE1", description="virtual entity 1")

        instance = model.InstanceEntity(virtual_entity=parent)

        # Annoying way to do it but see SQLALchemy documentation.
        def local(ie):
            try:
                self.db.add_instance_entity(ie)
            except Exception:
                self.db._db.session.rollback()
                raise

        self.assertRaises(Exception, local, instance)

    def test_instance_entity_insert(self):
        """Test that a virtual entity can be added to the database."""

        parent = model.VirtualEntity(title="VE1", description="virtual entity 1")

        # Add the parent.
        self.db.add_virtual_entity(parent)

        # Initialise the child (passing the parent as init parameter).
        instance = model.InstanceEntity(virtual_entity=parent)

        # Insert the instance.
        self.db.add_instance_entity(instance)

        # Virtual entities == 1.
        db_entities = self.db.get_all_virtual_entities()
        self.assertEqual(len(db_entities), 1)

        # Instance entities == 1.
        db_instances = self.db.get_all_instances()
        self.assertEqual(len(db_instances), 1)


class DeviceTest(DatabaseTest):
    def get_models(self):
        device_models = [
            model.DeviceModel(
                name="headset model 1",
                type=model.DeviceTypes.Headset,
                part_name="Plantronics Voyager 5200",
                description="headset description 1",
            ),
            model.DeviceModel(
                name="scanner model 1",
                type=model.DeviceTypes.Scanner,
                part_name="Scanner 5200",
                description="scanner description 1",
            ),
        ]

        return device_models

    def get_devices(self, device_models):
        headset_model, scanner_model = device_models

        devices = [
            model.PhysicalDevice(
                id=1,
                model_id=headset_model.id,
                ip="10.0.0.1",
                purpose="rfid reader",
            ),
            model.PhysicalDevice(
                id=2,
                model_id=scanner_model.id,
                ip="10.0.0.2",
                purpose="emic text to speech",
            ),
        ]

        return devices

    def test_models(self):
        """Test that models can be added to the database"""

        # Define the device models
        device_models = self.get_models()
        headset_model, scanner_model = device_models

        # Add the device models to the database
        for device_model in device_models:
            self.db.add_model(device_model)

        # Check the models were added
        db_models = self.db.get_all_models()
        self.assertEqual(len(db_models), len(device_models))
        for i, device_model in enumerate(device_models):
            self.assertEqual(db_models[i], device_model)

    def test_devices(self):
        """Test that devices can be added to the database"""

        # Define the device models
        device_models = self.get_models()

        # Add the device models to the database
        for device_model in device_models:
            self.db.add_model(device_model)

        # Define the physical devices
        devices = self.get_devices(device_models)

        # Add the physical devices to the database
        for device in devices:
            self.db.add_device(device)

        # Check the physical devices were added
        db_devices = self.db.get_all_devices()
        self.assertEqual(len(db_devices), len(devices))
        for i, device in enumerate(devices):
            self.assertEqual(db_devices[i], device)

    def test_outputs(self):
        """Test that outputs can be added to the database"""

        # Define the device models
        device_models = self.get_models()

        # Add the device models to the database
        for device_model in device_models:
            self.db.add_model(device_model)

        # Define the physical devices
        devices = self.get_devices(device_models)
        scanner_device, emics_device = devices

        # Add the physical devices to the database
        for device in devices:
            self.db.add_device(device)

        # Define the outputs
        outputs = [
            model.DeviceOutput(
                device_id=emics_device.id,
                type=model.OutputTypes.Text2Speech,
                name="emics",
                description="output description 1",
            ),
        ]

        # Add the outputs to the database
        for output in outputs:
            self.db.add_output(output)

        # Check the outputs were added
        db_outputs = self.db.get_all_outputs()
        self.assertEqual(len(db_outputs), len(outputs))
        for i, output in enumerate(outputs):
            self.assertEqual(db_outputs[i], output)

    def test_inputs(self):
        """Test that inputs can be added to the database"""

        # Define the device models
        device_models = self.get_models()

        # Add the device models to the database
        for device_model in device_models:
            self.db.add_model(device_model)

        # Define the physical devices
        devices = self.get_devices(device_models)
        scanner_device, emics_device = devices

        # Add the physical devices to the database
        for device in devices:
            self.db.add_device(device)

        # Define the inputs
        inputs = [
            model.DeviceInput(
                device_id=scanner_device.id,
                type=model.InputTypes.Rfid,
                name="rfid",
                description="input description 1",
            ),
        ]

        # Add the inputs to the database
        for input in inputs:
            self.db.add_input(input)

        # Check the inputs were added
        db_inputs = self.db.get_all_inputs()
        self.assertEqual(len(db_inputs), len(inputs))
        for i, input in enumerate(inputs):
            self.assertEqual(db_inputs[i], input)

    def test_delete_device(self):
        """Test deleting devices"""

        # Define the device models
        device_models = self.get_models()

        # Add the device models to the database
        for device_model in device_models:
            self.db.add_model(device_model)

        # Define the physical devices
        devices = self.get_devices(device_models)
        scanner_device, emics_device = devices

        # Add the physical devices to the database
        for device in devices:
            self.db.add_device(device)

        # Delete the device
        deleted_device = devices.pop()
        self.db.delete_device(deleted_device)

        # Check the device is gone
        db_devices = self.db.get_all_devices()
        self.assertEqual(len(db_devices), len(devices))

        # Check it was the correct device that got deleted
        for i, device in enumerate(devices):
            self.assertEqual(db_devices[i], device)


class SceneTest(DatabaseTest):
    def test_scenes(self):
        """Test adding and retrieving scenes"""

        scenes = [
            model.Scene(name="Scene 0", description="first scene"),
            model.Scene(name="Scene 1", description="second scene"),
            model.Scene(name="Scene 2", description="third scene"),
        ]

        for scene in scenes:
            self.db.add_scene(scene)

        db_scenes = self.db.get_all_scenes()
        self.assertEqual(len(db_scenes), len(scenes))

        for i, scene in enumerate(scenes):
            self.assertEqual(db_scenes[i].id, i + 1)
            self.assertEqual(db_scenes[i].name, scene.name)
            self.assertEqual(db_scenes[i].description, scene.description)

    def test_delete_scene(self):
        """Test deleting scenes"""

        scenes = [
            model.Scene(name="Scene 0", description="first scene"),
            model.Scene(name="Scene 1", description="second scene"),
            model.Scene(name="Scene 2", description="third scene"),
        ]

        for scene in scenes:
            self.db.add_scene(scene)

        # Check everything was added
        db_scenes = self.db.get_all_scenes()
        self.assertEqual(len(db_scenes), len(scenes))

        # Delete the scene
        deleted_scene = scenes.pop()
        self.db.delete_scene(deleted_scene)

        # Check the scene is gone
        db_scenes = self.db.get_all_scenes()
        self.assertEqual(len(db_scenes), len(scenes))

        # Check it was the correct scene that got deleted
        for i, scene in enumerate(scenes):
            self.assertEqual(db_scenes[i].id, i + 1)
            self.assertEqual(db_scenes[i].name, scene.name)
            self.assertEqual(db_scenes[i].description, scene.description)

class ActionTest(DatabaseTest):
    # FIXME: probably not the best place for this stuff

    from flask_app.actions import nodes
    from flask_app.actions.nodes import (
        CompoundStatement,
        IfElseStatement,
        PrintStatement,
        BinaryOp,
        BooleanLiteral,
        StringLiteral,
    )
    from flask_app.actions import unparser

    ast = CompoundStatement(statements=[
        PrintStatement(StringLiteral("Begin program")),
        IfElseStatement(
            condition=BinaryOp(
                left=BooleanLiteral(True),
                operator=nodes.Operator.LOGICAL_OR,
                right=BooleanLiteral(False)
            ),
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Line 1 of if body")),
                PrintStatement(StringLiteral("Line 2 of if body")),
                PrintStatement(StringLiteral("Line 3 of if body")),
            ]),
            else_body=PrintStatement(StringLiteral("Else body has only one statement")),
        ),
    ])

    ast_str = unparser.to_json(ast)

    def test_actions(self):
        """Test adding and retrieving scenes"""

        actions = [
            model.Action(name="Action 1", ast=self.ast_str),
        ]

        for action in actions:
            self.db.add_action(action)

        db_actions = self.db.get_all_actions()
        self.assertEqual(len(db_actions), len(actions))

        for i, action in enumerate(actions):
            self.assertEqual(db_actions[i].name, action.name)
            self.assertEqual(db_actions[i].ast, action.ast)

    def test_delete_actions(self):
        """Test deleting actions"""

        actions = [
            model.Action(name="Action 1", ast=self.ast_str),
            model.Action(name="Action 2", ast=self.ast_str),
            model.Action(name="Action 3", ast=self.ast_str),
        ]

        for action in actions:
            self.db.add_action(action)

        # Check everything was added
        db_actions = self.db.get_all_actions()
        self.assertEqual(len(db_actions), len(actions))

        # Delete the action
        deleted_action = actions.pop()
        self.db.delete_scene(deleted_action)

        # Check the action is gone
        db_actions = self.db.get_all_actions()
        self.assertEqual(len(db_actions), len(actions))

        # Check it was the correct scene that got deleted
        for i, action in enumerate(actions):
            self.assertEqual(db_actions[i].id, i + 1)
            self.assertEqual(db_actions[i].name, action.name)
            self.assertEqual(db_actions[i].ast, action.ast)

if __name__ == '__main__':
    unittest.main()
