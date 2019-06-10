import cache from '../common/cache/cache.module';
import service from '../common/service';
import oauth2 from '../common/oauth2/oauth2.module';
import msg from '../components/dialogManager/dialogsManager';
import lwPerson from '../components/select-person';
import "../styles/home.css";
import "../styles/login.css";
window.globals = {
    path: 'lwtpk-web',
    basePath: 'lwtpk-web'
};
window.tpkweb = angular.module('tpkweb', [
    cache,
    service,
    oauth2,
    msg,
    'flow',
    'lw.run',
    'lw.date',
    'lw.http',
    'lw.plugin',
    'ui.router',
    'lw.filter',
    'ui.bootstrap',
    'ui.select',
    'w5c.validator',
    'lw.permission',
    'lw.ui.model',
    'tpk.courseschedule',
    'tpk.normalmanage',
    'tpk.organization',
    'tpk.camera',
    'tpk.dailyschedule',
    'tpk.classroomManage',
    'tpk.streamMedia',
    'tpk.activity',
    'tpk.templatemanage',
    'tpk.teachmanage',
    lwPerson,
    // 'ngSanitize'
]).config(function (
    $qProvider,
    $httpProvider,
    $locationProvider,
    $urlRouterProvider,
    w5cValidatorProvider,
    flowFactoryProvider) {
    w5cValidatorProvider.config({
        blurTrig: true,
        showError: false,
        removeError: true
    });
    flowFactoryProvider.defaults = {
        target: '/lw-fileserver/fs/file/upload',
        permanentErrors: [404, 500, 501],//设置错误状态
        maxChunkRetries: 1,
        chunkRetryInterval: 5000,
        simultaneousUploads: 1,
        chunkSize: 1024 * 1024 * 500,//设置上传块大小--每个文件可以分成多个块上传
        testChunks: false,//true 为文件流的方式上传（速度快），一般设为false
        fileParameterName: 'filedata'//后台接受的文件的属性名
    };
    w5cValidatorProvider.setRules({
        email: {
            required: "邮箱地址不能为空",
            email: "邮箱地址格式不正确"
        },
        username: {
            required: "用户名不能为空"/*,
                 pattern       : "用户名必须输入字母、数字、下划线,以字母开头"*/
        },
        password: {
            required: "密码不能为空",
            minlength: "密码长度不能小于{minlength}",
            maxlenght: "密码长度不能大于{maxlength}"
        },
        url: {
            required: "URL不能为空"
        },
        newPassword: {
            required: "新密码不能为空",
            minlength: "新密码长度不能小于{minlength}",
            maxlength: "新密码长度不能大于{maxlength}",
            customizer: "密码必须包含字母和数字,不能包含特殊字符"
        },
        oldPassword: {
            required: "原始密码不能为空",
            minlength: "原始密码不正确",
            maxlength: "原始密码不正确"
        },
        repeatPassword: {
            required: "确认密码不能为空",
            repeat: "两次密码输入不一致"
        }
    });
    var encodeUrl = {
        params: function (obj) {
            this.query = '';
            for (var name in obj) {
                this.urlTransCode(obj[name], name);
            }
            return this.query.length ? this.query.substr(1) : this.query;
        },
        urlTransCode: function (value, name) {
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
        },
        paramsObject: function (value, name, key) {
            var fullSubName, subValue, innerObj;
            subValue = value[key];
            fullSubName = name + '.' + key;
            innerObj = {};
            innerObj[fullSubName] = subValue;
            this.query += '&' + this.params(innerObj);
        },
        paramsArray: function (value, name, key) {
            var fullSubName, subValue, innerObj;
            subValue = value[key];
            fullSubName = name + '[' + key + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            this.query += '&' + this.params(innerObj);
        }
    }

    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? encodeUrl.params(data) : data;
    }];

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $qProvider.errorOnUnhandledRejections(false);
    $locationProvider.html5Mode(true);
})

