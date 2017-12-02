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
	<div class="expression">
		<div class="dropdown">
			<button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				{{ options[expression.t] }}
				<span class="caret"></span>
			</button>
			<ul class="dropdown-menu">
				<li class="dropdown-header">Change Expression</li>
				<li v-for="(text, expressionType) in options">
					<a class="dropdown-item" href="#" v-on:click.prevent="select(expressionType)">
						{{ text }}
					</a>
				</li>
			</ul>
		</div>

		<div>
			<boolean-literal v-if="expression.t === 'BooleanLiteral'" v-bind:expression="expression" v-on:change="changed"></boolean-literal>
			<integer-literal v-else-if="expression.t === 'IntegerLiteral'" v-bind:expression="expression" v-on:change="changed"></integer-literal>
			<string-literal v-else-if="expression.t === 'StringLiteral'" v-bind:expression="expression" v-on:change="changed"></string-literal>
			<binary-op v-else-if="expression.t === 'BinaryOp'" v-bind:expression="expression" v-on:change="changed"></binary-op>
			<get-attr-expression v-else-if="expression.t === 'GetAttrExpression'" v-bind:expression="expression" v-on:change="changed"></get-attr-expression>
			<variable-name-expression v-else-if="expression.t === 'VariableNameExpression'" v-bind:expression="expression" v-on:change="changed"></variable-name-expression>
			<div v-else>
				Unknown expression type '{{expression.t}}'
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['expression'],

		data: () => ({
			options: {
				'BooleanLiteral': 'Boolean',
				'IntegerLiteral': 'Integer',
				'StringLiteral': 'String',
				'BinaryOp': 'Operator',
				'GetAttrExpression': 'Attribute',
				'VariableNameExpression': 'Variable',
			},
		}),

		// Necessary for circular references, see https://vuejs.org/v2/guide/components.html#Circular-References-Between-Components
		beforeCreate: function() {
			this.$options.components.BooleanLiteral = require('./ActionNodeBooleanLiteral.vue').default;
			this.$options.components.IntegerLiteral = require('./ActionNodeIntegerLiteral.vue').default;
			this.$options.components.StringLiteral = require('./ActionNodeStringLiteral.vue').default;
			this.$options.components.BinaryOp = require('./ActionNodeBinaryOp.vue').default;
			this.$options.components.GetAttrExpression = require('./ActionNodeGetAttrExpression.vue').default;
			this.$options.components.VariableNameExpression = require('./ActionNodeVariableNameExpression.vue').default;
		},

		components: {
		},

		methods: {
			changed: function(expression) {
				this.$emit('change', expression);
			},

			changeExpression: function(expression) {
				this.$emit('change', expression);
			},

			select: function(expressionType) {
				switch (expressionType) {
					case "BooleanLiteral": {
						const expression = {
							t: expressionType,
							value: true,
						};
						this.changeExpression(expression);
						break;
					}
					case "IntegerLiteral": {
						const expression = {
							t: expressionType,
							value: 0,
						};
						this.changeExpression(expression);
						break;
					}
					case "StringLiteral": {
						const expression = {
							t: expressionType,
							value: "",
						};
						this.changeExpression(expression);
						break;
					}
					case "BinaryOp": {
						const expression = {
							t: expressionType,
							left: {
								t: "IntegerLiteral",
								value: 0,
							},
							operator: "ADD",
							right: {
								t: "IntegerLiteral",
								value: 0,
							},
						};
						this.changeExpression(expression);
						break;
					}
					case "GetAttrExpression": {
						// FIXME: these aren't good defaults, but there aren't really any good defaults
						const expression = {
							t: expressionType,
							obj: "__INPUT__",
							name: "",
						};
						this.changeExpression(expression);
						break;
					}
					case "VariableNameExpression": {
						// FIXME: these aren't good defaults, but there aren't really any good defaults
						const expression = {
							t: expressionType,
							name: "",
						};
						this.changeExpression(expression);
						break;
					}
					default:
						console.log("Unknown expression", expressionType);
				}
			},
		},
	}
</script>

<style scoped>
	.expression {
		display: flex;
	}
</style>
