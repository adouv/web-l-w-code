import Vue from 'vue'
import canvasDragDirective from "./canvas-drag-directive";


export default {
  LoadDirectives() {
    Vue.use(canvasDragDirective);
  }
}
