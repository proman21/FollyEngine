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
		<div class="card">
			<div class="card-header">
				<label>If</label>
			</div>
			<div class="card-body">
				<expression-node v-bind:expression="statement.condition" v-on:change="conditionChanged"></expression-node>
			</div>
		</div>
		<div class="card">
			<div class="card-header">
				<label>Then</label>
			</div>
			<div class="card-body">
				<statement-node v-bind:statement="statement.if_body" v-on:change="ifChanged"></statement-node>
			</div>
		</div>
		<div class="card">
			<div class="card-header">
				<label>Else</label>
			</div>
			<div class="card-body">
				<statement-node v-bind:statement="statement.else_body" v-on:change="elseChanged"></statement-node>
			</div>
		</div>
	</div>
</template>

<script>
	import StatementNode from "./ActionNodeStatement.vue";
	import ExpressionNode from "./ActionNodeExpression.vue";

	export default {
		props: ['statement'],

		components: {
			'statement-node': StatementNode,
			'expression-node': ExpressionNode,
		},

		methods: {
			conditionChanged: function(expression) {
				this.$emit('change', {
					t: this.$props.statement.t,
					condition: expression,
					if_body: this.$props.statement.if_body,
					else_body: this.$props.statement.else_body,
				});
			},

			ifChanged: function(statement) {
				this.$emit('change', {
					t: this.$props.statement.t,
					condition: this.$props.statement.condition,
					if_body: statement,
					else_body: this.$props.statement.else_body,
				});
			},

			elseChanged: function(statement) {
				this.$emit('change', {
					t: this.$props.statement.t,
					condition: this.$props.statement.condition,
					if_body: this.$props.statement.if_body,
					else_body: statement,
				});
			},
		},
	}
</script>

<style scoped>
</style>
