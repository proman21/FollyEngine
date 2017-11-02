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
	<br>
		<div class="row infopanel">
            <div class="col-md-6">
                <label for="tbx_id">Id</label>
                <div class="textbox">
                    <input id="tbx_id" name="id" type="text" v-bind:value="entity.id" disabled>
                </div>
            </div>
            <div class="col-md-6">
                <label for="tbx_parent_id">Parent Id</label>
                <div class="textbox">
                    <input id="tbx_parent_id" name="parent_id" type="text" v-bind:value="entity.parent_id" disabled>
                </div>
            </div>
        </div>
		<br />
		<div class="row infopanel">
			<div class="col-md-6">
                <label for="tbx_title">Title</label>
                <div class="textbox">
                    <input id="tbx_title" name="title" type="text" v-model="title">
                </div>
			</div>
		</div>
		<br />
		<div class="row infopanel">
			<div class="col-md-12">
				<label for="tbx_description">Description</label>
				<div class="textbox">
					<textarea id="tbx_description" rows="3" cols="40" name="description" v-model="description"></textarea>
				</div>
			</div>
		</div>
		<br />
		<div class="row infopanel">
			<div class="col-md-12">
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
                    <tr v-for="(value, key) in instances">
                        <td>
                            {{ value.id }}
                        </td>
                        <td>
							tag: {{ value.tag}}
                        </td>
                        <td>
                            <button class="hyperlink_button component_button edit_component" v-on:click="editInstance()">e</button>
                        </td>
                        <td>
                            <button class="hyperlink_button component_button remove_component" v-on:click="removeInstance()">x</button>
                        </td>
                    </tr>
                    <!--<tr>-->
                        <!--<td>-->
          					<!--<button class="hyperlink_button component_button add_component" v-on:click="addInstance()">+</button>-->
                        <!--</td>-->
                        <!--<td colspan="3">-->
                            <!--&nbsp;-->
                        <!--</td>-->
                    <!--</tr>-->
                </table>
			</div>
		</div>
        <br />
		<div class="row">
			<div class="col-md-6">
                <!-- REFERENCE: https://stackoverflow.com/questions/44741931/access-value-and-key-in-vuejs-from-a-json-string -->
                <table class="entity_components">
                    <caption>Attributes</caption>
                    <tr>
                        <th>
                            <label for="tbx_property_name">Name</label>
                        </th>
                        <th>
                            <label for="ddl_property_class">Class</label>
                        </th>
                        <th>
                            <label for="ddl_property_type">Type</label>
                        </th>
                        <th>
                            &nbsp;
                        </th>
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
                            <button class="hyperlink_button component_button remove_component" v-on:click="removeProperty(key, value)">x</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
          					<input id="tbx_property_name" ref="tbx_property_name" title="Property name" type="text" />
                        </td>
                        <td>
                            <select id="ddl_property_class" ref="ddl_property_class" title="Property class" name="property_class" size="1">
                                <option value="" selected="selected">Select class</option>
                            </select>
                        </td>
                        <td>
                            <select id="ddl_property_type" ref="ddl_property_type" title="Property type" name="property_type" size="1">
                                <option value="" selected="selected">Please select class first</option>
                            </select>
                        </td>
                        <td>
                            <button class="hyperlink_button component_button add_component" v-on:click="addProperty()">+</button>
                        </td>
                    </tr>
                </table>
			</div>
		</div>
		<br />
		<div class="row infopanel">
			<div class="col-md-12">
				<!--<button class="btn btn-primary" v-on:click="updateEntity()">Update</button>-->
				<button class="btn btn-primary" v-on:click="deleteEntity()">Delete</button>
			</div>
		</div>
        <br />
	</div>
</template>

<script>
    let propertyObject = {
        "Numeric": ["integer", "number"],
        "Boolean": ["boolean"],
        "String": ["string"]
    };

    // REFERENCE: http://jsfiddle.net/mplungjan/65Q9L/
    let loadVEPropertyInputs = (ddlClass, ddlType) => {
        for (let cls in propertyObject) {
            ddlClass.options[ddlClass.options.length] = new Option(cls, cls);
        }

        ddlClass.onchange = function () {
            ddlType.length = 1; // remove all options bar first

            if (this.selectedIndex < 1) return; // done

            propertyObject[this.value].forEach(function (type) {
                ddlType.options[ddlType.options.length] = new Option(type, type);
            });
        };

        ddlClass.onchange(); // reset in case page is reloaded
    };

    let resetVEPropertyInputs = (tbxName, ddlClass, ddlType) => {
        $(tbxName).val("");
        $(ddlClass).prop('selectedIndex', 0);
        $(ddlType).prop('selectedIndex', 0);
    };

	export default {
		props: ['id'],

		data: () => ({
		}),

		components: {
		},

		methods: {
			deleteEntity() {
				const entity = this.entity;
				this.$store.dispatch('deleteEntity', { entity });
				this.$router.push({ path: '/entities' });
			},

            addProperty() {
			    // jQuery > JS DOM nav lol.
			    let propName = $(this.$refs.tbx_property_name).val();
			    let classVal = $(this.$refs.ddl_property_class).val();
			    let typeVal = $(this.$refs.ddl_property_type).val();

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

                resetVEPropertyInputs(this.$refs.tbx_property_name, this.$refs.ddl_property_class, this.$refs.ddl_property_type);
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

        // NOTE@s344878: Mounted + nextTick guarantees view has been fully rendered.
        // https://vuejs.org/v2/api/#mounted
        mounted: function () {
		    this.$nextTick(function () {
                loadVEPropertyInputs(this.$refs.ddl_property_class, this.$refs.ddl_property_type);
            });
			var heightmain = $('.maincontent').height();
			$('.lists').height(heightmain);
        },

		computed: {
			entity() {
				return this.$store.getters.entityById(this.$props.id);
			},

            childCount() {
			    return this.entity.children.length;
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
	#entity-edit-wrapper {
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

    /* REFERENCE: https://stackoverflow.com/questions/1367409/how-to-make-button-look-like-a-link */
    .hyperlink_button {
        background: none!important;
        color: inherit;
        border: none;
        padding: 0!important;
        font: inherit;
        cursor: pointer;
        font-size: 150%;
        font-weight: bold;
    }

    .entity_components td, .entity_components th {
        padding: 5px 5px 5px 5px;
    }

    .entity_components tr:last-child td {
        text-align: left;
    }

    .component_button {

    }

    .remove_component {
        color: red;
    }

    .add_component {
        color: green;
    }

    .edit_component {
        color: blue;
    }

</style>
