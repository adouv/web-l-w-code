import LwTitleComponent from './index.vue';
/** 
 * 主标题组件
 */
export const LwTitleInstall = (Vue) => {
    const Constructor = Vue.extend(LwTitleComponent);
    Vue.component('lw-title', Constructor);
}