import MultidimensionalBarComponent from './index.vue';

export const multidimensionalBarComponentInstall = (Vue) => {
    const Constructor = Vue.extend(MultidimensionalBarComponent);
    Vue.component('lw-multidimensional', Constructor);
}