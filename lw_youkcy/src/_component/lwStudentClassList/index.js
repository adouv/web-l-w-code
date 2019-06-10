import LWStudentClassListComponent from './index.vue'
/**
 * 选择姓名组件
 * @param {*} Vue 实例 
 */
export const LWStudentClassListInstall = (Vue) => {
    const Constructor = Vue.extend(LWStudentClassListComponent);
    Vue.component('lw-student-class-list', Constructor);
}