window.sys = 'home.';
tpkweb.config(function ($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            template: require('../views/login.html'),
            controller: 'loginCtrl'
        })
        .state('home', {
            url: '',
            template: require('../views/home.html'),
            controller: 'homeCtrl'
        })
        .state('test', {
            url: '/test',
            template: require('../modules/test/livedome.html'),
            controller: 'test.ctrl'
        });
});
tpkweb.factory('Garden', ['$state', '$stateParams', 'lwGardenService', function ($state, $stateParams, gardenService) {
    return {
        gardenToggle: function ($scope) {
            $scope.gardenId = $stateParams.gardenId;
            gardenService.getVisualGardenList(null, true, function (data) {
                $scope.gardens = data.data;
            });
            // serviceUtil.requestServer('/garden/garden/visibility', 'get', function (data) {
            //     $scope.gardens = data.data;
            // });
            $scope.toggleGarden = function () {
                $state.go($state.current.name, {gardenId: $scope.gardenId});
            }
        }
    }
}]);
tpkweb.factory('lwTree', ['$uibModal', function ($uibModal) {
    return {
        AreaTree: function ($scope) {
            $uibModal.open({
                animation: true,
                size: 'sm',
                scope: $scope,
                template: '<div class="modal-header">' +
                '<button type="button" class="close" ng-click="areaTree.cancel()">' +
                '<span>×</span><span class="sr-only">Close</span>' +
                '</button>' +
                '<h4 class="modal-title" id="modalLabel">功能区选择</h4>' +
                '</div>' +
                '<div class="modal-body" style="height: 260px;overflow: auto">' +
                '<ztree-area-select></ztree-area-select>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn tpk-btn-o" ng-click="areaTree.cancel()">取 消</button>' +
                '<button type="button" class="btn tpk-btn" ng-click="areaTree.ok()">确认</button>' +
                '</div>',
                controllerAs: 'areaTree',
                controller: function ($scope, $uibModalInstance) {
                    this.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    this.ok = function () {
                        $scope.$parent.keywords = $scope.keywords;
                        $scope.$parent.condition.areaCode = $scope.areaCode;
                        $uibModalInstance.close();
                    };
                }
            });
        }
    }
}]);
var appendMsg = (function () {
    return function (html) {
        var msgBor = document.createElement('div');
        msgBor.className = 'lw-msg';
        msgBor.innerHTML = html;
        var body = document.body;
        document.body.appendChild(msgBor);
        msgBor.onclick = function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (target.className == 'disapper') {
                body.removeChild(this);
            }
        };
        setTimeout(function () {
            body.removeChild(msgBor);
        }, 2000)
    }
})();
tpkweb.factory('$msg', [function () {
    return {
        error: function (msg) {
            var html = '<div class="msg-remove">' +
                '<span class="disapper"></span>' +
                '<i class="log"></i>' +
                '<p>' + (msg || '操作失败') + '</p>' +
                '</div>';
            appendMsg(html);
        },
        success: function (msg) {
            var html = '<div class="animated msg-remove succeed">' +
                '<span class="disapper"></span>' +
                '<i class="log"></i>' +
                '<p>' + (msg || '操作成功') + '</p>' +
                '</div>';
            appendMsg(html);
        }
    }
}]);
tpkweb.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            out = items;
        }

        return out;
    };
});
tpkweb.directive('ztreeAreaSelect', ['$stateParams', 'serviceUtil', 'lwGardenService', function ($stateParams, serviceUtil, gardenService) {
    return {
        replace: true,
        template: '<ul class="ztree" id="zTree"></ul>',
        link: function (scope, elem, attrs) {
            var setting = {
                check: {
                    enable: true,
                    chkStyle: "radio",
                    radioType: "all"
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeCheck: beforeCheck,
                    onCheck: onCheck
                }
            };

            function selectAll() {
                var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
            }

            function beforeCheck(treeId, treeNode) {
                return (treeNode.doCheck !== false);
            }

            function onCheck(e, treeId, treeNode) {
                scope.areaCode = null;
                if (treeNode.checked) {
                    scope.keywords = treeNode.name;
                    scope.areaCode = treeNode.id;
                } else {
                    scope.keywords = null;
                    scope.areaCode = null;
                }
            }

            gardenService.getGardenInfo($stateParams.gardenId, (data) => {
                var pId = null;
                var gardenId = data.gardenId;
                var gardenName = data.gardenName;
                var rootNode = {id: 0, 'name': gardenName, pId: pId, gardenId: gardenId};
                serviceUtil.requestServer('/area', 'get', function (data) {
                    data.data.unshift(rootNode);
                    var zTree = $.fn.zTree.init($(elem), setting, data.data);
                    $("#selectAll").bind("click", selectAll);
                    zTree.expandAll(true);
                    if (scope.$parent.condition && scope.$parent.condition.areaCode) {
                        var node = zTree.getNodeByParam('id', scope.$parent.condition.areaCode);
                        zTree.checkNode(node, true, true);
                    }
                }, {gardenId: gardenId});
            });
        }
    }
}]);

