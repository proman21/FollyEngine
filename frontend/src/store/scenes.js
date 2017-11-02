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

const sceneStore = {
	state: {
		scenes: {},
	},

	mutations: {
		updateScenes(state, { scenes }) {
			state.scenes = scenes;
		},

		setScene(state, { scene }) {
			Vue.set(state.scenes, scene.id, scene);
		},

		deleteScene(state, { scene }) {
			delete state.scenes[scene.id];
		},
	},

	actions: {
		async fetchScenes({ commit }) {
			const scenes = await api.getScenes();

			const normalized_scenes = {};
			for (let scene of scenes) {
				normalized_scenes[scene.id] = scene;
			}

			commit('updateScenes', { scenes: normalized_scenes });
		},

		updateScene({ commit }, { scene }) {
			commit('setScene', { scene })

			api.putScene(scene).catch(console.log)
		},

		async newScene({ commit, dispatch }) {
			const scene = await api.newScene();

			scene.name = `New Scene ${scene.id}`;
			dispatch('updateScene', { scene });

			return scene;
		},

		async deleteScene({ commit }, { scene }) {
			api.deleteScene(scene).catch(console.log)

			commit('deleteScene', { scene })
		},
	},

	getters: {
		sceneById: state => id => {
			return state.scenes[id];
		},
	},
}
export default sceneStore;
