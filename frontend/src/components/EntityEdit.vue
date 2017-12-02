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
		<h2>Virtual Entity</h2>
		<div>
			<label for="tbx_id">Id</label>
			<input id="tbx_id" name="id" type="text" v-bind:value="entity.id" disabled>
		</div>
		<div>
			<label for="tbx_parent_id">Parent Id</label>
			<input id="tbx_parent_id" name="parent_id" type="text" v-bind:value="entity.parent_id" disabled>
		</div>
		<div>
			<label for="tbx_title">Title</label>
			<input id="tbx_title" name="title" type="text" v-model="title">
		</div>
		<div>
			<label for="tbx_description">Description</label>
			<textarea id="tbx_description" rows="3" cols="40" name="description" v-model="description"></textarea>
		</div>
		<div>
			<table class="entity_components">
				<caption>Instances</caption>
				<tr>
					<th>
						<label>ID</label>
					</th>
					<th>
						<label>Tag</label>
					</th>
					<th colspan="2">
						&nbsp;
					</th>
				</tr>
				<tr v-for="instance in instances" v-bind:key="instance.id">
					<td>
						{{ instance.id }}
					</td>
					<td>
						tag: {{ instance.tag}}
					</td>
					<td>
						<router-link :to="{ name: 'instance', params: { id: instance.id } }" class="btn btn-secondary">
							edit
						</router-link>
					</td>
					<td>
						<button class="btn btn-danger btn-sm" v-on:click="removeInstance()">x</button>
					</td>
				</tr>
			</table>
		</div>
		<div>
			<table class="entity_components">
				<caption>Attributes</caption>
				<tr>
					<th>Name</th>
					<th>Class</th>
					<th>Type</th>
					<th>&nbsp;</th>
				</tr>
				<tr v-for="(value, key) in properties">
					<td>
						{{ key }}
					</td>
					<td>
						{{ value.class }}
					</td>
					<td>
						{{ value.type }}
					</td>
					<td>
						<button class="btn btn-danger btn-sm" v-on:click="removeProperty(key, value)">x</button>
					</td>
				</tr>
				<tr>
					<td>
						<input title="Property name" type="text" v-model="newProperty.propName">
					</td>
					<td>
						<select title="Property class" v-model="newProperty.classVal" v-on:change="changeClass">
							<option value="" disabled>Select class</option>
							<option v-for="option in classOptions" v-bind:value="option">
							{{ option }}
							</option>
						</select>
					</td>
					<td>
						<select title="Property type" v-model="newProperty.typeVal" v-bind:disabled="!isClassSelected">
							<option value="" disabled>Select type</option>
							<option v-for="option in typeOptions" v-bind:value="option">
							{{ option }}
							</option>
						</select>
					</td>
					<td>
						<button class="btn btn-primary" v-on:click="addProperty">Add Attribute</button>
					</td>
				</tr>
			</table>
		</div>
		<div>
			<!--<button class="btn btn-primary" v-on:click="updateEntity()">Update</button>-->
			<button class="btn btn-primary" v-on:click="deleteEntity()">Delete</button>
		</div>
	</div>
</template>

<script>
	let propertyObject = {
		"Numeric": ["integer", "number"],
		"Boolean": ["boolean"],
		"String": ["string"]
	};

	export default {
		props: ['id'],

		data: () => ({
			newProperty: {
				propName: "",
				classVal: "",
				typeVal: "",
			},
		}),

		components: {
		},

		methods: {
			deleteEntity() {
				const entity = this.entity;
				this.$store.dispatch('deleteEntity', { entity });
				this.$router.push({ path: '/entities' });
			},

			changeClass() {
				// Reset the type value when the class changes
				this.newProperty.typeVal = "";
			},

			addProperty() {
				const { propName, classVal, typeVal } = this.newProperty;

				// Should probably send some sort of feedback :P
				if (typeVal === '' || classVal === '' || $.trim(propName) === '') {
					return;
				}

				// Oooooh dangerous bug found: Using Object.assign, add a new id to a clean (attribute-less) VE.
				console.log(`ENTITY1:\n${ JSON.stringify(this.entity)}\n\n`);
				const entity = Object.assign({}, this.entity);

				let newProperties = Object.assign({}, this.entity["properties"]);
				newProperties[propName] = { "class": classVal, "type": typeVal };

				entity["properties"] = newProperties;

				this.$store.dispatch('updateEntity', { entity });

				// Reset
				this.newProperty.propName = "";
				this.newProperty.classVal = "";
				this.newProperty.typeVal = "";
			},

			removeProperty(key, value){
				// NOTE@s344878: Oddly, this doesn't fire the properties setter (see below). I would have thought it would.
				const entity = Object.assign({}, this.entity);

				let newProperties = Object.assign({}, this.entity["properties"]);
				delete newProperties[key];

				entity["properties"] = newProperties;

				this.$store.dispatch('updateEntity', { entity });
			},
		},

		computed: {
			entity() {
				return this.$store.getters.entityById(this.$props.id);
			},

			classOptions() {
				return Object.keys(propertyObject);
			},

			isClassSelected() {
				return this.newProperty.classVal !== '';
			},

			typeOptions() {
				const { classVal } = this.newProperty;

				const types = propertyObject[classVal];
				if (types === undefined) {
					return [];
				}

				return types;
			},

			//
			// This is tedious but recommended, see https://vuex.vuejs.org/en/forms.html.
			//

			title: {
				get: function() {
					return this.entity.title;
				},

				set: function(title) {
					const entity = Object.assign({}, this.entity, { title });
					this.$store.dispatch('updateEntity', { entity });
				}
			},

			description: {
				get: function() {
					return this.entity.description;
				},

				set: function(description) {
					const entity = Object.assign({}, this.entity, { description });
					this.$store.dispatch('updateEntity', { entity });
				}
			},

			properties: {
				get: function() {
					return this.entity.properties;
				},

				set: function(properties) {
					console.log("entity.properties setter triggered.");
					const entity = Object.assign({}, this.entity, { properties });
					this.$store.dispatch('updateEntity', { entity });
				}
			},

			children: {
				get: function() {
					return this.entity.children;
				}
			},

			instances: {
				get: function() {
					return this.entity.instances;
				}
			}
		},
	}
</script>

<style scoped>
	.entity_components td, .entity_components th {
		padding: 5px 5px 5px 5px;
	}

	.entity_components tr:last-child td {
		text-align: left;
	}
</style>
