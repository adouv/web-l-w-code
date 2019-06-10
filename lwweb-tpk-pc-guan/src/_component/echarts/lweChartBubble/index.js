import LweChartBubbleComponent from './index.vue'
/**
 * 
 * @param {*} Vue 
 */
export const lweChartBubbleInstall = (Vue) => {
    const Constructor = Vue.extend(LweChartBubbleComponent);
    Vue.component('lwe-bubble', Constructor);
}