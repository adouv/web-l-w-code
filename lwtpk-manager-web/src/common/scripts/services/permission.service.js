/**
 * Created by hejialin on 2016/9/7.
 */

angular.module('lw.permission',['ui.router'])
    .config(['$stateProvider',function ($stateProvider){
        $stateProvider
            .state('nopermission', {
                url:'/nopermission',
                templateUrl: 'views/nopermission.html'
            })
    }]);


var lwPermission = angular.module('lw.permission');

//lwPermission运行时把权限放入服务里面
lwPermission.run(['$location','$rootScope','$http','$state','permissions',function($location,$rootScope,$http,$state,permissions) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        var states = toState.name.split('.');
        var state = "";
        for(var i=0,len=states.length;i<len;i++){
            state += "."+states[i];
            var permission = $state.get(state.substring(1)).permission;
            if (permission && Type.isString(permission) && !permissions.hasPermission(permission)){
                event.preventDefault();
                $state.go('login');
                break;
            }
        }
    });
}]);

//定义扩展permissions服务中方法
lwPermission.factory('permissions', ['DaoService','$config',function (DaoService,$config) {
    return {
        setPermissions: function (callback) {
            var _this = this;
            return DaoService.get($config.modules.GARDEN,'/permission/getPermissionCodeList').then(function (res) {
                _this.permissionList = res.data;
                localStorage.setItem("permissionList", res.data);
                typeof callback === 'function' && callback(res);
            })
        },
        getPermissions:function () {
            return this.permissionList || localStorage.getItem("permissionList");
        },
        hasPermission: function (permissions) {
            if(!this.permissionList){
                this.permissionList = localStorage.getItem("permissionList");
                if(!this.permissionList)this.setPermissions();
            }
            var index = -1,isPermission=false;
            permissions = permissions.split(',');
            for(var i=0,len=permissions.length;i<len;i++){
                if(isPermission)break;
                var permission = permissions[i].trim();
                index = this.permissionList.indexOf(permission);
                if(index<0){
                    var rude = permission.split(":")[0]+":*";
                    index = this.permissionList.indexOf(rude);
                }
                isPermission = index > -1;
            }
            var admin = this.permissionList.indexOf('*:*');
            return isPermission || admin > -1;
        }
    };
}]);

//按钮权限控制指令
lwPermission.directive('hasPermission', function(permissions) {
    return {
        link: function(scope, elem, attrs) {
            if(!permissions.hasPermission(attrs.hasPermission)){
                elem.remove();
            }else{
                elem.removeAttr("has-permission");
            }
        }
    };
});

var Type = {
    isString:function (str) {
        return Object.prototype.toString.call(str) === "[object String]";
    }
};
