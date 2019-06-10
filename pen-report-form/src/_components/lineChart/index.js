import lineChartComponent from './index.vue';

export const lineChartComponentInstall = (Vue) => {
    const Constructor = Vue.extend(lineChartComponent);
    Vue.component('lw-line-chart', Constructor);
} 