import { LwClickMeDirective } from './lw-click-me.directive'
/**
 * 指令总入口
 * @param {*} Vue 实例
 */
export const DirectiveInit = (Vue) => {
    LwClickMeDirective(Vue);
}