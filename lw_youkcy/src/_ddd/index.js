import ElementService from './element.service'
import EncryptService from './encrypt.service'
import HttpService from './http.service'
import LocalStorageService from './localStorage.service'
import UtilService from './utils.service'

export default {
    ElementService,
    EncryptService,
    HttpService,
    LocalStorageService,
    UtilService
}
/**
 * 工具类总入口
 * @param {*} Vue 实例 
 */
export const DDDInit = (Vue) => {
    Vue.elem = Vue.prototype.elem$ = ElementService;
    Vue.enc = Vue.prototype.enc$ = EncryptService;
    Vue.http = Vue.prototype.http$ = HttpService;
    Vue.local = Vue.prototype.local$ = LocalStorageService;
    Vue.utils = Vue.prototype.utils$ = UtilService;
}