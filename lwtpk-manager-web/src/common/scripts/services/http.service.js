/**
 * Created by hejialin on 2016/9/20.
 */
var http = angular.module('lw.http', [])
http.service('serviceUtil', ['$http', '$rootScope', '$state','$q', function ($http, $rootScope, $state,$q) {
    function serializeData( data ) {
        if ( ! angular.isObject( data ) ) {
            return( ( data == null ) ? "" : data.toString() );
        }
        var buffer = [];
        for ( var name in data ) {
            if ( ! data.hasOwnProperty( name ) ) {
                continue;
            }
            var value = data[ name ];
            buffer.push(
                encodeURIComponent ( name ) + "=" + (value == null  ? "" : encodeURIComponent (value))
            );
        }
        var source = buffer.join( "&" ).replace( /%20/g, "+" );
        return source;
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
                //return $http.get(args[0]).then(function (data) {
                    location.href = sys_config.path.basePath + args[0]+'?'+serializeData(args[3])+'&TOKEN='+sessionStorage.getItem('TOKEN');
                    //args[2]&&args[2](data);
                //});
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
            if(args[1]==='delete'&&args[3]){
                args[0] += '?'+  serializeData(args[3]);
                args[3]=null;
            }
            if(args[1]==="get")args[3] = {params:args[3]};
            return $http[args[1]](sys_config.path.basePath + args[0], args[3]).then(function (data) {
                args[2] && args[2](data.data,data&&data.headers());
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
}]);
