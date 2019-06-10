import LwCardComponent from './index.vue';
/** 
 * 卡片组件
 */
export const lwCardInstall = (Vue) => {
    const Constructor = Vue.extend(LwCardComponent);
    Vue.component('lw-card', Constructor);
}