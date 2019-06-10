var bdpWeb = angular.module('bdpWeb');
bdpWeb.controller("billCtrl", ['$scope', '$state', 'serviceUtil','$rootScope','$config','dialogsManager','lwPermissionService', function ($scope, $state, serviceUtil,$rootScope,$config,dialogsManager,lwPermissionService) {
    $scope.foldSide=function () {
        if($scope.isfold){
            $scope.isfold=false
        }
        else{
            $scope.isfold=true
        }
    };
    $scope.billTab='projectcapital'
    let hasProjectCapital = lwPermissionService.hasPermission('bdp:projectCapital:list');
    let hasCapitalNumber = lwPermissionService.hasPermission('bdp:capitalNumber:list');
    var _this = this;
    if($state.current.name=='bill'){
        if(hasProjectCapital){
            $state.go('bill.projectcapital.index');
        }else if(hasCapitalNumber){
            $state.go('bill.capitalnumber.index');
        }
    }
    let states = $state.current.name.split('.');
    $rootScope.isHideNavBar = _this.isHideTab = states[2] && states[2]!='index';
    $rootScope.$on('$stateChangeStart',
        function (event, toState,toParams,fromeState,frameParams) {
            states = toState.name.split('.');
            if(states.indexOf('bill')>-1){
                $scope.billTab = states[1];
                $scope.billTab2 = states[2];
                $rootScope.isHideNavBar = _this.isHideTab = states[2] && states[2]!='index';
                if(toState.name=='bill'){
                    event.preventDefault();
                    if(hasProjectCapital){
                        $state.go('bill.projectcapital.index');
                    }else if(hasCapitalNumber){
                        $state.go('bill.capitalnumber.index');
                    }
                }
            }
        }
    );

    $scope.home = {};
    
    $scope.home.projectCategory = [];
    serviceUtil.requestServer(
        '/dictionary/item/PROJECT_CATEGORY', 'get',
        function (data) {
            data.forEach(function(e){
                if(!e.parentCode){
                    $scope.home.projectCategory.push(e);
                }
            });
        }
    );
}]);

bdpWeb.controller('batchInput.ctrl', ['$scope', '$state', 'serviceUtil', '$stateParams', 'dialogsManager',
    function ($scope, $state, serviceUtil, $stateParams, dialogsManager) {
        $scope.importType = $stateParams.importType;
        $scope.importName = $stateParams.importName;
        $scope.importProjectTypeName = $stateParams.importProjectTypeName;
        $scope.businessCode = "";
        if ($scope.importType == 'projects') {
            $scope.businessCode = '0';
        } else if ($scope.importType == 'contract') {
            $scope.businessCode = '1';
        } else if ($scope.importType == 'capitalnumber') {
            $scope.businessCode = '2';
        }else if ($scope.importType == 'income') {
            $scope.businessCode = '3';
        }else if ($scope.importType == 'payout') {
            $scope.businessCode = '4';
        }else if ($scope.importType == 'recovery') {
            $scope.businessCode = '5';
        }


        $scope.selectProjectType = function () {
            if ($scope.selectedProjectTypeIndex) {
                $scope.selectedProjectType = $scope.home.projectCategory[$scope.selectedProjectTypeIndex].itemValue;
                $scope.selectedProjectTypeName = $scope.home.projectCategory[$scope.selectedProjectTypeIndex].itemName;
            } else {
                $scope.selectedProjectType = null;
                $scope.selectedProjectTypeName = null;
            }
        };

        $scope.downloadTemplate = function () {
            serviceUtil.requestServer(
                '/template', 'download'
                , {"businessTypeCode": $scope.businessCode});
        };

        $scope.uploadSuccess = function (message, file) {
            if (!$scope.businessCode) {
                dialogsManager.showMessage("请选择要导入的项目类型", {className: 'error'});
                return;
            }
            file.hideDelIcon = true;
            var fileInfo = eval("(" + message + ")");
            var vo = {};
            vo.fileName = fileInfo.name;
            vo.type = 1;
            vo.id = file.jobId;
            vo.businessType = $scope.businessCode;
            vo.fileStorePath = fileInfo.path;
            serviceUtil.requestServer(
                '/taskPlan', 'put', function (data) {
                        dialogsManager.showMessage('上传成功,系统正在检测,请到任务列表查看',{className:'success'});
                }, vo);
        };

        $scope.deleteJob = function (jobId) {
            serviceUtil.requestServer(
                '/taskPlan', 'delete', function (data) {}, {ids: jobId}).then(data=>{
                    dialogsManager.showMessage('操作成功！',{className:'success'});
            },err=>{
                dialogsManager.showMessage('操作失败！',{className:'error'});
            });
        }

        $scope.uploadSubmit = function ($flow,index) {
            if (!$scope.businessCode) {
                dialogsManager.showMessage("导入业务类型Code不能为空", {className: 'error'});
                $flow.files = null;
                return;
            }
            if(!$flow.files[0]){
                return;
            }
            var idx = $flow.files.length-1;
            var file = $flow.files[idx];
            var vo = {};
            vo.fileName = file.name;
            vo.type = 1;
            vo.businessType = $scope.businessCode;
            serviceUtil.requestServer(
                '/taskPlan', 'post', function (data) {
                    file.jobId = data.data;
                    $flow.upload();
                }, vo);
        };
        $scope.goBack = function(){
            var capital = ['income','payout','recovery'];
            if(capital.indexOf($scope.importType) != -1){
                $state.go('bill.projectcapital.'+$scope.importType);
            }else{
                $state.go('bill.'+$scope.importType+'.index');
            }
        };
    }]);

