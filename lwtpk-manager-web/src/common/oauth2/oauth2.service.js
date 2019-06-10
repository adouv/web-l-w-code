

export default class OAuth2Factory{
    constructor(OAuth2Token,$http,$q,$config){
        this.$q = $q;
        this.$http = $http;
        this.host = $config.HOST?$config.PROTOCOL+$config.HOST:'';
        this.OAuth2Token = OAuth2Token;
        this.modules = $config.modules;
        this.oauth2 = $config.oauth2;
        this.GET_TOKEN_URL = this.host+this.modules.OAUTH+"/oauth/token";
        // 设置默认参数
        this.defaultParams = {
            client_id:this.oauth2.client_id,
            client_secret:this.oauth2.client_secret,
            grant_type:'password',
            scope:this.oauth2.scope||'read'
        };
        
    }
    // 整合参数
    sanitizeParams(params){
        if(!angular.isObject(params)){
            throw new TypeError('所传参数必须是一个对象！');
        }
        params = angular.extend({},this.defaultParams,params);
        angular.forEach(params,function (value, key) {
            if(!value)throw new TypeError('参数 `'+key+'` 不能为空！');
        });
        return params;
    }
    
    // token 请求
    requestToken(params,config,defer) {
        this.$http.post(this.GET_TOKEN_URL,params,config).then((resp) => {
            defer.resolve(resp);
            this.OAuth2Token.setToken(resp.data);
        },function (data) {
            defer.reject(data);
        })
    };
    
    // 整合headers
    sanitizeHeaders(options) {
        options = options || {};
        if(!angular.isObject(options)){
            throw new TypeError('所设headers的参数必须是一个对象！');
        }
        return angular.extend({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, options);
    };
    
    getAccessToken(params,config) {
        var defer = this.$q.defer();
        params = this.sanitizeParams(params);
        config = this.sanitizeHeaders(config);
        this.requestToken(params,config,defer);
        return defer.promise;
    }
    getRefreshToken(params,config) {
        var defer = this.$q.defer();
        params = params||{};
        params.grant_type = 'refresh_token';
        params.refresh_token = this.OAuth2Token.getRefreshToken();
        params = this.sanitizeParams(params);
        config = this.sanitizeHeaders(config);
        this.requestToken(params,config,defer);
        return defer.promise;
    }
}
OAuth2Factory.$inject = ['OAuth2Token','$http','$q','$config'];