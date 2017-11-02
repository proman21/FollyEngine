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
	<div class="form-inline">
		<div class="form-group">
			<div class="input-group">
				<label for="object" class="input-group-addon">Object</label>
				<input name="object" type="text" v-model="object" class="form-control" placeholder="object...">
			</div>
		</div>
		<div class="form-group">
			<div class="input-group">
				<label for="name" class="input-group-addon">.</label>
				<input name="name" type="text" v-model="name" class="form-control" placeholder="attribute name...">
			</div>
		</div>
		<div class="form-group">
			<div class="form-inline">
				<div class="form-group">
					<label>=</label>
				</div>
				<div class="form-group">
					<expression-node v-bind:expression="statement.rvalue" v-on:change="rvalueChanged"></expression-node>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import ExpressionNode from "./ActionNodeExpression.vue";

	export default {
		props: ['statement'],

		components: {
			'expression-node': ExpressionNode,
		},

		computed: {
			object: {
				get: function() {
					return this.$props.statement.obj;
				},

				set: function(object) {
					const statement = Object.assign({}, this.$props.statement, { obj: object });
					this.$emit('change', statement);
				},
			},

			name: {
				get: function() {
					return this.$props.statement.name;
				},

				set: function(name) {
					const statement = Object.assign({}, this.$props.statement, { name });
					this.$emit('change', statement);
				},
			},
		},

		methods: {
			rvalueChanged: function(expression) {
				const statement = Object.assign({}, this.$props.statement, { rvalue: expression });
				this.$emit('change', statement);
			},
		},
	}
</script>

<style scoped>
</style>
