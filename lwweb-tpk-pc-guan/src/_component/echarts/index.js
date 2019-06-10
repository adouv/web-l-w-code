import echarts from 'echarts';
import { lweChartInsideInstall } from './lweChartInside'
import { lweChartBubbleInstall } from './lweChartBubble'
/**
 * 
 * @param {*} Vue 
 */
export const lwEchartsInstall = (Vue) => {
    Vue.echarts = Vue.prototype.echarts$ = echarts;

    lweChartInsideInstall(Vue);
    lweChartBubbleInstall(Vue);
}