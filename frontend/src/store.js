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
import Vuex from 'vuex';
Vue.use(Vuex);
import createLogger from 'vuex/dist/logger'; // for debugging

import actionStore from './store/actions.js';
import deviceStore from './store/devices.js';
import sceneStore from './store/scenes.js';
import entityStore from './store/entities.js';
import eventStore from './store/events.js';
import eventActionStore from './store/eventActions.js';

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',

	plugins: [
		createLogger(),
	],

	modules: {
		actions: actionStore,
		devices: deviceStore,
		scenes: sceneStore,
		entities: entityStore,
		events: eventStore,
		eventActions: eventActionStore,
	},

	/*
	 * State tree
	 */
	state: {
	},

	/*
	 * Simple changes
	 */
	mutations: {
	},

	/*
	 * Async changes
	 */
	actions: {
	},

	/*
	 * Getters
	 */
	getters: {
	},
})
export default store;
