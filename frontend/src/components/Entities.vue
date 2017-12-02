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
	<div v-if="loading">
		Loading...
	</div>

	<div v-else class="row">
		<div class="col-md-2">
			<h4>Entities</h4>
			<nav>
				<ul class="nav nav-pills flex-column">
					<li v-for="entity in entities" v-bind:key="entity.id" class="nav-item row">
						<div class="dropdown col-sm-auto">
							<button type="button" class="btn btn-secondary dropdown-toggle btn-sm" data-toggle="dropdown"></button>
							<div class="dropdown-menu">
								<button class="dropdown-item">Add child</button>
								<button class="dropdown-item" v-if="entity.children.length == 0" v-on:click="newInstance(entity.id)">Add instance</button>
							</div>
						</div>
						<router-link
							v-bind:to="{ name: 'entities', params: { id: entity.id } }"
							active-class="active"
							class="nav-link col-sm"
						>
							{{ entity.title }}
						</router-link>
					</li>
				</ul>
				<button class="btn btn-primary" v-on:click="newEntity">New Entity</button>
			</nav>
		</div>
		<router-view class="col-md-10">
			<!-- Child route is rendered here -->
		</router-view>
	</div>
</template>

<script>
	import EntityEdit from "./EntityEdit.vue";

	export default {
		props: ['id'],

		data: () => ({
			loading: true,
		}),

		components: {
			'entity-edit': EntityEdit,
		},

		methods: {
			newEntity: function() {
				this.$store.dispatch('newEntity')
					.then(entity => {
						this.$router.push({ name: 'entities', params: { id: entity.id } })
					})
					.catch(console.log)
			},

			newInstance(entityId) {
			    console.log("NEW INSTANCE -- PASSED IN VE ID: " + entityId);

				this.$store.dispatch('newInstance', { entityId })
					.then(instance => {
			        	this.$router.push({ name: 'instance', params: { id: instance.id } });
					    console.log(instance);
					})
					.catch(console.log)
			},
		},

		computed: {
			entities() {
				return this.$store.state.entities.entities;
			},

			entity() {
				return this.$store.getters.entityById(this.$props.id);
			},
		},

		async created() {
			await this.$store.dispatch('fetchEntities');
			await this.$store.dispatch('fetchInstances');
			this.loading = false;
		}
	}
</script>

<style>
</style>
