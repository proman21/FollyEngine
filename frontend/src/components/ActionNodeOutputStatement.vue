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
		<div>
			<label for="output">Virtual Output</label>
			<div class="dropdown">
				<button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span v-if="output === null">
						Select Output…
					</span>
					<span v-else>
						{{ output.id }}: {{ output.name }}
					</span>
				</button>
				<div class="dropdown-menu">
					<button
						v-for="output in virtualOutputs"
						v-bind:key="output.id"
						class="dropdown-item"
						type="button"
						v-on:click="selectOutput(output.id)"
					>
						{{ output.id }}: {{ output.name }}
					</button>
					<div class="dropdown-divider"></div>
					<router-link v-bind:to="{ name: 'virtual-outputs' }" class="dropdown-item">
						Edit Virtual Outputs
					</router-link>
				</div>
			</div>
		</div>
		<div>
			<label for="resource">Text</label>
			<expression-node v-bind:expression="statement.resource" v-on:change="resourceChanged"></expression-node>
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
			virtualOutputs: function() {
				return this.$store.state.devices.virtualOutputs;
			},

			output: {
				get: function() {
					const outputId = this.$props.statement.output;
					if (outputId === null) {
						return null;
					}

					return this.virtualOutputs[outputId];
				},

				set: function(outputId) {
					const statement = Object.assign({}, this.$props.statement, { output: outputId });
					this.$emit('change', statement);
				},
			},
		},

		methods: {
			resourceChanged: function(expression) {
				const statement = Object.assign({}, this.$props.statement, { resource: expression });
				this.$emit('change', statement);
			},

			selectOutput: function(outputId) {
				this.output = outputId;
			},
		},
	}
</script>

<style scoped>
</style>
