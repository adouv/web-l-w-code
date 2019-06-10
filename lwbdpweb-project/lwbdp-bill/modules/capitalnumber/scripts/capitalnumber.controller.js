import '../style/list.css';
function checkInputNumber(value, digit) {
    if (!value) {
        return;
    }
    value = value.toString();
    if ('' != value.replace(/\d{1,}\.{0,1}\d{0,}/, '')) {
        value = value.match(/\d{1,}\.{0,1}\d{0,}/) == null ? '' : value.match(/\d{1,}\.{0,1}\d{0,}/);
    }
    value = value.toString();
    if (!value) {
        return;
    }
    if (value.split(".")[0].length > 14) {
        var value_left = value.split(".")[0].substr(0, 14);
        if (value.indexOf(".") != -1) {
            value = value_left + value.substr(value.indexOf("."));
        } else {
            value = value_left;
        }
    }
    if (value.indexOf(".") != -1) {
        value = value.substr(0, value.indexOf(".") + digit);
    }
    return value;
};

function add(param1, param2) {
    if (!(typeof (param1) == 'number' && typeof (param2) == 'number')) {
        return;
    }
    var m = Math.pow(10, 6)
    return (parseInt(param1 * m) + parseInt(param2 * m)) / m;
}

function subtract(param1, param2) {
    if (!(typeof (param1) == 'number' && typeof (param2) == 'number')) {
        return;
    }
    var m = Math.pow(10, 6)
    return (parseInt(param1 * m) - parseInt(param2 * m)) / m;
}

var bdp_capitalnumber = angular.module('bdp.capitalnumber');
bdp_capitalnumber.controller('capitalnumber.list.ctrl', ['$scope', '$state', 'serviceUtil', 'dialogsManager', 'ngDialog',
    function ($scope, $state, serviceUtil, dialogsManager, ngDialog) {
        var $ctrl = this;
        $scope.checkMinAmount = function (value) {
            $scope.condition.minAmount = checkInputNumber(value, 7);
        }
        $scope.checkMaxAmount = function (value) {
            $scope.condition.maxAmount = checkInputNumber(value, 7);
        }
        $scope.checkMaxMoreThenMin = function () {
            if ($scope.condition.maxAmount && $scope.condition.minAmount && $scope.condition.maxAmount * 1 < $scope.condition.minAmount * 1) {
                dialogsManager.showMessage("最大金额不能小于最小金额", { className: 'error' })
                $scope.condition.maxAmount = null;
            }
        }
        /*serviceUtil.requestServer('/garden/simple/group-strategy','get',function(data){
         $scope.gardens = data.data;
         })*/
        $scope.formatDate = function () {
            if ($scope.recoveryDate) {
                $scope.condition.recoveryDate = new Date($scope.recoveryDate).Format('yyyy-MM-dd');
            } else {
                $scope.condition.recoveryDate = null;
            }
        }
       

        $scope.amountInfo = function () {
            $scope.totalAmount = 0;
            serviceUtil.requestServer('/capital/type/amount', 'get', function (data) {
                $scope.investList = data;
                $scope.investList.forEach(function (e) {
                    $scope.totalAmount = $scope.totalAmount * 1 + e.amount * 1;
                });
            }, $scope.condition);
        }

        //回车查询
        $scope.enterSearch = function (e) {
            if (e.charCode === 13 || e.keyCode === 13 || e.which === 13) {
                $scope.pageSearch();
            }
        }

        //清空input
        $scope.removeKeywords = function () {
            $scope.condition.keywords = "";
        }

        //导出
        $scope.batchExport = function () {
            serviceUtil.requestServer(
                '/excel/capitalNumber',
                'download',
                $scope.condition
            );
        }
        //跳转财务列表
        $scope.toFinanceNumber = function () {
            $state.go('bill.projectcapital.index');
        }
        //跳
        //跳转资金文号列表
        $scope.toCapitalNumber = function () {
            $state.go('bill.capitalnumber.index');
        }
        //跳转详情
        $scope.info = function (item) {
            $state.go('bill.capitalnumber.detail', { id: item.id });
            // window.open(url, '_blank')
        };
        //跳转编辑
        $scope.edit = function (item) {
            $state.go('bill.capitalnumber.input', { id: item.id });
        };
        //全选
        $scope.allChecked = false;//默认不是全选状态
        $scope.checkAll = function (checked) {
            //循环操作数据，将每条数据里面的checked值跟全选状态的值对应起来
            angular.forEach($scope.datas, function (value, key) {
                value.checked = $scope.allChecked;
            });
        };

        //单选
        $scope.checkItem = function ($event, index) {
            let index2 = 0;
            $scope.datas[index].checked = $event.target.checked;
            $scope.datas.forEach(v => {
                if (v.checked == true) {
                    index2++;  
                }
            })
            if (index2 == $scope.datas.length) {
                $scope.allChecked = true;
            } else {
                $scope.allChecked = false;
            }
        }

        $scope.searchList = function () {
            serviceUtil.requestServer(
                '/capital/' + capitalId + '/projects', 'get',
                function (data) {
                    $scope.capitalProject = data;
                }
            );
        }

        //显示资金文号对应项目详情
        $scope.showCapitalProject = function (capitalId, size, parentSelector) {
            var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            ngDialog.open({
                scope: $scope,
                className: 'bill-dialog bill-dialog-big',
                template: require('../views/capitalnumber.dialog.html'),
                controller: 'capitalProjectDetailCtrl',
                plain: true,
                overlay: false
            })
            serviceUtil.requestServer(
                '/capital/' + capitalId + '/projects', 'get',
                function (data) {
                    $scope.capitalProject = data;
                }
            );
        };

        //批量导入
        $scope.batchAdd = function () {
            $state.go('bill.capitalnumber.batchInput', {
                importType: 'capitalnumber',
                importName: '资金文号',
                importProjectTypeName: ''
            });
        };

        //统计总金额
        $scope.amountInfo();
    }
]);
bdp_capitalnumber.controller('capitalProjectDetailCtrl', ['$scope', '$state', 'serviceUtil', '$stateParams', 'dialogsManager',
    function ($scope, $state, serviceUtil, $stateParams, dialogsManager) {
        $scope.close = function () {
            $scope.closeThisDialog();
        }
    }
]);
bdp_capitalnumber.controller('capitalnumber.detail.ctrl', ['$scope', '$state', 'serviceUtil', '$stateParams',
    function ($scope, $state, serviceUtil, $stateParams) {
        serviceUtil.requestServer(
            '/capital/' + $stateParams.id, 'get',
            function (data) {
                $scope.capitalNumber = data;
            }
        );
        $scope.goCapitalNumberList = function () {
            $state.go('bill.capitalnumber.index');
        }
    }
]);

