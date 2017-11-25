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
		<div v-for="(statement, index) in statement.statements">
			<div class="card">
				<div class="card-header">
					<div class="dropdown">
						<button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
							{{ headers[statement.t] }}
							<span class="caret"></span>
						</button>
						<ul class="dropdown-menu">
							<li><a class="dropdown-item" href="#" v-on:click.prevent="remove(index)">Delete Statement</a></li>
						</ul>
					</div>
				</div>
				<div class="card-body">
					<statement-node v-bind:statement="statement" v-on:change="changed(index, $event)"></statement-node>
				</div>
			</div>
		</div>
		<div class="dropdown">
			<button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				Add Statement
			</button>
			<ul class="dropdown-menu">
				<li v-for="option in options">
					<a class="dropdown-item" href="#" v-on:click.prevent="select(option)">
						{{option.text}}
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import StatementNode from "./ActionNodeStatement.vue";

	export default {
		name: 'compound-statement',

		props: ['statement'],

		data: () => ({
			options: [
				{ key: 'AssignmentStatement', text: 'Assignment' },
				{ key: 'IfElseStatement', text: 'If-Else' },
				{ key: 'OutputStatement', text: 'Output' },
				{ key: 'PrintStatement', text: 'Print' },
				{ key: 'SetAttrStatement', text: 'Set Attribute' },
			],

			headers: {
				'CompoundStatement': 'Statements',
				'AssignmentStatement': 'Assignment',
				'IfElseStatement': 'If-Else',
				'OutputStatement': 'Output',
				'PrintStatement': 'Print',
				'SetAttrStatement': 'Set Attribute',
			},
		}),

		components: {
			'statement-node': StatementNode,
		},

		methods: {
			changed: function(index, statement) {
				const statements = Array.from(this.$props.statement.statements); // copy
				const removed = statements.splice(index, 1, statement); // update the statement at the given index

				this.$emit('change', {
					t: this.$props.statement.t,
					statements,
				});
			},

			remove: function(index) {
				const statements = Array.from(this.$props.statement.statements); // copy
				const removed = statements.splice(index, 1); // remove the statement at the given index

				this.$emit('change', {
					t: this.$props.statement.t,
					statements,
				});
			},

			select: function(option) {
				switch (option.key) {
					case "AssignmentStatement": {
						const statement = {
							t: option.key,
							name: null,
							rvalue: {
								t: "StringLiteral",
								value: "",
							}
						};
						this.addStatement(statement);
						break;
					}
					case "PrintStatement": {
						const statement = {
							t: option.key,
							expression: {
								t: "StringLiteral",
								value: "",
							}
						};
						this.addStatement(statement);
						break;
					}
					case "OutputStatement": {
						const statement = {
							t: option.key,
							output: null,
							resource: {
								t: "StringLiteral",
								value: "",
							},
						};
						this.addStatement(statement);
						break;
					}
					case "IfElseStatement": {
						const statement = {
							t: option.key,
							condition: {
								t: "BooleanLiteral",
								value: true,
							},
							if_body: {
								t: "CompoundStatement",
								statements: [],
							},
							else_body: {
								t: "CompoundStatement",
								statements: [],
							},
						};
						this.addStatement(statement);
						break;
					}
					case "SetAttrStatement": {
						const statement = {
							t: option.key,
							obj: "__INPUT__",
							name: null,
							rvalue: {
								t: "StringLiteral",
								value: "",
							}
						};
						this.addStatement(statement);
						break;
					}
					default:
						console.log("Unknown statement");
				}
			},

			addStatement: function(newStatement) {
				const statements = [...this.$props.statement.statements, newStatement];

				const statement = Object.assign({}, this.$props.statement, { statements });
				this.$emit('change', statement);
			},
		},
	}
</script>

<style scoped>
</style>
