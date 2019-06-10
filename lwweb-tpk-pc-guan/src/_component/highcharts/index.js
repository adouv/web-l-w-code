import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stock from 'highcharts/modules/stock'
import map from 'highcharts/modules/map'
import exporting from 'highcharts/modules/exporting'
import venn from 'highcharts/modules/venn'
import pareto from 'highcharts/modules/pareto'
import treemap from 'highcharts/modules/treemap'
import highcharts3d from 'highcharts/highcharts-3d'
import { lwhChartDonutInstall } from './lwhChartDonut/index'
import { lwhChartSplintInstall } from './lwhChartSpline/index'
import { lwhChartVennInstall } from './lwhChartVenn/index'
import { lwhChartParetoInstall } from './lwhChartPareto/index'
import { lwhChartTreemapInstall } from './lwhChartTreemap/index'
/**
 * 图表插件组件安装
 * @param {*} Vue 
 */
export const lwHighchartsInstall = (Vue) => {
    stock(Highcharts);
    map(Highcharts);
    exporting(Highcharts);
    venn(Highcharts);
    pareto(Highcharts);
    treemap(Highcharts);
    highcharts3d(Highcharts);

    Vue.use(HighchartsVue);
    Vue.Highcharts = Vue.prototype.Highcharts = Highcharts;

    lwhChartDonutInstall(Vue);
    lwhChartSplintInstall(Vue);
    lwhChartVennInstall(Vue);
    lwhChartParetoInstall(Vue);
    lwhChartTreemapInstall(Vue);
}