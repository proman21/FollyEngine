/*
* Copyright (c) 2017 Llewellyn Roydhouse <lroyd16@gmail.com>
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

const eventStore = {
	state: {
		events: {},
	},
	
	mutations: {
		updateEvents(state, { events }){
			state.events = events;
		},
		
		addEvent(state, { evt }) {
			Vue.set(state.events, evt.id, evt);
		},
		
		updateEvent(state, {evt}){
			console.log("evt");
			console.log(evt);
			console.log(state.events);
			state.events[evt.id] = evt;
		},
		
		deleteEvent(state, {evt}){
			delete state.events[evt.id];
		},
		
	},
	
	actions: {
		fetchEvents({commit}) {
			api.getAllEvents().then(events => {
				const normalized_events = {};
				for (let evt of events){
					normalized_events[evt.id] = evt;
				}
				commit('updateEvents', {events: normalized_events});
			})
			.catch(err => {
				console.log(err);
			});
		},
		
		updateEvent({ commit }, { evt }) {
			commit('updateEvent', { evt })
			api.putEvent(evt).catch(console.log)
		},
		
		async newEvent({ commit, dispatch }, {sceneId}){
			const evt = await api.newEvent(sceneId);
			commit('addEvent', { evt } );
			console.log(evt);
			evt.name= 'New Event';
			dispatch('updateEvent', { evt });
			
			return evt;
		},
		
		async deleteEvent({ commit }, { evt }){
			api.deleteEvent(evt).catch(console.log)
			
			commit('deleteEvent', { evt })
		},
	},
	
	getters: {
		eventById: state => eventId => {
			return state.events[eventId];
		},
	},
}
export default eventStore;
		