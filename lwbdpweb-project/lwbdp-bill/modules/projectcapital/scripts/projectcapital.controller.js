import '../style/list.css';
import '../style/income.css';
//js小数数值运算，函数参数f--代表运算数字,digit--运算精度
Math.formatFloat = function (f, digit) {
    var m = Math.pow(10, digit);
    return parseInt(f * m, 10) / m;
}
function checkInputNumber(value, digit) {
    if (!value) {
        return;
    }
    value = value.toString();
    if ('' != value.replace(/\d{1,}\.{0,1}\d{0,}/, '')) {
        value = value.match(/\d{1,}\.{0,1}\d{0,}/) == null ? '' : value.match(/\d{1,}\.{0,1}\d{0,}/);
    }
    value = value.toString();
    if(!value){
        return;
    }
    if(value.split(".")[0].length > 14){
        var value_left = value.split(".")[0].substr(0,14);
        if(value.indexOf(".") != -1){
            value = value_left + value.substr(value.indexOf("."));
        }else{
            value = value_left;
        }
    }
    if (value.indexOf(".") != -1) {
        value = value.substr(0, value.indexOf(".") + digit);
    }
    return value;
};

function add(param1,param2){
    if(!(typeof(param1) == 'number' && typeof(param2) == 'number')){
        return;
    }
    var m = Math.pow(10,6)
    return (parseInt(param1*m) + parseInt(param2*m))/m;
}

function subtract(param1,param2){
    if(!(typeof(param1) == 'number' && typeof(param2) == 'number')){
        return;
    }
    var m = Math.pow(10,6)
    return (parseInt(param1*m) - parseInt(param2*m))/m;
}

var bdp_projectcapital = angular.module('bdp.projectcapital');
bdp_projectcapital.controller('projectcapital.ctrl', ['$scope', '$state', 
    function ($scope, $state) {
        if ($state.current.name == 'bill.projectcapital') {
            $state.go('bill.projectcapital.index');
        }
        $scope.Inputmax = function (scope, num, name, max) {
            if (num > max) {
                scope[name] = max;
            }
            if (num < 0) {
                scope[name] = 0;
            }
        };
    }]);

