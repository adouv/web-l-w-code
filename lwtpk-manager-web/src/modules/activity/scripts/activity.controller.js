/**
 * Created by lw-yf-025 on 2017/1/3.
 */
import "../styles/activity.css";
import "../styles/upload.css";

tpk_activity.controller('activity.list.ctrl', ['$scope', '$state', '$stateParams', '$uibModal', 'serviceUtil', 'lwUiModel', 'Garden', 'permissions',
    function ($scope, $state, $stateParams, $uibModal, serviceUtil, lwUiModel, Garden, permissions) {
        $scope.checkLiveIds = [];
        $scope.checkUnicastIds = [];
        $scope.gardenId = $stateParams.gardenId;
        // 获取所有园区
        Garden.gardenToggle($scope);
        serviceUtil.requestServer('/organization/grades', 'get', function (data) {
            $scope.grades = data;
            $scope.gradeIndex = 0;
        }, {gardenId: $stateParams.gardenId});

        // 获取活动列表
        $scope.getList = function () {
            $scope.pageSearch();
        }

        // 改变活动状态
        $scope.changeStatus = function ($event, id, type) {
            var target = $event.target;
            if (type == 1) {
                serviceUtil.requestServer('/live/status/' + target.checked, 'put',
                    function (data) {
                    }, {id: id})
            }
            if (type == 2) {
                serviceUtil.requestServer('/unicast/status/' + target.checked, 'put',
                    function (data) {
                    }, {id: id})
            }
        }


        // 删除活动
        $scope.delete = function (id, activityType) {
            lwUiModel.delete(function () {
                if (activityType == 1) {
                    serviceUtil.requestServer('/live/activity/' + id, 'delete',
                        function (data) {
                            $scope.getList();
                        })
                }
                if (activityType == 2) {
                    serviceUtil.requestServer('/unicast/activity/' + id, 'delete',
                        function (data) {
                            $scope.getList();
                        })
                }
            })
        }

        // 批量删除
        $scope.batchDelete = function () {
            if ($scope.checkLiveIds.length > 0 || $scope.checkUnicastIds.length > 0) {
                lwUiModel.delete(function () {
                    var liveids = $scope.checkLiveIds.toString();
                    var unicastids = $scope.checkUnicastIds.toString();
                    var types = $scope.types;
                    serviceUtil.requestServer('/live/activity', 'delete',
                        function (data) {
                            $scope.toSearch();
                        }, {ids: liveids})
                    serviceUtil.requestServer('/unicast/activity', 'delete',
                        function (data) {
                            $scope.toSearch();
                        }, {ids: unicastids})
                })
            } else {
                //提示信息
            }
        }

        /*
         * 选择选择框
         * */
        $scope.checkCheckbox = function ($event, id, type) {
            var target = $event.target.checked;
            if (target) {
                if (type == 1) {
                    $scope.checkLiveIds.push(id);
                }
                if (type == 2) {
                    $scope.checkUnicastIds.push(id);
                }
                if ($scope.datas.length == $scope.checkLiveIds.length + $scope.checkUnicastIds.length) {
                    $scope.checkAll = true;
                }
            } else {
                if (type == 1) {
                    var index = $scope.checkLiveIds.indexOf(id);
                    $scope.checkLiveIds.splice(index, 1);
                }
                if (type == 2) {
                    var index = $scope.checkUnicastIds.indexOf(id);
                    $scope.checkUnicastIds.splice(index, 1);
                }
                $scope.checkAll = false;
            }
        }
        /*
         * 选择框全选
         * */
        $scope.checkAllBox = function ($event) {
            if ($event.target.checked) {
                angular.forEach($scope.datas, function (data) {
                    if (data.activityType == '1') {
                        $scope.checkLiveIds.push(data.id);
                    }
                    if (data.activityType == '2') {
                        $scope.checkUnicastIds.push(data.id);
                    }
                    data.checked = true;
                })
            } else {
                angular.forEach($scope.datas, function (data) {
                    if (data.activityType == '1') {
                        var index = $scope.checkLiveIds.indexOf(data.id);
                        $scope.checkLiveIds.splice(index, 1);
                    }
                    if (data.activityType == '2') {
                        var index = $scope.checkUnicastIds.indexOf(data.id);
                        $scope.checkUnicastIds.splice(index, 1);
                    }
                    data.checked = false;
                });
            }
        }

        $scope.goInput = function (id) {
            $state.go(sys + 'activity.input', {id: id});
        }

        // 编辑活动
        $scope.goEdit = function (id, type) {
            $state.go(sys + 'activity.edit', {id: id, type: type});
        }

        // 查看详情
        $scope.goLook = function (id, type) {
            $state.go(sys + 'activity.look', {id: id, type: type});

        }
    }]);