bdp_capitalnumber.controller('capitalnumber.input.ctrl', ['$scope', '$state', 'serviceUtil', '$stateParams', 'dialogsManager',
    function ($scope, $state, serviceUtil, $stateParams, dialogsManager) {
        var gardenId = sessionStorage.getItem('gardenId');

        //获取投资类型
        $scope.getCapitalSourceType = function () {
            serviceUtil.requestServer(
                '/dictionary/getByParentId', 'get',
                function (data) {
                    if (!$stateParams.id) {
                        $scope.capitalNumber.capitalSourceTypeId = data[0].id;
                    }
                    $scope.capitalSourceTypeList = data;
                }, { dictionaryId: 'CAPITAL_SOURCE_TYPE', parentId: 'capitalNumber' });
        };

        //检查金额
        $scope.checkInputAmount = function (value) {
            // if (!value) {
            //     return;
            // }
            // value = value.toString();
            // console.log(value);
            // if ('' != value.replace(/\d{1,}\.{0,1}\d{0,}/, '')) {
            //     value = value.match(/\d{1,}\.{0,1}\d{0,}/) == null ? '' : value.match(/\d{1,}\.{0,1}\d{0,}/);
            // }
            if (!value) {
                return;
            }
            var newValue = value.toString();
            if (newValue != '' && newValue.substring(0, 1) == '.') {
                newValue = "";
            }
            newValue = newValue.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
            newValue = newValue.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            newValue = newValue.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            if (newValue.indexOf(".") != -1) {
                newValue = newValue.substr(0, newValue.indexOf(".") + 7);
            }
            if (newValue.indexOf(".") < 0 && newValue != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                newValue = parseFloat(newValue);
            }
            $scope.capitalNumber.totalAmount = newValue;
        };

        $scope.capitalNumber = {};

        //回显
        if ($stateParams.id) {
            serviceUtil.requestServer(
                '/capital/' + $stateParams.id, 'get',
                function (data) {
                    $scope.capitalNumber = data;
                    if ($scope.capitalNumber.replyDate) {
                        $scope.replyDate = new Date($scope.capitalNumber.replyDate);
                    }
                    if ($scope.capitalNumber.recoveryDate) {
                        $scope.recoveryDate = new Date($scope.capitalNumber.recoveryDate);
                    }
                });
            $scope.showName = "编辑";
        } else {
            $scope.showName = "添加";
        }

        //保存或更新
        $scope.saveOrUpdateCapitalNumber = function () {
            //新增
            if (!$scope.capitalNumber.id) {
                if ($scope.replyDate) {
                    $scope.capitalNumber.replyDate = new Date($scope.replyDate).Format('yyyy-MM-dd');
                }
                if ($scope.recoveryDate) {
                    $scope.capitalNumber.recoveryDate = new Date($scope.recoveryDate).Format('yyyy-MM-dd');
                }
                serviceUtil.requestServer('/capital', 'post', null, $scope.capitalNumber).then(function (data) {
                    dialogsManager.showMessage('保存成功', {
                        className: 'success', callback: function () {
                            $state.go('bill.capitalnumber.index');
                        }
                    })
                }, function (err) {
                    dialogsManager.showMessage(err.data.error_description, { className: 'error' })
                });
            } else {
                //修改
                if ($scope.capitalNumber.lastUpdateTime) {
                    $scope.capitalNumber.lastUpdateTime = new Date($scope.capitalNumber.lastUpdateTime).Format('yyyy-MM-dd');
                }
                if ($scope.replyDate) {
                    $scope.capitalNumber.replyDate = $scope.replyDate.Format('yyyy-MM-dd');
                }
                if ($scope.recoveryDate) {
                    $scope.capitalNumber.recoveryDate = $scope.recoveryDate.Format('yyyy-MM-dd');
                }
                serviceUtil.requestServer('/capital', 'put',
                    function (data) {
                        dialogsManager.showMessage('保存成功', {
                            className: 'success', callback: function () {
                                $state.go('bill.capitalnumber.index');
                            }
                        })
                    }, $scope.capitalNumber);
            }
        }

        //取消，返回列表页面
        $scope.goCapitalNumberList = function () {
            $state.go('bill.capitalnumber.index');
        }
        $scope.getCapitalSourceType();
    }
]);

