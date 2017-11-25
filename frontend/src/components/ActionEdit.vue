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
		<div class="row infopanel">
			<div class="col-md-4">
				<label for="id">Id</label>
				<input name="id" type="text" v-bind:value="action.id" disabled>
			</div>
			<div class="col-md-4">
				<label for="name">Name</label>
				<input name="name" type="text" v-model="name">
			</div>
			<div class="col-md-4">
				<label for="entity">Entity</label>
				<select name="entity" v-model="entity">
					<option v-for="entity in entities" v-bind:value="entity.id">
						{{entity.id}}: {{entity.title}}
					</option>
				</select>
			</div>
		</div>
		<div class="row infopanel">
			<div class="col-md-12">
				<statement-node v-bind:statement="ast" v-on:change="changed"></statement-node>
			</div>
		</div>
		<div class="row infopanel">
			<div class="col-md-1">
				<div>
					<button class="btn btn-primary" v-on:click="save">Save</button>
				</div>
			</div>
		</div>
		<br />
		<div class="row infopanel">
			<div class="col-md-1">
				<div>
					<button class="btn btn-primary" v-on:click="deleteAction()">Delete</button>
				</div>
			</div>
		</div>
		<br />
	</div>
</template>

<script>
	import Vue from 'vue';
	import StatementNode from "./ActionNodeStatement.vue";

	export default {
		props: ['id', 'ast'],

		components: {
			'statement-node': StatementNode,
		},

		methods: {
			changed(statement) {
				this.$emit('change', { ast: statement });
			},

			save() {
				this.$emit('save');
			},

			deleteAction: async function() {
				await this.$store.dispatch('deleteAction', { action: this.action });
				this.$router.push({ path: '/actions' });
			},
		},

		computed: {
			action() {
				return this.$store.getters.actionById(this.$props.id);
			},

			entities() {
				return this.$store.state.entities.entities;
			},

			//
			// This is tedious but recommended, see https://vuex.vuejs.org/en/forms.html.
			//

			name: {
				get: function() {
					return this.action.name;
				},

				set: function(name) {
					const action = Object.assign({}, this.action, { name });
					this.$store.dispatch('updateAction', { action });
				},
			},

			entity: {
				get: function() {
					return this.action.wants_entity_id;
				},

				set: function(wants_entity_id) {
					const action = Object.assign({}, this.action, { wants_entity_id });
					this.$store.dispatch('updateAction', { action });
				},
			},
		},
	}
</script>

<style scoped>
	#action-edit-wrapper {
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
