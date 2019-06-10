import popComponent from './index.vue';

export const popComponentInstall = (Vue) => {
    const Constructor = Vue.extend(popComponent);
    Vue.component('lw-pop', Constructor);
} 