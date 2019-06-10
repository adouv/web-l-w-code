import SelectedPersonComponent from './selectedPerson.vue'
/** 
 * 选人控件--右侧已选人员
 * 
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(SelectedPersonComponent);
    Vue.component('lw-selected-person', Constructor);
  }
}
