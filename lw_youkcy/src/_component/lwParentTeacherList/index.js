import LWTeacherListComponent from './index.vue'
/**
 * 选择姓名组件
 * @param {*} Vue 实例 
 */
export const LWTeacherListInstall = (Vue) => {
    const Constructor = Vue.extend(LWTeacherListComponent);
    Vue.component('lw-teacher-list', Constructor);
}