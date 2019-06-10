import LWParentSelectChildListComponent from './index.vue'
/**
 * 选择姓名组件
 * @param {*} Vue 实例 
 */
export const LWParentSelectChildListInstall = (Vue) => {
    const Constructor = Vue.extend(LWParentSelectChildListComponent);
    Vue.component('lw-parent-select-child-list', Constructor);
}