tpk_activity.controller('activity.input.ctrl', ['$scope', '$state', '$stateParams', '$uibModal', 'lwTree', 'Garden', 'serviceUtil', '$timeout', '$msg', 'permissions',
    function ($scope, $state, $stateParams, $uibModal, lwTree, Garden, serviceUtil, $timeout, $msg, permissions) {
        $scope.filePath = sys_config.path.fileServer + sys_config.path.pic_prefix;
        $scope.vildExt = true;
        $scope.vildSize = true;
        $scope.type = '1';
        $scope.activity = {};
        $scope.activityType = 1;
        $scope.getNow = function () {
            var date = new Date();
            $scope.now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        }
        Garden.gardenToggle($scope);
        $scope.activity.videoList = [{}];
        $scope.token = sessionStorage.getItem('TOKEN');

        serviceUtil.requestServer('/streamMedia/uploadPath/' + $stateParams.gardenId, 'get', function (data) {
            if(data){
                if (data.url.indexOf('http') > -1) {
                    $scope.uploadPath = data.url;
                } else {
                    $scope.uploadPath = data.url + '?TOKEN=' + $scope.token;
                }
            }
        });

        /*serviceUtil.requestServer('/organization/grades', 'get', function (data) {
            $scope.grades = data;
            $scope.gradeIndex = 0;
        }, {gardenId: $stateParams.gardenId});*/
        $scope.goList = function () {
            $state.go(sys + 'activity.index')
        }
        $scope.change = function () {
            $scope.vildExt = true;
            $scope.vildSize = true;
        }
        $scope.flag = 1;
        $scope.scope = '0';
        $scope.cleanPublicList = function () {
            if ($scope.scope != $scope.activity.publicScope) {
                $scope.activity.publicList = [];
                $scope.scope = $scope.activity.publicScope
            }
        }
        $scope.clean = function () {
            $scope.activity.publicList = [];
        }
        $scope.activityTypes = [];
        //if (permissions.hasPermission('unicastActivity:create')) {
        $scope.activityTypes.push({id: 2, name: "点播"});
        $scope.type = 2;
        //}
        //if (permissions.hasPermission('liveActivity:create')) {
        $scope.activityTypes.push({id: 1, name: "直播"});
        $scope.type = 1;
        //}

        $scope.launch = {
            switch1: function ($index) {
                var Input = document.getElementsByClassName('linkVideo')[$index];
                var uploudBtn = document.getElementsByClassName('uploud-btn')[$index];
                uploudBtn.style.display = 'inline-block';
                Input.setAttribute('placeholder', '');
                $scope.flag = $index - 1;
            },
            switch2: function ($index) {
                var Input = document.getElementsByClassName('linkVideo')[$index];
                var bdr = document.getElementsByClassName('native')[$index];
                bdr.className = 'native bdr';
                var uploudBtn = document.getElementsByClassName('uploud-btn')[$index];
                uploudBtn.style.display = 'none';
                Input.setAttribute('placeholder', '输入外部视频链接地址');
                $scope.flag = $index + 4;
            },
            vildImg: function ($file) {
                var ext = !!{png: 1, gif: 1, jpg: 1, jpeg: 1}[$file.getExtension()];
                var size = $file.size < (1024 * 1024 * 2);
                $scope.vildExt = ext;
                $scope.vildSize = size;
                return size && ext;
            },
            uploadCoverSuccess: function (data) {
                setTimeout(function () {
                    $scope.processCoverFlag = true;
                }, 2000);
                $scope.activity.coverUrl = eval('(' + data + ')').path;
            },
            save: function () {
                for (var i = 0, len = $scope.data.videoList.length; i < len; i++) {
                    this.videoUrlVild(i);
                }
                serviceUtil.requestServer(
                    '/unicast/activity', 'post',
                    $scope.data, function (data) {
                        $layer.statusMsg(data, function () {
                            $state.go('unicast.index', {
                                gardenId: user.gardenId
                            });
                        })
                    })
            },
            videoUrlVild: function (index) {
                if ($scope.data.videoList[index].videoSource) {
                    console.log($scope.videoLink);
                    $scope.vildUrlEmpty[index * 1] = !$scope.videoLink;
                } else {
                    $scope.vildUrlEmpty[index * 1] = !!$scope.videoSrc;
                }
            },
            vildFile: function ($file, $index) {
                var ext = !!{mp4: 1, flv: 1}[$file.getExtension()];
                var size = $file.size < (1024 * 1024 * 500);
                $scope.vildExt = ext;
                $scope.vildSize = size;
                return size && ext;
            },
            vildVideo: function (index, launchs) {
                $scope.uploadVideo[index] = launchs['link' + index].$error.required
                    || launchs['src' + index].$error.required;
            },
            uploadVideoSuccess: function (data, index) {
                $scope.isnotfirst = true;
                $scope.activity.videoList[index].videoSource = 0;
                $scope.activity.videoList[index].videoName = eval('(' + data + ')').sourceFileName;
                $scope.activity.videoList[index].fileName = eval('(' + data + ')').newFileName;
                if (eval('(' + data + ')').guid)
                    $scope.activity.videoList[index].guid = eval('(' + data + ')').guid;
            },
            addVideo: function () {
                $scope.activity.videoList.push({});
            },
            removeVideo: function ($index) {
                $scope.activity.videoList.splice($index, 1);
            }
        }
        $scope.removeVideo = function (index) {
            $scope.videos.splice(index, 1);
        }
        $scope.goAreaOrAccount = function () {
            if ($scope.activity.publicScope == 0) {
                return;
            }
            if ($scope.activity.publicScope == 1) {
                $uibModal.open({
                    animation: true,
                    size: 'md',
                    scope: $scope,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    template: require('../views/liveArea.html'),
                    controller: 'liveAreaCtrl'
                });
            }
        }
        $scope.goAreaCamera = function () {
            $uibModal.open({
                animation: true,
                size: 'md',
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/areaCamera.html'),
                controller: 'areaCameraCtrl'
            });
        }
        $scope.save = function () {
            if ($scope.activity.publicList.length == 0 && $scope.activity.publicScope != 0) {
                if ($scope.activity.publicScope == 1) {
                    $msg.error('当前所选园区为空');
                }
                if ($scope.activity.publicScope == 2) {
                    $msg.error('当前所选用户为空');
                }
                return false;
            }
            if ($scope.type == 1) {
                if ($scope.nolimit) {
                    $scope.activity.limitCount = 0;
                }
                $scope.activity.gardenId = $scope.gardenId;
                if ($scope.activity.status == null) {
                    $scope.activity.status = false;
                }
                serviceUtil.requestServer('/live/activity', 'post', function (data) {
                    if (data.code == 0) {
                        $msg.success("添加成功");
                        $state.go(sys + 'activity.index');
                    }
                    if (data.code == 1) {
                        $msg.error(data.msg);
                    }
                }, $scope.activity);
            }
            if ($scope.type == 2) {
                $scope.activity.gardenId = $scope.gardenId;
                if ($scope.activity.status == null) {
                    $scope.activity.status = false;
                }
                serviceUtil.requestServer('/unicast/activity', 'post', function (data) {
                    if (data.code == 0) {
                        $msg.success("添加成功");
                        $state.go(sys + 'activity.index');
                    }
                    if (data.code == 1) {
                        $msg.error(data.msg);
                    }
                }, $scope.activity)
            }
        }
        $scope.goAreaOrAccount = function () {
            if ($scope.activity.publicScope == 0) {
                return;
            }
            if ($scope.activity.publicScope == 1) {
                $uibModal.open({
                    animation: true,
                    size: 'md',
                    scope: $scope,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    template: require('../views/liveArea.html'),
                    controller: 'liveAreaCtrl'
                });
            }
        }
        $scope.goAreaCamera = function () {
            $uibModal.open({
                animation: true,
                size: 'md',
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/areaCamera.html'),
                controller: 'areaCameraCtrl'
            });
        }
    }]);

