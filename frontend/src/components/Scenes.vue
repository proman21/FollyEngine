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
    <div class="maincontent" id="scenes">
		<div v-if="loading">
			Loading...
		</div>

		<div v-else>
			<div class="row">
				<div class="col-md-2">
					<div class="lists">
						<h4>Current Scenes</h4>
						<ul class="side-menu-scene">
							<li v-for="scene in scenes" v-bind:key="scene.id">
								<router-link :to="{ name: 'scenes', params: { id: scene.id } }">
									({{ scene.id }}) {{ scene.name }}
								</router-link>
							</li>
						</ul>
						<button class="btn btn-primary" v-on:click="newScene">New Scene</button>
						<br />
					</div>
				</div>
				<div class="col-md-10 inner-section">
					<div class="innercontent">
						<div v-if="id !== undefined">
							<h2>Edit {{ scene.name }}</h2>
							<scene-edit :id="id" :eventId="$route.params.eventId"></scene-edit>
						</div>
						<div v-else>
							<h4> No scene selected</h4>
						</div>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>

<script>
	import SceneEdit from "./SceneEdit.vue";

	export default {
		props: ['id'],

		data: () => ({
			loading: true,
		}),

		components: {
			'scene-edit': SceneEdit,
		},
		
		methods: {
			newScene: function() {
				this.$store.dispatch('newScene')
					.then(scene => {
						this.$router.push({ name: 'scenes', params: { id: scene.id } })
					})
					.catch(console.log)
			}
		},

		computed: {
			scenes() {
				return this.$store.state.scenes.scenes;
			},

			scene() {
				return this.$store.getters.sceneById(this.$props.id);
			},
		},

		async created() {
			await this.$store.dispatch('fetchScenes');
			this.loading = false;
		},
	}
</script>

<style>
	#scene-view-wrapper {
		display: grid;
		grid-template-columns: 1fr 3fr;
	}
</style>
