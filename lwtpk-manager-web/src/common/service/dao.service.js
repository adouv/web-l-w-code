/**
 * @Author hejialin
 * @Description 公共服务
 */
import angular from 'angular';

export default class DaoService{
    constructor($http,$config,$window,$sessionStorage,$q,OAuth2,dialogsManager){
        this.$q = $q;
        this.$http = $http;
        this.$window = $window;
        this.$config = $config;
        this.OAuth2 = OAuth2;
        this.dialogsManager = dialogsManager;
        this. $sessionStorage = $sessionStorage;
        this.host = $config.HOST?$config.PROTOCOL+$config.HOST:'';
    }

    /**
     * token 失效再次请求
     * @param method
     * @param url
     * @param params
     * @param defer
     */
    requestAgain(method,url,params,defer){
        this.OAuth2.getRefreshToken().then(datas => {
            this.httpRequest(method,url,params).then(res=>{
                defer.resolve(res);
            },err=>{
                defer.reject(err);
            });
        });
    }

    /**
     * 请求统一入口
     * @param method
     * @param url
     * @param params
     */
    httpRequest(method,url,params){
        let defer = this.$q.defer();
        this.$http({
            method:method.toUpperCase(),
            url:url,
            data:params
        }).then(res=>{
            defer.resolve(res);
        },err=>{
            if(err.data&&err.data.error=='expired_token'){
                this.requestAgain(method,url,params,defer);
            }else{
                this.dialogsManager.showMessage(
                    err.data.error_description,
                    {
                        className: err.data.className||'error'
                    }
                );
                defer.reject(err);
            }
        });
        return defer.promise;
    }
    
    /**
     * $http.get 查询封装
     * @param moduleId 模块ID
     * @param resource 资源路径
     * @param params 请求参数
     */
    get(moduleId,resource,params){
        let url = this.host+moduleId+resource;
        if(angular.isObject(params)&&!angular.equals({}, params)){
            url += '?'+this.getParamsSerializer(params)
        }
        return this.httpRequest('get',url);
    }

    /**
     * $http.post 添加封装
     * @param moduleId 模块ID
     * @param resource 资源路径
     * @param params 请求参数
     */
    post(moduleId,resource,params){
        return this.httpRequest('post',this.host+moduleId+resource,params);
    }
    
    /**
     * $http.put 更新封装
     * @param moduleId 模块ID
     * @param resource 资源路径
     * @param params 请求参数
     */
    put(moduleId,resource,params){
        return this.httpRequest('put',this.host+moduleId+resource,params);
    }

    /**
     * $http.delete 删除封装
     * @param moduleId 模块ID
     * @param resource 资源路径
     * @param params 请求参数
     */
    delete(moduleId,resource,params){
        let url = this.host+moduleId+resource;
        if(angular.isObject(params)&&!angular.equals({}, params)){
            url += '?'+this.getParamsSerializer(params)
        }
        return this.httpRequest('delete',url);
    }

    /**
     *  从文件服务器进行下载
     * @param resource 资源路径
     */
    download(resource){
        this.$window.location.href = this.$config.file.DOWNLOAD+resource;
    }

    /**
     * 导出文档
     * @param moduleId 模块ID
     * @param resource 资源路径
     * @param params 请求参数
     */
    export(moduleId,resource,params){
        let url = this.host+moduleId+resource;
        params = params || {};
        params.TOKEN = this.$sessionStorage.get('TOKEN');
        url += '?'+this.getParamsSerializer(params);
        this.$window.location.href = url;
    }

    getParamsSerializer(params){
        return (function (data) {
            let paramsSerializer = (params)=>{
                let serializeParams = '';
                if(params instanceof Object){
                    for (let name in params) {
                        serializeParams += convertParams(name,params[name]);
                    }
                }else{
                    throw new Error('请求参数必须是一个对象！')
                }
                return serializeParams.length?serializeParams.substr(1):serializeParams;
            };
			let getObjectParam = function (key, subKey, value) {
                let subValue, subParams;
                subValue = value[subKey];
                subKey = key + '.' + subKey;
                subParams = new Object();
                subParams[subKey] = subValue;
                return '&' + paramsSerializer(subParams);
            };
            let getArrayParam = function(key, index, value) {
                let subKey, subValue, subParams;
                subValue = value[index];
                subKey = key + '[' + index + ']';
                subParams = new Object();
                subParams[subKey] = subValue;
                return '&' + paramsSerializer(subParams);
            };
            let convertParams = function (key,value) {
                let serializeParams = '';
                if (value instanceof Array) {
                    value.forEach((data,i)=>{
                        serializeParams+=getArrayParam(key, i, value);
                    })
                }
                else if (value instanceof Object) {
                    for (let subKey in value) {
                        serializeParams+=getObjectParam(key, subKey, value);
                    }
                }
                else if (value !== undefined &&
                    value !== null && value !== ''){
                    serializeParams+='&'+encodeURIComponent(key)+
                        '='+encodeURIComponent(value);
                }
                return serializeParams;
            };
            return paramsSerializer(data);
        })(params);
    }
}
DaoService.$inject = ['$http','$config','$window','$sessionStorage','$q','OAuth2','dialogsManager'];