import colorfulKeysChartComponent from './index.vue';

export const colorfulKeysChartComponentInstall = (Vue) => {
    const Constructor = Vue.extend(colorfulKeysChartComponent);
    Vue.component('lw-bar', Constructor);
} 