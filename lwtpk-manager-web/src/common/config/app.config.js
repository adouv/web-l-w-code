"use strict"
/**
 * @Author hejialin
 * @Description http模块封装$http
 */
import config from './config.json';

class EncodeUrl{

    params(obj) {
        this.query = '';
        for (var name in obj) {
            this.urlTransCode(obj[name], name);
        }
        return this.query.length ? this.query.substr(1) : this.query;
    }

    urlTransCode(value, name) {
        if (value instanceof Array) {
            for (var key = 0; key < value.length; ++key) {
                this.paramsArray(value, name, key);
            }
        }
        else if (value instanceof Object) {
            for (var key in value) {
                this.paramsObject(value, name, key);
            }
        }
        else if (value !== undefined && value !== null)
            this.query += '&' + encodeURIComponent(name) + '=' + encodeURIComponent(value);
    }

    paramsObject(value, name, key) {
        var fullSubName, subValue, innerObj;
        subValue = value[key];
        fullSubName = name + '.' + key;
        innerObj = {};
        innerObj[fullSubName] = subValue;
        this.query += '&' + this.params(innerObj);
    }

    paramsArray(value, name, key) {
        var fullSubName, subValue, innerObj;
        subValue = value[key];
        fullSubName = name + '[' + key + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        this.query += '&' + this.params(innerObj);
    }
}

function CommonConfig($httpProvider){

    $httpProvider.defaults.transformRequest = [function (data) {
        let encode = new EncodeUrl();
        return angular.isObject(data) && String(data) !== '[object File]' ? encode.params(data) : data;
    }];

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
}

/**
 * 处理配置信息
 * @param config
 * @return {*}
 */
let getConfig = (cfg)=>{
    let files = cfg.file;
    for(let key in files){
        if(angular.isString(files[key])&&cfg.HOST){
            cfg.file[key] = cfg.PROTOCOL+cfg.HOST+files[key];
        }
    }
    return cfg;
};
CommonConfig.$inject = ['$httpProvider','$locationProvider'];
window.FRAME_HOST = '10.0.0.10:116';
config.HOST = window.SERVICE_HOST;
config.FRAME_HOST = config.PROTOCOL + window.FRAME_HOST;
export default angular.module('lw.config',[])
    .config(CommonConfig)
    .value('$config',getConfig(config))
    .name

