/**
 * Created by lw-yf-015 on 2016/12/3.
 */
import "../styles/course.css";

tpk_courseschedule.controller('courseschedule.list.ctrl', ['$scope', '$uibModal', 'Garden', 'serviceUtil', '$stateParams', '$msg', 'permissions',
    function($scope, $uibModal, Garden, serviceUtil, $stateParams, $msg, permissions) {
        Garden.gardenToggle($scope);

        $scope.getList = function(gradeIndex, classId) {
            serviceUtil.requestServer('/organization/grades', 'get', function(data) {

                $scope.grades = data.data;
                $scope.gradeIndex = (gradeIndex == undefined ? 0 : gradeIndex);
                $scope.getClass(classId);
            }, {
                gardenId: $stateParams.gardenId
            });
        }

        $scope.getList();

        $scope.classCfg = function() {
            $scope.cfgClass = $scope.classInfo;
            $uibModal.open({
                animation: true,
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/class.cfg.html'),
                controller: 'class.cfg.ctrl'
            });
        };

        $scope.export = function() {
            var data = {};
            data.classId = $scope.classId;
            data.gardenId = $scope.gardenId;
            data.gradeId = $scope.grades[$scope.gradeIndex].id;
            serviceUtil.requestServer('/schedule/export', 'download', data);
        };
        $scope.import = function() {
            $uibModal.open({
                animation: true,
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/import.file.html'),
                controller: 'import.file.ctrl'
            });
        };
        $scope.getClass = function(classId) {
            if ($scope.gradeIndex !== '') {
                $scope.gradeId = $scope.grades[$scope.gradeIndex].id
                serviceUtil.requestServer('/organization/classes', 'get', function(data) {

                    $scope.classes = data.data;
                    $scope.classId = classId == undefined ? (data.data[0] ? data.data[0].id : '') : classId;
                }, {
                    gradeId: $scope.gradeId
                }).then(function() {
                    $scope.getSchedules();
                });
            } else {
                $scope.classes = [];
            }
        };
        $scope.getSchedules = function() {
            if ($scope.classId) {
                $scope.timeschedules = [];
                serviceUtil.requestServer('/timeTable/classId/' + $scope.classId, 'get', function(data) {
                    if (data.data) {
                        $scope.timeschedules = data.data.timeConfigs;
                    }
                });
                serviceUtil.requestServer('/organization', 'get', function(data) {
                    $scope.organization = data.data;
                    $scope.selectedCameras = [];
                    $scope.selectedCameraIds = [];
                    staticCamera(data.data.organizationCameras);
                    if (!data.data.cameraId) {
                        $scope.showing = false;
                    } else {
                        $scope.showing = true;
                    }

                    $scope.classInfo = data.data;
                }, {
                    id: $scope.classId
                });
                serviceUtil.requestServer('/schedule', 'get', function(data) {
                    if (data.data == '{}') {
                        data.data = [];
                    }

                    $scope.courseschedules = data.data;
                }, {
                    classId: $scope.classId
                });
            }
        };

        function staticCamera(arr) {
            arr = arr || [];
            for (var i = 0; i < arr.length; i++) {
                var obj = {};
                obj.id = arr[i].cameraId;
                obj.name = arr[i].cameraName;
                $scope.selectedCameras.unshift(obj);
                $scope.selectedCameraIds.unshift({
                    cameraId: arr[i].cameraId
                });
            }
        }

        $scope.courseCfg = function(week, period) {
            var weekList = $scope.courseschedules[week.toString()];
            if (weekList[period]) {
                $scope.cfgCourse = weekList[period];
            } else {
                $scope.cfgCourse = {
                    week: week,
                    period: period + 1
                };
            }
            $uibModal.open({
                animation: true,
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/course.cfg.html'),
                controller: 'course.cfg.ctrl'
            });
        };
        $scope.courseSync = function() {
            serviceUtil.requestServer('/ftp/courseTable', 'put', function(data) {
                if (data.code == 0) {
                    $msg.success('数据同步成功！');
                    $scope.getSchedules();
                }
            }, {
                gardenId: $scope.gardenId
            })
        }
    }
]);
// class
tpk_courseschedule.controller('class.cfg.ctrl', ['$scope', '$uibModalInstance', 'serviceUtil', 'AreaAndCamera', '$msg',
    function($scope, $uibModalInstance, serviceUtil, AreaAndCamera, $msg) {
        AreaAndCamera.selected($scope);
        var scope = $scope.$parent;
        $scope.showing = scope.showing;
        var cfgClass = scope.cfgClass;
        $scope.selectAdminstritation = {};
        $scope.selectedCameraIds = [];
        $scope.selectedCameras = [];
        $scope.teacherNames = [];
        $scope.teacherIds = [];
        $scope.classrooms = [];
        $scope.selectCameraType = '';
        $scope.cameraTypes = [
            { id: '', value: '所有摄像头类型' },
            { id: '0', value: '前-实体摄像头' },
            { id: '1', value: '后-实体摄像头' },
            { id: '2', value: '电脑画面虚拟摄像头' }
        ];

        console.log('cfgClass:', scope);
        /** 
         * 初始化数据
         */
        $scope.data = {
            id: cfgClass.id,
            teacherName: cfgClass.teacherName,
            teacherId: cfgClass.teacherId,
            teacherNames: cfgClass.teacherName ? [cfgClass.teacherName] : [],
            teacherIds: cfgClass.teacherId ? [cfgClass.teacherId] : [],
            areaCode: cfgClass.areaCode,
            areaName: cfgClass.areaName,
            classRoomId: cfgClass.classRoomId,
            classRoomName: cfgClass.classRoomName,
            cameraId: "",
            cameraName: "",
            organizationCameras: []
        };

        $scope.searchRootName = function() {
            $scope.cameraWords = $scope.searchName;
            $scope.$apply();
        }

        serviceUtil.requestServer('/camera/list', 'get', function(data) {
            if (data.length >= 0) {
                $scope.cameras = data;
                $scope.cameras.map(item => {
                    item['isDefault'] = false;
                    item['organizationId'] = scope.organization.id;
                });
            }
        }, {
            gardenId: $scope.gardenId,
            cameraType: ''
        }).then(function() {
            if (scope.organization.organizationCameras.length > 0) {
                $scope.data.cameraId = scope.organization.organizationCameras[0].cameraId;
                $scope.data.cameraName = scope.organization.organizationCameras[0].cameraName;

                scope.organization.organizationCameras.forEach(element => {
                    let include = $scope.cameras.filter((ele, index, array) => {
                        return ele.id === element.cameraId;
                    })[0];
                    let camerasItem = {
                        id: element.cameraId,
                        name: element.cameraName,
                        organizationId: scope.organization.id,
                        cameraType: include.cameraType,
                        cameraLocation: include.cameraLocation
                    };
                    $scope.selectedCameras.push(camerasItem);
                    $scope.selectedCameraIds.push({
                        cameraId: element.cameraId
                    });
                });
            }

            if ($scope.selectedCameraIds.length > 0) {
                $scope.selectedCameraIds.forEach(element => {
                    let include = $scope.cameras.filter((ele, index, array) => {
                        return ele.id === element.cameraId;
                    })[0];
                    if (include !== undefined) {
                        let j = $scope.cameras.findIndex(i => i.id === include.id);
                        $scope.cameras.splice(j, 1);
                    }
                });
            }
        });


        serviceUtil.requestServer('/classroom/list', 'get', function(data) {
            $scope.classrooms = data;
        }, {
            gardenId: scope.gardenId
        });

        serviceUtil.requestServer('/schedule/teachers', 'get', function(data) {
            $scope.teachers = data.data;
        }, {
            gardenId: scope.gardenId,
            classId: scope.classId
        });


        $scope.searchCs = function(data) {
            return $scope.classroomBar && (!$scope.classroomName || data.indexOf($scope.classroomName) > -1);
        };

        $scope.searchRs = function(data) {
            return $scope.teacherBar && (!$scope.teacherName || data.indexOf($scope.teacherName) > -1);
        }

        $scope.selectClassroom = ($event, data) => {
            if ($event.target.checked) {
                $scope.data.classRoomId = data.id;
                $scope.data.classRoomName = data.name;
            } else {
                $scope.data.classRoomId = 0;
                $scope.data.classRoomName = "";
            }
        }

        $scope.selectTeacher = function($event, data) {
            if ($event.target.checked) {
                $scope.data.teacherIds.push(data.id);
                $scope.data.teacherNames.push(data.name);
            } else {
                var dataId = $scope.data.teacherIds.indexOf(data.id);
                $scope.data.teacherIds.splice(dataId, 1);
                var dataName = $scope.data.teacherNames.indexOf(data.name);
                $scope.data.teacherNames.splice(dataName, 1)
            }
            $scope.data.teacherName = $scope.data.teacherNames.toString();
        };

        $scope.showClassroom = function() {
            $scope.teacherBar = 0;
            $scope.classroomBar = 1;
        }

        $scope.showTeacher = function() {
            $scope.teacherBar = 1;
            $scope.classroomBar = 0;
        }

        $scope.sureTeacher = function() {
            $scope.teacherBar = 0;
            $scope.teacherNames = angular.extend([], $scope.data.teacherNames);
            $scope.data.teacherName = $scope.data.teacherNames.join(';');
            $scope.data.teacherId = $scope.data.teacherIds.join(';');
        };

        $scope.sureClassroom = function() {
            $scope.classroomBar = 0;
        }


        $scope.changeCameraList = function() {
            var type = null;
            var location = null;
            if ($scope.selectCameraType === '0') {
                type = 0;
                location = 1;
            } else if ($scope.selectCameraType === '1') {
                type = 0;
                location = 2;
            } else if ($scope.selectCameraType === '2') {
                type = 1;
                location = null;
            }
            $scope.selectCameraType;
            serviceUtil.requestServer('/camera/list', 'get', function(data) {
                $scope.cameras = data;
                $scope.cameras.map(item => {
                    item['isDefault'] = false;
                })
            }, {
                gardenId: $scope.gardenId,
                cameraType: type,
                cameraLocation: location
            });
        }

        $scope.selectedCamera = function(index, data) {
            if ($scope.selectedCameraIds.indexOf(data.id) < 0) {
                if ($scope.selectedCameras.length == 0) {
                    $scope.showing = false;
                    $scope.selectedCameras.push(data);
                    $scope.selectedCameraIds.push({
                        cameraId: data.id
                    });
                } else {
                    if ($scope.selectedCameras.length >= 3) {
                        $msg.error('最多可选择3个摄像头');
                        return;
                    } else {
                        // 排除同种类型摄像头只能存在一种
                        let type = [];
                        $scope.selectedCameras.forEach(item => {
                            type.push($scope.distingwishCamera(item));
                        });
                        let target = $scope.distingwishCamera(data);
                        let index = type.indexOf(target);

                        if (index >= 0) {
                            let temp = $scope.selectedCameras.splice(index, 1);
                            $scope.selectedCameraIds = $scope.selectedCameraIds.filter(item => item.id != temp.id);
                            $scope.cameras.push(...temp)
                        }
                        $scope.selectedCameras.push(data);
                        $scope.selectedCameraIds.push({
                            cameraId: data.id
                        });
                    }

                }
                $scope.cameras.splice(index, 1)
            }
            $scope.firstCamera = true;
        };

        $scope.distingwishCamera = function(data) {
            let type = null;
            if (data.cameraType == 0 && data.cameraLocation == 1) {
                type = 'front'
            } else if (data.cameraType == 0 && data.cameraLocation == 2) {
                type = 'end'
            } else if (data.cameraType == 0 && data.cameraLocation) {
                type = 'static'
            }
            return type;
        }

        $scope.selectName = function(index, name, id) {
            $scope.showing = true;
            $scope.data.cameraName = name;
            $scope.data.cameraId = id;
            $scope.selectedCameras.unshift({
                id: index,
                name: name
            });
            $scope.selectedCameras.splice(index + 1, 1);
        }

        $scope.del = function(index, data) {
            if (angular.isArray($scope.cameras)) {
                $scope.cameras.push(data)
                $scope.selectedCameras.splice(index, 1);
                $scope.cameraIndex = null;
                $scope.data.cameraId = null;
                $scope.selectedCameraIds = $scope.selectedCameraIds.filter(item => {
                    return item.cameraId !== data.id
                });
            } else {
                $scope.cameras = [];
                $scope.cameras.push(data)
                $scope.selectedCameras.splice(index, 1);
                $scope.cameraIndex = null;
                $scope.data.cameraId = null;
                $scope.selectedCameraIds = $scope.selectedCameraIds.filter(item => {
                    return item.cameraId !== data.id
                })
            }
        }

        $scope.selectMainVoice = function(indx, item) {
            $scope.selectedCameras.forEach((ele, index) => {
                if (indx == index) {
                    item.isDefault = true;
                } else {
                    ele.isDefault = false;
                }
            })
        }

        $scope.ok = function() {
            var temp = [];
            $scope.firstCamera = true;
            $scope.data.organizationCameras = [];
            console.log($scope.selectedCameras);

            if ($scope.selectedCameras.length > 0) {
                temp = $scope.selectedCameraIds;
                //已选摄像头
                $scope.selectedCameras.forEach(element => {
                    let item = {
                        organizationId: element.organizationId,
                        cameraId: element.id,
                        cameraName: element.name,
                        cameraType: element.cameraType,
                        cameraLocation: element.cameraLocation,
                        number: 0
                    };
                    $scope.data.organizationCameras.push(item);
                });

                //默认摄像头
                let defaultCamera = $scope.selectedCameras.find(i => i.isDefault === true);
                if (defaultCamera !== undefined) {
                    $scope.data.cameraId = defaultCamera.id;
                    $scope.data.cameraName = defaultCamera.name;
                }

            }

            console.log($scope.data);

            serviceUtil.requestServer('/organization', 'put', function(data) {
                scope.getList(scope.gradeIndex, scope.classId);
                $msg.success();
                scope.classInfo.areaCode = $scope.data.areaCode;
                scope.classInfo.teacherName = $scope.data.teacherName;
                scope.classInfo.areaName = $scope.data.areaName;
                if (temp.length > 0) {
                    scope.classInfo.cameraIds = temp.map(item => {
                        return item.cameraId
                    }).join(',');
                }
            }, $scope.data);
            $uibModalInstance.close();
            $scope.$parent.cfgClass = null;
            $scope.selectedCameras = [];
            $scope.selectedCameraIds = [];
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
            $scope.$parent.cfgClass = null;
        }
    }
]);
// course
tpk_courseschedule.controller('course.cfg.ctrl', ['$scope', '$stateParams', '$uibModalInstance', 'serviceUtil', 'lwUiModel', 'AreaAndCamera', '$msg',
    function($scope, $stateParams, $uibModalInstance, serviceUtil, lwUiModel, AreaAndCamera, $msg) {
        AreaAndCamera.selected($scope);
        $scope.data = {
            isRecord: false
        };
        var scope = $scope.$parent;
        var classId = scope.classId;
        var cfgCourse = scope.cfgCourse;
        $scope.teacherIds = [];
        $scope.cameraIds = [];
        $scope.teacherNames = [];
        $scope.teacherNamesStr = "";
        $scope.data.teacherNamesStr = "";
        $scope.data.teacherIds = [];
        $scope.data.teacherNames = [];
        $scope.classrooms = [];
        $scope.selectCameraType = '';
        $scope.cameraTypes = [
            { id: '', value: '所有摄像头类型' },
            { id: '0', value: '前-实体摄像头' },
            { id: '1', value: '后-实体摄像头' },
            { id: '2', value: '电脑画面虚拟摄像头' }
        ];

        console.log('parent:', scope);

        serviceUtil.requestServer('/camera/list', 'get', function(data) {
            console.log(data);
            $scope.cameras = data;
            $scope.cameras.map(item => {
                item['isDefault'] = false;
                item['organizationId'] = scope.organization.id;
                item['lessonId'] = cfgCourse.id;
                item['number'] = 0;
            });
        }, {
            gardenId: $scope.$parent.gardenId,
            cameraType: ''
        }).then(function() {
            if (cfgCourse.id) {
                serviceUtil.requestServer('/schedule/' + cfgCourse.id, 'get', function(data) {
                    data = data.data;
                    $scope.courseSelectedCameras = [];
                    $scope.selectedCameraIds = [];

                    if (!data.cameraId) {
                        $scope.showing = false;
                    } else {
                        $scope.showing = true;
                    }
                    $scope.data = {
                        teacherIds: data.teacherIds ? data.teacherIds.split(',') : [],
                        teacherNames: data.teacherNames ? data.teacherNames.split('；') : [],
                        teacherNamesStr: data.teacherNames ? data.teacherNames : "",
                        subjectCode: data.subjectCode,
                        subjectName: data.subjectName,
                        areaCode: data.areaCode,
                        areaName: data.areaName,
                        cameraId: data.cameraId,
                        cameraName: data.cameraName,
                        cameraSame: data.cameraSame,
                        isRecord: data.isRecord,
                        courseTableCameras: data.courseTableCameras,
                        lessonStatus: data.lessonStatus,
                        classRoomSame: data.classRoomSame
                    };

                    // 初始化camera列表
                    var cameras = [];

                    for (var i = 0; i < $scope.data.courseTableCameras.length; i++) {
                        let include = $scope.cameras.filter((element, index, array) => {
                            return element.id === $scope.data.courseTableCameras[i].cameraId;
                        })[0];
                        var camera = {};
                        camera.cameraId = $scope.data.courseTableCameras[i].cameraId;
                        camera.cameraName = $scope.data.courseTableCameras[i].cameraName;
                        camera.cameraType = include.cameraType;
                        camera.cameraLocation = include.cameraLocation;
                        camera.courseTableId = cfgCourse.id;
                        camera.organizationId = scope.organization.id;
                        camera.isDefault = false;
                        camera.lessonId = cfgCourse.id;
                        camera.number = 0;
                        cameras.push(camera);
                    }

                    for (var i = 0; i < cameras.length; i++) {
                        if (cameras[i].cameraId != $scope.data.cameraId) {
                            cameras.splice(i, 1);
                            i--;
                        }
                    }

                    for (var i = 0; i < $scope.data.courseTableCameras.length; i++) {
                        if ($scope.data.courseTableCameras[i].cameraId != $scope.data.cameraId) {
                            let include = $scope.cameras.filter((element, index, array) => {
                                return element.id === $scope.data.courseTableCameras[i].cameraId;
                            })[0];
                            var camera = {};
                            camera.cameraId = $scope.data.courseTableCameras[i].cameraId;
                            camera.cameraName = $scope.data.courseTableCameras[i].cameraName;
                            camera.cameraType = include.cameraType;
                            camera.cameraLocation = include.cameraLocation;
                            camera.courseTableId = cfgCourse.id;
                            camera.organizationId = scope.organization.id;
                            camera.isDefault = false;
                            camera.lessonId = cfgCourse.id;
                            camera.number = 0;
                            cameras.push(camera);
                        }
                    }

                    $scope.data.courseTableCameras = [];

                    for (var i = 0; i < cameras.length; i++) {
                        $scope.data.courseTableCameras.push(cameras[i]);
                    }

                    if ($scope.data.courseTableCameras.length == 0 && $scope.data.cameraId != null) {
                        var camera = {};
                        let include = $scope.cameras.filter((element, index, array) => {
                            return element.id === $scope.data.cameraId;
                        })[0];

                        camera.id = $scope.data.cameraId;
                        camera.name = $scope.data.cameraName;
                        camera.cameraType = include.cameraType;
                        camera.cameraLocation = include.cameraLocation;
                        camera.courseTableId = cfgCourse.id;
                        camera.organizationId = scope.organization.id;
                        camera.isDefault = false;
                        camera.lessonId = cfgCourse.id;
                        camera.number = 0;
                        $scope.courseSelectedCameras.push(camera);
                    }

                    var cameraIds = staticCamera($scope.data.courseTableCameras);
                    var cameraArr = angular.extend([], $scope.cameras);
                    $scope.cameras = [];

                    for (var j = 0; j < cameraArr.length; j++) {
                        if (cameraIds.indexOf(cameraArr[j].id) < 0) {
                            $scope.cameras.push(cameraArr[j]);
                        }
                    }

                    $scope.teacherNames = angular.extend([], $scope.data.teacherNames);
                    var eqClassCamera = data.cameraId && data.cameraId == scope.classInfo.cameraId;
                    var eqClassArea = data.areaCode && data.areaCode == scope.classInfo.areaCode;
                    $scope.isUseClassCfg = eqClassCamera && eqClassArea;

                    for (var i = 0, len = $scope.cameras.length; i < len; i++) {
                        if (data.cameraId == $scope.cameras[i].id) {
                            $scope.cameraIndex = i;
                            $scope.data.cameraName = $scope.cameras[i].name;
                        }
                    }
                });
            } else {
                //取消默认的摄像头
                $scope.$parent.selectedCameraIds = [];
                $scope.$parent.selectedCamera = [];
                $scope.$parent.classInfo.cameraId = '';
                $scope.$parent.classInfo.cameraName = '';
                scope = $scope.$parent;
            }
        });

        $scope.changeCameraList = function() {
            var type = null;
            var location = null;
            if ($scope.selectCameraType === '0') {
                type = 0;
                location = 1;
            } else if ($scope.selectCameraType === '1') {
                type = 0;
                location = 2;
            } else if ($scope.selectCameraType === '2') {
                type = 1;
                location = null;
            }
            $scope.selectCameraType;
            serviceUtil.requestServer('/camera/list', 'get', function(data) {
                $scope.cameras = data;
                $scope.cameras.map(item => {
                    item['isDefault'] = false;
                    item['organizationId'] = scope.organization.id;
                    item['lessonId'] = cfgCourse.id;
                    item['number'] = 0;
                })
            }, {
                gardenId: $scope.$parent.gardenId,
                cameraType: type,
                cameraLocation: location
            });
        }

        $scope.classData = {
            classroomId: 0,
            classroomName: ""
        };

        serviceUtil.requestServer('/classroom/list', 'get', function(data) {
            $scope.classrooms = data;
        }, {
            gardenId: $scope.$parent.gardenId
        });

        $scope.showClassroom = function() {
            $scope.teacherBar = 0;
            $scope.classroomBar = 1;
        }

        $scope.showTeacher = function() {
            $scope.teacherBar = 1;
            $scope.classroomBar = 0;
        }

        $scope.searchRootName = function() {
            $scope.cameraWords = $scope.searchName;
            $scope.$apply();
        }

        function staticCamera(data) {
            var selectedCameraIds = [];
            data = data || [];
            $scope.selectedCameraIds = []
            for (var i = 0; i < data.length; i++) {
                var obj = {};
                obj.id = data[i].cameraId;
                obj.name = data[i].cameraName;
                obj.cameraType = data[i].cameraType;
                obj.cameraLocation = data[i].cameraLocation;
                obj.organizationId = scope.organization.id;
                obj.isDefault = false;
                obj.lessonId = cfgCourse.id;
                obj.number = 0;
                $scope.courseSelectedCameras.push(obj);
                $scope.selectedCameraIds.push({
                    cameraId: data[i].cameraId
                });
                selectedCameraIds.push(data[i].cameraId);
            }
            return selectedCameraIds;
        }

        serviceUtil.requestServer('/organization/subjects/class/' + classId, 'get', function(data) {
            $scope.subjects = data.data;
        });

        var echoTeacher = function(data) {
            if (cfgCourse.id) {
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].id == cfgCourse.teacherIds) {
                        $scope.teacherName = data.name;
                    }
                }
            }
        };

        serviceUtil.requestServer('/schedule/teachers', 'get', function(data) {
            $scope.teachers = data.data;
            echoTeacher(data.data);
        }, {
            gardenId: $stateParams.gardenId,
            week: scope.cfgWeek,
            period: scope.cfgPeriod,
            classId: scope.classId
        });

        $scope.searchRs = function(data) {
            return $scope.teacherBar && (!$scope.teacherName || data.indexOf($scope.teacherName) > -1);
        };

        $scope.searchCs = function(data) {
            return $scope.classroomBar && (!$scope.classroomName || data.indexOf($scope.classroomName) > -1);
        }

        $scope.ClassroomCfg = function($event) {
            var checked = $event.target.checked;
            if (checked) {
                $scope.isClassroomFlag = true;
                $scope.classData.classroomId = scope.classInfo.classRoomId;
                $scope.classData.classroomName = scope.classInfo.classRoomName;
                $scope.classroomBar = 0;
            } else {
                $scope.isClassroomFlag = false;
                $scope.classData.classroomId = 0;
                $scope.classData.classroomName = "";
            }
        }

        $scope.selfStudyCourses = function($event) {
            var checked = $event.target.checked;
            if (checked) {
                $scope.subjectNameFlag = true;
                $scope.data.isRecord = false;
                $scope.teacherBar = 0;
                $scope.teacherIds = [];
                $scope.teacherNames = [];
                $scope.teacherNamesStr = "";
                $scope.data.teacherIds = [];
                $scope.data.teacherNames = [];
                $scope.data.teacherNamesStr = "";
            } else {
                $scope.subjectNameFlag = false;
                $scope.data.isRecord = true;
            }
        }

        $scope.userClassCfg = function($event) {
            var checked = $event.target.checked;
            if (checked) {
                if ($scope.courseSelectedCameras.length > 0) {
                    $scope.courseSelectedCameras.forEach(element => {
                        $scope.cameras.push(element);
                    });
                    $scope.courseSelectedCameras = [];
                }
            }
            $scope.firstArea = true;
            $scope.firstCamera = true;
        };

        function echoCamera(cameraId) {
            for (var i = 0, len = $scope.cameras.length; i < len; i++) {
                if (cameraId == $scope.cameras[i].id) {
                    $scope.cameraIndex = i;
                }
            }
        }


        $scope.selectMainVoice = function(indx, item) {
            $scope.courseSelectedCameras.forEach((ele, index) => {
                if (indx == index) {
                    item.isDefault = true;
                } else {
                    ele.isDefault = false;
                }
            })
        }

        $scope.selectClassroom = function($event, data) {
            if ($event.target.checked) {
                $scope.classData.classroomId = data.id;
                $scope.classData.classroomName = data.name;
            } else {
                $scope.classData.classroomId = 0;
                $scope.classData.classroomName = "";
            }
        }

        $scope.selectTeacher = function($event, data) {
            if ($event.target.checked) {
                $scope.data.teacherIds.push(data.id);
                $scope.data.teacherNames.push(data.name);
                $scope.data.teacherNamesStr = $scope.data.teacherNames.join().toString();
            } else {
                var dataId = $scope.data.teacherIds.indexOf(data.id);
                $scope.data.teacherIds.splice(dataId, 1);
                var dataName = $scope.data.teacherNames.indexOf(data.name);
                $scope.data.teacherNames.splice(dataName, 1);
                $scope.data.teacherNamesStr = $scope.data.teacherNames.join().toString();
            }
        };

        $scope.getSubjectName = function() {
            for (var i = 0, len = $scope.subjects.length; i < len; i++) {
                if ($scope.data.subjectCode == $scope.subjects[i].id) {
                    $scope.data.subjectName = $scope.subjects[i].name;
                }
            }
        };

        $scope.courseSelectedCameras = [];

        $scope.selectedCamera = function(index, data) {
            if ($scope.selectedCameraIds.indexOf(data.id) < 0) {
                if ($scope.courseSelectedCameras.length == 0) {
                    $scope.showing = false;
                    $scope.courseSelectedCameras.push(data);
                    $scope.selectedCameraIds.push({
                        cameraId: data.id
                    });
                } else {
                    if ($scope.courseSelectedCameras.length == 3) {
                        $msg.error('最多可选择3个摄像头')
                        return;
                    } else {
                        // 排除同种类型摄像头只能存在一种
                        let type = [];
                        $scope.courseSelectedCameras.forEach(item => {
                            type.push($scope.distingwishCamera(item));
                        });
                        let target = $scope.distingwishCamera(data);
                        let index = type.indexOf(target);

                        if (index >= 0) {
                            let temp = $scope.courseSelectedCameras.splice(index, 1);
                            $scope.selectedCameraIds = $scope.selectedCameraIds.filter(item => item.id != temp.id);
                            $scope.cameras.push(...temp)
                        }
                        $scope.courseSelectedCameras.push(data);
                        $scope.selectedCameraIds.push({
                            cameraId: data.id
                        });
                    }
                }
                $scope.cameras.splice(index, 1);
            }
            $scope.firstCamera = true;
            $scope.isUseClassCfg = false;
        };

        $scope.distingwishCamera = function(data) {
            let type = null;
            if (data.cameraType == 0 && data.cameraLocation == 1) {
                type = 'front'
            } else if (data.cameraType == 0 && data.cameraLocation == 2) {
                type = 'end'
            } else if (data.cameraType == 0 && data.cameraLocation) {
                type = 'static'
            }
            return type;
        }

        $scope.selectName = function(index, name, id) { // 设置默认摄像头
            $scope.showing = true;
            $scope.data.cameraName = name;
            $scope.data.cameraId = id;
            $scope.courseSelectedCameras.unshift({
                id: index,
                name: name
            })
            $scope.courseSelectedCameras.splice(index + 1, 1);
        }

        $scope.del = function(index, data) {
            if (angular.isArray($scope.cameras)) {
                $scope.cameras.push(data)
                $scope.courseSelectedCameras.splice(index, 1);
                $scope.cameraIndex = null;
                $scope.data.cameraId = null;
                $scope.selectedCameraIds = $scope.selectedCameraIds.filter(item => {
                    return item.cameraId !== data.id
                })
            } else {
                $scope.cameras = [];
                $scope.cameras.push(data)
                $scope.courseSelectedCameras.splice(index, 1);
                $scope.cameraIndex = null;
                $scope.data.cameraId = null;
                $scope.selectedCameraIds = $scope.selectedCameraIds.filter(item => {
                    return item.cameraId !== data.id
                })
            }
        }

        var getData = function() {
            $scope.data.id = cfgCourse.id;
            $scope.data.week = cfgCourse.week;
            $scope.data.period = cfgCourse.period;
            $scope.data.gardenId = $stateParams.gardenId;
            $scope.data.gradeId = scope.grades[scope.gradeIndex].id;
            $scope.data.classId = scope.classId;
            $scope.data.courseTableCameras = $scope.courseSelectedCameras;
            $scope.data.lessonStatus = $scope.subjectNameFlag ? 2 : 1;
            $scope.data.classRoomSame = $scope.isClassroomFlag ? 1 : 0;
            $scope.data.cameraSame = $scope.isUseClassCfg ? 1 : 0;
            return $scope.data;
        };

        var saveAfter = function(id) {
            scope.getList(scope.gradeIndex, scope.classId);
            location.reload();
            var rs = $scope.data;
            var courseList = scope.courseschedules[cfgCourse.week.toString()];
            if (id) {
                cfgCourse.id = id;
                cfgCourse.teacherNames = rs.teacherNames.join('；');
                cfgCourse.subjectName = rs.subjectName;
                cfgCourse.cameraId = rs.cameraId;
                cfgCourse.cameraName = rs.cameraName;
                courseList.push(cfgCourse);
            } else {
                var course = courseList[cfgCourse.period * 1 - 1];
                course.teacherNames = rs.teacherNames.join('；');
                course.subjectName = rs.subjectName;
                course.cameraName = rs.cameraName;
            }
        };

        var add = function() {
            var courseTable = getData();
            courseTable.teacherId = courseTable.teacherIds.join(',');
            console.log('add:', courseTable);
            serviceUtil.requestServer('/schedule', 'post', function(data) {
                saveAfter(data.data);
                $msg.success();
            }, courseTable)
        };

        var update = function() {
            var courseTable = getData();
            courseTable.teacherId = courseTable.teacherIds.join(',');
            console.log('update:', courseTable);
            serviceUtil.requestServer('/schedule', 'put', function(data) {
                saveAfter();
                $msg.success();
            }, courseTable)
        };

        $scope.sureClassroom = function() {
            $scope.classroomBar = 0;
        }

        $scope.sureTeacher = function() {
            $scope.teacherBar = 0;
            // $scope.data.teacherIds = $scope.teachersId.toString();
            // $scope.data.teacherId = $scope.teachersId;
            // $scope.data.teacherNames = $scope.teachersName.join('；');
            // $scope.data.teacherNames = $scope.teachersName;
            $scope.teacherNames = angular.extend([], $scope.data.teacherNames);
        };

        $scope.clearAll = function() {
            $scope.data = {};
        };

        $scope.ok = function() {
            if (!$scope.subjectNameFlag) {
                if ($scope.data.subjectCode == null) {
                    $msg.error("请选择课程！");
                    return;
                }
                if ($scope.data.teacherNames.length == 0) {
                    $msg.error("请选择授课教室！");
                    return;
                }
            }
            $scope.firstArea = true;
            $scope.firstCamera = true;

            if (cfgCourse.id) {
                update();
            } else {
                add();
            }
            $uibModalInstance.close();
            $scope.$parent.cfgCourse = null;

            $scope.selectedCameras = [];
            $scope.courseSelectedCameras = [];
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
            $scope.$parent.cfgCourse = null;
        }
    }
]);

