/*
* Copyright (c) 2017 Ned Hoy <nedhoy@gmail.com>
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

// RESOURCE [mutations vs actions]: https://stackoverflow.com/questions/39299042/vuex-action-vs-mutations-edited-said-vuejs

const URL_BASE = '/api';

async function fetchJson(url) {
	try {
		const response = await fetch(url);
		return response.json();
	} catch (err) {
		console.error(err);

		throw new Error('bad response');
	}
}

export async function getActions() {
	const url = `${URL_BASE}/actions/`;

	return fetchJson(url);
}

export async function getEventActions() {
	const url = `${URL_BASE}/eventAction/`;
	
	const request = new Request(url, {
		method: 'GET',
	});
	const response = await fetchJson(request);
	console.log(response);
	return response;
}

export async function linkAction(eventId, actionId){
	const url = `${URL_BASE}/eventAction/`;
	const request = new Request(url, {
		method: 'POST',
		body: JSON.stringify({
			action_id: actionId,
			event_id: eventId,
		})
	});
	
	const response = await fetch(request);
	const response_location = new URL(response.url);
	// We have to make another request because we need the event id
	const get_response = await fetch(response_location.pathname);
	console.log(response_location.pathname)

	return get_response.json();
}

export async function unlinkAction(eventAction){
	const id = eventAction.id;
	const url = `${URL_BASE}/eventAction/${id}/`;
	
	const request = new Request(url, {
		method: 'DELETE',
	});

	return fetch(request);
}

export async function getAllEvents(){
	const url = `${URL_BASE}/events/`;
	return fetchJson(url);
}

export async function getEvents(scene_id){
	const url = `${URL_BASE}/events/${scene_id}/`;
	return fetchJson(url);
}

export async function putEvent(evt){
	const id = evt.id;
	const url = `${URL_BASE}/event/${id}/`;

	const request = new Request(url, {
		method: 'PUT',
		body: JSON.stringify(evt),
	});

	return fetch(request);
	
}

export async function newEvent(scene_id){
	const url = `${URL_BASE}/newEvent/${scene_id}/`;

	const request = new Request(url, {
		method: 'POST',
		body: JSON.stringify({
			name: null,
			type: null,
		})
	});

	const response = await fetch(request);
	const response_location = new URL(response.url);
	// We have to make another request because we need the event id
	const get_response = await fetch(response_location.pathname);
	console.log(response_location.pathname)

	return get_response.json();
}

export async function deleteEvent(evt){
	const id = evt.id;
	const url = `${URL_BASE}/event/${id}/`;
	
	const request = new Request(url, {
		method: 'DELETE',
	});

	return fetch(request);
}

export async function getDevices() {
	const url = `${URL_BASE}/devices/`;
	return fetchJson(url);
}

export async function getScenes() {
	const url = `${URL_BASE}/scenes/`;
	return fetchJson(url);
}

export async function pingDevices() {
	const url = `${URL_BASE}/devices/ping/`;
	return fetchJson(url);
}

export async function newDevice(device) {
	const url = `${URL_BASE}/devices/`;

	const request = new Request(url, {
		method: 'POST',
		body: JSON.stringify({
			ip: '10.10.10.' + Math.floor(Math.random() * 255), // FIXME: should specify before creating or allow null
		})
	});

	const response = await fetch(request);
	const response_location = new URL(response.url);

	// We have to make another request because we need the device id
	const get_response = await fetch(response_location.pathname);
	return get_response.json();
}

export async function newAction(scene) {
	const url = `${URL_BASE}/actions/`;

	const request = new Request(url, {
		method: 'POST',
		body: JSON.stringify({
			name: null,
			ast: {
				't': 'CompoundStatement',
				'statements': [],
			},
		})
	});

	const response = await fetch(request);
	const response_location = new URL(response.url);

	// We have to make another request because we need the action id
	const get_response = await fetch(response_location.pathname);
	return get_response.json();
}

export async function newScene(scene) {
	const url = `${URL_BASE}/scenes/`;

	const request = new Request(url, {
		method: 'POST',
		body: JSON.stringify({
			name: null,
			description: null,
		})
	});

	const response = await fetch(request);
	const response_location = new URL(response.url);

	// We have to make another request because we need the scene id
	const get_response = await fetch(response_location.pathname);
	return get_response.json();
}

export async function putAction(action) {
	const id = action.id;
	const url = `${URL_BASE}/actions/${id}`;

	const request = new Request(url, {
		method: 'PUT',
		body: JSON.stringify(action),
	});

	return fetch(request);
}

export async function putDevice(device) {
	const id = device.id;
	const url = `${URL_BASE}/devices/${id}`;

	const request = new Request(url, {
		method: 'PUT',
		body: JSON.stringify(device),
	});

	return fetch(request);
}

export async function putScene(scene) {
	const id = scene.id;
	const url = `${URL_BASE}/scenes/${id}`;

	const request = new Request(url, {
		method: 'PUT',
		body: JSON.stringify(scene),
	});

	return fetch(request);
}

export async function deleteAction(action) {
	const id = action.id;
	const url = `${URL_BASE}/actions/${id}`;

	const request = new Request(url, {
		method: 'DELETE',
	});

	return fetch(request);
}

export async function deleteDevice(device) {
	const id = device.id;
	const url = `${URL_BASE}/devices/${id}`;

	const request = new Request(url, {
		method: 'DELETE',
	});

	return fetch(request);
}

export async function deleteScene(scene) {
	const id = scene.id;
	const url = `${URL_BASE}/scenes/${id}`;

	const request = new Request(url, {
		method: 'DELETE',
	});

	return fetch(request);
}


export async function getEntities() {
	const url = `${URL_BASE}/entities/`;
	return fetchJson(url);
}

export async function newEntity(entity) {
	const url = `${URL_BASE}/entities/`;

	const request = new Request(url, {
		method: 'POST',
		body: JSON.stringify({
			title: '', // FIXME
		})
	});

	const response = await fetch(request);
	const response_location = new URL(response.url);

	// We have to make another request because we need the entity id
	const get_response = await fetch(response_location.pathname);
	return get_response.json();
}

export async function putEntity(entity) {
	const id = entity.id;
	const url = `${URL_BASE}/entities/${id}`;

	const request = new Request(url, {
		method: 'PUT',
		body: JSON.stringify(entity),
	});

	return fetch(request);
}

export async function deleteEntity(entity) {
	const id = entity.id;
	const url = `${URL_BASE}/entities/${id}`;

	const request = new Request(url, {
		method: 'DELETE',
	});

	return fetch(request);
}

export async function getInstances() {
	const url = `${URL_BASE}/instances/`;

	return fetchJson(url);
}

export async function newInstance(entityId) {
    const url = `${URL_BASE}/instances/`;

	const request = new Request(url, {
		method: 'POST',
		body: JSON.stringify({
			virtual_entity_id: entityId
		})
	});

	const response = await fetch(request);
	const response_location = new URL(response.url);

	// We have to make another request because we need the entity id
	const get_response = await fetch(response_location.pathname);

	return get_response.json();
}

export async function putInstance(instance) {
	const id = instance.id;
	const url = `${URL_BASE}/instances/${id}`;

	const request = new Request(url, {
		method: 'PUT',
		body: JSON.stringify(instance),
	});

	return fetch(request);
}
