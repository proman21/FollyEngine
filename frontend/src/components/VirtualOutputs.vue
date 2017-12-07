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
	<div v-if="loading">
		Loading...
	</div>

	<div v-else class="container">
		<button type="button" class="btn btn-primary" v-on:click="toggleNewVirtualOutput">New virtual output</button>

		<div v-if="this.showNewPanel" class="card bg-light">
			<div class="card-body">
				<form>
					<div class="form-row">
						<div class="form-group col-md-4">
							<label for="name" class="col-form-label">Name</label>
							<input type="text" name="name" v-model="newVirtualOutput.name" class="form-control" autocomplete="off">
						</div>
					</div>
					<button type="submit" class="btn btn-primary" v-on:click.prevent="create">Create virtual output</button>
				</form>
			</div>
		</div>

		<div class="card">
			<div class="card-header">Virtual Outputs</div>
			<div class="list-group">
				<div v-for="output in virtualOutputs" class="list-group-item">
					<div v-if="isEditMode(output.id)">
						<form>
							<div class="form-row">
								<div class="form-group col-md-4">
									<label for="name" class="col-form-label">Name</label>
									<input
										type="text"
										name="name"
										v-bind:value="getVirtualOutputName(output.id)"
										v-on:input="setVirtualOutputName(output.id, $event.target.value)"
										class="form-control"
										autocomplete="off"
									>
								</div>
								<div class="form-group col-md-4">
									<label for="device-output" class="col-form-label">Output</label>
									<input
										type="text"
										name="device-output"
										v-bind:value="getVirtualOutputDeviceOutput(output.id)"
										v-on:input="setVirtualOutputDeviceOutput(output.id, parseInt($event.target.value) || null)"
										class="form-control"
										autocomplete="off"
									>
								</div>
							</div>
							<button type="button" class="btn btn-secondary" v-on:click="cancelEdit(output.id)">Cancel</button>
							<button type="submit" class="btn btn-primary" v-on:click.prevent="save(output.id)">Save</button>
						</form>
					</div>
					<div v-else class="row">
						<div class="col">
							{{ output.name }}
						</div>
						<div class="col">
							Linked to
							<span v-if="output.device_output_id === null">
								nothing yet
							</span>
							<span v-else>
								{{ output.device_output_id }}
							</span>
						</div>
						<div class="col text-right">
							<a type="button" href="#" v-on:click.prevent="showEdit(output.id)">Edit</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: [],

		data: () => ({
			loading: true,
			showNewPanel: false,
			newVirtualOutput: {
				name: "",
			},
			editSet: [],
			editOutputs: {},
		}),

		components: {
		},
		
		methods: {
			toggleNewVirtualOutput() {
				this.showNewPanel = !this.showNewPanel;
			},

			async create() {
				const virtualOutput = Object.assign({}, this.newVirtualOutput);

				await this.$store.dispatch('newVirtualOutput', { virtualOutput });

				// hide panel and reset data
				this.showNewPanel = false;
				this.newVirtualOutput = {
					name: "",
				};
			},

			showEdit(outputId) {
				if (!this.editSet.includes(outputId)) {
					this.editSet.push(outputId);
				}

				const virtualOutput = this.virtualOutputs[outputId];
				this.editOutputs[outputId] = Object.assign({}, virtualOutput);
			},

			cancelEdit(outputId) {
				const index = this.editSet.indexOf(outputId);
				if (index != -1) {
					this.editSet.splice(index, 1);
				}
			},

			isEditMode(outputId) {
				return this.editSet.includes(outputId);
			},

			async save(outputId) {
				const virtualOutput = this.editOutputs[outputId];
				await this.$store.dispatch('updateVirtualOutput', { virtualOutput });

				// turn off edit mode after saving changes
				this.cancelEdit(outputId);
			},

			getVirtualOutputName(outputId) {
				return this.editOutputs[outputId].name;
			},

			setVirtualOutputName(outputId, name) {
				const virtualOutput = this.editOutputs[outputId];

				this.editOutputs[outputId] = Object.assign({}, virtualOutput, { name })
			},

			getVirtualOutputDeviceOutput(outputId) {
				return this.editOutputs[outputId].device_output_id;
			},

			setVirtualOutputDeviceOutput(outputId, deviceOutputId) {
				const virtualOutput = this.editOutputs[outputId];

				this.editOutputs[outputId] = Object.assign({}, virtualOutput, { device_output_id: deviceOutputId })
			},
		},

		computed: {
			virtualOutputs: function() {
				return this.$store.state.devices.virtualOutputs;
			},
		},

		async created() {
			await this.$store.dispatch('fetchVirtualOutputs');
			this.loading = false;
		},
	}
</script>

<style>
</style>

