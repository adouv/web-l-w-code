import ElementService from './element.service'
import EncryptService from './encrypt.service'
import HttpService from './http.service'
import LocalStorageService from './local.storage.service'
import UtilsService from './utils.service'
/**
 * 工具类总入口
 * @param {*} Vue 实例 
 */
export const DDDInit = (Vue) => {
    Vue.local = Vue.prototype.local$ = LocalStorageService;
    Vue.ele = Vue.prototype.ele$ = ElementService;
    Vue.enc = Vue.prototype.enc$ = EncryptService;
    Vue.http = Vue.prototype.http$ = HttpService;
    Vue.utils = Vue.prototype.utils$ = UtilsService;
}