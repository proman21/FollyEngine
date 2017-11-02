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

const eventActionStore = {
	state: {
		eventActions: {},
	},
	
	mutations: {
		
		updateEventActions(state, { eventActions }){
			state.eventActions = eventActions;
		},
		
		linkAction(state, {eventAction}){
			Vue.set(state.eventActions, eventAction.id, eventAction);

		},
		
		unlinkAction(state, {eventAction}){
			Vue.delete(state.eventActions, eventAction.id);
		},
	},
	
	actions: {
		fetchEventActions({commit}) {
			api.getEventActions().then(eventActions => {
				const normalized_eventActions = {};
				console.log("eventActions");
				console.log(eventActions);
				for (let eventAction of eventActions){
					normalized_eventActions[eventAction.id] = eventAction;
				}
				console.log("eventActions");
				console.log(normalized_eventActions);
				commit('updateEventActions', {eventActions: normalized_eventActions});
			})
			.catch(err => {
				console.log(err);
			});
		},
		
		
		async linkAction({ commit, dispatch }, {eventId, actionId}){
			const eventAction = await api.linkAction(eventId, actionId);
			commit('linkAction', { eventAction } );
		},
		
		async unlinkAction({ commit }, { eventAction }){
			await api.unlinkAction(eventAction).catch(console.log);
			commit('unlinkAction', { eventAction })
		},
	},
	
	getters: {
		getEventAction: state => (eventId, actionId) => {
			const eventActions = state.eventActions;
			var eventAction = {};
			console.log(eventId);
			console.log(actionId);
			for (let e in eventActions){
				if (eventActions[e].event_id == eventId && eventActions[e].action_id == actionId){
					eventAction = eventActions[e];
				}
			}
			console.log(eventAction);
			return eventAction;
		}
	},
}
export default eventActionStore;