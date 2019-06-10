// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './_store'

import { lwComponentInstall } from './_component'
import { lwDriectiveInstall } from './_directive'
import { lwDDDInstall } from './_ddd'

import './assets/icon-font/font-ketangjiaohu/iconfont.css'
import './assets/icon-font/font-pc/iconfont.css'
import './assets/icon-font/font-pen-pc/iconfont.css'
import '../node_modules/flex.css/dist/flex.css'
import './assets/scss/index.scss'

lwDDDInstall(Vue)
lwComponentInstall(Vue)
lwDriectiveInstall(Vue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})