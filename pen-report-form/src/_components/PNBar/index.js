import positiveAndNegativeBarComponent from './index.vue';

export const positiveAndNegativeBarComponentInstall = (Vue) => {
    const Constructor = Vue.extend(positiveAndNegativeBarComponent);
    Vue.component('lw-PNBar', Constructor);
}