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
		<h2>Edit {{ entity.title }} Instance</h2>
		<div>
			<label for="id">Id</label>
			<input name="id" type="text" v-bind:value="instance.id" disabled>
		</div>
		<div>
			<label for="entity">Entity</label>
			<input name="entity" type="text" v-bind:value="entity.title" disabled>
		</div>
		<div>
			<label for="tag">Tag</label>
			<input name="tag" type="text" v-bind:value="instance.tag">
		</div>
		<div>
			<label for="type">Type</label>
			<input name="type" type="text" v-bind:value="instance.type">
		</div>
		<div>
			<h3>Properties</h3>
			<table>
				<tr>
					<th>Name</th>
					<th>Value</th>
				</tr>
				<tr v-for="(value, name) in instance.properties">
					<td>{{ name }}</td>
					<td>
						<input
							v-if="instance.schema[name].class == 'Numeric' && instance.schema[name].type == 'integer'"
							type="number"
							v-bind:value="value"
							v-on:input="changeProperty(name, parseInt($event.target.value))"
						>
						<input
							v-else-if="instance.schema[name].class == 'Numeric' && instance.schema[name].type == 'number'"
							type="number"
							step="any"
							v-bind:value="value"
							v-on:input="changeProperty(name, parseFloat($event.target.value))"
						>
						<input
							v-else-if="instance.schema[name].class == 'String'"
							type="text"
							v-bind:value="value"
							v-on:input="changeProperty(name, $event.target.value)"
						>
						<input
							v-else-if="instance.schema[name].class == 'Boolean'"
							type="checkbox"
							v-bind:checked="value"
							v-on:input="changeProperty(name, $event.target.checked)"
						>
						<span v-else v-bind:value="string">Error: unknown attribute type</span>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['id'],

		data: () => ({
		}),

		components: {
		},

		methods: {
			changeProperty(name, value) {
				console.log(name, value);

				console.log("previous", JSON.stringify(this.instance.properties));
				const properties = Object.assign({}, this.instance.properties, { [name]: value });
				console.log("next", JSON.stringify(properties));
				const instance = Object.assign({}, this.instance, { properties });

				this.$store.dispatch('updateInstance', { instance });
			},
		},

		computed: {
			instance() {
				return this.$store.getters.instanceById(this.$props.id);
			},

			entity() {
				return this.$store.getters.entityById(this.instance.virtual_entity_id);
			},
		},
	}
</script>

<style scoped>
</style>
