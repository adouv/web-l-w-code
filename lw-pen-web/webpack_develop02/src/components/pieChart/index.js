import PieChartComponent from './pieChart.vue'
/** 
 * 饼图
 * 
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(PieChartComponent);
    Vue.component('lw-pie-chart', Constructor);
  }
}
