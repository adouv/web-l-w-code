import Vue from 'vue'
import Router from 'vue-router'
import LwPageGuanComponent from '@/modules/guan/index.vue'
import LwPageIntelligentMonitoringComponent from '@/modules/intelligentMonitoring/index.vue'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'lwpGuan',
        component: LwPageGuanComponent
    }, {
        path: '/lwPageIntelligentMonitoring',
        name: 'lwPageIntelligentMonitoring',
        component: LwPageIntelligentMonitoringComponent
    }]
})