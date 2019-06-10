import LwSmallTitleComponent from './index.vue';
/** 
 * 小标题组件
 */
export const LwSmallTitleInstall = (Vue) => {
    const Constructor = Vue.extend(LwSmallTitleComponent);
    Vue.component('lw-stitle', Constructor);
}