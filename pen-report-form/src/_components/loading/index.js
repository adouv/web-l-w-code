import loadingComponent from './index.vue';

export const loadingComponentInsatll = (Vue) => {
    const Constructor = Vue.extend(loadingComponent);
    Vue.component('lw-loading', Constructor);
}