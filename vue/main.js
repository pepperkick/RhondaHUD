import Vue from 'vue'

import App from './App.vue'
import router from './router'

import Socket from 'vue-socket.io'
import VueNativeSock from 'vue-native-websocket'

import '@/assets/tailwind.css'

Vue.config.productionTip = false;

Vue.use(VueNativeSock, 'ws://localhost:5540', { protocol: 'game-data', format: 'json' });

Vue.use(new Socket({
  connection: `http://${process.env.VUE_APP_ELECTRON_HOST}:${process.env.VUE_APP_ELECTRON_SOCKET_PORT}`
}));

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app');
