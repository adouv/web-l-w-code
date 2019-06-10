/**
 * Created by hejialin on 2017/3/18.
 */
import angular from 'angular'

angular.module('repeat.interceptor',[]).config(['$httpProvider',function ($httpProvider) {
    // $httpProvider.interceptors.push('repeatInterceptor');
}]).factory('repeatInterceptor',RepeatInterceptor);

function RepeatInterceptor($rootScope,$q,$timeout) {
    return {
        request:function (config) {
            if((config.method=='POST'||config.method=='PUT')&&config.url.indexOf('/token')<0){
            	var isDifferentUrl = !$rootScope.prevPostUrl || $rootScope.prevPostUrl!=config.url,
					isDifferentMethod = !$rootScope.prevPostMethod || $rootScope.prevPostMethod!=config.method;
                if(!isDifferentUrl && !isDifferentMethod){
					return $q.reject("reason");
                }else{
					$rootScope.prevPostUrl = config.url;
					$rootScope.prevPostMethod = config.method;
                }
            }
            return config;
        },
        response:function (response) {
            var config = response.config;
            if((config.method=='POST'||config.method=='PUT')&&$rootScope.prevPostUrl==config.url){
                $timeout(function () {
                    $rootScope.prevPostUrl = null;
                },1000);
            }
            return response;
        }
    }
}
RepeatInterceptor.$inject = ['$rootScope','$q','$timeout'];