import LwhChartVennComponent from './index.vue'
/**
 * 韦恩图组件
 * @param {*} Vue 
 */
export const lwhChartVennInstall = (Vue) => {
    const Constructor = Vue.extend(LwhChartVennComponent);
    Vue.component('lwh-venn', Constructor);
}