import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// Verificar autenticación al iniciar la app
store.dispatch('checkAuth');

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
