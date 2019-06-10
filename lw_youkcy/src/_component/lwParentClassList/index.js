import LWParentClassListComponent from './index.vue'
/**
 * 选择姓名组件
 * @param {*} Vue 实例 
 */
export const LWParentClassListInstall = (Vue) => {
    const Constructor = Vue.extend(LWParentClassListComponent);
    Vue.component('lw-parent-class-list', Constructor);
}