<!--
-- Copyright (c) 2017 Ned Hoy <nedhoy@gmail.com>
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
		<h2>Edit {{ scene.name }}</h2>
		<div class="row">
			<div class="col-md-6">
				<div class="row">
					<div class="col-md-12">
						<label for="id">Id</label>
						<div class="textbox">
							<input name="id" type="text" v-bind:value="scene.id" disabled>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<label for="name">Name</label>
						<div class="textbox">
							<input name="name" type="text" v-model="name">
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-12">
						<label for="description">Description</label>
						<div class="textbox">
							<textarea rows="3" cols="40" id = "scenename" name="description" v-model="description" />
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-1">
						<button class="btn btn-primary" v-on:click="deleteScene()">Delete Scene</button>
					</div>
				</div>

			</div>
			<!-- events part to do -->

			<div class="col-md-6">
				<div class="row">
					<div class="col-md-12">
						<div class = "subbox" style="height: 260px">
							<ul class = "action-menu">
								<li v-for="evt in events" v-bind:key="evt.id">
									<router-link :to="{ name: 'events', params: { id: evt.scene_id, eventId: evt.id } }">
										{{ evt.name }}
									</router-link>
								</li>
							</ul>
							<button class="btn btn-primary" v-on:click="newEvent">New Event</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<div class = "innercontent">
					<router-view>
						<!-- Child route is rendered here -->
					</router-view>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import EventEdit from "./EventEdit.vue"
	
	export default {
		props: ['id', 'eventId'],

		data: () => ({
		}),
		
		
		components: {
			'event-edit': EventEdit,
		},

		methods: {
			deleteScene() {
				const scene = this.scene;
				this.$store.dispatch('deleteScene', { scene });
				this.$router.push({ path: '/scenes' });
			},
			newEvent: function(){
			const sceneId = this.$props.id;
			    this.$store.dispatch('newEvent', {sceneId}).then(evt => {
			        this.$router.push({name: 'events', params: {id: sceneId, eventId: evt.id}})
			    }).catch(console.log)
			},
		},

		computed: {
			events(){
				const sceneId = this.$props.id;
		        const evts = this.$store.state.events.events;
				console.log("events");
				console.log(evts);
				var sceneEvents = {};
				
				for (let e in evts){
					if (evts[e].scene_id == sceneId){
						console.log(evts[e]);
						sceneEvents[e] = evts[e];
					}
				}
				console.log("sceneEvents");
				console.log(sceneEvents);
				return sceneEvents;
				
		    },

		    evt(){
		        const eventId = this.$props.eventId;
		        const evt = this.$store.getters.eventById(eventId)

		        return evt;
		    },
			
			scene() {
				return this.$store.getters.sceneById(this.$props.id);
			},

			//
			// This is tedious but recommended, see https://vuex.vuejs.org/en/forms.html.
			//

			name: {
				get: function() {
					return this.scene.name;
				},

				set: function(name) {
					const scene = Object.assign({}, this.scene, { name });
					this.$store.dispatch('updateScene', { scene });
				},
			},

			description: {
				get: function() {
					return this.scene.description;
				},

				set: function(description) {
					const scene = Object.assign({}, this.scene, { description });
					this.$store.dispatch('updateScene', { scene });
				},
			},
			
		},
		
		async created() {
			await this.$store.dispatch('fetchEvents');
			this.loading = false;
		},
	}
</script>

<style scoped>
</style>
