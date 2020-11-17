import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

Vue.mixin({
  methods: {  
    handle_function_call(function_name, parameters) {
      this[function_name](parameters)
  }  
  }
})

Vue.directive('visible', function(el, binding) {
	el.style.visibility = binding.value ? 'visible' : 'hidden';
});