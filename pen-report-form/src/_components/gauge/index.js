import gaugeComponent from './index.vue';


export const gaugeComponentInstall = (Vue) => {
    const Constructor = Vue.extend(gaugeComponent);
    Vue.component('lw-gauge', Constructor);
}

