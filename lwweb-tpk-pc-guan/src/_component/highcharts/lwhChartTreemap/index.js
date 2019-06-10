import LwhChartTreemapComponent from './index.vue'
/**
 * 柏拉图
 * @param {*} Vue 
 */
export const lwhChartTreemapInstall = (Vue) => {
    const Constructor = Vue.extend(LwhChartTreemapComponent);
    Vue.component('lwh-treemap', Constructor);
}