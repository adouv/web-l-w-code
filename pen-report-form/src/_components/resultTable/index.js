import resultTableComponent from './index.vue';

export const resultTableComponentInstall = (Vue) => {
    const Constructor = Vue.extend(resultTableComponent);
    Vue.component('lw-result-table', Constructor);
} 