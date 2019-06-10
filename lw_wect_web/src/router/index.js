import Vue from 'vue'
import Router from 'vue-router'
import AuthService from '../_ddd/auth.service'
import TianDingIndexComponent from '@/modules'


Vue.use(Router)

let routes = [{
        path: '/',
        name: 'tdIndex',
        component: TianDingIndexComponent
    },
    {
        path: '/tdIndex',
        name: 'tdIndex',
        component: TianDingIndexComponent
    }
];

const router = new Router({
    mode: 'history',
    routes: routes
});

AuthService.tokenAuth(Vue, router, routes);

export default router;