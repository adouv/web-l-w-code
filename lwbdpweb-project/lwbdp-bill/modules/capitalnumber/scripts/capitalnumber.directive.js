var bdp_capitalnumber = angular.module('bdp.capitalnumber');
bdp_capitalnumber.directive('deleteCapitalNumber', ['serviceUtil', '$timeout','dialogsManager', function (serviceUtil, $timeout,dialogsManager) {
    return {
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                scope.ids = [];
                //批量删除
                if (!attrs.deleteCapitalNumber) {
                    angular.forEach(scope.datas, function (value, key) {
                        if (value.checked) {
                            scope.ids.push(value.id);
                        }
                    });
                } else {
                    //单个删除
                    scope.ids.push(attrs.deleteCapitalNumber)
                }
                if (scope.ids.length == 0) {
                    dialogsManager.showMessage('请选择删除的数据！', {className: 'warning'});
                    return;
                }
                dialogsManager.confirm({
                    title:'删除提示',
                    content:'确认删除吗？',
                    callback:()=>{
                        serviceUtil.requestServer('/capital', 'delete', {ids: scope.ids}).then(function (data) {
                            dialogsManager.showMessage('删除成功！', {className: 'success'});
                            $timeout(function () {
                                $("#lw-search").trigger("click");
                            }, 50)
                        }, function (err) {
                            dialogsManager.showMessage(err.data.error_description, {className: 'error'});
                        });
                    }
                })
            });
        }

    }
}]);
