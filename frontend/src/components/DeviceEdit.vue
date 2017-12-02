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
		<h2>Edit Device {{ device.id }}</h2>
		<div class="row">
			<div class="col-md-6">
				<label for="id">Id</label>
				<div class="textbox">
					<input name="id" type="text" v-bind:value="device.id" disabled>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<label for="model_id">Model Id</label>
				<div class="textbox">
					<input name="model_id" type="text" v-bind:value="device.model_id" disabled>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<label for="ip">IP Address</label>
				<div class="textbox">
					<input name="ip" type="text" v-model="ip">
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-6">
				<label for="purpose">Purpose</label>
				<div class="textbox">
					<input name="purpose" type="text" v-model="purpose">
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-1">
				<button class="btn btn-primary" v-on:click="deleteDevice()">Delete</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['id'],

		data: () => ({
		}),

		components: {
		},

		methods: {
			deleteDevice() {
				const device = this.device;
				this.$store.dispatch('deleteDevice', { device });
				this.$router.push({ path: '/devices' });
			},
		},

		computed: {
			device() {
				return this.$store.getters.deviceById(this.$props.id);
			},

			//
			// This is tedious but recommended, see https://vuex.vuejs.org/en/forms.html.
			//

			ip: {
				get: function() {
					return this.device.ip;
				},

				set: function(ip) {
					const device = Object.assign({}, this.device, { ip });
					this.$store.dispatch('updateDevice', { device });
				},
			},

			purpose: {
				get: function() {
					return this.device.purpose;
				},

				set: function(purpose) {
					const device = Object.assign({}, this.device, { purpose });
					this.$store.dispatch('updateDevice', { device });
				},
			},
		},
	}
</script>

<style scoped>
</style>
