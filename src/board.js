import Vue from 'vue'
import VueRouter from 'vue-router'

// router setup
import routes from './routes/routes'

//http service
import VueResource from 'vue-resource'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import FastClick from 'fastclick'

import App from './App.vue'

// plugin setup

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(MintUI)
Vue.http.options.emulateJSON = true;

FastClick.attach(document.body);

// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
