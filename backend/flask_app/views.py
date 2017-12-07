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

import flask
import json
import requests

from . import data_access
from . import app
from . import model


@app.route('/')
def index():
    return app.send_static_file('app.html')


@app.route('/api/devices/', methods=['GET', 'POST'])
def api_devices():
    if flask.request.method == 'GET':
        db = data_access.Database()
        devices = db.get_all_devices()

        serialisable_devices = []
        for device in devices:
            serialisable_devices.append({
                'id': device.id,
                'model_id': device.model_id,
                'ip': device.ip,
                'purpose': device.purpose,
            })

        return flask.jsonify(serialisable_devices)

    elif flask.request.method == 'POST':
        new_device = json.loads(flask.request.get_data(as_text=True))

        id = new_device.get('id')

        # model_id = 1 # FIXME
        model_id = new_device.get('model_id')
        # if model_id is None:
        #     flask.abort(400)

        ip = new_device.get('ip')
        if ip is None:
            flask.abort(400)

        purpose = new_device.get('purpose')
        # if purpose is None:
        #     flask.abort(400)

        device = model.PhysicalDevice(
            id=id,
            model_id=model_id,
            ip=ip,
            purpose=purpose,
        )

        db = data_access.Database()

        # check for existing device
        existingDevice = db.get_device_by_id(id)
        if existingDevice is not None:
            # If device exists update the ip
            existingDevice.ip = ip
            db.commit()
            return '', 200

        db.add_device(device)

        # FIXME: don't assume what outputs the device has, device should tell us.
        device_output = model.DeviceOutput(
            device_id=device.id,
            type=model.OutputTypes.Text2Speech,
        )
        db.add_output(device_output)

        return flask.redirect(flask.url_for('api_device_by_id', device_id=device.id), code=303)


@app.route('/api/devices/ping/', methods=['GET'])
def api_ping_devices():
    if flask.request.method == 'GET':
        print('here we ping')

        requests.post('http://192.168.0.101:8080', data={'key': 'This is what I want you to say'})

        return '', 200


@app.route('/api/devices/<int:device_id>', methods=['GET', 'PUT', 'DELETE'])
def api_device_by_id(device_id):
    if flask.request.method == 'GET':
        db = data_access.Database()

        device = db.get_device_by_id(device_id)
        if device is None:
            flask.abort(404)

        serialisable_device = {
            'id': device.id,
            'model_id': device.model_id,
            'ip': device.ip,
            'purpose': device.purpose,
        }

        return flask.jsonify(serialisable_device)

    elif flask.request.method == 'PUT':
        db = data_access.Database()

        device = db.get_device_by_id(device_id)
        if device is None:
            flask.abort(404)

        updated_device = json.loads(flask.request.get_data(as_text=True))

        model_id = updated_device.get('model_id')
        # if model_id is None:
        #     flask.abort(400)

        ip = updated_device.get('ip')
        if ip is None:
            flask.abort(400)

        purpose = updated_device.get('purpose')
        if purpose is None:
            flask.abort(400)

        # Note: we don't want to be able to change the device ID
        # device.id = device_id
        device.model_id = model_id
        device.ip = ip
        device.purpose = purpose

        db.commit()

        return '', 201

    elif flask.request.method == 'DELETE':
        db = data_access.Database()
        device = db.get_device_by_id(device_id)
        if device is None:
            flask.abort(404)

        db = data_access.Database()
        db.delete_device(device)

        return '', 204


