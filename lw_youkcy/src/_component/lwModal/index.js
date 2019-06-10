import LwModalComponent from './index.vue'
/**
 * 通用弹框
 * @param {*} Vue 实例 
 */
export const LwModalInstall = (Vue) => {
    const Constructor = Vue.extend(LwModalComponent);
    Vue.component('lw-modal', Constructor);
}