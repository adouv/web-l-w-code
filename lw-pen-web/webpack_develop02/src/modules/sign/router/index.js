import Vue from 'vue'
import Router from 'vue-router'
import SignComponent from '../views/sign/index.vue'
import SignClassComponent from '../views/signClass/index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'sign',
      component: SignComponent
    },
    {
      path: '/signClass',
      name: 'signClass',
      component: SignClassComponent
    }
  ]
})