@app.route('/api/virtual-outputs/', methods=['GET', 'POST'])
def api_virtual_outputs():
    if flask.request.method == 'GET':
        db = data_access.Database()
        virtual_outputs = db.get_all_virtual_outputs()

        serialisable_virtual_outputs = []
        for virtual_output in virtual_outputs:
            serialisable_virtual_outputs.append({
                'id': virtual_output.id,
                'name': virtual_output.name,
                'device_output_id': virtual_output.device_output_id,
            })

        return flask.jsonify(serialisable_virtual_outputs)

    elif flask.request.method == 'POST':
        new_virtual_output = json.loads(flask.request.get_data(as_text=True))

        name = new_virtual_output.get('name')
        if name is None:
            flask.abort(400)

        device_output_id = new_virtual_output.get('device_output_id')

        if device_output_id is not None:
            device_output = db.get_output_by_id(device_output_id)
            if device_output is None:
                flask.abort(400)
        else:
            device_output = None

        virtual_output = model.VirtualOutput(name=name, device_output=device_output)

        db = data_access.Database()
        db.add_virtual_output(virtual_output)

        return flask.redirect(flask.url_for('api_virtual_output_by_id', virtual_output_id=virtual_output.id), code=303)


@app.route('/api/virtual-outputs/<int:virtual_output_id>', methods=['GET', 'PUT', 'DELETE'])
def api_virtual_output_by_id(virtual_output_id):
    if flask.request.method == 'GET':
        db = data_access.Database()
        virtual_output = db.get_virtual_output_by_id(virtual_output_id)
        if virtual_output is None:
            flask.abort(404)

        serialisable_virtual_output = {
            'id': virtual_output.id,
            'name': virtual_output.name,
            'device_output_id': virtual_output.device_output_id,
        }

        return flask.jsonify(serialisable_virtual_output)

    elif flask.request.method == 'PUT':
        db = data_access.Database()
        virtual_output = db.get_virtual_output_by_id(virtual_output_id)
        if virtual_output is None:
            flask.abort(404)

        updated_virtual_output = json.loads(flask.request.get_data(as_text=True))

        name = updated_virtual_output.get('name')
        device_output_id = updated_virtual_output.get('device_output_id')

        if device_output_id is not None:
            device_output = db.get_output_by_id(device_output_id)
            if device_output is None:
                flask.abort(400)
        else:
            device_output = None

        virtual_output.name = name
        virtual_output.device_output = device_output
        db.commit()

        return '', 201

    elif flask.request.method == 'DELETE':
        db = data_access.Database()
        virtual_output = db.get_virtual_output_by_id(virtual_output_id)
        if virtual_output is None:
            flask.abort(404)

        db = data_access.Database()
        db.delete_virtual_output(virtual_output)

        return '', 204


@app.route('/api/scenes/', methods=['GET', 'POST'])
def api_scenes():
    if flask.request.method == 'GET':
        db = data_access.Database()
        scenes = db.get_all_scenes()

        serialisable_scenes = []
        for scene in scenes:
            serialisable_scenes.append({
                'id': scene.id,
                'name': scene.name,
                'description': scene.description,
            })

        return flask.jsonify(serialisable_scenes)

    elif flask.request.method == 'POST':
        new_scene = json.loads(flask.request.get_data(as_text=True))

        scene_name = new_scene.get('name')
        # if scene_name is None:
        #     flask.abort(400)

        scene_description = new_scene.get('description')
        # if scene_description is None:
        #     flask.abort(400)

        scene = model.Scene(name=scene_name, description=scene_description)

        db = data_access.Database()
        db.add_scene(scene)

        return flask.redirect(flask.url_for('api_scene_by_id', scene_id=scene.id), code=303)


@app.route('/api/scenes/<int:scene_id>', methods=['GET', 'PUT', 'DELETE'])
def api_scene_by_id(scene_id):
    if flask.request.method == 'GET':
        db = data_access.Database()
        scene = db.get_scene_by_id(scene_id)
        if scene is None:
            flask.abort(404)

        serialisable_scene = {
            'id': scene.id,
            'name': scene.name,
            'description': scene.description,
        }

        return flask.jsonify(serialisable_scene)

    elif flask.request.method == 'PUT':
        db = data_access.Database()
        scene = db.get_scene_by_id(scene_id)
        if scene is None:
            flask.abort(404)

        updated_scene = json.loads(flask.request.get_data(as_text=True))

        scene_name = updated_scene.get('name')
        # if scene_name is None:
        #     flask.abort(400)

        scene_description = updated_scene.get('description')
        # if scene_description is None:
        #     flask.abort(400)

        scene.name = scene_name
        scene.description = scene_description
        db.commit()

        return '', 201

    elif flask.request.method == 'DELETE':
        db = data_access.Database()
        scene = db.get_scene_by_id(scene_id)
        if scene is None:
            flask.abort(404)

        db = data_access.Database()
        db.delete_scene(scene)

        return '', 204


