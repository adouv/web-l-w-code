import Vue from 'vue'
/**
 * 下载指令
 * @param {*} el 指令所绑定的元素，可以用来直接操作 DOM 。
 * @param {*} binding 一个对象，包含以下属性：
 * @param {*} vnode Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
 * @param {*} oldVnode 上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。
 */
export default {
  /**
   * 安装指令方法
   * @param {*} Vue Vue实例
   * @param {*} PluginOptions 选项
   */
  install(Vue, PluginOptions = {}) {
    Vue.directive('canvasDragDir', {
      drag(el, binding) {
        console.log(el);
      },
      /**
       * 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
       */
      bind(el, binding, vnode, oldVnode) {

      },
      /**
       * 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
       */
      inserted(el, binding, nodeDom) {},
      /**
       * 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
       */
      update(el, binding, nodeDom) {},
      /**
       * 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
       */
      componentUpdated(el, binding, nodeDom) {},
      /**
       * 只调用一次，指令与元素解绑时调用。
       */
      unbind(el, binding, nodeDom) {}
    })
  }
}
