import lineComponent from './index.vue';

export const lineComponentInstall = (Vue) =>  {
    const Constructor = Vue.extend(lineComponent);
    Vue.component('lw-line', Constructor);
}