@app.route('/api/actions/', methods=['GET', 'POST'])
def api_actions():
    if flask.request.method == 'GET':
        db = data_access.Database()
        actions = db.get_all_actions()

        serialisable_actions = []
        for action in actions:
            ast = json.loads(action.ast)
            serialisable_actions.append({
                'id': action.id,
                'name': action.name,
                'ast': ast,
                'wants_entity_id': action.wants_entity_id,
            })

        return flask.jsonify(serialisable_actions)

    elif flask.request.method == 'POST':
        new_action = json.loads(flask.request.get_data(as_text=True))

        action_name = new_action.get('name')
        # if action_name is None:
        #     flask.abort(400)

        action_ast = new_action.get('ast')
        if action_ast is None:
            flask.abort(400)

        action_wants_entity_id = new_action.get('wants_entity_id')

        if action_wants_entity_id is not None:
            db = data_access.Database()
            entity = db.get_virtual_entity_by_id(action_wants_entity_id)
            if entity is None:
                flask.abort(400)
        else:
            entity = None

        action = model.Action(
            name=action_name,
            ast=json.dumps(action_ast),
            wants_entity=entity,
        )

        db = data_access.Database()
        db.add_action(action)

        return flask.redirect(flask.url_for('api_action_by_id', action_id=action.id), code=303)


@app.route('/api/actions/<int:action_id>', methods=['GET', 'PUT', 'DELETE'])
def api_action_by_id(action_id):
    if flask.request.method == 'GET':
        db = data_access.Database()
        action = db.get_action_by_id(action_id)
        if action is None:
            flask.abort(404)

        ast = json.loads(action.ast)
        serialisable_action = {
            'id': action.id,
            'name': action.name,
            'ast': ast,
            'wants_entity_id': action.wants_entity_id,
        }

        return flask.jsonify(serialisable_action)

    elif flask.request.method == 'PUT':
        db = data_access.Database()
        action = db.get_action_by_id(action_id)
        if action is None:
            flask.abort(404)

        updated_action = json.loads(flask.request.get_data(as_text=True))

        action_name = updated_action.get('name')
        if action_name is None:
            flask.abort(400)

        action_ast = updated_action.get('ast')
        if action_ast is None:
            flask.abort(400)

        action_wants_entity_id = updated_action.get('wants_entity_id')
        if action_wants_entity_id is not None:
            entity = db.get_virtual_entity_by_id(action_wants_entity_id)
            if entity is None:
                flask.abort(400)
        else:
            entity = None

        action.name = action_name
        action.ast = json.dumps(action_ast)
        action.wants_entity = entity
        db.commit()

        return '', 201

    elif flask.request.method == 'DELETE':
        db = data_access.Database()
        action = db.get_action_by_id(action_id)
        if action is None:
            flask.abort(404)

        db = data_access.Database()
        db.delete_action(action)

        return '', 204


@app.route('/api/entities/', methods=['GET', 'POST'])
def api_entities():
    if flask.request.method == 'GET':
        db = data_access.Database()
        entities = db.get_all_virtual_entities()

        serialisable_entities = []

        for entity in entities:
            serialisable_entities.append(entity.to_complete_dictionary())

        return flask.jsonify(serialisable_entities)

    elif flask.request.method == 'POST':
        new_entity = json.loads(flask.request.get_data(as_text=True))

        title = new_entity.get('title')

        # TODO: Fix me.
        # if title is None:
        #     flask.abort(400)

        # Can be None.
        parent_id = new_entity.get('parent_id')

        description = new_entity.get('description')

        entity = model.VirtualEntity(
            title=title,
            parent_id=parent_id,
            description=description,
        )

        db = data_access.Database()
        db.add_virtual_entity(entity)

        return flask.redirect(flask.url_for('api_entity_by_id', entity_id=entity.id), code=303)


