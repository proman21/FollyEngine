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
	<div class="maincontent" id="devices">
		<div v-if="loading">
			Loading...
		</div>

		<div v-else>
			<div class="row">
				<div class="col-md-2">
					<div class="lists">
						<h4>Current Devices</h4>
						<ul>
							<li v-for="device in devices" v-bind:key="device.id">
								<router-link :to="{ name: 'devices', params: { id: device.id } }">
									({{ device.id }}) {{ device.ip }} -- {{ device.purpose }}
							</router-link>
							</li>
						</ul>
						<button class="btn btn-primary" v-on:click="pingDevices">Ping Devices</button>
						<br />
					</div>
				</div>
				<div class="col-md-10 inner-section">
					<div v-if="id !== undefined">
						<h2>Edit {{ device.type }}</h2>
						<device-edit :id="id"></device-edit>
					</div>
					<div v-else>
						<h4>No device selected</h4>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import DeviceEdit from "./DeviceEdit.vue";

	export default {
		props: ['id'],

		data: () => ({
			loading: true,
		}),

		components: {
			'device-edit': DeviceEdit,
		},

		methods: {
			newDevice: function() {
				this.$store.dispatch('newDevice')
					.then(device => {
						this.$router.push({ name: 'devices', params: { id: device.id } })
					})
					.catch(console.log)
			},
			pingDevices: function() {
				this.$store.dispatch('pingDevices')
					.catch(console.log)
			},
		},

		computed: {
			devices() {
				return this.$store.state.devices.devices;
			},

			device() {
				return this.$store.getters.deviceById(this.$props.id);
			},
		},

		async created() {
			await this.$store.dispatch('fetchDevices');
			this.loading = false;
		}
	}
</script>

<style>
	#device-view-wrapper {
		display: grid;
		grid-template-columns: 1fr 3fr;
	}
</style>
