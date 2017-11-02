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
	},

	mutations: {
		updateEntities(state, { entities }) {
			state.entities = entities;
		},

		setEntity(state, { entity }) {
			Vue.set(state.entities, entity.id, entity);
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
			return await api.newInstance(entityId);
		},
	},

	getters: {
		entityById: state => id => {
			return state.entities[id];
		},
	}
};

export default entityStore;
