import ModalComponent from "./modal.vue";

export default {
  install(Vue, PluginOptions = {}) {

    Object.defineProperty(Vue.prototype, 'modal$', {
      get() {
        let div = document.createElement('div');
        document.body.appendChild(div);
        return (options, show = true) => {
          const Constructor = Vue.extend(ModalComponent);
          const Instance = new Constructor({
            data() {
              return {
                show: show,
                modalOptions: options
              }
            }
          }).$mount(div);
        }
      }
    });

    Vue.modal = Vue.prototype.modal$;
  }
};