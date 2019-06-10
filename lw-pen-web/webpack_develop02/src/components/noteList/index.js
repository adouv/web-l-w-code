import LwNoteListComponent from './noteList.vue'
/** 
 * canvas笔记绘制
 * 
 */
export default {
  install(Vue, PluginOptions = {}) {
    const Constructor = Vue.extend(LwNoteListComponent);
    Vue.component('lw-note-list', Constructor);
  }
}
