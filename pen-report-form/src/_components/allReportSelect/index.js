import allReportSelectComponent from './index.vue';

export const allReportSelectComponentInstall = (Vue) => {
    const Constructor = Vue.extend(allReportSelectComponent);
    Vue.component('lw-all-report-select', Constructor);
}