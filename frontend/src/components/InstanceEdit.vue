<!--&lt;!&ndash; Copyright (c) 2017 Nicolas Binette <loupceuxl@gmail.com>-->
<!--&#45;&#45;-->
<!--&#45;&#45; Permission is hereby granted, free of charge, to any person obtaining a copy-->
<!--&#45;&#45; of this software and associated documentation files (the "Software"), to deal-->
<!--&#45;&#45; in the Software without restriction, including without limitation the rights-->
<!--&#45;&#45; to use, copy, modify, merge, publish, distribute, sublicense, and/or sell-->
<!--&#45;&#45; copies of the Software, and to permit persons to whom the Software is-->
<!--&#45;&#45; furnished to do so, subject to the following conditions:-->
<!--&#45;&#45;-->
<!--&#45;&#45; The above copyright notice and this permission notice shall be included in all-->
<!--&#45;&#45; copies or substantial portions of the Software.-->
<!--&#45;&#45;-->
<!--&#45;&#45; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR-->
<!--&#45;&#45; IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,-->
<!--&#45;&#45; FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE-->
<!--&#45;&#45; AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER-->
<!--&#45;&#45; LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,-->
<!--&#45;&#45; OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.-->
<!--&ndash;&gt;-->

<!--<template>-->
	<!--<div>-->
	<!--<br>-->
		<!--<div class="row infopanel">-->
            <!--<div class="col-md-6">-->
                    <!--<label for="tbx_id">Id</label>-->
                    <!--<div class="textbox">-->
                        <!--<input id="tbx_id" name="id" type="text" v-bind:value="instance.id" disabled>-->
                    <!--</div>-->
            <!--</div>-->
            <!--<div class="col-md-6">-->
                    <!--<label for="tbx_parent_id">Parent Id</label>-->
                    <!--<div class="textbox">-->
                        <!--<input id="tbx_parent_id" name="parent_id" type="text" v-bind:value="entity.parent_id" disabled>-->
                    <!--</div>-->
            <!--</div>-->
		<!--</div>-->
		<!--<br />-->
		<!--<div class="row infopanel">-->
			<!--<div class="col-md-6">-->
					<!--<label for="tbx_title">Title</label>-->
					<!--<div class="textbox">-->
						<!--<input id="tbx_title" name="title" type="text" v-model="title">-->
					<!--</div>-->
			<!--</div>-->
		<!--</div>-->
		<!--<br />-->
		<!--<div class="row infopanel">-->
			<!--<div class="col-md-12">-->
				<!--<label for="tbx_description">Description</label>-->
				<!--<div class="textbox">-->
					<!--<textarea id="tbx_description" rows="3" cols="40" name="description" v-model="description"></textarea>-->
				<!--</div>-->
			<!--</div>-->
		<!--</div>-->
		<!--<br />-->
		<!--<div class="row">-->
			<!--<div class="col-md-6">-->
   <!---->
			<!--</div>-->
		<!--</div>-->
		<!--<br />-->
		<!--<div class="row infopanel">-->
			<!--<div class="col-md-12">-->
				<!--&lt;!&ndash;<button class="btn btn-primary" v-on:click="updateEntity()">Update</button>&ndash;&gt;-->
				<!--<button class="btn btn-primary" v-on:click="deleteInstance()">Delete</button>-->
			<!--</div>-->
		<!--</div>-->
        <!--<br />-->
	<!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--let propertyObject = {-->
        <!--"Numeric": ["integer", "number"],-->
        <!--"Boolean": ["boolean"],-->
        <!--"String": ["string"]-->
    <!--};-->

    <!--// REFERENCE: http://jsfiddle.net/mplungjan/65Q9L/-->
    <!--let loadVEPropertyInputs = (ddlClass, ddlType) => {-->
        <!--for (let cls in propertyObject) {-->
            <!--ddlClass.options[ddlClass.options.length] = new Option(cls, cls);-->
        <!--}-->

        <!--ddlClass.onchange = function () {-->
            <!--ddlType.length = 1; // remove all options bar first-->

            <!--if (this.selectedIndex < 1) return; // done-->

            <!--propertyObject[this.value].forEach(function (type) {-->
                <!--ddlType.options[ddlType.options.length] = new Option(type, type);-->
            <!--});-->
        <!--};-->

        <!--ddlClass.onchange(); // reset in case page is reloaded-->
    <!--};-->

    <!--let resetVEPropertyInputs = (tbxName, ddlClass, ddlType) => {-->
        <!--$(tbxName).val("");-->
        <!--$(ddlClass).prop('selectedIndex', 0);-->
        <!--$(ddlType).prop('selectedIndex', 0);-->
    <!--};-->

	<!--export default {-->
		<!--props: ['id'],-->

		<!--data: () => ({-->
		<!--}),-->

		<!--components: {-->
		<!--},-->

		<!--methods: {-->
			<!--deleteEntity() {-->
				<!--const entity = this.entity;-->
				<!--this.$store.dispatch('deleteEntity', { entity });-->
				<!--this.$router.push({ path: '/entities' });-->
			<!--},-->

            <!--addProperty() {-->
			    <!--// jQuery > JS DOM nav lol.-->
			    <!--let propName = $(this.$refs.tbx_property_name).val();-->
			    <!--let classVal = $(this.$refs.ddl_property_class).val();-->
			    <!--let typeVal = $(this.$refs.ddl_property_type).val();-->

			    <!--// Should probably send some sort of feedback :P-->
			    <!--if (typeVal === '' || classVal === '' || $.trim(propName) === '') {-->
                    <!--return;-->
                <!--}-->

                <!--console.log(`ENTITY1:\n${ JSON.stringify(this.entity)}\n\n`);-->

                <!--// Oooooh dangerous bug found: Using Object.assign, add a new id to a clean (attribute-less) VE.-->

                <!--const entity = Object.assign({}, this.entity);-->

			    <!--let newProperties = Object.assign({}, this.entity["properties"]);-->
                <!--newProperties[propName] = { "class": classVal, "type": typeVal };-->

			    <!--entity["properties"] = newProperties;-->

			    <!--this.$store.dispatch('updateEntity', { entity });-->

                <!--resetVEPropertyInputs(this.$refs.tbx_property_name, this.$refs.ddl_property_class, this.$refs.ddl_property_type);-->
            <!--},-->

            <!--removeProperty(key, value){-->
                <!--// NOTE@s344878: Oddly, this doesn't fire the properties setter (see below). I would have thought it would.-->
                <!--const entity = Object.assign({}, this.entity);-->

                <!--let newProperties = Object.assign({}, this.entity["properties"]);-->
                <!--delete newProperties[key];-->

                <!--entity["properties"] = newProperties;-->

                <!--this.$store.dispatch('updateEntity', { entity });-->
            <!--},-->
		<!--},-->

        <!--// NOTE@s344878: Mounted + nextTick guarantees view has been fully rendered.-->
        <!--// https://vuejs.org/v2/api/#mounted-->
        <!--mounted: function () {-->
		    <!--this.$nextTick(function () {-->
                <!--loadVEPropertyInputs(this.$refs.ddl_property_class, this.$refs.ddl_property_type);-->
            <!--});-->
			<!--var heightmain = $('.maincontent').height();-->
			<!--$('.lists').height(heightmain);-->
        <!--},-->

		<!--computed: {-->
			<!--entity() {-->
				<!--return this.$store.getters.entityById(this.$props.id);-->
			<!--},-->

            <!--childCount() {-->
			    <!--return this.entity.children.length;-->
            <!--},-->

			<!--//-->
			<!--// This is tedious but recommended, see https://vuex.vuejs.org/en/forms.html.-->
			<!--//-->

			<!--title: {-->
				<!--get: function() {-->
					<!--return this.entity.title;-->
				<!--},-->

				<!--set: function(title) {-->
					<!--const entity = Object.assign({}, this.entity, { title });-->
					<!--this.$store.dispatch('updateEntity', { entity });-->
				<!--}-->
			<!--},-->

			<!--description: {-->
				<!--get: function() {-->
					<!--return this.entity.description;-->
				<!--},-->

				<!--set: function(description) {-->
					<!--const entity = Object.assign({}, this.entity, { description });-->
					<!--this.$store.dispatch('updateEntity', { entity });-->
				<!--}-->
			<!--},-->

			<!--properties: {-->
				<!--get: function() {-->
					<!--return this.entity.properties;-->
				<!--},-->

				<!--set: function(properties) {-->
				    <!--console.log("entity.properties setter triggered.");-->
					<!--const entity = Object.assign({}, this.entity, { properties });-->
					<!--this.$store.dispatch('updateEntity', { entity });-->
				<!--}-->
			<!--},-->

			<!--children: {-->
				<!--get: function() {-->
					<!--return this.entity.children;-->
				<!--}-->
			<!--}-->
		<!--},-->
		<!---->
	<!--}-->
