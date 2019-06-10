/**
 * Created by hejialin on 2016/10/26.
 */
var interceptor = angular.module('lw.interceptor', []);

interceptor.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);

interceptor.factory('httpInterceptor',['$location',function ($location) {
    var contextPath = sys_config.path.basePath;
    var interceptor = {
        isLogin:function (config) {
            return config.url === contextPath+'/login';
        },
        isNotLogin:function (config) {
            return !this.isLogin(config);
        },
        isLogout:function (config) {
            return config.url === contextPath+'/logout';
        },
        isNotLogout:function (config) {
            return !this.isLogout(config);
        },
        logout:function (config) {
            var isLogout = this.isLogout(config);
            if(isLogout && !!sessionStorage.getItem('TOKEN')){
                sessionStorage.clear();
                localStorage.clear();
            }
        },
        setToken :function (config) {
            var isLogin = this.isLogin(config)
            var token = !isLogin && sessionStorage.getItem('TOKEN');
            if(!isLogin && token){
                config.headers.TOKEN = token;
            }
        },
        login:function (response) {
            if(this.isLogin(response.config)){
                if(response.data.data && response.data.data.TOKEN){
                    sessionStorage.setItem('TOKEN',response.data.data.TOKEN);
                }else{
                    return false
                }
            }else{
                return response.data.code==2;
            }
            return response;
        }
    };
    return {
        request:function (config) {
            if(new RegExp("^"+contextPath).test(config.url)){
                interceptor.setToken(config);
                interceptor.logout(config);
            }
            return config;
        },
        response:function (response) {
            var url = response.config.url;
            if(url==contextPath+'/login'){
                return interceptor.login(response);
            }
            return response;
        }
    }
}]);
