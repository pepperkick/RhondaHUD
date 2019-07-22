import Vue from 'vue'

import App from './App.vue'
import store from './store'
import router from './router'

import axios from 'axios'
import Socket from 'vue-socket.io';
import VueNativeSock from 'vue-native-websocket'

import '@/assets/tailwind.css'

Vue.config.productionTip = false;

var axiosInstance = axios.create({
  baseURL: `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_API_PORT}`
});

Vue.prototype.$axios = axiosInstance;

Vue.use(new Socket({
  connection: `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_SOCKET_PORT}`,
  vuex: {
    store,        
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}));

Vue.use(VueNativeSock, 'ws://localhost:5540', { protocol: 'game-data', format: 'json' });

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app');
