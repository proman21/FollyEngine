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
		<expression-node v-bind:expression="expression.left" v-on:change="leftChanged"></expression-node>
		<select v-model="operator">
			<option v-for="(op, key) in operators" v-bind:value="key">
				<code>{{ op }}</code>
			</option>
		</select>
		<expression-node v-bind:expression="expression.right" v-on:change="rightChanged"></expression-node>
	</div>
</template>

<script>
	import ExpressionNode from "./ActionNodeExpression.vue";

	export default {
		props: ['expression'],

		components: {
			'expression-node': ExpressionNode,
		},

		data: function() {
			return {
				operators: {
					'ADD': '+',
					'MULT': '*',
					'SUB': '-',
					'MOD': '%',
					'LT': '<',
					'LE': '≤',
					'EQ': '=',
					'NE': '≠',
					'GE': '≥',
					'GT': '>',
					'LOGICAL_OR': 'or',
					'LOGICAL_AND': 'and',
				},
			}
		},

		computed: {
			operator: {
				get: function() {
					return this.$props.expression.operator;
				},

				set: function(operator) {
					this.$emit('change', {
						t: this.$props.expression.t,
						operator: operator,
						left: this.$props.expression.left,
						right: this.$props.expression.right,
					});
				},
			},
		},

		methods: {
			leftChanged: function(expression) {
				this.$emit('change', {
					t: this.$props.expression.t,
					operator: this.$props.expression.operator,
					left: expression,
					right: this.$props.expression.right,
				});
			},

			rightChanged: function(expression) {
				this.$emit('change', {
					t: this.$props.expression.t,
					operator: this.$props.expression.operator,
					left: this.$props.expression.left,
					right: expression,
				});
			},
		},
	}
</script>

<style scoped>
</style>
