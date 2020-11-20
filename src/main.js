import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './registerServiceWorker'

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
    },
    pushAlert(type, content) {
      this.alert.status = true,
        this.alert.type = type,
        this.alert.content = content;
      setTimeout(() => {
        this.deleteAlert()
      }, 7000);
    },
    deleteAlert() {
      this.alert.status = false,
        this.alert.type = undefined,
        this.alert.content = [];
    },
    pushModal(type, content) {
      this.modal.status = true,
        this.modal.title = content.title,
        this.modal.text = content.messages,
        this.modal.options = content.options
    },
    deleteModal() {
      this.loading_itemSubmit = false;
      this.modal.status = false,
        this.modal.title = undefined,
        this.modal.text = [],
        this.modal.options = []
    },   
    germanDate(dateString) {
      if (typeof dateString !== 'undefined' && dateString != null) {
      var c = dateString.split('-');
      var monthNames = ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
      return c[2] + '. ' + monthNames[Number(c[1])-1] + ' ' + c[0];
      } else {
        return '';
      }
    }
  }
})

Vue.directive('visible', function (el, binding) {
  el.style.visibility = binding.value ? 'visible' : 'hidden';
});