import TreeComponent from './tree.vue'
/** 
 * 选人控件--选择园区
 * 
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(TreeComponent);
    Vue.component('lw-tree', Constructor);
  }
}
