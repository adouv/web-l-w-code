/**
 * Created by lw-yf-015 on 2016/12/15.
 */
var model = angular.module('lw.ui.model', ['ui.bootstrap']);
model.service('lwUiModel', ['$uibModal', function ($uibModal) {
    var confirm = {
        alert: function (args) {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                size:'sm',
                template: '<div class="modal-header">' +
                                '<button type="button" class="close" ng-click="confirm.cancel()">' +
                                '<span>×</span><span class="sr-only">Close</span>' +
                                '</button>' +
                                '<h4 class="modal-title" id="modalLabel">{{confirm.title}}</h4>' +
                            '</div>' +
                            '<div class="modal-body" style="height: auto">' +
                                '<p>{{confirm.msg}}</p>' +
                            '</div>' +
                            '<div class="modal-footer" style="padding-top: 0">' +
                                '<button type="button" class="btn tpk-btn-o" ng-click="confirm.cancel()">取 消</button>' +
                                '<button type="button" class="btn tpk-btn" ng-click="confirm.ok()">确认</button>' +
                            '</div>',
                controller: function ($uibModalInstance) {
                    this.title = args.title;
                    this.msg = args.msg;
                    this.cancel = function () {
                        typeof cancel === 'function' && args.cancel();
                        $uibModalInstance.dismiss('cancel');
                    };
                    this.ok = function () {
                        typeof args.ok === 'function' && args.ok();
                        $uibModalInstance.close();
                    };
                },
                controllerAs:'confirm'
            });
        }
    };
    return {
        delete:function (ok) {
            confirm.alert({
                title:'删除提示',
                msg:'确认要删除选择的数据吗？',
                ok:ok
            })
        }
    }
}]);
model.controller('model.confirm.ctrl',['$uibModalInstance','$scope',function ($uibModalInstance,$scope) {
    $scope.title = '操作提示'
    $scope.msg = '确认删除吗？'
    this.cancel = function () {
        typeof cancel === 'function' && cancel();
        $uibModalInstance.dismiss('cancel');
    };
    this.ok = function () {
        typeof cancel === 'function' && ok();
        $uibModalInstance.close();
    };
}]);