tpk_activity.controller('areaCameraCtrl', ['$scope', '$state', '$uibModalInstance', '$stateParams', '$uibModal', 'serviceUtil', 'Garden',
    function ($scope, $state, $uibModalInstance, $stateParams, $uibModal, serviceUtil, Garden) {
        Garden.gardenToggle($scope);
        $scope.selectedCameras = [];
        $scope.cameraUrl = $scope.$parent.activity.cameraUrl;
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
        $scope.getValue = function (cameraUrl, id) {
            $scope.cameraUrl = cameraUrl;
            $scope.cameraId = id;
        }
        $scope.ok = function () {
            $scope.$parent.activity.cameraUrl = $scope.cameraUrl;
            $scope.$parent.activity.cameraId = $scope.cameraId;
            $uibModalInstance.close();
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }])

tpk_activity.controller('liveAreaCtrl', ['$scope', '$state', '$uibModalInstance', '$stateParams', '$uibModal', 'serviceUtil', 'Garden', '$msg', 'lwGardenService',
    function ($scope, $state, $uibModalInstance, $stateParams, $uibModal, serviceUtil, Garden, $msg, gardenService) {
        $scope.gardenIds = [];
        $scope.gardenNames = [];
        var split = $scope.$parent.activity.publicList;
        if (split) {
            for (var i = 0; i < split.length; i++) {
                $scope.gardenIds.push(split[i].id)
                $scope.gardenNames.push(split[i].name)
            }
        }
        gardenService.getVisualGardenList(null, true, (data) => {
            $scope.gardens = data.data;
        });

        // serviceUtil.requestServer('/garden/garden/visibility', 'get', function (data) {
        //     $scope.gardens = data.data;
        // });
        $scope.checked = function ($event, id, name) {
            if ($event.target.checked) {
                $scope.gardenIds.push(id);
                $scope.gardenNames.push(name);
            } else {
                $scope.gardenIds.splice($scope.gardenIds.indexOf(id), 1);
                $scope.gardenNames.splice($scope.gardenNames.indexOf(name), 1);
            }
        }
        $scope.ok = function () {
            $scope.$parent.activity.publicIds = $scope.gardenIds.toString();
            $scope.$parent.activity.publicList = [];
            for (var i = 0; i < $scope.gardenIds.length; i++) {
                var obj = {};
                obj.id = $scope.gardenIds[i];
                for (var j = 0; j < $scope.gardens.length; j++) {
                    if (obj.id == $scope.gardens[j].id) {
                        obj.name = $scope.gardens[j].name;
                    }
                }
                $scope.$parent.activity.publicList.push(obj);
            }
            if ($scope.$parent.activity.publicList.length == 0) {
                $msg.error('当前还没有选择任何园区');
                return;
            }
            $uibModalInstance.close();
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }]);

tpk_activity.controller('accountCtrl', ['$scope', '$state', '$uibModalInstance', '$stateParams', '$uibModal', 'serviceUtil', 'Garden', '$msg',
    function ($scope, $uibModalInstance, $state, $stateParams, $uibModal, serviceUtil, Garden, $msg) {
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
        $scope.getValue = function (cameraUrl) {
            $scope.cameraUrl = cameraUrl;
            $scope.$parent.activity.cameraUrl = $scope.cameraUrl;

        }
    }]);

tpk_activity.controller('activity.edit.ctrl', ['$scope', '$state', '$stateParams', '$uibModal', 'serviceUtil', 'Garden', '$timeout', 'lwUiModel', '$msg',
    function ($scope, $state, $stateParams, $uibModal, serviceUtil, Garden, $timeout, lwUiModel, $msg) {
        $scope.filePath = sys_config.path.fileServer + sys_config.path.pic_prefix;
        $scope.token = sessionStorage.getItem('TOKEN');
        $scope.vildExt = true;
        $scope.vildSize = true;
        $scope.getNow = function () {
            var date = new Date();
            $scope.now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        }
        $scope.change = function () {
            $scope.vildExt = true;
            $scope.vildSize = true;
        }
        if ($stateParams) {
            if ($stateParams.type == 1) {
                serviceUtil.requestServer('/live/activity/' + $stateParams.id, 'get', function (data) {
                    $scope.activity = data.data;
                    $scope.publicScope = data.data.publicScope + '';
                    if (data.data.publicScope == '0') {
                        $scope.publicScopeDescribe = '完全公开；';
                    }
                    if (data.data.publicScope == '1') {
                        $scope.publicScopeDescribe = '园区公开：';
                    }
                    if (data.data.publicScope == '2') {
                        $scope.publicScopeDescribe = '指定用户公开：';
                    }
                    $scope.type = '1';
                    $scope.activityType = '直播';
                    $scope.activity.publicScope = $scope.activity.publicScope + '';
                    $scope.activity.startTime = new Date($scope.activity.startTime).Format("yyyy-MM-dd hh:mm:ss");
                    $scope.activity.endTime = new Date($scope.activity.endTime).Format("yyyy-MM-dd hh:mm:ss");
                    $scope.nolimit = !$scope.activity.limitCount ? true : false;
                })
            }
            if ($stateParams.type == 2) {
                serviceUtil.requestServer('/unicast/pcactivity/' + $stateParams.id, 'get', function (data) {
                    $scope.activity = data.data;
                    $scope.publicScope = data.data.publicScope + '';
                    $scope.type = '2';
                    if (data.data.publicScope == '0') {
                        $scope.publicScopeDescribe = '完全公开；';
                    }
                    if (data.data.publicScope == '1') {
                        $scope.publicScopeDescribe = '园区公开：';
                    }
                    if (data.data.publicScope == '2') {
                        $scope.publicScopeDescribe = '指定用户公开：';
                    }
                    $scope.type = '2';
                    $scope.activityType = '点播';
                    $scope.activity.publicScope = $scope.activity.publicScope + '';
                    $scope.activity.startTime = new Date($scope.activity.startTime).Format("yyyy-MM-dd hh:mm:ss");
                    $scope.activity.endTime = new Date($scope.activity.endTime).Format("yyyy-MM-dd hh:mm:ss");
                })
            }
        }
        $scope.clean = function () {
            $scope.activity.publicList = [];
        }
        $scope.goList = function () {
            $state.go(sys + 'activity.index')
        }
        $scope.switch = function () {
            $state.go(sys + 'activity.videouploud')
        }
        $scope.upload = function () {
            if ($scope.activity.videoList == null) {
                $scope.activity.videoList = [{}];
            }
            $uibModal.open({
                animation: true,
                size: 'md',
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/uploud.html'),
                controller: 'uploadVideo'
            });
        };
        $scope.edit = {
            vildImg: function ($file) {
                var ext = !!{png: 1, gif: 1, jpg: 1, jpeg: 1}[$file.getExtension()];
                var size = $file.size < (1024 * 1024 * 2);
                $scope.vildExt = ext;
                $scope.vildSize = size;
                return size && ext;
            },
            uploadCoverSuccess: function (data) {
                $timeout(function () {
                    $scope.processCoverFlag = true;
                }, 2000);
                $scope.activity.coverUrl = eval('(' + data + ')').path;
            }
        }
        $scope.goAreaOrAccount = function () {
            $scope.activity.publicIds = [];
            if ($scope.activity.publicScope == 0) {
                $scope.publicName = false;
                return;
            }
            if ($scope.activity.publicScope == 1) {
                $scope.publicName = true;
                $uibModal.open({
                    animation: true,
                    size: 'md',
                    scope: $scope,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    template: require('../views/liveArea.html'),
                    controller: 'liveAreaCtrl'
                });
            }
        }
        $scope.updateActivity = function () {
            if ($scope.activity.publicList.length == 0 && $scope.activity.publicScope != 0) {
                if ($scope.activity.publicScope == 1) {
                    $msg.error('当前所选园区为空');
                }
                if ($scope.activity.publicScope == 2) {
                    $msg.error('当前所选用户为空');
                }
                return false;
            }
            if ($scope.activity.startTime && $scope.activity.endTime) {
                $scope.activity.startTime = new Date($scope.activity.startTime).Format("yyyy-MM-dd hh:mm:ss");
                $scope.activity.endTime = new Date($scope.activity.endTime).Format("yyyy-MM-dd hh:mm:ss");
            }
            $scope.activity.lastUpdateTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            $scope.activity.createTime = new Date($scope.activity.createTime).Format("yyyy-MM-dd hh:mm:ss");
            if (!$scope.activity.publicIds) {
                data = $scope.activity.publicList;
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].id && i != 0) {
                        $scope.activity.publicIds = $scope.activity.publicIds + "," + data[i].id;
                    }
                    if (data[i].id && i == 0) {
                        $scope.activity.publicIds = data[i].id;
                    }
                }
            }
            if ($scope.type == 1) {
                serviceUtil.requestServer('/live/activity', 'put', function (data) {
                    if (data.code == 0) {
                        $msg.success("操作成功");
                        $state.go(sys + 'activity.index');
                    } else {
                        $msg.error(data.msg);
                    }
                }, $scope.activity)
            }
            if ($scope.type == 2) {
                delete $scope.activity.startTime;
                delete $scope.activity.endTime;
                serviceUtil.requestServer('/unicast/activity', 'put', function (data) {
                    if (data.code == 0) {
                        $msg.success("操作成功");
                        $state.go(sys + 'activity.index');
                    } else {
                        $msg.error(data.msg);
                    }
                }, $scope.activity)
            }
        }
        $scope.deleteVideo = function (index) {
            lwUiModel.delete(function () {
                $scope.activity.videoList.splice(index, 1);
            });
        }
        $scope.goAreaCamera = function () {
            $uibModal.open({
                animation: true,
                size: 'md',
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/areaCamera.html'),
                controller: 'areaCameraCtrl'
            });
        }
    }]);