tpk_courseschedule.controller('import.file.ctrl', ['$scope', '$uibModalInstance', 'serviceUtil', '$stateParams',
    function($scope, $uibModalInstance, serviceUtil, $stateParams) {
        var scope = $scope.$parent;
        $scope.data = {};
        $scope.stepOne = true;
        $scope.data.classId = scope.classId;
        $scope.data.gradeId = scope.gradeId;
        $scope.data.gardenId = scope.gardenId;
        $scope.gardenId = $stateParams.gardenId;
        var token = sessionStorage.getItem('TOKEN');
        $scope.importUrl = '/lwtpk-web/schedule/import?TOKEN=' + token;
        $scope.getGrades = function() {
            serviceUtil.requestServer('/organization/grades', 'get', function(data) {
                $scope.grades = data.data;
            }, {
                gardenId: $scope.data.gardenId
            })
        };
        $scope.getClasses = function() {
            serviceUtil.requestServer('/organization/classes', 'get', function(data) {
                $scope.classes = data.data;
            }, {
                gradeId: $scope.data.gradeId
            });
        };
        $scope.createTemplate = function() {
            $scope.gardenNotNull = !$scope.data.gardenId;
            $scope.gradeNotNull = !$scope.data.gradeId;
            $scope.classNotNull = !$scope.data.classId;
            if (!$scope.gardenNotNull && !$scope.gradeNotNull && !$scope.classNotNull) {
                $scope.templateBar = true;
                for (var i = 0, len = scope.gardens.length; i < len; i++) {
                    if (scope.gardens[i].id == $scope.data.gardenId) {
                        $scope.gardenName = scope.gardens[i].name;
                        $scope.data.gardenId = scope.gardens[i].id;
                        break;
                    }
                }
                if (scope.grades && scope.grades[0]) {
                    for (var i = 0, len = $scope.grades.length; i < len; i++) {
                        if (scope.grades[i].id == $scope.data.gradeId) {
                            $scope.gradeName = $scope.grades[i].name;
                            $scope.data.gradeId = scope.grades[i].id;
                            break;
                        }
                    }
                }
                if (scope.classes && $scope.classes[0]) {
                    for (var i = 0, len = $scope.classes.length; i < len; i++) {
                        if (scope.classes[i].id == $scope.data.classId) {
                            $scope.className = scope.classes[i].name;
                            $scope.data.classId = scope.classes[i].id;
                            break;
                        }
                    }
                }
            }
        };
        $scope.import = function(data) {
            var data = eval('(' + data + ')');
            if (data.code == 0 && data.data == '{}') {
                scope.getSchedules();
                $uibModalInstance.close();
            } else {
                $scope.errors = data.data != '{}' ? data.data : null;
            }
        };
        $scope.addFileAfter = function($file) {
            $scope.uploadFileName = $file.name;
            return !!{
                xlsx: 1,
                xls: 1
            }[$file.getExtension()]
        };
        $scope.export = function() {
            serviceUtil.requestServer('/schedule/export', 'download', $scope.data);
        };
        $scope.last = function() {
            $scope.stepOne = true;
            $scope.stepTwo = false;
        };
        $scope.next = function() {
            $scope.stepTwo = true;
            $scope.stepOne = false;
        };
        $scope.cancel = function() {
            $uibModalInstance.close();
        }
    }
]);