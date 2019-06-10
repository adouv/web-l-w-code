/**
 * Created by hejialin on 2016/9/7.
 */
import angular from 'angular';

export default angular.module('lw.permission', []).name;


var lwPermission = angular.module('lw.permission');

//lwPermission运行时把权限放入服务里面
lwPermission.run(['$location', '$rootScope', '$http', '$state', 'lwPermissionService', function ($location, $rootScope, $http, $state, permissions) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        var states = toState.name.split('.');
        var state = "";
        for (var i = 0, len = states.length; i < len; i++) {
            state += "." + states[i];
            var permission = $state.get(state.substring(1)).permission;
            if (permission && angular.isString(permission) && !permissions.hasPermission(permission)) {
                event.preventDefault();
                $state.go('login');
                break;
            }
        }
    });
}]);

//定义扩展permissions服务中方法
lwPermission.factory('lwPermissionService', ['DaoService', '$sessionStorage', '$config', function (DaoService, $sessionStorage, $config) {
    return {
        setPermissions: function (callback) {
            var _this = this;
            return DaoService.get($config.modules.GARDEN, '/permission/getPermissionCodeList').then(function (data) {
                _this.permissionList = data.data;
                $sessionStorage.set("permissionList", data.data);
                typeof callback === 'function' && callback(data);
            })
        },
        getPermissions: function () {
            return this.permissionList || $sessionStorage.get("permissionList");
        },
        hasPermission: function (permissions) {
            if (permissions) {
                if (!this.permissionList) {
                    this.permissionList = $sessionStorage.get("permissionList");
                    if (!this.permissionList) this.setPermissions();
                }
                if (this.permissionList) {
                    let isPermission = true;
                    if (this.permissionList.indexOf('&&') > -1) {
                        isPermission = this.permissionAnd(permissions);
                    } else {
                        isPermission = this.permissionOr(permissions);
                    }
                    var admin = this.permissionList.indexOf('*:*');
                    return isPermission || admin > -1;
                }
            }
            return true;
        },
        permissionAnd: function (permissions) {
            permissions = permissions.split('&&');
            for (var i = 0, len = permissions.length; i < len; i++) {
                var permission = permissions[i].trim();
                let index = this.permissionList.indexOf(permission);
                if (index < 0) {
                    var rude = 'bdp:' + permission.split(":")[1] + ":*";
                    index = this.permissionList.indexOf(rude);
                }
                if (index < 0) {
                    return false;
                }
            }
            return true;
        },
        permissionOr: function (permissions) {
            permissions = permissions.split('||');
            for (var i = 0, len = permissions.length; i < len; i++) {
                var permission = permissions[i].trim();
                let index = this.permissionList.indexOf(permission);
                if (index < 0) {
                    var rude = 'bdp:' + permission.split(":")[1] + ":*";
                    index = this.permissionList.indexOf(rude);
                }
                if (index > -1) {
                    return true;
                }
            }
            return false;
        }
    };
}]);

//按钮权限控制指令
lwPermission.directive('hasPermission', ['lwPermissionService', function (permissions) {
    return {
        link: function (scope, elem, attrs) {
            if (!permissions.hasPermission(attrs.hasPermission)) {
                elem.remove();
            } else {
                elem.removeAttr("has-permission");
            }
        }
    };
}]);
