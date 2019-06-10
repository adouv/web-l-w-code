import ElementService from './element.service';
import EncryptService from './encrypt.service';
import HttpService from './http.service';
import LocalStorageService from './local.storage.service';
import UtilService from './util.service';
/** 
 * 工具类
 */
export const lwDDDInstall = (Vue) => {
    Vue.ele = Vue.prototype.ele$ = ElementService;
    Vue.encry = Vue.prototype.encry$ = EncryptService;
    Vue.http = Vue.prototype.http$ = HttpService;
    Vue.local = Vue.prototype.local$ = LocalStorageService;
    Vue.utils = Vue.prototype.utils$ = UtilService;
}