tpk_activity.controller('uploadVideo', ['$scope', '$state', '$uibModalInstance', '$stateParams', '$uibModal', 'serviceUtil', 'Garden',
    function ($scope, $state, $uibModalInstance, $stateParams, $uibModal, serviceUtil, Garden) {
        scope = $scope.$parent;
        $scope.token = sessionStorage.getItem('TOKEN');
        $scope.uploadPath = sessionStorage.getItem('uploadPath') + '?TOKEN=' + $scope.token;
        if (!scope.activity.videoList.length) {
            scope.activity.videoList = [{}];
        }
        $scope.cancel = function () {
            $uibModalInstance.close();
            // $uibModalInstance.dismiss('cancel');
        }

        $scope.flag = 1;
        $scope.launch = {
            switch1: function ($index) {
                var Input = document.getElementsByClassName('linkVideo')[$index];
                var uploudBtn = document.getElementsByClassName('uploud-btn')[$index];
                uploudBtn.style.display = 'inline-block';
                Input.setAttribute('placeholder', '');
                $scope.flag = $index - 1;
            },
            switch2: function ($index) {
                var Input = document.getElementsByClassName('linkVideo')[$index];
                var uploudBtn = document.getElementsByClassName('uploud-btn')[$index];
                var bdr = document.getElementsByClassName('native')[$index];
                bdr.className = 'native bdr';
                uploudBtn.style.display = 'none';
                Input.setAttribute('placeholder', '输入外部视频链接地址');
                $scope.flag = $index + 4;
            },
            vildImg: function ($file) {
                var ext = !!{png: 1, gif: 1, jpg: 1, jpeg: 1}[$file.getExtension()];
                var size = $file.size < (1024 * 1024 * 2);
                $scope.vildExt = ext;
                $scope.vildSize = size;
                return size && ext;
            },
            uploadCoverSuccess: function (data) {
                setTimeout(function () {
                    $scope.processCoverFlag = true;
                }, 2000);
                $scope.activity.coverUrl = eval('(' + data + ')').path;
            },
            save: function () {
                for (var i = 0, len = $scope.data.videoList.length; i < len; i++) {
                    this.videoUrlVild(i);
                }
                serviceUtil.requestServer(
                    '/unicast/activity', 'post',
                    $scope.data, function (data) {
                        $layer.statusMsg(data, function () {
                            $state.go('unicast.index', {
                                gardenId: user.gardenId
                            });
                        })
                    })
            },
            vildFile: function ($file, $index) {
                var ext = !!{mp4: 1, flv: 1}[$file.getExtension()];
                var size = $file.size < (1024 * 1024 * 500);
                $scope.vildExt = ext;
                $scope.vildSize = size;
                console.log(size, ext)
                return size && ext;
            },
            vildVideo: function (index, launchs) {
                $scope.uploadVideo[index] = launchs['link' + index].$error.required
                    || launchs['src' + index].$error.required;
            },
            uploadVideoSuccess: function (data, index) {
                /*$timeout(function () {
                 $scope.processVideoFlag[index] = true;
                 }, 2000);*/
                $scope.isnotfirst = true;
                $scope.activity.videoList[index].videoSource = 0;
                $scope.activity.videoList[index].videoName = eval('(' + data + ')').sourceFileName;
                $scope.activity.videoList[index].fileName = eval('(' + data + ')').newFileName;
                if (eval('(' + data + ')').guid)
                    $scope.activity.videoList[index].guid = eval('(' + data + ')').guid;
            },
            addVideo: function () {
                $scope.activity.videoList.push({});
            },
            removeVideo: function ($index) {
                $scope.activity.videoList.splice($index, 1);
            }
        }
        $scope.ok = function () {
            $uibModalInstance.close();
            // $scope.nameList = '';
            // angular.forEach($scope.activity.videoList, function (data) {
            //   if(data.videoName){
            //     $scope.nameList = $scope.nameList + data.videoName +'；';
            //   }
            //   if(data.videoUrl){
            //     $scope.nameList = $scope.nameList + data.videoUrl +'；';
            //   }
            // })
            // $scope.nameList = '';
            // angular.forEach($scope.activity.videoList, function (data) {
            //   if (data.videoName) {
            //     $scope.nameList = $scope.nameList + data.videoName + '；';
            //   }
            //   if (data.videoUrl) {
            //     $scope.nameList = $scope.nameList + data.videoUrl + '；';
            //   }
            // })
        }
    }]);

