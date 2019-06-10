import AnswerChartComponent from './answerChart.vue'
/** 
 * 饼图
 * 
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(AnswerChartComponent);
    Vue.component('lw-answer-chart', Constructor);
  }
}
