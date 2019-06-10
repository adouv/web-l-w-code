 import confirm from './confirm';
 export default {
     init(Vue, options = {}) {
         Vue.confirm = Vue.prototype.confirm$ = confirm;
     }
 }