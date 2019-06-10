/**
 * 指令
 * @param {*} Vue 实例 
 * @param {*} PluginOptions 选项 
 */
export const LwClickMeDirective = (Vue, PluginOptions = {}) => {
    Vue.directive('clickMe', {
        bind(el, binding, vnode, oldVnode) {
            //......do something
        },
        inserted(el, binding, nodeDom) {
            //......do something
        },
        update(el, binding, nodeDom) {
            //......do something
        },
        componentUpdated(el, binding, nodeDom) {
            //......do something
        },
        unbind(el, binding, nodeDom) {
            //......do something
        }
    });
}