@app.route('/api/entities/<int:entity_id>', methods=['GET', 'PUT', 'DELETE'])
def api_entity_by_id(entity_id):
    if flask.request.method == 'GET':
        db = data_access.Database()

        entity = db.get_virtual_entity_by_id(entity_id)

        if entity is None:
            flask.abort(404)

        serialisable_entity = entity.to_complete_dictionary()

        return flask.jsonify(serialisable_entity)

    elif flask.request.method == 'PUT':
        # VE Update: title, description and properties.
        db = data_access.Database()

        entity = db.get_virtual_entity_by_id(entity_id)

        # Entity no longer exists (may have been deleted).
        if entity is None:
            flask.abort(404)

        json_update = json.loads(flask.request.get_data(as_text=True))

        # TODO: Reflect (new) frontend functionality which modifies an entity's hierarchy, i.e., changes to parent_id.

        title = json_update.get('title')

        if title is None:
            flask.abort(400)

        title = json_update.get('title')
        description = json_update.get('description')
        properties = json_update.get('properties')

        entity.title = title
        entity.description = description
        # Convert properties to SchemaProperties.
        entity.properties = model.VirtualEntity.generate_property_dictionary(properties)

        # TODO: Handle InvalidRequestError which will arise if no changes have been made (unlikely but it could happen via conccurrency?)
        # More info: http://docs.sqlalchemy.org/en/latest/orm/session_api.html#sqlalchemy.orm.session.Session.commit

        # Auto json_schema conversion occurs on update and insert.
        db.commit()

        return '', 201

    elif flask.request.method == 'DELETE':
        db = data_access.Database()
        entity = db.get_virtual_entity_by_id(entity_id)
        if entity is None:
            flask.abort(404)

        db = data_access.Database()
        db.delete_virtual_entity(entity)

        return '', 204


@app.route('/api/instances/', methods=['GET', 'POST'])
def api_instances():
    if flask.request.method == 'GET':
        db = data_access.Database()
        instances = db.get_all_instances()

        serialisable_instances = []
        for instance in instances:
            serialisable_instances.append(instance.to_dictionary())

        return flask.jsonify(serialisable_instances)

    elif flask.request.method == 'POST':
        new_instance = json.loads(flask.request.get_data(as_text=True))

        virtual_entity_id = new_instance.get('virtual_entity_id')

        # Need a parent (VE).
        if virtual_entity_id is None:
            flask.abort(400)

        # TODO@s344878: Type check.
        print("IE ID TYPE: {}\n".format(type(virtual_entity_id)))

        # TODO: Add tag?

        db = data_access.Database()

        # NOTE: This extra step could be avoided by changing IE constructor.
        virtual_entity = db.get_virtual_entity(virtual_entity_id)

        # Need a parent (VE).
        if virtual_entity is None:
            flask.abort(400)

        instance = model.InstanceEntity(virtual_entity)

        db.add_instance_entity(instance)

        return flask.redirect(flask.url_for('api_instance_by_id', instance_id=instance.id), code=303)


@app.route('/api/instances/<int:instance_id>', methods=['GET', 'PUT', 'DELETE'])
def api_instance_by_id(instance_id):
    if flask.request.method == 'GET':
        db = data_access.Database()

        instance = db.get_instance_entity(instance_id)

        if instance is None:
            flask.abort(404)

        serialisable_instance = instance.to_dictionary()

        return flask.jsonify(serialisable_instance)

    elif flask.request.method == 'PUT':
        db = data_access.Database()

        instance = db.get_instance_entity(instance_id)
        if instance is None:
            flask.abort(404)

        updated_instance = json.loads(flask.request.get_data(as_text=True))

        instance_tag = updated_instance.get('tag')

        instance_properties = updated_instance.get('properties')

        instance.tag = instance_tag
        for name, value in instance_properties.items():
            try:
                instance.set_property_value(name, value)
            except Exception:
                flask.abort(400)

        db.commit()

        return '', 201

    elif flask.request.method == 'DELETE':
        pass


