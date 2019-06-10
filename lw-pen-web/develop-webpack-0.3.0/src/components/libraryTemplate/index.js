import LibraryTemplateComponent from './libraryTemplate.vue'
/** 
 * 校本题库右侧数据
 * 
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(LibraryTemplateComponent);
    Vue.component('lw-library-template', Constructor);
  }
}
