import LineChartComponent from './lineChart.vue'
/** 
 * 全局缺省页
 * 
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(LineChartComponent);
    Vue.component('lw-line-chart', Constructor);
  }
}
