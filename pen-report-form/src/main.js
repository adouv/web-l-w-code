// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ddd from './_ddd'
import { FilterInit } from '@/_filters'
import { ComponentInit } from '@/_components/index.js';


import echarts from  'echarts';

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '../node_modules/flex.css/dist/flex.css'
import './assets/icon-font/iconfont.css'




Vue.config.productionTip = false;

Vue.prototype.$echarts = echarts ;

Vue.use(ElementUI, { locale });

Vue.utils = Vue.prototype.utils$ = ddd.UtilService
Vue.use(ElementUI, { locale })
Vue.filter('formatSeconds', function (data) {
  return ddd.UtilService.fromatDate(data);
})
Vue.filter('toPrecision', function (data) {
  return parseFloat((data * 100).toPrecision(12)) + "%";
})
Vue.filter('toOption', function (data) {
  let str = '';
  if (data == 0) {
    str = "得分";
  } else if (data == 1) {
    str = "对错";
  } else {
    str = "选项";
  }
  return str;
})
ComponentInit(Vue);
FilterInit(Vue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
