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

const deviceStore = {
	state: {
		devices: {},
	},

	mutations: {
		updateDevices(state, { devices }) {
			state.devices = devices;
		},

		setDevice(state, { device }) {
			Vue.set(state.devices, device.id, device);
		},

		deleteDevice(state, { device }) {
			delete state.devices[device.id];
		},
	},

	actions: {
		async fetchDevices({ commit }) {
			const devices = await api.getDevices();

			const normalized_devices = {};
			for (let device of devices) {
				normalized_devices[device.id] = device;
			}

			commit('updateDevices', { devices: normalized_devices });
		},

		// TODO: debounce...
		updateDevice({ commit }, { device }) {
			commit('setDevice', { device })

			api.putDevice(device).catch(console.log)
		},

		async newDevice({ commit, dispatch }) {
			const device = await api.newDevice();

			device.description = `New Device ${device.id}`;
			dispatch('updateDevice', { device });

			return device;
		},

		async deleteDevice({ commit }, { device }) {
			api.deleteDevice(device).catch(console.log)

			commit('deleteDevice', { device })
		},
		async pingDevices({ commit }) {
            api.pingDevices().catch(console.log)

        },
	},

	getters: {
		deviceById: state => id => {
			return state.devices[id];
		},
	},
}
export default deviceStore;
