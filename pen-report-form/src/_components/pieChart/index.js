import pieChartComponent from './index.vue';

export const pieChartComponentInstall = (Vue) => {
    const Constructor = Vue.extend(pieChartComponent);
    Vue.component('lw-pie-chart', Constructor);
} 