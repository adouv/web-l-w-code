/**
 * Created by lw-yf-012 on 2016/12/26.
 */
import "../styles/streamMedia.css";
import "../styles/choosegarden.css";

tpk_streamMedia.controller('streamMedia.ctrl', ['$scope', '$state', '$stateParams', 'serviceUtil', 'Garden',
    function ($scope, $state, $stateParams, serviceUtil, Garden) {
        Garden.gardenToggle($scope);
        $scope.gardenId = $stateParams.gardenId;
        $scope.version = "";
        $scope.condition = {};
        $scope.checkeds = [];
        $scope.platforms = [];
        //获取流媒体平台
        serviceUtil.requestServer('/streamMediaPlatform', "get",
            function (data) {
                $scope.platforms = data;
                $scope.platforms.unshift({
                    id:'',
                    platformName:"请选择流媒体平台版本"
                })
         });
        $scope.changeStatus = function ($event, id) {
            var target = $event.target;
            serviceUtil.requestServer('/streamMedia/status/' + target.checked, 'put',
                function (data) {
                    //添加提示信息
                }, {id: id});
        }
        $scope.platformChange = function(){
            $scope.condition.platformId = $scope.version;
            $('#lw-search').click();
        }
        $scope.checkCheckbox = function ($event, id) {
            var target = $event.target.checked;
            if (target) {
                $scope.checkeds.push(id);
                if ($scope.checkeds.length == $scope.datas.length) {
                    $scope.checkAll = true;
                }
            } else {
                var index = $scope.checkeds.indexOf(id);
                $scope.checkeds.splice(index, 1);
                $scope.checkAll = false;
            }
        }
        $scope.checkAllBox = function($event){
            if($event.target.checked){
                angular.forEach($scope.datas,function (data) {
                    $scope.checkeds.push(data.id);
                    data.checked = true;
                })
            }else{
                angular.forEach($scope.datas,function (data) {
                    data.checked = false;
                });
                $scope.checkeds = [];
            }
        }

        $scope.batchDelete = function () {
            if ($scope.checkeds.length > 0) {
                lwUiModel.delete(function () {
                    var ids = $scope.checkeds.toString();
                    serviceUtil.requestServer('/streamMedia/' + ids, 'delete',
                        function (data) {
                            $scope.toSearch();
                        })
                })
            } else {
                //提示信息
            }
        }
        function getStreamMediaById(id){
            for(var i=0;i<$scope.platforms.length;i++){
                if($scope.platforms[i].id==id){
                    return $scope.platforms[i];
                }
            }
            return {};
        }
        $scope.streamMediaModule = {
            toDetail: function (id) {
                $state.go("home.streamMedia.info", {id: id})
            },
            toEdit: function (id) {
                $state.go("home.streamMedia.input", {id: id})
            },
            toAdd: function () {
                $state.go("home.streamMedia.input")
            }
        }
    }]);
