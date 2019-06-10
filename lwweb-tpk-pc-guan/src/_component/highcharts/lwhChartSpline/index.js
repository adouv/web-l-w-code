import LwhChartSplintComponent from './index.vue'
/**
 * 实时刷新曲线图组件
 * @param {*} Vue 
 */
export const lwhChartSplintInstall = (Vue) => {
    const Constructor = Vue.extend(LwhChartSplintComponent);
    Vue.component('lwh-spline', Constructor);
}