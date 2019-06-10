import WinCloseComponent from './tools.vue'
/** 
 * win窗体关闭公共组件
 * :params可传可不传
 * 页面使用 <lw-win-close :params="params"></lw-win-close>
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(WinCloseComponent);
    Vue.component('lw-win-tools', Constructor);
  }
}
