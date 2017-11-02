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
	<div class="maincontent" id="actions">
		<div v-if="loading">
			Loading...
		</div>

		<div v-else>
			<div class="row">
				<div class="col-md-2">
					<div class="lists">
						<h4>Actions</h4>
						<ul>
							<li v-for="action in actions" v-bind:key="action.id">
								<router-link :to="{ name: 'actions', params: { id: action.id } }">
									({{ action.id }}) {{ action.name }}
								</router-link>
							</li>
						</ul>
					<button class="btn btn-primary" v-on:click="newAction">New Action</button>
					<br />
					</div>
				</div>
				<div class="col-md-10 inner-section">
					<div v-if="id !== undefined">
						<h2>Edit {{ action.name }}</h2>
						<action-edit :id="id" :ast="ast" v-on:change="changed" v-on:save="save"></action-edit>
					</div>
					<div v-else>
						<h4>No action selected</h4>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import ActionEdit from "./ActionEdit.vue";
	
	export default {
		props: ['id'],

		data: function() {
			return {
				loading: true,
				data_ast: null, // a copy of the ast
			}
		},

		components: {
			'action-edit': ActionEdit,
		},

		beforeRouteUpdate: function(to, from, next) {
			console.log("Actions :: route changed", to, from, next);

			// Reset the saved ast when the route changes, otherwise we can't switch between actions
			this.data_ast = null;

			next();
		},

		methods: {
			newAction: function() {
				this.$store.dispatch('newAction')
					.then(action => {
						this.$router.push({ name: 'actions', params: { id: action.id } })
					})
					.catch(console.log)
			},

			changed: function(action) {
				console.log("Actions :: @changed", action);
				this.data_ast = action.ast;
			},

			save: function() {
				console.log("Actions :: @save", this.ast);

				// Update action over api
				const action = { id: this.action.id, name: this.action.name, ast: this.ast };
				this.$store.dispatch('updateAction', { action });
			},
		},

		computed: {
			actions() {
				return this.$store.state.actions.actions;
			},

			action() {
				return this.$store.getters.actionById(this.$props.id);
			},

			ast: {
				get: function() {
					if (this.data_ast === null) {
						this.data_ast = JSON.parse(JSON.stringify(this.action.ast));
					}
					const ast = this.data_ast;

					console.log("Actions :: ast :: get ->", JSON.parse(JSON.stringify(ast)));
					return ast;
				},

				set: function(ast) {
					console.log("Actions:: ast :: set <-", ast);
					this.data_ast = ast;
				},
			},
		},

		async created() {
			await this.$store.dispatch('fetchActions');
			await this.$store.dispatch('fetchDevices'); // ensure store is populated with the devices
			this.loading = false;
		},
	}

</script>

<style>
	#action-view-wrapper {
		display: grid;
		grid-template-columns: 1fr 3fr;
	}
</style>
