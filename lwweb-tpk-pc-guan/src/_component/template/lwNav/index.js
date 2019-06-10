import LwNavComponent from './index.vue';
/** 
 * 导航组件
 */
export const lwNavInstall = (Vue) => {
    const Constructor = Vue.extend(LwNavComponent);
    Vue.component('lw-nav', Constructor);
}