/**
 * Created by lw-yf-015 on 2016/12/3.
 */
import "../styles/course.css";

tpk_classroomManage.controller('classroomManage.list.ctrl', ['$scope', '$uibModal', 'Garden', 'serviceUtil', '$stateParams', 'lwUiModel', '$msg', 'permissions',
    function ($scope, $uibModal, Garden, serviceUtil, $stateParams, lwUiModel, $msg, permissions) {
        $scope.classRoomList = [];
        $scope.dataList = [{}];
        $scope.keywords = '';
        $scope.className = '';
        $scope.inputErr = false;
        $scope.gardenId = $stateParams.gardenId;
        console.log($scope.gardenId);
        // 获取所有园区
        Garden.gardenToggle($scope);
        serviceUtil.requestServer('/organization/grades', 'get', function (data) {
            $scope.grades = data;
            $scope.gradeIndex = 0;
        }, {
            gardenId: $stateParams.gardenId
        });
        // 获取列表
        $scope.getList = function () {
            serviceUtil.requestServer('/classroom/list', 'get', function (data) {
                console.log(data);
                $scope.classRoomList = data;
                $scope.classRoomList.forEach(element => {
                    element.action = 'list';
                });
            }, {
                gardenId: $stateParams.gardenId,
                name: $scope.keywords
            });
        }
        $scope.getList();

        function setDataList() {
            let lastVal = $scope.classRoomList[$scope.classRoomList.length - 1];
            if (lastVal.name == '') {
                $scope.inputErr = true;
                $scope.classRoomList.pop();
            }
            $scope.classRoomList.push({
                name: '',
                action: 'add'
            });
            console.log($scope.classRoomList)
        }


        //添加
        $scope.add = function () {
            setDataList();
            $scope.scrollWindow();

        }
        $scope.scrollWindow=function(){
            var _el = document.getElementById('scollHeight');
            _el.scrollTop = _el.scrollHeight + 60;
            console.log(_el.scrollTop,_el.clientHeight,_el.offsetHeight,_el.scrollHeight)
        };
        //编辑
        $scope.goEdit = function (item) {
            item.action = 'edit';            
        }
        //input失焦
        $scope.inputBlur = function (item) {
            if (item.name == '') {
                $scope.inputErr = true;
                return;
            }
            if (item.action == 'add') {
                serviceUtil.requestServer('/classroom', 'post', function (data) {
                    $msg.success();
                    $scope.getList();
                }, {
                    id: '',
                    name: item.name,
                    gardenId: $scope.gardenId

                });
            }

            if(item.action == 'edit'){
                serviceUtil.requestServer('/classroom', 'put', function (data) {
                    $msg.success();
                    $scope.getList();
                }, {
                    id: item.id,
                    name: item.name,
                    gardenId: $scope.gardenId

                });
            }
        }

        //删除
        $scope.delete = function (id, macAddress) {
            if (macAddress) {
                $msg.error("已有绑定数据，不允许删除");
                return;
            } else {

                lwUiModel.delete(function () {
                    serviceUtil.requestServer('/classroom', 'delete', function (data) {
                        $msg.success();
                        $scope.getList();
                    }, {
                        id: id
                    });
                })
            }
        }

    }
]);