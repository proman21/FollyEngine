<!--
-- Copyright (c) 2017 Llewellyn Roydhouse <lroyd16@gmail.com>
-- 
-- Permission is hereby granted, free of charge, to any person obtaining a copy
-- of this software and associated documentation files (the "Software"), to deal
-- in the Software without restriction, including without limitation the rights
-- to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
-- copies of the Software, and to permit persons to whom the Software is
-- furnished to do so, subject to the following conditions:
-- 
-- The above copyright notice and this permission notice shall be included in all
-- copies or substantial portions of the Software.
-- 
-- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
-- IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
-- FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
-- AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
-- LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
-- OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
-- SOFTWARE.
-->


<template>
	<div>
		<div v-if="loading">
			Loading...
		</div>

		<div v-else>
			<h3>Event Editor for {{ evt.name }}</h3>
			<div class="row infopanel">
				<div class="col-md-6">
					<label for="id">Id</label>
					<div class="textbox">
						<input name="id" type="text" v-bind:value="evt.id" disabled>
					</div>
				</div>
			</div>
			<div class="row infopanel">
				<div class="col-md-6">
					<label for="name">Name</label>
					<div class="textbox">
						<input name="name" type="text" v-model="name">
					</div>
				</div>
			</div>

			<div class="row infopanel">
				<div class="col-md-6">

					<label for="AvailableActions">Type of Event</label>
					<div class="textbox">
						<select name="availableActions" id="actiondrop1" v-model="type">
							<option value="Time">Time</option>
							<option value="Scan">Scanner</option>
						</select>
					</div>
				</div>
			</div>

			<div class="row infopanel">
				<div class="col-md-6">
					<div v-if="evt.type == 'Time'">
						<label for="time">Time</label>
						<input name="time" type="datetime-local" v-model="time"> <br>
					</div>
					<div v-if="evt.type == 'Scan'">
						<label for="device_id">Device ID</label>
						<select name="device_id" v-model="device_id">
							<option v-for="device in devices" v-bind:value="device.id">
							{{device.id}}: {{device.purpose}} ({{device.ip}})
							</option>
						</select>
					</div>
				</div>
			</div>





			<div class="row infopanel">
				<div class="col-md-6">
					<h2>Nonlinked Actions</h2>
					click to link
					<ul>
						<li v-for="action in nonlinkedActions" v-bind:key="action.id" v-on:click="linkAction(action)">
							{{ action.name }}
						</li>
					</ul>
				</div>
				<div class="col-md-6">
					<h2>Linked Actions</h2>
					click to unlink
					<ul>
						<li v-for="action in linkedActions" v-bind:key="action.id" v-on:click="unlinkAction(action)">
							{{ action.name }}
						</li>
					</ul>
				</div>
			</div>
			<div class="row infopanel">
				<div class="col-md-1">
					<button class="btn btn-primary" v-on:click="deleteEvent()">Delete Event</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	export default {
		props: ['id', 'eventId', 'actionId'],

		data: () => ({
			loading: true,
		}),

		components: {
		},

		methods: {
			deleteEvent() {
				const evt = this.evt;
				this.$store.dispatch('deleteEvent', { evt });
				this.$router.push({ path: '/scenes'});
			},
			
			linkAction(action) {
				
				const eventId = this.$props.eventId;
				const actionId = action.id
				this.$store.dispatch('linkAction', {eventId, actionId});

			},
			
			unlinkAction(action) {
				const evt = this.evt;
				console.log("action");
				console.log(action);
				const eventAction = this.$store.getters.getEventAction(evt.id, action.id);
				this.$store.dispatch('unlinkAction', {eventAction});
			},
		},

		computed: {
/**
		    events(){
				const sceneId = this.$props.id;
		        const evts = this.$store.state.events.events;
				var sceneEvents = {};
				
				for (let e in evts){
					if (evts[e].scene_id == sceneId){
						sceneEvents[e] = evts[e];
					}
				}
				return sceneEvents;
				
		    },
**/
		    evt(){
		        const eventId = this.$props.eventId;
		        const evt = this.$store.getters.eventById(eventId);
		        return evt;
		    },
			
			action(){
				const action = this.$store.getters.actionById(this.$props.actionId);
				return action;
			},
			
			linkedActions(){
				const eventId = this.$props.eventId;
				const eventActions = this.$store.state.eventActions.eventActions;
				var actions = {};
				
				for (let e in eventActions) {
					if (eventActions[e].event_id == eventId){
						const action = this.$store.getters.actionById(eventActions[e].action_id);
						actions[e] = action;
					}
				}
				return actions;

			},
			
			nonlinkedActions() {
				const eventId = this.$props.eventId;
				const actions = this.$store.state.actions.actions;
				const eventActions = this.$store.state.eventActions.eventActions;
				var acts = {};
				for (let a in actions){
					let contains = false;
					for (let e in eventActions) {
						if (actions[a].id == eventActions[e].action_id && eventId == eventActions[e].event_id){
							contains = true;
						}
					}
					if (contains == false){
						acts[actions[a].id] = actions[a];
					}
				}
				return acts;
			},
			
			devices() {
				return this.$store.state.devices.devices;
			},
			
			

			//
			// This is tedious but recommended, see https://vuex.vuejs.org/en/forms.html.
			//

			name: {
				get: function() {
					return this.evt.name;
				},

				set: function(name) {
					const evt = Object.assign({}, this.evt, { name });
					this.$store.dispatch('updateEvent', { evt });
				},
			},

			type: {
				get: function() {
					return this.evt.type;
				},

				set: function(type) {
					const evt = Object.assign({}, this.evt, { type });
					this.$store.dispatch('updateEvent', { evt });
				},
			},
			time: {
				get: function() {
					return this.evt.time;
				},

				set: function(time) {
					const evt = Object.assign({}, this.evt, { time });
					this.$store.dispatch('updateEvent', { evt });
				},
			},
			device_id: {
				get: function() {
					const device_id = this.evt.device_id;
					console.log(this.$store.getters.deviceById(device_id));
					return device_id;
				},

				set: function(device_id) {
					const evt = Object.assign({}, this.evt, { device_id });
					this.$store.dispatch('updateEvent', { evt });
				},
			},
		},

		async created() {
		    await this.$store.dispatch('fetchEventActions');
			await this.$store.dispatch('fetchActions');
			await this.$store.dispatch('fetchDevices');
			this.loading = false;
		},
	}
</script>

<style scoped>
	#scene-edit-wrapper {
		display: grid;
		grid-template-columns: 10em 1fr;
	}

	label {
		grid-column-start: 1;
		grid-column-end: 2;
	}

	input {
		grid-column-start: 2;
		grid-column-end: 3;
	}
</style>