tpk_streamMedia.controller('streamMediaMessage.ctrl', ['$scope', '$state', '$stateParams', '$uibModal', 'serviceUtil',
    function ($scope, $state, $stateParams, $uibModal, serviceUtil) {
        // console.log();
        $scope.patterns = {
            ip:/((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/,
            port:{
                pattern:/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                include:['ftp_port','mb_live_port','mb_record_port','pc_live_port','rtmp_port']
            },
            root:{
                include:['record_folder','ftp_root','upload_folder'],
                record_folder:'示例:初一',
                ftp_root:'示例:D:\\录制视频\\2016年\\',
                upload_folder:'示例:初一'
            },
            users:{
                include:['ftp_password','ftp_admin'],
            },
            disable:{
                include:['client_id']
            },
            other:{
                include:['secret']
            }
            // :
        }
        $scope.validate = {}
        $scope.streamMedia = {};
        $scope.versionItems = [];
        $scope.gardenIds = [];
        $scope.itemMap = {};
        $scope.gardenNames = "";
        $scope.validate = {
            isIp: function(ip){
                console.log($scope.streamMedia[ip],ip)
                var re = /((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/;
                return re.test($scope.streamMedia[ip]);
            },
            isPort: function (ports) {
                var re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
                return re.test(ports);
            },
            absolutePath: function (path) {
                // var url = /^[A-Z]\*:\\/;
                if(path&&(path.lastIndexOf("\\")==path.length-1)&&path.indexOf(":\\")==1){
                    return true;
                }else{
                    return false;
                }
            },
            relativePath: function (path) {
                if(path&&path.indexOf("\\")!=0&&(path.lastIndexOf("\\")==path.length-1)){
                    return true;
                }else {
                    return false;
                }
            }
        }
        var id =  $stateParams.id;
        $scope.id = $stateParams.id;
        //获取流媒体平台
        serviceUtil.requestServer('/streamMediaPlatform', "get",
            function (data) {
                $scope.platforms = data;
                $scope.platforms.unshift({
                    id:'',
                    platformName:"请选择流媒体平台版本"
                })

        });
        if ($scope.id) {
            serviceUtil.requestServer('/streamMedia/' +  $scope.id, 'get',
                function (data) {
                    $scope.streamMedia = data;
                    $scope.streamMedia.creatTime = null;
                    $scope.streamMedia.lastUpdateTime = null;
                    $scope.version = data.platformCode;
                    $scope.versionItems = getStreamMediaByCode($scope.version);
                    $scope.itemMap = data.itemMap;
                    $scope.gardenNames = "";
                    for (var i=0,len=data.streamMediaGardens.length;i<len;i++) {
                        var gardenName = data.streamMediaGardens[i].gardenName;
                        $scope.gardenNames += " "+gardenName + ";";
                        $scope.gardenIds.push(data.streamMediaGardens[i].gardenId);
                    }
                })
        }
        //改变流媒体类型
        $scope.platformChange = function(){
            $scope.versionItems = getStreamMediaByCode($scope.version);
            if($scope.versionItems.id==$scope.streamMedia.platformId){
                $scope.itemMap = $scope.streamMedia.itemMap
            }else{
                $scope.itemMap = {}
                $scope.itemMap.client_id = $scope.$parent.gardenId;
                // $scope.itemMap
            }
            // $scope.itemMap

        }
        $scope.chooseGarden = function () {
            $uibModal.open({
                animation: true,
                size: 'md',
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/choosegarden.html'),
                controller: 'chooseGardenctrl'
            });
        };
        $scope.toBack = function () {
            $state.go(sys + "streamMedia.index");
        }
        $scope.toSave = function () {
            $scope.streamMedia.gardenIds = $scope.gardenIds.toString();
            if(typeof($scope.streamMedia.status)=='undefined'){
              $scope.streamMedia.status = false;
            }
            var method = id ? "put" : "post";
            serviceUtil.requestServer('/streamMedia', method,
                function (data) {
                    if (data.code == 0) {
                        $state.go(sys + "streamMedia.index");
                    } else {
                        console.log(data.message);
                    }

                }, createSubmitData());
        }
        function createSubmitData(){
            var returnObj = {};
            if($scope.id)returnObj.id=$scope.id;
            returnObj.platformId = $scope.versionItems.id;
            returnObj.platformCode = $scope.versionItems.platformCode;
            returnObj.ip = $scope.streamMedia.ip;
            returnObj.name = $scope.versionItems.platformName;
            returnObj.port = $scope.streamMedia.port;
            returnObj.status = $scope.streamMedia.status;
            returnObj.gardenIds = $scope.gardenIds.toString();
            returnObj.description = $scope.streamMedia.description;
            returnObj.itemJson = JSON.stringify($scope.itemMap);
            return returnObj;
        }
        function getStreamMediaByCode(code){
            for(var i=0;i<$scope.platforms.length;i++){
                if($scope.platforms[i].platformCode==code){
                    return $scope.platforms[i];
                }
            }
            return {};
        }

    }]);
tpk_streamMedia.controller('chooseGardenctrl', ['$scope', '$state', '$stateParams', '$uibModal', 'serviceUtil', '$uibModalInstance', 'lwGardenService',
    function ($scope, $state, $stateParams, $uibModal, serviceUtil, $uibModalInstance, gardenService) {
        $scope.gardenIds = [];
        angular.forEach($scope.$parent.gardenIds, function (data, i) {
            $scope.gardenIds.push(data);
        });
        $scope.gardenNames = $scope.$parent.gardenNames;
        $scope.ok = function () {
            $scope.$parent.gardenIds = $scope.gardenIds;
            $scope.$parent.gardenNames = $scope.gardenNames;
            $uibModalInstance.close();
        };
        $scope.cancle = function () {
            $uibModalInstance.dismiss('cancel');
        };
        gardenService.getVisualGardenList(null, false, (data) =>{
            $scope.gardens = data.data;
        });

        $scope.checkGarden = function ($event, gardenId, gardenName) {
            var isChecked = $event.target.checked;
            if (isChecked) {
                $scope.gardenIds.push(gardenId);
                $scope.gardenNames = $scope.gardenNames +" "+ gardenName + ";";
            } else {
                var index = $scope.gardenIds.indexOf(gardenId);
                $scope.gardenIds.splice(index, 1);
                $scope.gardenNames = $scope.gardenNames.replace(gardenName + ";", "");
            }
        }
    }]);
