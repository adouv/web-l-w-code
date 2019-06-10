import LwProgressComponent from './index.vue'
/**
 * 进度条
 * @param {*} Vue 实例 
 */
export const LwProgressInstall = (Vue) => {
    const Constructor = Vue.extend(LwProgressComponent);
    Vue.component('lw-progress', Constructor);
}