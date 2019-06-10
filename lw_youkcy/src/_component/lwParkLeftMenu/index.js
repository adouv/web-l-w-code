import LwParkLeftMenuComponent from './index.vue'
/**
 * 应用园区绑定左侧
 * @param {*} Vue 实例 
 */
export const LwParkLeftMenuInstall = (Vue) => {
    const Constructor = Vue.extend(LwParkLeftMenuComponent);
    Vue.component('lw-park-left-menu', Constructor);
}