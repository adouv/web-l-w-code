// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import App from './App'
import router from './router'
import ddd from './_ddd'
import store from './_store'
import component from './_components'

import '@/assets/scss/index.scss'
import '@/assets/tdfonts/iconfont.css'
import '@node/font-awesome/scss/font-awesome.scss'
// mintUI
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

// ddd
Vue.http = Vue.prototype.http$ = ddd.HttpService
Vue.local = Vue.prototype.local$ = ddd.LocalStorageService
Vue.utils = Vue.prototype.utils$ = ddd.UtilService
Vue.stores = Vue.prototype.stores$ = ddd.StoreService
Vue.cookies = Vue.prototype.cookies$ = VueCookies;
// mint-ui扩展
Vue.toast = Vue.prototype.toast$ = MintUI.Toast;
Vue.indicator = Vue.prototype.indicator$ = MintUI.Indicator;

component.init(Vue);

Vue.config.productionTip = false
    /* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: {
        App
    },
    template: '<App/>'
})