@app.route('/api/tags/log/', methods=['POST'])
def api_tags():
    if flask.request.method == 'POST':
        message = json.loads(flask.request.get_data(as_text=True))
        print(message)

        device_id = message.get('id')
        if device_id is None:
            flask.abort(400)
        device_id = int(device_id) # FIXME: should be sent as an int

        tag_id = message.get('tag_id')
        if tag_id is None:
            flask.abort(400)

        # FIXME: should be done concurrently and return straight away
        #       to avoid delay and also to avoid any errors that occur causing
        #       a 500 to be sent back if the action raises an error, as the
        #       device shouldn't know or care about that.
        execute_actions(device_id=device_id, tag_id=tag_id)

        print('done')

        return '', 200


def execute_actions(device_id, tag_id):
    print("execute_actions(device_id={}, tag_id={})".format(device_id, tag_id))

    db = data_access.Database()
    event = db.get_event_by_device(device_id)
    if event is None:
        raise ValueError("No event found for device id", device_id)

    print("event", event)
    event_actions = db.get_actions_per_event(event.id)
    print("event_actions", event_actions)

    # TODO: Errors in one action shouldn't prevent the other from running, so
    # catch and print/log any errors but continue executing the next actions.
    for event_action in event_actions:
        action = db.get_action_by_id(event_action.action_id)
        print("Retrieved action", action)
        try:
            execute_action(action, tag_id)
        except ValueError as e:
            print("Error while executing action:", e)


def execute_action(action, tag_id):
    json_str = action.ast

    from .actions.executor import Executor
    from .actions import parser

    # Convert to AST from JSON string
    print("Parsing...")
    root = json.loads(json_str)
    node = parser.from_json(root)

    # Find the entity instance associated with the tag id
    db = data_access.Database()
    instance = db.get_instance_entity_by_tag(tag=tag_id)
    if instance is None:
        raise ValueError("Couldn't find instance with tag '{}'".format(tag_id))
    if instance.virtual_entity != action.wants_entity:
        raise ValueError("Action wants entity of type '{}' but instance is of type '{}'".format(action.wants_entity.title, instance.virtual_entity.title))

    # FIXME: inserting an extra node here isn't very nice.
    #        We need a better way to pass the input in.
    from .actions import nodes
    node.statements.insert(
        0,
        nodes.AssignmentStatement(
            name="__INPUT__",
            rvalue=nodes.StringLiteral(value=str(instance.id)),
        )
    )

    # Execute
    print("Executing...")
    executor = Executor(db=db)
    executor.visit_statement(node)


@app.route('/api/events/<int:scene_id>', methods=['GET'])
def events_by_scene_id(scene_id):
    if flask.request.method == 'GET':
        db = data_access.Database()
        events = db.get_events_by_scene(scene_id)

        serialisable_events = []
        for event in events:
            t = event.type
            if t is not None:
                t = event.type.value
            serialisable_events.append({
                'id': event.id,
                'scene_id': event.scene_id,
                'name': event.name,
                'type': t,
                'time': event.time,
                'device_id': event.device_id,
            })
        return flask.jsonify(serialisable_events)


@app.route('/api/events/', methods=['GET'])
def all_events():
    if flask.request.method == 'GET':
        db = data_access.Database()
        events = db.get_all_events()

        serialisable_events = []
        for event in events:
            t = event.type
            if t is not None:
                t = event.type.value
            serialisable_events.append({
                'id': event.id,
                'scene_id': event.scene_id,
                'name': event.name,
                'type': t,
                'time': event.time,
                'device_id': event.device_id,
            })

        return flask.jsonify(serialisable_events)


