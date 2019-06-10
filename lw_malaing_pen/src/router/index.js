import Vue from 'vue'
import Router from 'vue-router'
import ExerciseManageComponent from "@/modules/exerciseManage/index"
import TestFormComponent from "@/modules/exerciseManage/test-form"
import GroupExerciseComponent from "@/modules/exerciseManage/group-exercise"
import LoginComponent from "@/modules/login/index"

// import ExerciseManage from "../modules/exerciseManage/ExerciseManage"
Vue.use(Router)

export default new Router({
    routes: [{
            path: '/login',
            name: 'login',
            component: LoginComponent
        },
        {
            path: '',
            name: '',
            component: LoginComponent
        },
        {
            path: '/exerciseManage',
            name: 'exerciseManage',
            component: ExerciseManageComponent
        },

        {
            path: '/exerciseManage/groupExercise',
            name: 'groupExercise',
            component: GroupExerciseComponent
        },
        {
            path: '/testForm',
            name: 'testForm',
            component: TestFormComponent
        },
        
    ]
})