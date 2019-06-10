import LweChartInsideComponent from './index.vue';
/**
 * 
 * @param {*} Vue 
 */
export const lweChartInsideInstall = (Vue) => {
    const Constructor = Vue.extend(LweChartInsideComponent);
    Vue.component('lwe-inside', Constructor);
}