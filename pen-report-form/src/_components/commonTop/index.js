import commonTopComponent from './index.vue';

export const commonTopComponentInstall = (Vue) => {
    const Constructor = Vue.extend(commonTopComponent);
    Vue.component('lw-common-top', Constructor);
} 