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

import json
import unittest

from urllib.parse import urlparse

from flask_app import app
from flask_app import model
from flask_app import data_access


class Test(unittest.TestCase):
    """Base class for Flask API tests"""

    @classmethod
    def setUpClass(cls):
        # 'sqlite://' defaults to using :memory:, an in-memory database useful for testing
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite://'

    def setUp(self):
        self.db = data_access.Database()
        self.db.create_database()

        self.test_client = app.test_client()

    def tearDown(self):
        self.db.wipe_database()

class DeviceTest(Test):

    def test_empty_devices(self):
        """Test that there are initially no devices"""

        response = self.test_client.get('/api/devices/')
        self.assertEqual(response.status_code, 200)

        json_response = response.get_data(as_text=True)
        devices = json.loads(json_response)

        self.assertEqual(devices, [])

    def test_new_device(self):
        """Test that a new device can be added"""

        request_data = {
            'id': 1,
            'model_id': 1,
            'ip': '10.0.0.1',
            'purpose': 'rfid reader',
        }
        response = self.test_client.post('/api/devices/', data=json.dumps(request_data))
        self.assertEqual(response.status_code, 303)
        self.assertEqual(urlparse(response.location).path, "/api/devices/1")

        response = self.test_client.get('/api/devices/')
        self.assertEqual(response.status_code, 200)

        json_response = response.get_data(as_text=True)
        devices = json.loads(json_response)

        expected = [
            {
                'id': 1,
                'model_id': 1,
                'ip': '10.0.0.1',
                'purpose': 'rfid reader',
            },
        ]
        self.assertEqual(devices, expected)

    def test_device_get_404(self):
        """Test get fails for unknown device id"""

        response = self.test_client.get('/api/device/100')
        self.assertEqual(response.status_code, 404)

    def test_device_put_404(self):
        """Test put fails for unknown device id"""

        updated_device = {
            'id': 100,
            'ip': '10.0.0.1',
            'purpose': 'rfid reader',
        }
        response = self.test_client.put('/api/devices/100', data=json.dumps(updated_device));
        self.assertEqual(response.status_code, 404)

    def test_update_device(self):
        """Test that devices can be updated"""

        # Add a new device
        data = {
            'id': 1,
            'model_id': 1,
            'ip': '10.0.0.1',
            'purpose': 'rfid reader',
        }
        response = self.test_client.post('/api/devices/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)
        self.assertEqual(urlparse(response.location).path, "/api/devices/1")

        # Now try updating the device
        updated_device = {
            'id': 1,
            'model_id': 1,
            'ip': '10.0.0.100',
            'purpose': 'rfid reader with new purpose',
        }

        response = self.test_client.put('/api/devices/1', data=json.dumps(updated_device));
        self.assertEqual(response.status_code, 201)

        response = self.test_client.get('/api/devices/1')
        self.assertEqual(response.status_code, 200)

        device = json.loads(response.get_data(as_text=True))
        self.assertEqual(device, updated_device)

    def test_delete_device(self):
        """Test that devices can be deleted"""

        # Add a new device
        data = {
            'id': 1,
            'model_id': 1,
            'ip': '10.0.0.1',
            'purpose': 'rfid reader',
        }

        response = self.test_client.post('/api/devices/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)
        self.assertEqual(urlparse(response.location).path, "/api/devices/1")

        # Now try deleting the device
        response = self.test_client.delete('/api/devices/1')
        self.assertEqual(response.status_code, 204)

        # Check that it's gone
        response = self.test_client.get('/api/devices/1')
        self.assertEqual(response.status_code, 404)


class SceneTest(Test):

    def test_add_scenes(self):
        """Test that scenes can be added and retrieved"""

        data = {
            'name': 'Scene 0',
            'description': 'first scene',
        }
        response = self.test_client.post('/api/scenes/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)

        response = self.test_client.get('/api/scenes/')
        self.assertEqual(response.status_code, 200)

        scenes = json.loads(response.get_data(as_text=True))

        expected = [
            {
                'id': 1,
                'name': 'Scene 0',
                'description': 'first scene',
            },
        ]
        self.assertEqual(scenes, expected)

    def test_scene_get_404(self):
        """Test get fails for unknown scene id"""

        response = self.test_client.get('/api/scenes/100')
        self.assertEqual(response.status_code, 404)

    def test_scene_put_404(self):
        """Test put fails for unknown scene id"""

        updated_scene = {
            'id': 100,
            'name': 'Scene with New Name',
            'description': 'scene has new description',
        }
        response = self.test_client.put('/api/scenes/100', data=json.dumps(updated_scene));
        self.assertEqual(response.status_code, 404)

    def test_new_empty_scene(self):
        """Test that scenes can be created without any content"""

        # Add a new scene
        data = {
            'name': None,
            'description': None,
        }
        response = self.test_client.post('/api/scenes/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)
        self.assertEqual(urlparse(response.location).path, "/api/scenes/1")

    def test_update_scene(self):
        """Test that scenes can be updated"""

        # Add a new scene
        data = {
            'name': 'Scene 0',
            'description': 'first scene',
        }
        response = self.test_client.post('/api/scenes/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)
        self.assertEqual(urlparse(response.location).path, "/api/scenes/1")

        # Now try updating the scene
        updated_scene = {
            'id': 1,
            'name': 'Scene with New Name',
            'description': 'scene has new description',
        }
        response = self.test_client.put('/api/scenes/1', data=json.dumps(updated_scene));
        self.assertEqual(response.status_code, 201)

        response = self.test_client.get('/api/scenes/1')
        self.assertEqual(response.status_code, 200)

        scene = json.loads(response.get_data(as_text=True))
        self.assertEqual(scene, updated_scene)

    def test_delete_scene(self):
        """Test that scenes can be deleted"""

        # Add a new scene
        data = {
            'name': 'Scene 0',
            'description': 'first scene',
        }

        response = self.test_client.post('/api/scenes/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)
        self.assertEqual(urlparse(response.location).path, "/api/scenes/1")

        # Now try deleting the scene
        response = self.test_client.delete('/api/scenes/1')
        self.assertEqual(response.status_code, 204)

        # Check that it's gone
        response = self.test_client.get('/api/scenes/1')
        self.assertEqual(response.status_code, 404)


class ActionTest(Test):

    def test_new_action(self):
        """Test that actions can be added"""

        ast = {
            't': 'CompoundStatement',
            'statements': []
        }

        data = {
            'name': 'Action 1',
            'ast': ast,
        }
        response = self.test_client.post('/api/actions/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)

        response = self.test_client.get('/api/actions/')
        self.assertEqual(response.status_code, 200)

        actions = json.loads(response.get_data(as_text=True))

        expected = [
            {
                'id': 1,
                'name': 'Action 1',
                'ast': ast,
                'wants_entity_id': None,
            },
        ]
        self.assertEqual(actions, expected)

    def test_action_get_404(self):
        """Test get fails for unknown action id"""

        response = self.test_client.get('/api/actions/100')
        self.assertEqual(response.status_code, 404)

    def test_action_put_404(self):
        """Test put fails for unknown action id"""

        ast = {
            't': 'CompoundStatement',
            'statements': []
        }

        updated_action = {
            'id': 100,
            'name': 'Action with New Name',
            'act': ast,
        }
        response = self.test_client.put('/api/actions/100', data=json.dumps(updated_action));
        self.assertEqual(response.status_code, 404)

    def test_update_action(self):
        """Test that actions can be updated"""

        ast = {
            "t": "CompoundStatement",
            "statements": []
        }

        # Add a new action
        data = {
            'name': 'Action 1',
            'ast': ast,
        }
        response = self.test_client.post('/api/actions/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)
        self.assertEqual(urlparse(response.location).path, "/api/actions/1")

        # Now try updating the action
        updated_action = {
            'id': 1,
            'name': 'Action with New Name',
            'ast': ast,
            'wants_entity_id': None,
        }
        response = self.test_client.put('/api/actions/1', data=json.dumps(updated_action));
        self.assertEqual(response.status_code, 201)

        response = self.test_client.get('/api/actions/1')
        self.assertEqual(response.status_code, 200)

        action = json.loads(response.get_data(as_text=True))
        self.assertEqual(action, updated_action)

    def test_delete_action(self):
        """Test that actions can be deleted"""

        ast = {
            "t": "CompoundStatement",
            "statements": []
        }

        # Add a new action
        data = {
            'name': 'Action 1',
            'ast': ast
        }

        response = self.test_client.post('/api/actions/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)
        self.assertEqual(urlparse(response.location).path, "/api/actions/1")

        # Now try deleting the action
        response = self.test_client.delete('/api/actions/1')
        self.assertEqual(response.status_code, 204)

        # Check that it's gone
        response = self.test_client.get('/api/actions/1')
        self.assertEqual(response.status_code, 404)

class EntityTest(Test):

    def test_new_entity(self):
        """Test adding entities"""

        data = {
            'title': 'VE1',
            'description': 'virtual entity 1',
        }
        response = self.test_client.post('/api/entities/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)

        response = self.test_client.get('/api/entities/')
        self.assertEqual(response.status_code, 200)

        entities = json.loads(response.get_data(as_text=True))

        expected_entities = [
            {
                'id': 1,
                'type': 'virtual_entity',
                'parent_id': None,
                'properties': {},
                'title': 'VE1',
                'description': 'virtual entity 1',
                'instances': [],
                'children': [],
            },
        ]

        self.assertEqual(entities, expected_entities)

    def test_entity_get_404(self):
        """Test get fails for unknown entity id"""

        response = self.test_client.get('/api/entities/100')
        self.assertEqual(response.status_code, 404)

    def test_entity_put_404(self):
        """Test put fails for unknown entity id"""

        updated_entity = {
            'title': 'VE1',
            'description': 'virtual entity 1',
        }
        response = self.test_client.put('/api/entities/100', data=json.dumps(updated_entity));
        self.assertEqual(response.status_code, 404)

    def test_update_entity(self):
        """Test put entity"""

        data = {
            'title': 'VE1',
            'description': 'virtual entity 1',
        }
        response = self.test_client.post('/api/entities/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)

        updated_entity = {
            'title': 'new title',
            'description': 'new description',
            'properties': {},
        }
        response = self.test_client.put('/api/entities/1', data=json.dumps(updated_entity));
        self.assertEqual(response.status_code, 201)

        response = self.test_client.get('/api/entities/1')
        self.assertEqual(response.status_code, 200)

    def test_delete_entity(self):
        """Test that an entity can be deleted"""

        data = {
            'title': 'VE1',
            'description': 'virtual entity 1',
        }
        response = self.test_client.post('/api/entities/', data=json.dumps(data))
        self.assertEqual(response.status_code, 303)
        self.assertEqual(urlparse(response.location).path, "/api/entities/1")

        # Now try deleting the entity
        response = self.test_client.delete('/api/entities/1')
        self.assertEqual(response.status_code, 204)

        # Check that it's gone
        response = self.test_client.get('/api/entities/1')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
