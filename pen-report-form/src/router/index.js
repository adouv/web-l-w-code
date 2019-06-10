import Vue from 'vue'
import Router from 'vue-router'
import All from '@/components/All'
import Single from '@/components/single'
import Report from '@/components/report/report'
import Result from '@/components/resultsOverview'
import Loading from '@/components/loading'
import ExerciseSelect from '@/components/exercise'
import SmallAllReport from '@/components/smallAllReport'

import LwPageSignQuestionResultComponent from '../modules/sign';
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/all',
            name: 'all',
            component: All,
        },
        {
            path: '/single',
            name: 'single',
            component: Single,
        },
        {
            path: '/report',
            name: 'report',
            component: Report,
        },
        {
            path: '/result',
            name: 'result',
            component: Result,
        },
        {
            path: '/loading',
            name: 'loading',
            component: Loading
        },
        {
            path: '/exerciseSelect',
            name: 'exerciseSelect',
            component: ExerciseSelect
        },
        {
            path: '/smallAllReport',
            name: 'smallAllReport',
            component: SmallAllReport
        },
        {
            path: '*',
            redirect: '/single'
        }, //======
        //历史练习回看->单道题结果统计
        {
            path: '/LwPageSignQuestionResult',
            name: 'LwPageSignQuestionResult',
            component: LwPageSignQuestionResultComponent
        }
    ]
})