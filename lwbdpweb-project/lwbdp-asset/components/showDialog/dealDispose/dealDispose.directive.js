import dealDispose from './dealDispose.html';
export default function dealDisposeDirective(dialogsManager) {
    return {
        restrict: "AE",
        replace: true,
        template: dealDispose,
        scope: {
            dispose: "=",
            parent: '=',
            show: "=",
            save: "&",
            module:'='
        },
        link($scope, ele) {
            $scope.dictionaryName = "";
            $scope.changeList = [];
            let disposeObj = $scope.dispose.qoList;
            $scope.changeList = disposeObj.concat([]);
            // 点击添加按钮事件
            $scope.addData = function () {
                $scope.invalid = false;
                if ($scope.dictionaryName == "" || $scope.dictionaryName.length == 0) {
                    $scope.verifyInfo = "必填项"
                    $scope.invalid = true;
                    return;
                }
                // 校验不允许输入特殊字符
                var NAME_REG = /^[a-zA-Z\u4e00-\u9fa5]+$/;
                if (!NAME_REG.test($scope.dictionaryName)) {
                    $scope.verifyInfo = "不允许输入特殊字符"
                    $scope.dictionaryName = ""
                    return;
                }

                //添加数据到数组中
                $scope.changeList.push({ isHidden: false, pId: $scope.parent, name: $scope.dictionaryName,module:$scope.module });
                $scope.changeList.forEach(function (item) {
                    item.createTime = null;
                    item.lastUpdateTime = null;
                });
                $scope.dictionaryName = "";
            }

            // 全选与反选 
            $scope.checked = [];
            $scope.checkedAll = function () {
                if ($scope.checked_all) {
                    $scope.checked = [];
                    angular.forEach($scope.changeList, function (i) {
                        i.checked = true;
                        $scope.checked.push(i.id);
                    })
                } else {
                    angular.forEach($scope.changeList, function (i) {
                        i.checked = false;
                        $scope.checked = [];
                    })
                }
            }

            //  反选
            $scope.checkedOne = function () {
                angular.forEach($scope.changeList, function (i) {
                    var index = $scope.checked.indexOf(i.id);
                    if (i.checked && index === -1) {
                        $scope.checked.push(i.id);
                    } else if (!i.checked && index !== -1) {
                        $scope.checked.splice(index, 1);
                    };
                })

                if ($scope.changeList.length === $scope.checked.length) {
                    $scope.checked_all = true;
                } else {
                    $scope.checked_all = false;
                }
            }

            // 删除按钮
            $scope.remove = function () {
                let selectArray = [];
                $scope.changeList.forEach(function (item, i) {
                    if ($scope.checked.indexOf(item.id) == -1) {
                        selectArray.push(item);
                    }
                })
                $scope.changeList = selectArray;
            }

            // 点击确定按钮
            $scope.saveClick = function () {
                $scope.dispose.qoList = $scope.changeList;
                $scope.save();
                $scope.show = false;
            }

            // 关闭弹窗  
            $scope.cancel = function () {
                $scope.changeList.forEach(function (item, i) {
                    item.checked = false;
                })
                $scope.show = false;
            }

            // 校验不允许输入特殊字符
            $scope.stripscript = function (value) {
                if (value == "" || value.length == 0) {
                    $scope.invalid = false;
                    return false;
                }
                var NAME_REG = /^[a-zA-Z\u4e00-\u9fa5]+$/;
                if (!NAME_REG.test(value)) {
                    $scope.verifyInfo = "不允许输入特殊字符"
                    $scope.invalid = true;
                    return false;
                }
                $scope.invalid = false;
                return true;
            }

        }
    }
}
dealDisposeDirective.$inject = ['dialogsManager'];