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
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import 'bootstrap';

import store from './store.js';

import App from './components/App.vue';
import Actions from './components/Actions.vue';
import Scenes from './components/Scenes.vue';
import Devices from './components/Devices.vue';
import DeviceEdit from './components/DeviceEdit.vue';
import Entities from './components/Entities.vue';
import EntityEdit from './components/EntityEdit.vue';
import InstanceEdit from './components/InstanceEdit.vue';
import SceneEdit from './components/SceneEdit.vue';
import EventEdit from './components/EventEdit.vue';

const routes = [
	{ path: '/', redirect: '/scenes' }, // default route
	{ path: '/actions', component: Actions },
	{
		path: '/actions/:id',
		name: 'actions',
		component: Actions,
		props: (route) => ({
			id: parseInt(route.params.id),
		}),
	},
	{
		path: '/scenes',
		component: Scenes,
		children: [
			{
				path: '/scenes/:id',
				name: 'scenes',
				component: SceneEdit,
				props: (route) => ({
					id: parseInt(route.params.id),
				}),
				children: [
					{
						path: '/scenes/:id/event/:eventId',
						name: 'events',
						component: EventEdit,
						props: (route) => ({
							eventId: parseInt(route.params.eventId),
						}),
					},
				],
			},
		],
	},
	{
		path: '/devices',
		component: Devices,
		children: [
			{
				path: '/devices/:id',
				name: 'devices',
				component: DeviceEdit,
				props: (route) => ({
					id: parseInt(route.params.id),
				}),
			},
		],
	},
	{
		path: '/entities',
		component: Entities,
		props: (route) => ({
			id: parseInt(route.params.id),
		}),
		children: [
			{
				path: '/entities/:id',
				name: 'entities',
				component: EntityEdit,
				props: (route) => ({
					id: parseInt(route.params.id),
				}),
			},
			{
				path: '/instances/:id',
				name: 'instance',
				component: InstanceEdit,
				props: (route) => ({
					id: parseInt(route.params.id),
				}),
			},
		],
	},
];

const router = new VueRouter({
	// mode: 'history',
	routes,
});

new Vue({
	el: '#app',
	router,
	store,
	render: createElement => createElement(App)
});