bdp_projectcapital.controller('projectcapital.list.ctrl', ['$scope', '$state', 'serviceUtil', '$config', 'dialogsManager',
    function ($scope, $state, serviceUtil, $config, dialogsManager) {
        $scope.independentTypeId = '';
        $scope.sourceTypeGroupNumList = [];
        $scope.expenseTypeGroupNumList = [];

        $scope.batchExport = function () {
            serviceUtil.requestServer(
                '/excel/capital',
                'download',
                $scope.condition
            );
        };
        $scope.foldSide = function () {
            if ($scope.isfold) {
                $scope.isfold = false
            }
            else {
                $scope.isfold = true
            }
        }
        $scope.multipleOrderArr = [];

        $scope.singleOrderObject = {name: '所属项目', type: ''};
        //多选排序类型
        $scope.multipleChooseContext = [];
        $scope.multipleChooseOrderType = [];
        $scope.multipleChooseOrderTypeForIncome = null;
        $scope.multipleChooseOrderTypeForHitsIncome = null;
        $scope.multipleChooseOrderTypeForPayout = null;
        $scope.multipleChooseOrderTypeForHitsPayout = null;

        //筛选类型
        $scope.optionTypeList = [];
        $scope.sourceTypeList = [];
        $scope.expenseTypeList = [];
        $scope.sourceTypeIdList = [];
        $scope.expenseTypeIdList = [];

        //单选排序
        $scope.selectSingleChooseOrder = function () {
            //清空多选排序
            $scope.clearMultipleChoose();

            $scope.multipleOrderArr = [];
            $scope.singleOrderObject = {};
            if ($scope.condition.context == 'updateTime') {
                $scope.singleOrderObject.name = '更新时间';
                if (!$scope.condition.orderType) {
                    $scope.condition.orderType = 'DESC';
                    $scope.singleOrderObject.type = '倒序';
                }
                $scope.singleOrderObject.type = $scope.condition.orderType == 'ASC' ? '正序' : '倒序';
            } else if ($scope.condition.context == 'construct') {
                $scope.singleOrderObject.name = '建设单位';
                if (!$scope.condition.orderType) {
                    $scope.condition.orderType = 'ASC';
                    $scope.singleOrderObject.type = '正序';
                }
                $scope.singleOrderObject.type = $scope.condition.orderType == 'ASC' ? '正序' : '倒序';
            } else {
                $scope.singleOrderObject.name = '所属项目';
                $scope.singleOrderObject.type = $scope.condition.orderType == null;
            }
            $scope.pageSearch();
            $scope.refreshSourceNum();
            $scope.multipleChooseOrderTypeForIncome = null;
            $scope.multipleChooseOrderTypeForHitsIncome = null;
            $scope.incomeMultipleChooseContext = [];
            $scope.multipleChooseOrderTypeForHitsPayout = null;
            $scope.multipleChooseOrderTypeForPayout = null;
            $scope.payoutMultipleChooseContext = [];
        };

        //选择单选排序类型
        $scope.selectOrderType = function () {
            $scope.clearMultipleChoose();
            if (!$scope.condition.orderType || $scope.condition.orderType == 'DESC') {
                $scope.condition.orderType = 'ASC';
            } else {
                $scope.condition.orderType = 'DESC';
            }
            if ($scope.condition.context) {
                $scope.singleOrderObject.type = $scope.condition.orderType == 'ASC' ? '正序' : '倒序';
            }
            $scope.pageSearch();
            $scope.refreshSourceNum();
        };

        $scope.incomeMultipleChooseContext = [];
        $scope.incomeMultipleChooseOrderType = [];
        $scope.incomeMultipleOrderArr = [];

        //多选
        $scope.selectIncomeMultipleChooseOrder = function (context, orderType) {
            $scope.payoutMultipleChooseContext = [];
            $scope.payoutMultipleChooseOrderType = [];
            $scope.payoutMultipleOrderArr = [];
            $scope.multipleChooseOrderTypeForPayout = null;
            $scope.multipleChooseOrderTypeForHitsPayout = null;
            $scope.clearSingleChooseOrder();
            $scope.removePayoutTree();
            if (!$scope[orderType] || $scope[orderType] == 'DESC') {
                $scope[orderType] = "ASC";
            } else {
                $scope[orderType] = "DESC";
            }
            var index = $scope.incomeMultipleChooseContext.indexOf(context)
            if (index < 0) {
                $scope.incomeMultipleChooseContext.push(context);
                $scope.incomeMultipleChooseOrderType.push($scope[orderType]);
            } else {
                $scope.incomeMultipleChooseOrderType.splice(index, 1, $scope[orderType]);
            }
            for (var i = 0; i < $scope.incomeMultipleChooseContext.length; i++) {
                if ($scope.incomeMultipleChooseContext[i] === 'amount') {
                    $scope.multipleChooseOrderTypeForIncome = $scope.incomeMultipleChooseOrderType[i];
                } else {
                    $scope.multipleChooseOrderTypeForHitsIncome = $scope.incomeMultipleChooseOrderType[i];
                }
            }
            $scope.condition.multipleChooseContext = $scope.incomeMultipleChooseContext;
            $scope.condition.multipleChooseOrderType = $scope.incomeMultipleChooseOrderType;

            var orderObject = {};
            if (context == 'amount') {
                orderObject.name = '金额';
            }
            if (context == 'hits') {
                orderObject.name = '点击量';
            }
            orderObject.type = $scope[orderType] == 'ASC' ? '正序' : '倒序';
            if (index < 0) {
                $scope.incomeMultipleOrderArr.push(orderObject);
            } else {
                $scope.incomeMultipleOrderArr.splice(index, 1, orderObject);
            }
            $scope.multipleOrderArr = $scope.incomeMultipleOrderArr;
            $scope.pageSearch();
            $scope.refreshSourceNum();
        }

        $scope.payoutMultipleChooseContext = [];
        $scope.payoutMultipleChooseOrderType = [];
        $scope.payoutMultipleOrderArr = [];

        $scope.selectPayoutMultipleChooseOrder = function (context, orderType) {
            $scope.clearSingleChooseOrder();
            $scope.removeIncomeTree();
            $scope.incomeMultipleChooseContext = [];
            $scope.incomeMultipleChooseOrderType = [];
            $scope.incomeMultipleOrderArr = [];
            $scope.multipleChooseOrderTypeForIncome = null;
            $scope.multipleChooseOrderTypeForHitsIncome = null;
            if (!$scope[orderType] || $scope[orderType] == 'DESC') {
                $scope[orderType] = "ASC";
            } else {
                $scope[orderType] = 'DESC';
            }
            var index = $scope.payoutMultipleChooseContext.indexOf(context);
            if (index < 0) {
                $scope.payoutMultipleChooseContext.push(context);
                $scope.payoutMultipleChooseOrderType.push($scope[orderType]);
            } else {
                $scope.payoutMultipleChooseOrderType.splice(index, 1, $scope[orderType]);
            }
            for (var i = 0; i < $scope.payoutMultipleChooseContext.length; i++) {
                if ($scope.payoutMultipleChooseContext[i] === 'amount') {
                    $scope.multipleChooseOrderTypeForPayout = $scope.payoutMultipleChooseOrderType[i];
                } else {
                    $scope.multipleChooseOrderTypeForHitsPayout = $scope.payoutMultipleChooseOrderType[i];
                }
            }
            $scope.condition.multipleChooseContext = $scope.payoutMultipleChooseContext;
            $scope.condition.multipleChooseOrderType = $scope.payoutMultipleChooseOrderType;

            var orderObject = {};
            if (context == 'amount') {
                orderObject.name = '金额';
            }
            if (context == 'hits') {
                orderObject.name = '点击量';
            }
            orderObject.type = $scope[orderType] == 'ASC' ? '正序' : '倒序';
            if (index < 0) {
                $scope.payoutMultipleOrderArr.push(orderObject);
            } else {
                $scope.payoutMultipleOrderArr.splice(index, 1, orderObject);
            }
            $scope.multipleOrderArr = $scope.payoutMultipleOrderArr;
            $scope.pageSearch();
            $scope.refreshSourceNum();
        }

        $scope.cancelIncomeMultipleChooseOrder = function () {
            //清空多选排序
            if ($scope.multipleChooseOrderTypeForIncome || $scope.multipleChooseOrderTypeForHitsIncome) {
                $scope.incomeMultipleOrderArr = [];
                $scope.singleOrderObject = {name: '所属项目', type: ''};
                $scope.multipleChooseOrderTypeForIncome = null;
                $scope.multipleChooseOrderTypeForHitsIncome = null;
                $scope.clearMultipleChoose();
                $scope.incomeMultipleChooseContext = [];
                $scope.incomeMultipleChooseOrderType = [];
                $scope.multipleOrderArr = $scope.incomeMultipleOrderArr;
                $scope.pageSearch();
                $scope.refreshSourceNum();
            }
        }

        $scope.cancelPayoutMultipleChooseOrder = function () {
            //清空多选排序
            if ($scope.multipleChooseOrderTypeForPayout || $scope.multipleChooseOrderTypeForHitsPayout) {
                $scope.payoutMultipleOrderArr = [];
                $scope.singleOrderObject = {name: '所属项目', type: ''};
                $scope.multipleChooseOrderTypeForPayout = null;
                $scope.multipleChooseOrderTypeForHitsPayout = null;
                $scope.clearMultipleChoose();
                $scope.payoutMultipleChooseContext = [];
                $scope.payoutMultipleChooseOrderType = [];
                $scope.multipleOrderArr = $scope.payoutMultipleOrderArr;
                $scope.pageSearch();
                $scope.refreshSourceNum();
            }
        }

        //清楚单选结果
        $scope.clearSingleChooseOrder = function () {
            $scope.condition.context = '';
            $scope.condition.orderType = '';
            $scope.singleOrderObject = {};
        }

        //清除选中条件
        $scope.removeOption = function (item, $event) {
            item.selected = false;
            if ($scope.sourceTypeIdList.length > 0) {
                var index = $scope.sourceTypeIdList.indexOf(item.id);
                $scope.sourceTypeIdList.splice(index, 1);
                $scope.sourceTypeList.splice(index, 1);
            }
            if ($scope.expenseTypeIdList.length > 0) {
                var index = $scope.expenseTypeIdList.indexOf(item.id);
                $scope.expenseTypeIdList.splice(index, 1);
                $scope.expenseTypeList.splice(index, 1);
            }
            $event.stopPropagation();
            $scope.pageSearch();
            $scope.refreshSourceNum();
        }

        //点击搜索,刷新项目类型
        $scope.refreshSourceNum = function () {
            var sourceList = $scope.condition.sourceTypeIdList;
            var expenseList = $scope.condition.expenseTypeIdList;
            serviceUtil.requestServer(
                '/bill/incomeTypeStatistics', 'get',
                function (data) {
                    $scope.sourceTypeGroupNumList = data;
                    if (sourceList != null) {
                        for (var i = 0; i < $scope.sourceTypeGroupNumList.length; i++) {
                            for (var j = 0; j < sourceList.length; j++) {
                                if ($scope.sourceTypeGroupNumList[i].id === sourceList[j]) {
                                    $scope.sourceTypeGroupNumList[i].selected = true;
                                }
                            }
                        }
                    }
                }, $scope.condition
            );
            serviceUtil.requestServer(
                '/bill/expenseTypeStatistics', 'get',
                function (data) {
                    $scope.expenseTypeGroupNumList = data;
                    if (expenseList != null) {
                        for (var i = 0; i < $scope.expenseTypeGroupNumList.length; i++) {
                            for (var j = 0; j < expenseList.length; j++) {
                                if ($scope.expenseTypeGroupNumList[i].id === expenseList[j]) {
                                    $scope.expenseTypeGroupNumList[i].selected = true;
                                }
                            }
                        }
                    }
                }, $scope.condition
            );
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

        //选中资金来源
        $scope.selectSourceType = function (item) {
            $scope.cancelPayoutMultipleChooseOrder();
            if ($scope.expenseTypeList.length > 0) {
                $scope.optionTypeList.forEach(function (e) {
                    e.selected = false;
                });
            }
            item.selected = true;
            $scope.expenseTypeIdList = [];
            $scope.expenseTypeList = [];
            if ($scope.sourceTypeIdList.indexOf(item.id) == -1) {
                $scope.sourceTypeList.push(item);
                $scope.sourceTypeIdList.push(item.id);
            }
            $scope.optionTypeList = $scope.sourceTypeList;
            $scope.condition.sourceTypeIdList = $scope.sourceTypeIdList;
            $scope.condition.expenseTypeIdList = $scope.expenseTypeIdList;
            $scope.pageSearch();
            $scope.refreshSourceNum();
        }
        //选中支出费用类型
        $scope.selectExpenseType = function (item) {
            $scope.cancelIncomeMultipleChooseOrder();
            if ($scope.sourceTypeList.length > 0) {
                $scope.optionTypeList.forEach(function (e) {
                    e.selected = false;
                });
            }
            item.selected = true;
            $scope.sourceTypeIdList = [];
            $scope.sourceTypeList = [];
            if ($scope.expenseTypeIdList.indexOf(item.id) == -1) {
                $scope.expenseTypeList.push(item);
                $scope.expenseTypeIdList.push(item.id);
            }
            $scope.optionTypeList = $scope.expenseTypeList;
            $scope.condition.sourceTypeIdList = $scope.sourceTypeIdList;
            $scope.condition.expenseTypeIdList = $scope.expenseTypeIdList;
            $scope.pageSearch();
            $scope.refreshSourceNum();
        }

        //清空多选排序
        $scope.clearMultipleChoose = function () {
            $scope.condition.multipleChooseContext = null;
            $scope.condition.multipleChooseOrderType = null;
        };

        //查询资金资金来源类型和支出费用类型
        $scope.initTypeNum = function () {
            /*serviceUtil.requestServer(
             '/bill/incomeTypeStatistics', 'get',
             function (data) {
             if (data.code == '0') {
             $scope.sourceTypeGroupNumList = data.data;
             }
             }, $scope.condition
             );
             serviceUtil.requestServer(
             '/bill/expenseTypeStatistics', 'get',
             function (data) {
             if (data.code == '0') {
             $scope.expenseTypeGroupNumList = data.data;
             }
             }, $scope.condition
             );*/
        }
        $scope.toBackDetail = function (id) {
            $state.go('bill.projectcapital.detail_back', {id: id});
        };
        //跳转详情
        $scope.info = function (item) {
            if (item.billType == 3) {
                $state.go('bill.projectcapital.detail_back', {batchNo: item.batchNo});
            }else{
                $state.go('bill.projectcapital.detail', {batchNo: item.batchNo, type: item.billType})
            }
            // window.open(url, '_blank')
        };
        //跳转财务列表
        $scope.toFinanceNumber = function () {
            $state.go('bill.projectcapital');
        }
        //跳转资金文号列表
        $scope.toCapitalNumber = function () {
            $state.go('bill.capitalnumber.index');
        }
        //跳转收入列表
        $scope.toAddIncome = function () {
            $state.go('bill.projectcapital.income');
        }
        //项目大类菜单切换
        $scope.switchTypeMenu = function (projectTypeId) {
            $scope.incomeTreeInit({projectTypeId: projectTypeId});
            $scope.payoutTreeInit({projectTypeId: projectTypeId});
            $scope.independentTypeId = projectTypeId;
            $scope.condition.projectTypeId = projectTypeId;
            $scope.condition.constructUnitName = null;
            $scope.condition.gardenIdString = null;
            $scope.condition.sourceTypeIdList = [];
            $scope.condition.sourceTypeList = [];
            $scope.condition.expenseTypeIdList = [];
            $scope.condition.expenseTypeList = [];
            $scope.condition.keywords = null;
            $scope.optionTypeList = [];
            $scope.sourceTypeList = [];
            $scope.expenseTypeList = [];
            $scope.sourceTypeIdList = [];
            $scope.expenseTypeIdList = [];
            $scope.cancelIncomeMultipleChooseOrder();
            $scope.cancelPayoutMultipleChooseOrder();
            $scope.clearMultipleChoose();
            $scope.pageSearch();
            $scope.refreshSourceNum();
        };
        $scope.initTypeNum();


        $scope.getProcessingTaskNum = function () {
            serviceUtil.requestServer(
                '/taskPlan/taskNum', 'get', function (data) {}, {isFinished: false}).then(data=>{
                    $scope.processingTaskNum = data.data;
            },err=>{
            dialogsManager.showMessage("获取进行中任务数失败", {className: 'error'});
        });
        }
        $scope.getProcessingTaskNum();
    }
]);
/************************收入*********************************/
bdp_projectcapital.controller('projectcapital.income.ctrl', ['$scope', '$rootScope', '$state', 'serviceUtil', 'dialogsManager', 'DaoService', '$config','ngDialog',
    function ($scope, $rootScope, $state, serviceUtil, dialogsManager, DaoService, $config,ngDialog) {
        $scope.isPayout = false;
        //返回列表
        $scope.backToList = function () {
            $state.go('bill.projectcapital.index');
        };

        //冲红类型
        $scope.backType = 'part';
        $scope.incomeType = 'income';

        $scope.$watch('selectedProject.id', function () {
            $scope.searchProjectIncome();
        })

        $scope.searchProjectIncome = function (incomeCapitalType) {
            if (!$scope.selectedProject.id) {
                return;
            }
            serviceUtil.requestServer(
                '/bill/projectIncome', 'get',
                function (data) {}, {projectId: $scope.selectedProject.id, capitalType: incomeCapitalType}
            ).then(data=>{
                    $scope.projectIncomeList = data.data;
                    $scope.selectedIncome = null;
            },err=>{

            });
        }

        $scope.showIncomeBillDetail = function (index, item) {
            item.checked = true;
            $scope.incomeId = item.projectIncomeId;
            item.idx = index;
            $scope.selectedIncome = item;
            serviceUtil.requestServer(
                '/bill/incomeDetail/' + item.projectIncomeId, 'get',
                function (data) {
                        $scope.incomeDetailList = data;
                }
            );
        };
        $scope.delSelectedIncome = function (idx) {
            $scope.projectIncomeList[idx].checked = false;
            $scope.selectedIncome = null;
            $scope.incomeDetailList = null;
        };

        //可见园区
        //TODO 返回值 code
        DaoService.get($config.modules.GARDEN, '/garden/simple/group-strategy',{isUserControlStrategy:false}).then(function (data) {
            $scope.gardens = data.data;
        });

        //收入来源字典
        serviceUtil.requestServer(
            '/dictionary/item/CAPITAL_SOURCE_TYPE', 'get',
            function (data) {
                $scope.incomeCapitalTypeList = [];
                $scope.capitalNumberSourceTypeList = [];
                data.forEach(function (e) {
                    if (!e.parentCode) {
                        $scope.incomeCapitalTypeList.push(e);
                    } else {
                        $scope.capitalNumberSourceTypeList.push(e);
                    }
                });
            });

        $scope.searchCapitalNumber = function () {
            serviceUtil.requestServer('/capital', 'get', function (data) {}, {gardenIdString: $scope.gardenIdString, capitalType: $scope.capitalType, keywords: $scope.capitalNumberName
            }).then(data=>{
                    $scope.capitalNumberList = data.data;
                    //重新搜索完，之前设置的数据依然存在
                    $scope.selectedCapitalNumberArray.forEach(function (e1) {
                        var flag = true;
                        $scope.capitalNumberList.forEach(function (e2) {
                            if (flag) {
                                if (e1.capitalNumberId == e2.id) {
                                    e2.usedAmount = e2.usedAmount * 1 + e1.amount * 1;
                                    e2.availableAmount = e2.availableAmount * 1 - e1.amount * 1;
                                    flag = false;
                                }
                            }
                        })

                    });
            },err=>{

            });
        }

        //要提交的项目资金明细对象
        $scope.projectCapital = {};
        //用于选择的项目对象
        $scope.selectedProject = {};
        //选择的资金文号数组
        $scope.selectedCapitalNumberArray = [];
        //分配金额的总额度
        $scope.allAssignAmount;
        //选择资金文号并分配资金
        $scope.showCapitalNumberDialog = function (index, item) {
            $scope.operateCapitalNumber = item;
            ngDialog.open({
                scope: $scope,
                className:'bill-dialog',
                template: require('../views/selector/capitalnumber.input.html'),
                controller: 'projectcapital.capitalNumberInput.ctrl',
                plain: true
            })
        }

        $scope.initCapitalNumberList = function (incomeCapitalType) {
            if (incomeCapitalType != 'capitalNumber') {
                $scope.selectedCapitalNumberArray = [];
            } else {
                $scope.searchCapitalNumber();
            }
        }

        $scope.saveIncome = function () {
            if (!$scope.incomeCapitalType) {
                dialogsManager.showMessage("请选择支出类型", {className:'error'});
            }
            $scope.projectCapital.type = $scope.incomeCapitalType;
            $scope.projectCapital.projectId = $scope.selectedProject.id;
            $scope.projectCapital.receivedDate = $scope.receivedDate ? new Date($scope.receivedDate).Format('yyyy-MM-dd') : null;
            $scope.projectCapital.incomeAmountVoList = [];
            if ($scope.incomeCapitalType == 'capitalNumber') {
                if ($scope.selectedCapitalNumberArray.length == 0) {
                    dialogsManager.showMessage("请选择资金文号", {className:'error'});
                    return;
                }
                $scope.selectedCapitalNumberArray.forEach(function (e) {
                    $scope.projectCapital.incomeAmountVoList.push({capitalId: e.capitalNumberId, amount: e.amount});
                });

            } else {
                if ($scope.incomeAmount * 1 <= 0) {
                    dialogsManager.showMessage("收入金额必须大于0", {className:'error'});
                    return;
                }
                $scope.incomeCapitalTypeList.forEach(function (e) {
                    if ($scope.incomeCapitalType == e.itemValue) {
                        $scope.projectCapital.typeName = e.itemName;
                    }
                });
                $scope.projectCapital.incomeAmountVoList.push({capitalId: null, amount: $scope.incomeAmount})
            }
            serviceUtil.requestServer(
                '/cashAccount', 'post',
                function (data) {
                        dialogsManager.showMessage('操作成功', {className:'success',callback:function () {
                            $state.go('bill.projectcapital.index');
                        }});
                }, $scope.projectCapital);

        }
        $scope.writeBackAmountSum = 0;
        $scope.checkWriteBackTotalAmount = function (item) {
            item.amount = checkInputNumber(item.amount, 7);
            if (!$scope.writeBackTotalAmount) {
                item.amount = null;
                dialogsManager.showMessage("请填写本次冲红总额", {className:'error'});
                return;
            }
            if (item.amount * 1 > item.availableAmount * 1) {
                item.amount = null;
                dialogsManager.showMessage("冲红金额不能大于可用额度", {className:'error'});
                $scope.writeBackAmountSum = 0;
                $scope.$apply()
            }
            $scope.writeBackAmountSum = 0;
            $scope.incomeDetailList.forEach(function (e) {
                if (e.amount) {
                    $scope.writeBackAmountSum = Math.formatFloat($scope.writeBackAmountSum + e.amount * 1, 6);
                }
            });
            if ($scope.writeBackTotalAmount < $scope.writeBackAmountSum) {
                item.amount = null;
                dialogsManager.showMessage("冲红金额不能大于冲红总额", {className:'error'});
                $scope.writeBackAmountSum = 0;
                $scope.$apply()
            }
        };

        $scope.saveIncomeWriteBack = function () {
            if (!$scope.incomeId) {
                dialogsManager.showMessage("请选择收入", {className:'error'});
                return;
            }
            if (!$scope.writeBackReason) {
                dialogsManager.showMessage("请输入冲红原因", {className:'error'});
                return;
            }
            //填入总金额校验
            if( $scope.selectedIncome.typeName=='资金文号'&& $scope.selectedIncome.availableAmount){
                if ($scope.selectedIncome.availableAmount) {
                    if ($scope.backType == 'part' && !$scope.writeBackTotalAmount) {
                        dialogsManager.showMessage("请填写冲红的总金额", {className:'error'});
                        return false;
                    }
                    if ($scope.backType == 'part' && ($scope.writeBackAmountSum != $scope.writeBackTotalAmount)) {
                        var num = $scope.writeBackTotalAmount - $scope.writeBackAmountSum;
                        var text = '您的待分配金额为' + num + '万元，请继续分配';
                        dialogsManager.showMessage(text, {className:'error'});
                        return false;
                    }
                }
            }


            $scope.incomeWriteBack = {};
            $scope.incomeWriteBack.businessType = 4;
            $scope.incomeWriteBack.description = $scope.writeBackReason;
            $scope.incomeWriteBack.cashAccountDetailVoList = [];
            if ($scope.backType == 'part') {
                $scope.incomeDetailList.forEach(function (e) {
                    if (e.amount) {
                        $scope.incomeWriteBack.cashAccountDetailVoList.push({
                            cashAccountId: e.id,
                            cashAccountDetailId: e.billDetailId,
                            amount: e.amount
                        });
                    }
                });
                if ($scope.incomeWriteBack.cashAccountDetailVoList.length == 0) {
                    // if (!$scope.selectedProject.id) {
                    //     dialogsManager.showMessage("请填写冲红金额", {className:'error'});
                    //     return;
                    // }
                    $scope.incomeDetailList.forEach(function (e) {
                        $scope.incomeWriteBack.cashAccountDetailVoList.push({
                            cashAccountId: e.id,
                            cashAccountDetailId: e.billDetailId,
                            amount: $scope.writeBackTotalAmount
                        });
                    });
                }
                $scope.incomeWriteBack.type = '0';
                } else {
                $scope.incomeWriteBack.type = '1';
                $scope.incomeDetailList.forEach(function (e) {
                    $scope.incomeWriteBack.cashAccountDetailVoList.push({
                        cashAccountId: e.id,
                        cashAccountDetailId: e.billDetailId,
                        amount: e.totalAmount
                    });
                });
            }
            serviceUtil.requestServer(
                '/cashAccount', 'put',
                function (data) {
                        dialogsManager.showMessage('操作成功', {className:'success',callback:function () {
                            $state.go('bill.projectcapital.index');
                        }})
                }, $scope.incomeWriteBack);
        }

        $scope.save = function () {
            if (!$scope.selectedProject.id) {
                dialogsManager.showMessage("请选择项目", {className:'error'});
                return;
            }
            if ($scope.incomeType == 'income') {
                $scope.saveIncome();
            }
            if ($scope.incomeType == 'incomeWriteBack') {
                $scope.saveIncomeWriteBack();
            }
        }

        $scope.removeCapitalNumber = function (index, $event) {
            $scope.capitalNumberList.forEach(function (e) {
                if (e.id == $scope.selectedCapitalNumberArray[index].capitalNumberId) {
                    e.usedAmount = e.usedAmount * 1 - $scope.selectedCapitalNumberArray[index].amount * 1;
                    e.availableAmount = e.availableAmount * 1 + $scope.selectedCapitalNumberArray[index].amount * 1;
                }
            });
            $scope.allAssignAmount = $scope.allAssignAmount * 1 - $scope.selectedCapitalNumberArray[index].amount * 1;
            $scope.selectedCapitalNumberArray.splice(index, 1);
            $event.stopPropagation();
        };
        $scope.inputed = function (num, name, max) {
            this.number = num;
            var all = 0;
            $scope[name] = checkInputNumber($scope[name], 7);
            angular.forEach($scope.incomeDetailList, function (v, k) {
                all = all + v.amount * 1;
            });
            $scope.Inputmax($scope, num, name, max);
            if (all > $scope[name]) {
                $scope.writeBackAmountSum = 0;
                angular.forEach($scope.incomeDetailList, function (v, k) {
                    v.amount = null;
                });
            }
        };

        //批量导入收入
        $scope.batchAddIncome = function () {
            $state.go('bill.projectcapital.batchInput', {
                importType: 'income',
                importName: '项目收入',
                importProjectTypeName: ''
            });
        };
    }
]);


//支出资金文号金额设置框
bdp_projectcapital.controller('projectcapital.capitalNumberInput.ctrl', ['$scope', '$state','serviceUtil','dialogsManager',
    function ($scope, $state, serviceUtil,dialogsManager) {
        $scope.isPayout = $scope.$parent.isPayout;
        $scope.tempCapitalNumber = $scope.$parent.operateCapitalNumber;
        $scope.checkAssignAmount = function (value) {
            $scope.assignAmount = checkInputNumber(value, 7);
        }

        $scope.ok = function () {
            if ($scope.isPayout && $scope.assignAmount * 1 > $scope.tempCapitalNumber.availableAmount * 1) {
                dialogsManager.showMessage("可用金额不足，不能分配", {className:'error'});
                return;
            }
            if (!$scope.isPayout && $scope.assignAmount * 1 > $scope.tempCapitalNumber.capitalAvailableAmount * 1) {
                dialogsManager.showMessage("可用金额不足，不能分配", {className:'error'});
                return;
            }
            if ($scope.assignAmount * 1 <= 0) {
                dialogsManager.showMessage("分配的金额不能小于等于0", {className:'error'});
                return;
            }
            var isExist = false;
            var temp;
            $scope.$parent.selectedCapitalNumberArray.forEach(function (e) {
                if (e.capitalNumberId == $scope.tempCapitalNumber.id) {
                    temp = e;
                    isExist = true;
                }
            });
            if (isExist) {
                temp.amount = add(temp.amount * 1, $scope.assignAmount * 1);
            } else {
                $scope.$parent.selectedCapitalNumberArray.push({
                    'capitalNumberId': $scope.tempCapitalNumber.id,
                    'name': $scope.tempCapitalNumber.name,
                    'amount': $scope.assignAmount,
                    'gardenName': $scope.tempCapitalNumber.gardenName
                });
            }
            $scope.$parent.operateCapitalNumber.usedAmount = add($scope.$parent.operateCapitalNumber.usedAmount * 1, $scope.assignAmount * 1);
            $scope.$parent.operateCapitalNumber.availableAmount = subtract($scope.$parent.operateCapitalNumber.availableAmount * 1, $scope.assignAmount * 1);
            //统计分配的总额度
            $scope.$parent.allAssignAmount = 0;
            $scope.$parent.selectedCapitalNumberArray.forEach(function (e) {
                $scope.$parent.allAssignAmount = add($scope.$parent.allAssignAmount * 1, e.amount * 1);
            });
            $scope.closeThisDialog();
        };


        $scope.cancle = function () {
            $scope.closeThisDialog();
        }
    }
]);
/******************************* 支出 ***************************************/
bdp_projectcapital.controller('projectcapital.payout.ctrl', ['$scope', '$state', 'serviceUtil', 'dialogsManager','ngDialog',
    function ($scope, $state, serviceUtil, dialogsManager,ngDialog) {
        $scope.isPayout = true;
        $scope.backType = 'part';
        $scope.payoutType = 'payout';

        $scope.PayoutQo = {};

        $scope.expenseTypeName = null;
        $scope.expenseTypeItemId = null;

        $scope.backToList = function () {
            $state.go('bill.projectcapital.index');
        };

        $scope.$watch('selectedProject.id', function () {
            $scope.searchProjectIncomeList();
            $scope.searchProjectPayoutList();
        })
        //项目资金
        $scope.projectCapital = {};
        //用于选择的项目对象
        $scope.selectedProject = {};
        //选择的资金文号数组
        $scope.selectedCapitalNumberArray = [];
        //选择的合同
        $scope.selectedProjectContract = {};
        //选择的付款方
        $scope.selectedBuildUnit = {};

        //选择资金文号并分配资金
        $scope.showCapitalNumberDialog = function (index, item) {
            $scope.operateCapitalNumber = item;
            ngDialog.open({
                scope: $scope,
                className:'bill-dialog',
                template: require('../views/selector/capitalnumber.input.html'),
                controller: 'projectcapital.capitalNumberInput.ctrl',
                plain: true,
                overlay: false
            })
        };
        //搜索项目收入列表
        $scope.searchProjectIncomeList = function () {
            if (!$scope.selectedProject.id) {
                return;
            }
            $scope.selectedCapitalNumberArray = [];
            $scope.allAssignAmount = 0;
            serviceUtil.requestServer(
                '/bill/projectIncome', 'get',
                function (data) {
                        $scope.projectIncomeList = data;
                        //重新搜索完，之前设置的数据依然存在
                        $scope.selectedCapitalNumberArray = [];
                        $scope.allAssignAmount = 0;
                }, {projectId: $scope.selectedProject.id, capitalType: $scope.keywords});
        }

        $scope.initPayoutSelectWindow = function () {
            //支出类型列表
            $scope.expenseTypeIdList = [];
            $scope.expenseTypeList = [];
            //项目合同列表
            $scope.contractNoList = [];
            $scope.contractList = [];
            //支出对象列表
            $scope.payeeIdList = [];
            $scope.payeeList = [];
        }

        $scope.initPayoutSelectWindow();
        //搜索项目支出列表
        $scope.searchProjectPayoutList = function () {
            $scope.initPayoutSelectWindow();
            if (!$scope.selectedProject.id) {
                return;
            }
            serviceUtil.requestServer(
                '/bill/projectPayout', 'get',
                function (data) {}, {projectId: $scope.selectedProject.id}).then(data=>{
                    console.log(data,data.data);
                    $scope.projectPayoutList = data.data;
                    $scope.projectPayoutList.forEach(function (e) {
                        if ($scope.expenseTypeIdList.indexOf(e.expenseTypeItemId) == -1) {
                            $scope.expenseTypeIdList.push(e.expenseTypeItemId);
                            $scope.expenseTypeList.push({
                                expenseTypeItemId: e.expenseTypeItemId,
                                expenseTypeItemName: e.expenseTypeItemName
                            });
                        }
                        if (e.contractNo && $scope.contractNoList.indexOf(e.contractNo) == -1) {
                            $scope.contractNoList.push(e.contractNo);
                            $scope.contractList.push({contractNo: e.contractNo, contractName: e.contractName});
                        }
                        if (e.payee && $scope.payeeIdList.indexOf(e.payee) == -1) {
                            $scope.payeeIdList.push(e.payee);
                            $scope.payeeList.push({payee: e.payee, payeeName: e.payeeName});
                        }
                    });
                    $scope.filterProjectPayoutList = $scope.projectPayoutList;
            });
        }
        //js牧模糊匹
        $scope.getFilterProjectPayoutList = function () {
            if ($scope.tempExpenseTypeItemId || $scope.tempContractNo || $scope.tempPayee || $scope.tempKeywords) {
                $scope.filterProjectPayoutList = [];
                for (var i = 0; i < $scope.projectPayoutList.length; i++) {
                    if ($scope.tempExpenseTypeItemId && $scope.tempExpenseTypeItemId != $scope.projectPayoutList[i].expenseTypeItemId) {
                        continue;
                    }
                    if ($scope.tempContractNo && $scope.tempContractNo != $scope.projectPayoutList[i].contractNo) {
                        continue;
                    }
                    if ($scope.tempPayee && $scope.tempPayee != $scope.projectPayoutList[i].payee) {
                        continue;
                    }
                    if ($scope.tempKeywords && $scope.projectPayoutList[i].expenseTypeItemName.indexOf($scope.tempKeywords) == -1) {
                        continue;
                    }
                    $scope.filterProjectPayoutList.push($scope.projectPayoutList[i]);
                }
            } else {
                $scope.filterProjectPayoutList = $scope.projectPayoutList;
            }
        }

        $scope.showIncomeBillDetail = function (index, item) {
            item.idx = index;
            item.checked = true;
            $scope.incomeId = item.projectIncomeId;
            $scope.selectedIncome = item;
            $scope.selectedCapitalNumberArray = [];
            serviceUtil.requestServer(
                '/bill/incomeDetail/' + item.projectIncomeId, 'get',
                function (data) {
                        $scope.incomeDetail = data;
                });
        };
        $scope.delSelectPayIncome = function (idx) {
            $scope.selectedIncome = null;
            $scope.projectIncomeList[idx].checked = false;
        };

        $scope.showPayoutBillDetail = function (idx, item) {
            item.checked = true;
            item.idx = idx;
            $scope.selectedPayout = item;
            serviceUtil.requestServer(
                '/bill/payoutDetail/' + item.batchNo, 'get',
                function (data) {
                        $scope.payoutDetailList = data;
                });
        };
        $scope.delSelectedPayout = function (idx) {
            $scope.filterProjectPayoutList[idx].checked = false;
            $scope.selectedPayout = null;
            $scope.writeBackTotalAmount = null;
        };
        $scope.inputed = function (num, name, max) {
            $scope[name] = checkInputNumber($scope[name], 7);
            $scope.Inputmax($scope, num, name, max);
            var all = 0;
            angular.forEach($scope.payoutDetailList, function (v, k) {
                all = all + v.amount * 1;
            });
            if (all > $scope[name]) {
                $scope.writeBackAmountSum = 0;
                angular.forEach($scope.payoutDetailList, function (v, k) {
                    v.amount = null;
                });
            }

        };
        $scope.writeBackAmountSum = 0;
        $scope.checkPayoutWriteBackTotalAmount = function (item) {
            item.amount = checkInputNumber(item.amount, 7);
            if (!$scope.writeBackTotalAmount) {
                item.amount = null;
                dialogsManager.showMessage("请填写本次冲红总额", {className: 'error'});
                return;
            }
            if (item.amount * 1 > item.availableAmount * 1) {
                item.amount = item.availableAmount;
            }
            $scope.writeBackAmountSum = 0;
            $scope.payoutDetailList.forEach(function (e) {
                if (e.amount) {
                    $scope.writeBackAmountSum = Math.formatFloat($scope.writeBackAmountSum + e.amount * 1, 6);
                }
            });
            if ($scope.writeBackTotalAmount < $scope.writeBackAmountSum) {
                $scope.writeBackAmountSum = Math.formatFloat($scope.writeBackAmountSum - item.amount * 1, 6)
                item.amount = null;
                dialogsManager.showMessage("冲红金额不能大于冲红总额", {className: 'error'});
                return;
            }
        }

        //资金文号移除
        $scope.removeCapitalNumber = function (index) {
            $scope.incomeDetail.forEach(function (e) {
                if (e.id == $scope.selectedCapitalNumberArray[index].capitalNumberId) {
                    e.usedAmount = e.usedAmount * 1 - $scope.selectedCapitalNumberArray[index].amount * 1;
                    e.availableAmount = e.availableAmount * 1 + $scope.selectedCapitalNumberArray[index].amount * 1;
                }
            });
            $scope.allAssignAmount = $scope.allAssignAmount * 1 - $scope.selectedCapitalNumberArray[index].amount * 1;
            $scope.selectedCapitalNumberArray.splice(index, 1);
        }

        $scope.save = function () {
            if (!$scope.selectedProject.id) {
                dialogsManager.showMessage("请选择项目", {className: 'error'});
                return;
            }
            if ($scope.payoutType == 'payout') {
                $scope.savePayout();
            }
            if ($scope.payoutType == 'payoutWriteBack') {
                $scope.savePayoutWriteBack();
            }
        }

        $scope.savePayout = function () {
            if ($scope.selectedCapitalNumberArray.length == 0) {
                dialogsManager.showMessage("请选择收入并配置对应的资金文号", {className: 'error'});
                return;
            }
            /*      if (!$scope.selectedProjectContract.contractNo) {
             dialogsManager.showMessage("合同不能为空", {className: 'error'});
             return;
             }*/
            if (!$scope.selectedBuildUnit.id) {
                dialogsManager.showMessage("收款方不能为空", {className: 'error'});
                return;
            }

            if (!$scope.expenseTypeItemId) {
                dialogsManager.showMessage("费用类型不能为空", {className: 'error'});
                return;
            }
            $scope.projectCapital.cashAccountDetailVoList = [];
            $scope.selectedCapitalNumberArray.forEach(function (e) {
                $scope.projectCapital.cashAccountDetailVoList.push({
                    cashAccountId: e.capitalNumberId,
                    amount: e.amount
                });
            });
            $scope.projectCapital.expenseTypeItemId = $scope.expenseTypeItemId;
            $scope.projectCapital.businessType = 2;
            $scope.projectCapital.contractNo = $scope.selectedProjectContract.contractNo;
            $scope.projectCapital.payee = $scope.selectedBuildUnit.id;
            if ($scope.capitalChangeDate) {
                $scope.projectCapital.capitalChangeDate = new Date($scope.capitalChangeDate).Format('yyyy-MM-dd');
            }
            serviceUtil.requestServer(
                '/cashAccount', 'put',
                function (data) {
                    dialogsManager.showMessage('操作成功', {
                        className: 'success', callback: function () {
                            $state.go('bill.projectcapital.index');
                        }
                    });
                }, $scope.projectCapital
            );
        };

        $scope.savePayoutWriteBack = function () {
            if (!$scope.selectedPayout.batchNo) {
                dialogsManager.showMessage("请选择支出", {className: 'error'});
                return;
            }
            $scope.PayoutWriteBackVo = {};
            $scope.PayoutWriteBackVo.description = $scope.writeBackReason;
            $scope.PayoutWriteBackVo.businessType = 5;
            $scope.PayoutWriteBackVo.cashAccountDetailVoList = [];
            if (!$scope.writeBackReason) {
                dialogsManager.showMessage("请输入冲红原因", {className: 'error'});
                return;
            }
            if ($scope.backType == 'part') {
                if (!$scope.writeBackTotalAmount || $scope.writeBackTotalAmount == 0) {
                    dialogsManager.showMessage("冲红的金额必须大于0", {className: 'error'});
                    return;
                }
                if ($scope.writeBackAmountSum != $scope.writeBackTotalAmount) {
                    var num = $scope.writeBackTotalAmount - $scope.writeBackAmountSum;
                    var text = '您的待分配金额为' + num + '万元，请继续分配';
                    dialogsManager.showMessage(text, {className: 'error'});
                    return false;
                }
                $scope.PayoutWriteBackVo.type = '0';
                $scope.payoutDetailList.forEach(function (e) {
                    if (e.amount) {
                        $scope.PayoutWriteBackVo.cashAccountDetailVoList.push(
                            {cashAccountId: e.billId, cashAccountDetailId: e.id, amount: e.amount}
                        );
                    }
                });
            } else {
                $scope.PayoutWriteBackVo.type = '1';
                $scope.payoutDetailList.forEach(function (e) {
                    $scope.PayoutWriteBackVo.cashAccountDetailVoList.push(
                        {cashAccountId: e.billId, cashAccountDetailId: e.id, amount: e.availableAmount}
                    );
                });
            }
            serviceUtil.requestServer(
                '/cashAccount', 'put',
                function (data) {
                        dialogsManager.showMessage('操作成功', {
                            className: 'success', callback: function () {
                                $state.go('bill.projectcapital.index');
                            }
                        })
                }, $scope.PayoutWriteBackVo);
        }

        //批量导入支出
        $scope.batchAddPayout = function () {
            $state.go('bill.projectcapital.batchInput', {
                importType: 'payout',
                importName: '项目支出',
                importProjectTypeName: ''
            });
        };
    }
]);

/******************************** 回收 ****************************************/
bdp_projectcapital.controller('projectcapital.recovery.ctrl', ['$scope', '$state', 'serviceUtil', 'dialogsManager',
    function ($scope, $state, serviceUtil, dialogsManager) {

        $scope.backToList = function () {
            $state.go('bill.projectcapital.index');
        };

        $scope.backType = 'part';
        $scope.recoveryType = 'recovery';

        //要提交的回收对象
        $scope.projectCapitalRecovery = {};
        $scope.projectCapitalRecovery.cashAccountDetailVoList = [];
        $scope.totalItemRecovery = 0;

        //选中的项目
        $scope.selectedProject = {};
        //选中的资金文号
        $scope.selectedCapitalNumber = {};

        $scope.$watch('selectedCapitalNumber.id', function () {
            $scope.searchCapitalAmount();
            $scope.getCapitalProjectIncomeList();
            $scope.getRecoveryItemList();
        })

        //获取资金文号，总额、可用金额等
        $scope.capitalAmountInfo = {};
        $scope.searchCapitalAmount = function () {
            if (!$scope.selectedCapitalNumber.id) {
                return;
            }
            serviceUtil.requestServer(
                '/capital/' + $scope.selectedCapitalNumber.id + '/amount', 'get',
                function (data) {
                        $scope.capitalAmountInfo = data;
                }
            );
        }

        //获取资金文号下的收入列表（已经按项目分类）
        $scope.getCapitalProjectIncomeList = function () {
            if (!$scope.selectedCapitalNumber.id) {
                return;
            }
            serviceUtil.requestServer(
                '/bill/capital/' + $scope.selectedCapitalNumber.id + '/projectIncome', 'get',
                function (data) {
                        $scope.capitalProjectIncomeList = data;
                }
            );
        }
        //校验资金文号回收金额
        $scope.checkRecoveryAmount = function () {
            $scope.recoveryAmount = checkInputNumber($scope.recoveryAmount, 7);
            if (!$scope.selectedCapitalNumber.id) {
                dialogsManager.showMessage("请选择资金文号", {className: 'error'});
                $scope.recoveryAmount = null;
                return;
            }
            if ($scope.recoveryAmount * 1 > $scope.capitalAmountInfo.totalAvailableAmount * 1) {
                $scope.recoveryAmount = $scope.capitalAmountInfo.totalAvailableAmount;
            }
            $scope.sumRecoveryAmount();
        }
        //校验项目中每一项回收金额
        $scope.checkItemRecoveryAmount = function (item) {
            item.recoveryAmount = checkInputNumber(item.recoveryAmount, 7);
            if (item.recoveryAmount && item.recoveryAmount * 1 <= 0) {
                dialogsManager.showMessage("回收金额必须大于0", {className: 'error'});
                item.recoveryAmount = null;
                return;
            }
            if (item.recoveryAmount && item.recoveryAmount * 1 > item.availableAmount * 1) {
                item.recoveryAmount = item.availableAmount;
            }
            $scope.sumRecoveryAmount();
        }

        //汇总未支出收走和已支出收走金额
        $scope.sumRecoveryAmount = function () {
            $scope.totalRecoveryAmount = $scope.recoveryAmount ? $scope.recoveryAmount * 1 + $scope.getItemTotalRecoveryAmount() : $scope.getItemTotalRecoveryAmount();
        }
        //合计项目回收列表的总金额
        $scope.getItemTotalRecoveryAmount = function () {
            $scope.totalItemRecovery = 0;
            $scope.projectCapitalRecovery.cashAccountDetailVoList = [];
            if ($scope.capitalProjectIncomeList) {
                $scope.capitalProjectIncomeList.forEach(function (e) {
                    e.incomeBillQoList.forEach(function (e1) {
                        if (e1.recoveryAmount) {
                            $scope.totalItemRecovery = $scope.totalItemRecovery + e1.recoveryAmount * 1;
                            $scope.projectCapitalRecovery.cashAccountDetailVoList.push({
                                cashAccountId: e1.billId,
                                amount: e1.recoveryAmount
                            });
                        }
                    });
                });
            }
            return $scope.totalItemRecovery;
        }

        //回收保存
        $scope.saveRecovery = function () {
            if (!$scope.recoveryReason) {
                dialogsManager.showMessage("请输入回收原因", {className: 'error'});
                return;
            }
            if (!$scope.recoveryAmount && $scope.capitalProjectIncomeList.length == 0) {
                dialogsManager.showMessage("回收金额不能为空", {className: 'error'});
                return;
            }
            if (!$scope.recoveryAmount && $scope.totalItemRecovery == 0) {
                dialogsManager.showMessage("回收金额不能为空", {className: 'error'});
                return;
            }
            $scope.projectCapitalRecovery.capitalId = $scope.selectedCapitalNumber.id;
            $scope.projectCapitalRecovery.businessType = 3;
            $scope.projectCapitalRecovery.amount = $scope.recoveryAmount;
            $scope.projectCapitalRecovery.description = $scope.recoveryReason;
            serviceUtil.requestServer(
                '/cashAccount', 'put',
                function (data) {
                        dialogsManager.showMessage('操作成功！', {
                            className: 'success', callback: function () {
                                $state.go('bill.projectcapital.index');
                            }
                        });
                }, $scope.projectCapitalRecovery
            );
        }

        /********************
         *                  *
         *      回收冲红     *
         *                  *
         ********************/

        $scope.totalProjectRecoveryWriteBackAmount = 0;

        $scope.checkCapitalRecoveryWriteBack = function (name, num, max) {
            $scope[name] = checkInputNumber($scope[name], 7);
            $scope.Inputmax($scope, num, name, max);
        };

        $scope.checkProjectRecoveryWriteBack = function (item) {
            item.writeBackAmount = checkInputNumber(item.writeBackAmount, 7);
            if ($scope.writeBackAmount && $scope.writeBackAmount * 1 <= 0) {
                dialogsManager.showMessage("冲红金额必须大于0", {className: 'error'});
                item.writeBackAmount = null;
                return;
            }
            if (item.writeBackAmount * 1 && item.availableWriteBackAmount < item.writeBackAmount * 1) {
                item.writeBackAmount = item.availableWriteBackAmount;
            }
            $scope.sumTotalRecoveryWriteBackAmount();
        }

        $scope.getTotalProjectRecoveryWriteBackAmount = function () {
            $scope.totalProjectRecoveryWriteBackAmount = 0;
            for (var key in $scope.projectRecoveryWriteBackDetailMap) {
                if (key) {
                    $scope.projectRecoveryWriteBackDetailMap[key].forEach(function (e) {
                        if ($scope.backType == 'part' && e.writeBackAmount) {
                            $scope.totalProjectRecoveryWriteBackAmount = $scope.totalProjectRecoveryWriteBackAmount + e.writeBackAmount * 1;
                        } else if ($scope.backType == 'all' && e.availableWriteBackAmount) {
                            $scope.totalProjectRecoveryWriteBackAmount += e.availableWriteBackAmount;
                        }
                    });
                }
            }
        }

        $scope.totalRecoveryWriteBackAmount = 0;

        $scope.sumTotalRecoveryWriteBackAmount = function () {
            $scope.totalRecoveryWriteBackAmount = 0;
            $scope.getTotalProjectRecoveryWriteBackAmount();
            $scope.totalRecoveryWriteBackAmount = Math.formatFloat($scope.totalProjectRecoveryWriteBackAmount + (($scope.writeBackAmount && $scope.backType == 'part') ? Number($scope.writeBackAmount) : 0) + (($scope.capitalRecoveryWriteBack && $scope.backType == 'all') ? $scope.capitalRecoveryWriteBack.availableWriteBackAmount : 0), 6);
        }

        //回收列表（汇总），用于冲红
        $scope.getRecoveryItemList = function () {
            if (!$scope.selectedCapitalNumber.id) {
                return;
            }
            $scope.totalProjectRecoveryWriteBackAmount = 0
            $scope.selectedRecovery = null;
            serviceUtil.requestServer(
                '/bill/capital/' + $scope.selectedCapitalNumber.id + '/recovery', 'get',
                function (data) {
                        $scope.recoveryItemList = data;
                }
            );
        };
        //选中单笔回收之后，查询该笔回收下面的明细
        $scope.selectRecovery = function (index, item) {
            item.checked = true;
            item.idx = index;
            $scope.totalProjectRecoveryWriteBackAmount = 0;
            $scope.selectedRecovery = item;
            serviceUtil.requestServer(
                '/bill/capital/recovery/' + item.batchNo, 'get',
                function (data) {
                        $scope.projectRecoveryWriteBackDetailMap = data.projectRecoveryDetailMap;
                        $scope.projectAvailableWriteBackAmount = data.projectAvailableWriteBackAmount;
                        $scope.capitalRecoveryWriteBack = data.capitalRecovery;
                        $scope.sumTotalRecoveryWriteBackAmount();
                }
            );
        };
        $scope.delSelectedRecovery = function (idx) {
            $scope.recoveryItemList[idx].checked = false;
            $scope.selectedRecovery = null;
            $scope.writeBackAmount = null;
        };
        //保存回收冲红
        $scope.saveRecoveryWriteBack = function () {
            if (!$scope.recoveryWriteBackReason) {
                dialogsManager.showMessage("请填写冲红原因", {className: 'error'});
                return;
            }
            $scope.recoveryWriteBack = {};
            $scope.recoveryWriteBack.businessType = 7
            $scope.recoveryWriteBack.type = ($scope.backType == 'part' ? '0' : '1');
            $scope.recoveryWriteBack.description = $scope.recoveryWriteBackReason;
            $scope.recoveryWriteBack.cashAccountDetailVoList = [];
            if ($scope.capitalRecoveryWriteBack) {
                if ($scope.backType == 'part' && $scope.writeBackAmount) {
                    $scope.recoveryWriteBack.cashAccountDetailVoList.push({
                        cashAccountId: $scope.capitalRecoveryWriteBack.billId,
                        cashAccountDetailId: $scope.capitalRecoveryWriteBack.billDetailId,
                        amount: $scope.writeBackAmount
                    });
                } else if ($scope.backType == 'all') {
                    $scope.recoveryWriteBack.cashAccountDetailVoList.push({
                        cashAccountId: $scope.capitalRecoveryWriteBack.billId,
                        cashAccountDetailId: $scope.capitalRecoveryWriteBack.billDetailId,
                        amount: $scope.capitalRecoveryWriteBack.availableWriteBackAmount
                    });
                }
            }
            for (var key in $scope.projectRecoveryWriteBackDetailMap) {
                if (key) {
                    $scope.projectRecoveryWriteBackDetailMap[key].forEach(function (e) {
                        if ($scope.backType == 'part' && e.writeBackAmount && e.writeBackAmount > 0) {
                            $scope.recoveryWriteBack.cashAccountDetailVoList.push({
                                cashAccountId: e.billId,
                                cashAccountDetailId: e.billDetailId,
                                amount: e.writeBackAmount
                            });
                        } else if ($scope.backType == 'all' && e.availableWriteBackAmount > 0) {
                            $scope.recoveryWriteBack.cashAccountDetailVoList.push({
                                cashAccountId: e.billId,
                                cashAccountDetailId: e.billDetailId,
                                amount: e.availableWriteBackAmount
                            });
                        }
                    });
                }
            }
            serviceUtil.requestServer(
                '/cashAccount', 'put',
                function (data) {
                        dialogsManager.showMessage('操作成功！',{className:'success',callback: function () {
                            $state.go('bill.projectcapital.index');
                        }});
                }, $scope.recoveryWriteBack
            );

        }
        //保存汇总
        $scope.save = function () {
            if (!$scope.selectedCapitalNumber.id) {
                dialogsManager.showMessage("请选择资金文号", {className: 'error'});
                return;
            }
            if ($scope.recoveryType == 'recovery') {
                $scope.saveRecovery();
            } else {
                $scope.saveRecoveryWriteBack();
            }
        }

        //批量导入财政收走
        $scope.batchAddRecovery = function () {
            $state.go('bill.projectcapital.batchInput', {
                importType: 'recovery',
                importName: '财政收走',
                importProjectTypeName: ''
            });
        };
    }
]);

/******************************** 项目资金详情 *****************************************/
bdp_projectcapital.controller('projectcapital.detail.ctrl', ['$scope', '$state', '$stateParams', 'serviceUtil', 'dialogsManager',
    function ($scope, $state, $stateParams, serviceUtil, dialogsManager) {
        $scope.totalAmount = 0;
        if ($stateParams.type == '1') {
            $scope.showName = '收入';
            $scope.showPayoutInfo = false;
        } else if ($stateParams.type == '2') {
            $scope.showName = '支出';
            $scope.showPayoutInfo = true;
        } else {
            dialogsManager.showMessage("请求参数错误！", {className: 'error'})
        }
        serviceUtil.requestServer(
            '/hits',
            'post',
            {sourceId: $stateParams.batchNo, dataSources: '2'}
        );
        if (!$scope.showPayoutInfo) {
            serviceUtil.requestServer('/bill/projectIncome/info/' + $stateParams.batchNo, 'get').then(data=>{
                    $scope.projectCapital = data.data;
            },err=>{
                dialogsManager.showMessage(err.data.error_description, {className: 'error'});
            });
            serviceUtil.requestServer('/bill/projectIncome/writeBack/' + $stateParams.batchNo, 'get').then(data=>{
                    $scope.projectWriteBack = data.data;
            },err=>{
                dialogsManager.showMessage(err.data.error_description, {className: 'error'});
            });
        } else {
            serviceUtil.requestServer('/bill/projectPayout/info/' + $stateParams.batchNo, 'get').then(data=>{
                    $scope.projectCapital = data.data;
            },err=>{
                dialogsManager.showMessage(err.data.error_description, {className: 'error'});
            });
            serviceUtil.requestServer('/bill/projectPayout/writeBack/' + $stateParams.batchNo, 'get').then(data=>{
                    $scope.projectWriteBack = data.data;
            },err=>{
                dialogsManager.showMessage(err.data.error_description, {className: 'error'});
            });
        }
        $scope.goProjectCapitalList = function () {
            $state.go('bill.projectcapital.index');
        }
    }
]);

/***************************收走详情********************************/
bdp_projectcapital.controller('projectcapital.detailBack.ctrl', ['$scope', '$state', '$stateParams', 'serviceUtil', 'dialogsManager',
    function ($scope, $state, $stateParams, serviceUtil, dialogsManager) {
        //统计点击量
        serviceUtil.requestServer(
            '/hits', 'post',
            {sourceId: $stateParams.batchNo, dataSources: '2'}
        );
        //查询点击量
        serviceUtil.requestServer(
            '/hits', 'get', function (data) {
                    $scope.hits = data;
            },
            {sourceId: $stateParams.batchNo, dataSources: '2'}
        );
        serviceUtil.requestServer(
            '/capital/amount/recovery', 'get', function (data) {},
            {batchNo: $stateParams.batchNo}
        ).then(data=>{
                $scope.capital = data.data;
        },err=>{
            dialogsManager.showMessage("查询资金文号金额分布出错", {className: 'error'})
        });

        serviceUtil.requestServer(
            '/bill/capital/recovery/' + $stateParams.batchNo, 'get', function (data) {}
        ).then(data=>{
                $scope.recovery = data.data;
        },err=>{
            dialogsManager.showMessage("查询资金文号收走金额出错", {className: 'error'})
        });

        serviceUtil.requestServer(
            '/bill/capital/recoveryWriteBack/' + $stateParams.batchNo, 'get', function (data) {}
        ).then(data=>{
                $scope.recoveryWriteBack = data.data;
        },err=>{
            dialogsManager.showMessage("查询资金文号收走冲红金额出错", {className: 'error'})
        });


        $scope.goProjectCapitalList = function () {
            $state.go('bill.projectcapital.index');
        }
    }
]);
