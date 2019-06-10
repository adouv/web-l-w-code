import powerScatterComponent from './index.vue';

export const powerScatterComponentInstall = (Vue) => {
    const Constructor = Vue.extend(powerScatterComponent);
    Vue.component('lw-powerScatter', Constructor);
}