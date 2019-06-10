// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './index.vue'
import store from '../../_store/store'
import vs from '../../_ddd/vue.service'
import echarts from 'echarts'

Vue.config.productionTip = false

Vue.echarts = Vue.prototype.$echarts = echarts

vs.init(Vue);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  template: '<App/>',
  components: {
    App
  }
})