@app.route('/api/event/<int:event_id>/', methods=['PUT', 'GET', 'DELETE'])
def event_by_id(event_id):
    if flask.request.method == 'GET':
        db = data_access.Database()

        event = db.get_event_by_id(event_id)
        if event is None:
            flask.abort(404)
        t = event.type
        if t is not None:
            t = event.type.value
        serialisable_event = {
            'id': event.id,
            'scene_id': event.scene_id,
            'name': event.name,
            'type': t,
            'time': event.time,
            'device_id': event.device_id,
        }

        return flask.jsonify(serialisable_event)

    elif flask.request.method == 'PUT':
        db = data_access.Database()
        event = db.get_event_by_id(event_id)
        if event is None:
            flask.abort(404)

        updated_event = json.loads(flask.request.get_data(as_text=True))

        event_name = updated_event.get('name')
        if event_name is None:
            flask.abort(400)
        event_type = updated_event.get('type')
        event_time = updated_event.get('time')
        event_device = updated_event.get('device_id')

        event.name = event_name
        print(event_type)
        if (event_type == "Time"):
            event.type = model.EventTypes.time
        elif(event_type == "Scan"):
            event.type = model.EventTypes.scan
        event.time = event_time
        if (event_device is not None):
            event.device_id = int(event_device)

        db.commit()

        return '', 201

    elif flask.request.method == 'DELETE':
        db = data_access.Database()
        event = db.get_event_by_id(event_id)
        if event is None:
            flask.abort(404)

        db.delete_event(event)

        return '', 204


@app.route('/api/newEvent/<int:scene_id>/', methods=['GET', 'POST'])
def newEvent(scene_id):
    if flask.request.method == 'GET':
        db = data_access.Database()
        events = db.get_all_events()

        serialisable_events = []
        for event in events:
            t = event.type
            if t is not None:
                t = event.type.value
            serialisable_events.append({
                'id': event.id,
                'scene_id': event.scene_id,
                'name': event.name,
                'type': t,
                'time': event.time,
                'device_id': event.device_id,
            })

        return flask.jsonify(serialisable_events)

    elif flask.request.method == 'POST':
        db = data_access.Database()
        event = model.Event(scene_id=scene_id, name='new event')
        db.add_event(event)

        return flask.redirect(flask.url_for('event_by_id', event_id=event.id), code=303)


@app.route('/api/eventAction/', methods=['POST', 'GET'])
def linkAction():
    if flask.request.method == 'POST':
        link = json.loads(flask.request.get_data(as_text=True))
        db = data_access.Database()

        action_id = link.get('action_id')
        print("actionid")
        print(action_id)
        if action_id is None:
            flask.abort(400)

        event_id = link.get('event_id')
        print("eventid")
        print(event_id)
        if event_id is None:
            flask.abort(400)

        eventAction = model.EventActions(event_id=event_id, action_id=action_id)

        db = data_access.Database()
        db.add_event_action(eventAction)

        return flask.redirect(flask.url_for('eventAction', eventAction_id=eventAction.id), code=303)

    elif flask.request.method == 'GET':
        db = data_access.Database()
        eventActions = db.get_all_event_actions()
        serialisable_eventActions = []
        for eventAction in eventActions:
            serialisable_eventActions.append({
                'id': eventAction.id,
                'event_id': eventAction.event_id,
                'action_id': eventAction.action_id,
            })
        return flask.jsonify(serialisable_eventActions)


@app.route('/api/eventAction/<int:eventAction_id>/', methods=['GET', 'DELETE'])
def eventAction(eventAction_id):
    if flask.request.method == 'GET':
        db = data_access.Database()

        eventAction = db.get_event_action_by_id(eventAction_id)
        if eventAction is None:
            flask.abort(404)

        serialisable_eventAction = {
            'id': eventAction.id,
            'event_id': eventAction.event_id,
            'action_id': eventAction.action_id,
        }

        return flask.jsonify(serialisable_eventAction)

    elif flask.request.method == 'DELETE':
        db = data_access.Database()
        eventAction = db.get_event_action_by_id(eventAction_id)
        if eventAction is None:
            flask.abort(404)

        db.delete_event_action(eventAction)

        return '', 204