tpkweb.directive('dateFormat', ['$filter', function ($filter) {
    var dateFilter = $filter('date');
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            setTimeout(function () {
                function formatter(value) {
                    console.log(value)
                    return dateFilter(value, 'yyyy-MM-dd'); //format
                }

                function parser() {
                    return ctrl.$modelValue;
                }

                ctrl.$formatters.push(formatter);
                ctrl.$parsers.unshift(parser);
            }, 5000)

        }
    };
}]);
tpkweb.controller("loginCtrl", ['$scope', '$state', '$location', 'serviceUtil', '$stateParams', 'lwPermissionService', 'lwAccountService', 'dialogsManager', 'OAuth2', 'permissions',
    function ($scope, $state, $location, serviceUtil, $stateParams, lwPermissionService, lwAccountService, dialogsManager, OAuth2, permissions) {

        $scope.login = function () {
            $scope.isLoging = true;
            OAuth2.getAccessToken($scope.user).then(function (resp) {
                lwAccountService.getCurrentAccount(function (res) {
                    var gardenId = res.data.gardens[0].gardenId;
                    permissions.setPermissions(function () {
                        $scope.isLoging = false;
                        sessionStorage.setItem('gardenId', gardenId);
                        $state.go(window.sys + 'streamMedia', {gardenId: gardenId});
                    });
                });

            }, function (resp) {
                dialogsManager.showMessage(resp.data.error_description, {className: 'error'});
                $scope.logining = false;
            });
        };
    }]);

tpkweb.controller("homeCtrl", ['$scope', '$state', '$rootScope', '$location', 'serviceUtil', 'lwAccountService', '$sessionStorage', function ($scope, $state, $rootScope, $location, serviceUtil, lwAccountService, $sessionStorage) {
    $scope.url = {};
    var gardenId = sessionStorage.getItem('gardenId');
    var location = $location.path();
    $scope.url[location.substring(1, 5)] = true;
    $rootScope.$on('$stateChangeStart',
        function (event, toState) {
            var stateArr = toState.name.split('.');
            if (stateArr.length == 2) {
                event.preventDefault();
                $state.go(toState.name + '.index');
            } else {
                $scope.url = {};
                var model = toState.name.substring(5, 9);
                $scope.url[model] = true;
            }
        }
    );
    lwAccountService.getCurrentAccount(function (res) {
        $scope.user = res.data;
        sessionStorage.setItem('account', JSON.stringify(res.data));
    });
    var reloadAry = ['templatemanage'];
    $scope.goModule = function (name) {
        $state.go(sys + name + '.index', {gardenId: gardenId}, {reload: reloadAry.indexOf(name) != -1});
    };
    $scope.logout = function () {
        serviceUtil.requestServer('/logout', 'get', function () {
            $state.go('login');
        });
    }
}]);