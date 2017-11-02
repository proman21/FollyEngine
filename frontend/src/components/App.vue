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
      <div class="site-wrapper">
         <div class="site-wrapper-inner">
            <div class = "cover-container">
               <div class="inner">
                  <a href="index.html">
                  <img src="img/realengine.png" alt="Real Engine" style="width:670px;height:80px;">
                  </a>
               </div>
            </div>
            <div class="topnav">
               <ul class = "main-menu">
					<li><router-link to="/scenes">Scenes</router-link></li>
					<li><router-link to="/devices">Devices</router-link></li>
					<li><router-link to="/entities">Entities</router-link></li>
					<li><router-link to="/actions">Actions</router-link></li>
               </ul>
            </div>
			<div>
				<router-view>
					<!-- Current route is rendered here -->
				</router-view>
			</div>
		 </div>
	  </div>
</template>

<script>
	export default {
		data: () => ({
		}),

		components: {
		},

		methods: {
		}
	}

</script>

<style>
</style>
