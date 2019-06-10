import LwSelectNameComponent from './index.vue'
/**
 * 选择姓名组件
 * @param {*} Vue 实例 
 */
export const LwSelectNameInstall = (Vue) => {
    const Constructor = Vue.extend(LwSelectNameComponent);
    Vue.component('lw-select-name', Constructor);
}