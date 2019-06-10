import CollapseTreeComponent from './CollapseTree.vue'
/** 
 * 校本题库选择左侧树列表
 * 
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(CollapseTreeComponent);
    Vue.component('lw-collapse-tree', Constructor);
  }
}
