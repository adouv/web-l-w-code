import studenInfoTableComponent from './index.vue';

export const studenInfoTableComponentInstall = (Vue) => {
    const Constructor = Vue.extend(studenInfoTableComponent);
    Vue.component('lw-studentInfoTable', Constructor);
}