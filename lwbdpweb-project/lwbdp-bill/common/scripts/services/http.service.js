/**
 * Created by hejialin on 2016/9/20.
 */
import angular from 'angular';
export default angular.module('lw.http', []).service('serviceUtil', ['$http', '$rootScope', '$state','$q','$sessionStorage','$config','$httpParamSerializer', function ($http, $rootScope, $state,$q,$sessionStorage,$config,$httpParamSerializer) {
    var removeEmpty = function (data) {
        var obj = {};
        for(var key in data){
            if(data[key]!==''&&data[key]!==null&&data!==undefined){
                obj[key] = data[key]; 
            }
        }
        return obj;
    }
    var path = {
        getArgs:function (args) {
            var params = new Array(args.length);
            for(var i=0,len=args.length;i<len;i++){
                args[i]&&this.setParams(params,args[i])
            }
            return params;
        },
        setParams:function (params,args) {
            var type = args.constructor;
            if(type == String){
                args = args.trim();
                if(args.indexOf('/')>-1){
                    params[0] = args;
                }else if('get,post,delete,put,download'.indexOf(args.toLowerCase())>-1){
                    params[1] = args.toLowerCase();
                }
            }
            if(type == Function)params[2] = args;
            if(type == Object)params[3] = args;
        },
        request: function (url, method, callback, params) {
            var args = path.getArgs(arguments);
            if(args[1] === "download"){
                location.href = ($config.HOST?$config.PROTOCOL+$config.HOST:'')+$config.modules.BILL + args[0]+'?'+$httpParamSerializer(removeEmpty(args[3]))+'&TOKEN='+$sessionStorage.get('access_token');
            } else {
                return path.requestHttp.apply(path,args);
            }
        },
        requestHttp: function () {
            var args = arguments,defer = $q.defer();
            path.http.call(path, args[0],args[1],args[2],args[3],defer);
            return defer.promise;
        },
        http: function () {
            var args = arguments;
            if((args[1]==="get"||args[1]==='delete')&&args[3]){
                args[0] += '?'+  $httpParamSerializer(removeEmpty(args[3]));
                args[3]=null;
            }
            return $http[args[1]]((($config.HOST?$config.PROTOCOL+$config.HOST:''))+$config.modules.BILL + args[0],args[3]).then(function (data) {
                    args[2] && args[2](data.data,data.headers());
                    args[4]&&args[4].resolve(data);
            },function (data) {
                    args[2] && args[2](null);
                    args[4]&&args[4].reject(data);
            });
        }
    };
    return {
        requestServer: function (url, method, callback, params) {
            this.requestServer = path.request;
            return path.request(url, method, callback,params);
        }
    }
}]).name;
