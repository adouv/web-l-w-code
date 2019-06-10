import Vue from 'vue'
import Router from 'vue-router'
import StudentListComponent from '../views/studentList/index.vue'
import AddStudentComponent from '../views/addStudent/index.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '',
      name: 'studentList',
      component: StudentListComponent
    },
    {
      path: '/addStudent',
      name: 'addStudent',
      component: AddStudentComponent
    }
  ]
})
