import funnelComponent from './index.vue';

export const funnelComponentInstall = (Vue) => {
    let Constructor = Vue.extend(funnelComponent);
    Vue.component('lw-funnel', Constructor);
}

