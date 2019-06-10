import EllipticalPageComponent from './ellipticalPage.vue'
/** 
 * 全局缺省页
 * 
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(EllipticalPageComponent);
    Vue.component('lw-elliptical-page', Constructor);
  }
}
