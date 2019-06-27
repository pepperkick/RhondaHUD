import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import socket from 'vue-socket.io';

Vue.config.productionTip = false

Vue.use(new socket({
  connection: `http://127.0.0.1:${process.env.VUE_APP_SOCKET_PORT}`,
  vuex: {
    store,        
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}));

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
