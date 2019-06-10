import NoteDrawComponent from './noteDraw.vue'
/** 
 * canvas笔记绘制
 * 
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(NoteDrawComponent);
    Vue.component('lw-note-draw', Constructor);
  }
}
