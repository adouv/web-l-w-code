import LwModalComponent from "./index.vue";
/**
 * 
 * @param {*} Vue 
 * @param {*} PluginOptions 
 */
export const LwModalInstall = (Vue, PluginOptions = {}) => {
    Object.defineProperty(Vue.prototype, 'modal$', {
        get() {
            let div = document.createElement('div');
            document.body.appendChild(div);
            return (options, show = true) => {
                const Constructor = Vue.extend(LwModalComponent);
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