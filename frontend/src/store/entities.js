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

import Vue from 'vue';

import * as api from '../api.js';

const entityStore = {
	state: {
		entities: {},
		instances: {},
	},

	mutations: {
		updateEntities(state, { entities }) {
			state.entities = entities;
		},

		setEntity(state, { entity }) {
			Vue.set(state.entities, entity.id, entity);
		},

		updateInstances(state, { instances }) {
			state.instances = instances;
		},

		setInstance(state, { instance }) {
			const entity_id = instance.virtual_entity_id;

			// FIXME: this works but it's a bit ugly because we need to update
			// a deeply nested object. Normalizing the data would help.
			const entity = state.entities[entity_id];
			const newInstances = Object.assign({}, entity.instances, { [instance.id]: instance });
			const newEntity = Object.assign({}, entity, { instances: newInstances });

			// Update parent entity's instance record
			Vue.set(state.entities, entity_id, newEntity);

			// Update instances
			Vue.set(state.instances, instance.id, instance);
		},

		deleteEntity(state, { entity }) {
			delete state.entities[entity.id];
		},
	},

	actions: {
		async fetchEntities({ commit }) {
			const entities = await api.getEntities();

			const normalized_entities = {};
			for (let entity of entities) {
				normalized_entities[entity.id] = entity;
			}

			commit('updateEntities', { entities: normalized_entities });
		},

		async fetchInstances({ commit }) {
			const instances = await api.getInstances();

			const normalized_instances = {};
			for (let instance of instances) {
				normalized_instances[instance.id] = instance;
			}

			commit('updateInstances', { instances: normalized_instances });
		},

		// NOTE: Out of curiosity, why not asynchronous?
		updateEntity({ commit }, { entity }) {
			commit('setEntity', { entity })

            //console.log(JSON.stringify(entity));

			api.putEntity(entity).catch(console.log);
		},

		async newEntity({ commit, dispatch }) {
			const entity = await api.newEntity();

			entity.title = `New Entity ${entity.id}`;
			dispatch('updateEntity', { entity });

			return entity;
		},

		async deleteEntity({ commit }, { entity }) {
			api.deleteEntity(entity).catch(console.log)

			commit('deleteEntity', { entity })
		},

		async newInstance({ commit, dispatch }, { entityId }) {
			const instance = await api.newInstance(entityId);

			commit('setInstance', { instance });

			return instance;
		},

		async updateInstance({ commit }, { instance }) {
			commit('setInstance', { instance });

			await api.putInstance(instance);
		},
	},

	getters: {
		entityById: state => id => {
			return state.entities[id];
		},

		instanceById: state => id => {
			return state.instances[id];
		},
	}
};

export default entityStore;
