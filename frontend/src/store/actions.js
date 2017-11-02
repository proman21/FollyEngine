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

const actionStore = {
	state: {
		actions: {},
	},

	mutations: {
		updateActions(state, { actions }) {
			state.actions = actions;
		},

		setAction(state, { action }) {
			console.log("actions");
			console.log(state.actions);
			Vue.set(state.actions, action.id, action);
		},

		deleteAction(state, { action }) {
			delete state.actions[action.id];
		},
	},

	actions: {
		async fetchActions({ commit }) {
			const actions = await api.getActions();

			const normalized_actions = {};
			for (let action of actions) {
				normalized_actions[action.id] = action;
			}

			commit('updateActions', { actions: normalized_actions });
		},

		updateAction({ commit }, { action }) {
			commit('setAction', { action })

			api.putAction(action).catch(console.log)
		},

		async newAction({ commit, dispatch }) {
			const action = await api.newAction();

			action.name = `New Action ${action.id}`;
			dispatch('updateAction', { action });

			return action;
		},

		async deleteAction({ commit }, { action }) {
			await api.deleteAction(action);

			commit('deleteAction', { action })
		},
	},

	getters: {
		actionById: state => id => {
			return state.actions[id];
		},
	},
}
export default actionStore;
