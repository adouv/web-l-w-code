/**
 * Created by lw-yf-015 on 2016/12/5.
 */
import "../styles/camera.css";

tpk_camera.controller('camera.assign.ctrl', ['$scope', 'Garden', 'serviceUtil', '$timeout', '$state',
    function ($scope, Garden, serviceUtil, $timeout, $state) {
        Garden.gardenToggle($scope);
        $scope.selectedCameras = [];
        serviceUtil.requestServer('/camera', 'get', function (data) {
            $scope.cacheCameras = data.data;
            $scope.cameras = data.data;
        }, {gardenId: $scope.gardenId});
        $scope.searchCarams = function () {
            $timeout.cancel($scope.caramsTime);
            $scope.caramsTime = $timeout(function () {
                $scope.cameras = [];
                angular.forEach($scope.cacheCameras, function (keyword) {
                    if (keyword.name.indexOf($scope.cameraKeywords) > -1) {
                        $scope.cameras.push(keyword);
                    }
                });
            }, 500);
        };
        var area = {
            save: function (id) {
                var cameraIds = [];
                this.getCameraIds(id, cameraIds, $scope.cameras);
                serviceUtil.requestServer('/camera', 'post', {
                    areaCode: $scope.areaCode,
                    gardenId: $scope.gardenId,
                    cameraIds: cameraIds.toString()
                })
            },
            delete: function (id) {
                var cameraIds = [];
                this.getCameraIds(id, cameraIds, $scope.selectedCameras);
                serviceUtil.requestServer('/camera', 'delete', {
                    areaCode: $scope.areaCode,
                    cameraIds: cameraIds.toString()
                })
            },
            getCameraIds: function (id, cameraIds, cameras) {
                if (id == undefined) {
                    var len = cameras.length;
                    for (var i = 0; i < len; i++) {
                        cameraIds.push(cameras[i].id);
                    }
                } else {
                    cameraIds.push(id);
                }
            }
        };
        $scope.addCur = function (flag, index) {
            if ($scope.areaSelected) {
                if (flag == 'selected') {
                    $scope.removeIndex = null;
                    $scope.selectedIndex = index;
                } else if (flag == 'remove') {
                    $scope.selectedIndex = null;
                    $scope.removeIndex = index;
                }
            }
        };
        $scope.selected = function (index) {
            if ($scope.areaSelected) {
                var camera = $scope.cameras[index];
                area.save(camera.id);
                $scope.selectedCameras.push(camera);
                var cameras = $scope.cameras;
                $scope.cameras = [];
                for(var i=0,len=cameras.length;i<len;i++){
                    if(i!=index){
                        $scope.cameras.push(cameras[i])
                    }
                }
            }
        };
        $scope.remove = function (index) {
            if ($scope.areaSelected) {
                var camera = $scope.selectedCameras[index];
                area.delete(camera.id);
                $scope.cameras.push(camera);
                $scope.selectedCameras.splice(index, 1)
            }
        };
        $scope.singleSelected = function (flag) {
            if ($scope.areaSelected) {
                if (flag == 'remove' && $scope.removeIndex !== null) {
                    var camera = $scope.selectedCameras[$scope.removeIndex];
                    area.delete(camera.id);
                    $scope.cameras.push(camera);
                    $scope.selectedCameras.splice($scope.removeIndex, 1)
                    $scope.removeIndex = null;
                } else if (flag == 'selected' && $scope.selectedIndex !== null) {
                    var camera = $scope.cameras[$scope.selectedIndex];
                    area.save(camera.id);
                    $scope.selectedCameras.push(camera);
                    $scope.cameras.splice($scope.selectedIndex, 1)
                    $scope.selectedIndex = null;
                }
            }
        };
        $scope.multipleSelected = function (flag) {
            if ($scope.areaSelected) {
                if (flag == 'selected') {
                    $scope.selectedIndex = null;
                    area.save();
                    Array.prototype.push.apply($scope.selectedCameras, $scope.cameras)
                    $scope.cameras = [];
                } else if (flag == 'remove') {
                    $scope.removeIndex = null;
                    area.delete();
                    Array.prototype.push.apply($scope.cameras, $scope.selectedCameras)
                    $scope.selectedCameras = [];
                }
            }
        };
        $scope.goList = function () {
            $state.go(sys + 'camera.camera');
        }
    }]);


tpk_camera.controller('camera.camera.ctrl', ['$scope','$state','$stateParams','$uibModal','lwTree','Garden','serviceUtil','$msg',
    function ($scope,$state,$stateParams,$uibModal,lwTree,Garden,serviceUtil,$msg) {
        Garden.gardenToggle($scope);
        $scope.gardenId = $stateParams.gardenId;
        $scope.view = 'camera';
        $scope.goArea = function () {
            $state.go(sys+'camera.area');
        };
        $scope.selectedArea = function () {
            lwTree.AreaTree($scope);
        };
        $scope.cameraSync = function () {
            serviceUtil.requestServer('/camera/sync','put',function (data) {
                if(data.code==0){
                    $msg.success('数据同步成功！');
                    $scope.pageSearch();
                }else{
                    $msg.error(data.msg);
                }
            },{gardenId:$scope.gardenId})
        }
}]);
tpk_camera.controller('camera.area.ctrl', ['$scope','$state','$stateParams','$uibModal','lwTree','Garden',
    function ($scope,$state,$stateParams,$uibModal,lwTree,Garden) {
        Garden.gardenToggle($scope);
        $scope.condition = {};
        $scope.gardenId = $stateParams.gardenId;
        $scope.goCamera = function () {
            $state.go(sys+'camera.camera');
        };
        $scope.selectedArea = function () {
            lwTree.AreaTree($scope);
        }
}]);

