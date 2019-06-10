import LwhChartParetoComponent from './index.vue'
/**
 * 实时刷新曲线图组件
 * @param {*} Vue 
 */
export const lwhChartParetoInstall = (Vue) => {
    const Constructor = Vue.extend(LwhChartParetoComponent);
    Vue.component('lwh-pareto', Constructor);
}