// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './index.vue'
import store from '../../_store/store'
import router from './router'
import { VueInit } from '../../_ddd/init.service'

Vue.config.productionTip = false

VueInit(Vue)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {
        App
    }
})