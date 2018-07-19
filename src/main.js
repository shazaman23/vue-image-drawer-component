import Vue from 'vue';
import $ from 'jquery';
import 'bootstrap';
import App from './App.vue';
import './assets/app.scss';

window.$ = $;
window.jQuery = $;

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