<!--</script>-->

<!--<style scoped>-->
	<!--#entity-edit-wrapper {-->
		<!--display: grid;-->
		<!--grid-template-columns: 10em 1fr;-->
	<!--}-->

	<!--label {-->
		<!--grid-column-start: 1;-->
		<!--grid-column-end: 2;-->
	<!--}-->

	<!--input {-->
		<!--grid-column-start: 2;-->
		<!--grid-column-end: 3;-->
	<!--}-->

    <!--/* REFERENCE: https://stackoverflow.com/questions/1367409/how-to-make-button-look-like-a-link */-->
    <!--.hyperlink_button {-->
        <!--background: none!important;-->
        <!--color: inherit;-->
        <!--border: none;-->
        <!--padding: 0!important;-->
        <!--font: inherit;-->
        <!--cursor: pointer;-->
    <!--}-->

    <!--.attribute_table td, .attribute_table th {-->
        <!--padding: 5px 5px 5px 5px;-->
    <!--}-->

    <!--.attribute_table tr th:nth-child(4n+0) {-->
        <!--font-style: italic;-->
    <!--}-->

    <!--.attribute_table tr th:nth-child(4n+0), .attribute_table tr td:nth-child(4n+0) {-->
        <!--text-align: center;-->
    <!--}-->

    <!--.attribute_table tr:last-child td {-->
        <!--text-align: left;-->
    <!--}-->

    <!--.attribute_table tr td:nth-child(4n+0) button {-->
        <!--font-size: 150%;-->
        <!--font-weight: bold;-->
        <!--color: red;-->
    <!--}-->

    <!--.attribute_table tr:last-child td:nth-child(4n+0) button {-->
        <!--color: green;-->
    <!--}-->

<!--</style>-->
