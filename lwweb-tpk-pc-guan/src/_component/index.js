import { lwTemplateInstall } from './template'
import { lwExpansionInstall } from './expansion'
import { lwHighchartsInstall } from './highcharts'
import { lwEchartsInstall } from './echarts'
/** 
 * 
 */
export const lwComponentInstall = (Vue) => {
    lwTemplateInstall(Vue);
    lwExpansionInstall(Vue);
    lwHighchartsInstall(Vue);
    lwEchartsInstall(Vue);
}