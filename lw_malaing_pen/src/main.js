// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './_store'
import { DtoInit } from './_dto'
import { DDDInit } from './_ddd'
import { FilterInit } from './_filters'
import { ServicesInit } from './_services'
import { ComponentInit } from './_component/'
import { DirectiveInit } from './_directives'
import './assets/icon-font/iconfont.css'
import './assets/scss/common/index.scss'
import '../node_modules/flex.css/dist/flex.css'


Vue.config.productionTip = false

//实体
DtoInit(Vue);
//工具类
DDDInit(Vue);
//过滤器
FilterInit(Vue);
//服务
ServicesInit(Vue);
//组件
ComponentInit(Vue);
//指令
DirectiveInit(Vue);

/* eslint-disable no-new */
Vue.prototype.$eventHub= Vue.prototype.$eventHub ||  new Vue()  
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>',
    data: {
        eventHub: new Vue()
      }
})