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
		<compound-statement v-if="statement.t === 'CompoundStatement'" v-bind:statement="statement" v-on:change="changed"></compound-statement>
		<print-statement v-else-if="statement.t === 'PrintStatement'" v-bind:statement="statement" v-on:change="changed"></print-statement>
		<assignment-statement v-else-if="statement.t === 'AssignmentStatement'" v-bind:statement="statement" v-on:change="changed"></assignment-statement>
		<if-else-statement v-else-if="statement.t === 'IfElseStatement'" v-bind:statement="statement" v-on:change="changed"></if-else-statement>
		<output-statement v-else-if="statement.t === 'OutputStatement'" v-bind:statement="statement" v-on:change="changed"></output-statement>
		<set-attr-statement v-else-if="statement.t === 'SetAttrStatement'" v-bind:statement="statement" v-on:change="changed"></set-attr-statement>
		<div v-else>
			Unknown statement type '{{statement.t}}'
		</div>
	</div>
</template>

<script>
	export default {
		props: ['statement'],

		// Necessary for circular references, see https://vuejs.org/v2/guide/components.html#Circular-References-Between-Components
		beforeCreate: function() {
			this.$options.components.CompoundStatement = require('./ActionNodeCompoundStatement.vue').default;
			this.$options.components.AssignmentStatement = require('./ActionNodeAssignmentStatement.vue').default;
			this.$options.components.PrintStatement = require('./ActionNodePrintStatement.vue').default;
			this.$options.components.IfElseStatement = require('./ActionNodeIfElseStatement.vue').default;
			this.$options.components.OutputStatement = require('./ActionNodeOutputStatement.vue').default;
			this.$options.components.SetAttrStatement = require('./ActionNodeSetAttrStatement.vue').default;
		},

		components: {
		},

		methods: {
			changed: function(statement) {
				this.$emit('change', statement);
			},
		},
	}
</script>

<style scoped>
</style>
