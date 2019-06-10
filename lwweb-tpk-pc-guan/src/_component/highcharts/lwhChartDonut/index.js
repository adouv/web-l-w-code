import LwhChartDonutComponent from './index.vue'
/**
 * 3D 环形图
 * @param {*} Vue 
 */
export const lwhChartDonutInstall = (Vue) => {
    const Constructor = Vue.extend(LwhChartDonutComponent);
    Vue.component('lwh-pie', Constructor);
}