tpk_activity.controller('activity.look.ctrl', ['$scope', '$state', '$stateParams', '$uibModal', 'serviceUtil', 'Garden',
    function ($scope, $state, $stateParams, $uibModal, serviceUtil, Garden) {
        $scope.filePath = sys_config.path.fileServer + sys_config.path.pic_prefix;
        if ($stateParams) {
            if ($stateParams.type == 1) {
                serviceUtil.requestServer('/live/activity/' + $stateParams.id, 'get', function (data) {
                    $scope.activity = data.data;
                    $scope.activityType = "直播";
                    if (data.data.publicScope == 0) {
                        $scope.publicType = "完全公开；";
                    }
                    if (data.data.publicScope == 1) {
                        $scope.publicType = "园区公开：";
                        angular.forEach(data.data.publicList, function (data) {
                            $scope.publicType = $scope.publicType + data.name + '；';
                        })
                        $scope.count = data.data.publicList.length;
                        /*$scope.publicType = $scope.publicType + '等';
                         $scope.countType = '个园区';*/
                    }
                    if (data.data.publicScope == 2) {
                        $scope.publicType = "指定用户公开：";
                        angular.forEach(data.data.publicList, function (data) {
                            $scope.publicType = $scope.publicType + data.name + '；';
                        })
                        $scope.count = data.data.publicList.length;
                        /*$scope.publicType = $scope.publicType + '等共计';
                         $scope.countType = '个用户；';*/
                    }
                    if (data.data.status) {
                        $scope.status = "有效";
                    } else {
                        $scope.status = "无效";
                    }
                    // console.log(data)
                })
            }
            if ($stateParams.type == 2) {
                serviceUtil.requestServer('/unicast/pcactivity/' + $stateParams.id, 'get', function (data) {
                    $scope.activity = data.data;
                    $scope.activityType = "点播";
                    $scope.publicObject = "";
                    if (data.data.publicScope == 0) {
                        $scope.publicType = "完全公开；";
                    }
                    if (data.data.publicScope == 1) {
                        $scope.publicType = "园区公开：";
                        angular.forEach(data.data.publicList, function (data) {
                            $scope.publicType = $scope.publicType + data.name + '；';
                        });
                        $scope.count = data.data.publicList.length;
                        /*   $scope.publicType = $scope.publicType + '等';
                         $scope.countType = '个园区';*/
                    }
                    if (data.data.publicScope == 2) {
                        $scope.publicType = "指定用户公开：";
                        angular.forEach(data.data.publicList, function (data) {
                            $scope.publicType = $scope.publicType + data.name + '；';
                        })
                        $scope.count = data.data.publicList.length;
                        /*$scope.publicType = $scope.publicType + '等共计';
                         $scope.countType = '个用户；';*/
                    }
                    if (data.data.status) {
                        $scope.status = "有效";
                    } else {
                        $scope.status = "无效";
                    }
                    console.log(data)
                })
            }
        }
        $scope.goPublicList = function () {
            $uibModal.open({
                animation: true,
                size: 'md',
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/publicList.html'),
                controller: 'publicListCtrl'
            });
        }
        $scope.goList = function () {
            $state.go(sys + 'activity.index')
        }
    }]);

tpk_activity.controller('publicListCtrl', ['$scope', '$state', '$stateParams', '$uibModal', 'lwTree', 'Garden', '$uibModalInstance',
    function ($scope, $state, $stateParams, $uibModal, lwTree, Garden, $uibModalInstance) {
        if ($scope.$parent.activity.publicScope == 1) {
            $scope.Publictype = '园区';
        }
        if ($scope.$parent.activity.publicScope == 2) {
            $scope.Publictype = '用户';
        }
        $scope.publicList = $scope.$parent.activity.publicList;
        $scope.ok = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
    }
])

tpk_activity.controller('activity.videouploud.ctrl', ['$scope', '$state', '$stateParams', '$uibModal', 'lwTree', 'Garden',
    function ($scope, $state, $stateParams, $uibModal, lwTree, Garden) {
        $scope.chooseGarden = function () {
            $uibModal.open({
                animation: true,
                size: 'md',
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/uploud.html'),
                controller: 'chooseGardenctrl'
            });
        };
    }]);

