import Vue from 'vue'

import App from './App.vue'
import store from './store'
import router from './router'

import axios from 'axios'
import socket from 'vue-socket.io';

import '@/assets/tailwind.css'

Vue.config.productionTip = false

var axiosInstance = axios.create({
  baseURL: `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_API_PORT}`
})

Vue.prototype.$axios = axiosInstance

Vue.use(new socket({
  connection: `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_SOCKET_PORT}`,
  vuex: {
    store,        
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
