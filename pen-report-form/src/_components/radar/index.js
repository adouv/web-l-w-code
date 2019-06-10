import radarComponent  from './index.vue';

export const radarComponentInstall = (Vue) => {
    const Constructor = Vue.extend(radarComponent);
    Vue.component('lw-radar', Constructor);
}
