/**
 * Created by lw-yf-015 on 2016/12/3.
 */
import "../styles/dailyschedule.css";
import "../styles/modal.garden.css";
import "../styles/vacation.css";

tpk_organization.controller('dailyschedule.list.ctrl', ['$scope', 'Garden', '$stateParams', 'serviceUtil', '$state', 'lwUiModel', '$msg', '$uibModal', function ($scope, Garden, $stateParams, serviceUtil, $state, lwUiModel, $msg, $uibModal) {
  Garden.gardenToggle($scope);
  serviceUtil.requestServer('/organization/grades', 'get', function (data) {
    $scope.grades = data.data;
  }, {
    gardenId: $stateParams.gardenId
  });


  $scope.checkeds = [];
  $scope.checkAllBox = false;
  $scope.check = function ($event, id) {
    var target = $event.target.checked;
    if (target) {
      $scope.checkeds.push(id);
      if ($scope.checkeds.length == $scope.datas.length) {
        $scope.checkAllBox = true;
      }
    } else {
      var index = $scope.checkeds.indexOf(id);
      $scope.checkeds.splice(index, 1);
      $scope.checkAllBox = false;
    }
  }




  $scope.changeStatus = function ($event, id, index) {
    $scope.selectedData = {
      timeTableId: $scope.datas[index].id,
      startTime: $scope.datas[index].startTime,
      endTime: $scope.datas[index].endTime,
      timeTableName: $scope.datas[index].name,
      list: $scope.datas[index].organizationPojoList
    };
    $scope.isChangeStatus = true;
    $scope.id = id;
    var isChecked = $event.target.checked;
    if (isChecked) {
      $event.target.checked = !isChecked;
      serviceUtil.requestServer('/timeTable/repeates', 'get',
        function (data) {
          $scope.conflicts = data.data;
          if ($scope.conflicts.length == 0) {
            duleStatus()
          } else {
            $scope.conflicts.unshift($scope.selectedData);
            $scope.sureErrors();
          }
        }, {
          id: id
        });
    } else {
      duleStatus();
    }

    function duleStatus() {
      serviceUtil.requestServer('/timeTable/status/' + isChecked, 'put',
        function (data) {
          if (data.code == 0) {
            $msg.success();
            $scope.toSearch();
          }
        }, {
          id: id
        });
    }
  }
  $scope.conflictCallBack = function (addConflict) {
    var id = $scope.id;
    serviceUtil.requestServer('/timeTable/status/true', 'put',
      function (data) {
        if (data.code == 0) {
          $msg.success();
          $scope.id = null;
          $scope.toSearch();
        }
      }, {
        id: id,
        addConflict: addConflict
      });
  }
  $scope.timeVacation = function () {
    $uibModal.open({
      animation: true,
      scope: $scope,
      dialogClass: 'model-shadows',
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      template: require('../views/vacationList.html'),
      controller: 'vacation.ctrl'
    });
  }
  $scope.sureErrors = function () {
    $uibModal.open({
      animation: true,
      scope: $scope,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      template: require('../views/errors.modal.html'),
      controller: 'errors.modal.ctrl'
    });
  };


  $scope.checkAll = function ($event) {
    if ($event.target.checked) {
      angular.forEach($scope.datas, function (data) {
        $scope.checkeds.push(data.id);
        data.checked = true;
      })
    } else {
      $scope.datas = $scope.datas.map(function (item) {
        item.checked = false
        return item
      })
      $scope.checkeds = [];
    }
  }
  $scope.deleteAll = function () {
    var ids = $scope.checkeds;
    if (ids.length > 0) {
      $scope.delete(ids);
    }
  };
  $scope.delete = function (ids) {
    if (ids) {
      lwUiModel.delete(function () {
        serviceUtil.requestServer('/timeTable', 'delete',
          function (data) {
            $scope.toSearch();
            $msg.success("删除成功!请同步课表更新录像时间");
          }, {ids: ids.toString()});
      })
    } else {
      //提示信息
    }
  }
  $scope.toAdd = function () {
    $state.go(sys + 'dailyschedule.input', {
      gardenId: $scope.gardenId
    });
  }
  $scope.timeTableModule = {
    toEdit: function (id) {
      $state.go(sys + 'dailyschedule.input', {
        id: id,
        gardenId: $scope.gardenId
      });
    },
    toDetail: function (id) {
      $state.go(sys + 'dailyschedule.detail', {
        id: id
      })
    }
  }

  /**
   * if ($scope.$parent.isChangeStatus) {
            $scope.conflictCallBack(true);
          serviceUtil.requestServer('/timeTable', 'delete',
            function (data) {
              $scope.toSearch();
              $msg.success("操作成功!");
            }, {ids: $scope.$parent.conflicts[0].timeTableId});
 */

}]);
tpk_dailyschedule.controller('vacation.ctrl', ['$scope', '$uibModalInstance', 'serviceUtil', '$state', '$msg', 'lwUiModel',
  function ($scope, $uibModalInstance, serviceUtil, $state, $msg, lwUiModel) {
    $scope.holiday = {};
    $scope.gradeIds = [];
    $scope.gradeNames = [];
    $scope.ids = [];
    $scope.operatOrganizationIds = [];
    $scope.operatOrganizationNames = [];
    $scope.OrganizationIds = [];
    $scope.OrganizationNames = [];


    // 下拉框1
    $scope.addOrganizationId = function (id, name) {
      var flag = 0;
      for (var i = 0; i < $scope.operatOrganizationIds.length; i++) {
        if (id == $scope.operatOrganizationIds[i]) {
          flag = 1;
        }
      }
      if (flag == 0) {
        $scope.operatOrganizationIds.push(id);
        $scope.operatOrganizationNames.push(name);
      }
      $scope.organizationNames = $scope.operatOrganizationNames.join('；');
      if ($scope.operatOrganizationIds.length == $scope.gradeIds.length) {
        $scope.checkAllBox = true;
      }
    }
    $scope.deleteOrganizationId = function (id, name) {
      lwUiModel.delete(function () {
        var idIndex = $scope.operatOrganizationIds.indexOf(id);
        var nameIndex = $scope.operatOrganizationNames.indexOf(name);
        $scope.operatOrganizationIds.splice(idIndex, 1);
        $scope.operatOrganizationNames.splice(nameIndex, 1);
        $scope.organizationNames = $scope.operatOrganizationNames.join('；');
        $scope.checkAllBox = false;
      })
    }
    $scope.all = function ($event) {
      if ($event.target.checked) {
        $scope.organizationNames = $scope.gradeNames.join('；');
        for (var i = 0; i < $scope.gradeNames.length; i++) {
          $scope.operatOrganizationNames.push($scope.gradeNames[i]);
        }
        for (var i = 0; i < $scope.gradeIds.length; i++) {
          $scope.operatOrganizationIds.push($scope.gradeIds[i]);
        }
      } else {
        $scope.organizationNames = '';
        $scope.operatOrganizationIds = [];
        $scope.operatOrganizationNames = [];
      }
    }
    $scope.ok = function () {
      if ($scope.operatOrganizationIds != null) {
        $scope.holiday.organizationIds = $scope.operatOrganizationIds.join(',');
      }
      $scope.vacationObj = 0;
    }

    //  下拉框2
    var num = null;
    var organizationIdArray = [];
    var organizationNameArray = [];

    $scope.editName = function (index) {
      console.log($scope.datas);
      num = index;
      $scope.tempData = $scope.datas[num].organizationIds;
      organizationIdArray = $scope.datas[num].organizationIds.split(',');
      $scope.datas[num].organizationNames = $scope.datas[num].organizationNames.substring(0, $scope.datas[num].organizationNames.length - 1);
      organizationNameArray = $scope.datas[num].organizationNames.split('；')

      if (organizationIdArray.length == $scope.gradeIds.length) {
        $scope.checkAllboxEdit = true;
      } else {
        $scope.checkAllboxEdit = false;
      }
      $scope.vacationObj2 = 1;
    }
    $scope.addOrganizationIdByEdit = function (id, name) {
      var flag = 0;
      for (var i = 0; i < organizationIdArray.length; i++) {
        if (id == organizationIdArray[i]) {
          flag = 1;
        }
      }
      if (flag == 0) {
        organizationIdArray.push(id);
        organizationNameArray.push(name);
      }
      if (organizationIdArray.length == $scope.gradeIds.length) {
        $scope.checkAllboxEdit = true;
      }
      $scope.datas[num].organizationIds = organizationIdArray.join(',');
      $scope.datas[num].organizationNames = organizationNameArray.join('；');
      $scope.tempData = $scope.datas[num].organizationIds;

    }
    $scope.deleteOrganizationIdByEdit = function (id, name) {
      lwUiModel.delete(function () {
        var idIndex = organizationIdArray.indexOf(id);
        var nameIndex = organizationNameArray.indexOf(name);
        organizationIdArray.splice(idIndex, 1);
        organizationNameArray.splice(nameIndex, 1);
        $scope.datas[num].organizationIds = organizationIdArray.join(',');
        $scope.datas[num].organizationNames = organizationNameArray.join('；');
        $scope.tempData = $scope.datas[num].organizationIds;
        $scope.checkAllboxEdit = false;
      })
    }
    $scope.allByEdit = function ($event) {
      if ($event.target.checked) {
        // organizationIdArray = $scope.gradeIds;
        // organizationNameArray = $scope.gradeNames;
        for (var i = 0; i < $scope.gradeIds.length; i++) {
          organizationIdArray.push($scope.gradeIds[i]);
          organizationNameArray.push($scope.gradeNames[i]);
        }
        $scope.datas[num].organizationIds = $scope.gradeIds.join(',');
        $scope.datas[num].organizationNames = $scope.gradeNames.join('；');
        $scope.tempData = $scope.datas[num].organizationIds;
      } else {
        organizationIdArray = [];
        organizationNameArray = [];
        $scope.datas[num].organizationIds = organizationIdArray.join(',');
        $scope.datas[num].organizationNames = organizationNameArray.join('；');
        $scope.tempData = $scope.datas[num].organizationIds;
      }
    }
    $scope.ok2 = function () {
      $scope.vacationObj2 = 0;
    }


    $scope.gardenId = $scope.$parent.gardenId;
    for (var i = 1; i < $scope.$parent.gardens.length; i++) {
      if ($scope.gardenId == $scope.$parent.gardens[i].id) {
        $scope.gardenName = $scope.$parent.gardens[i].name;
      }
    }
    serviceUtil.requestServer('/organization/grades', 'get', function (data) {
      if (data.code == 0) {
        $scope.ogrades = data.data;
        for (var i = 0; i < $scope.ogrades.length; i++) {
          $scope.gradeIds.push($scope.ogrades[i].id);
          $scope.gradeNames.push($scope.ogrades[i].name);
        }
      }
    }, {
      gardenId: $scope.gardenId
    })
    $scope.getList = function () {
      $scope.pageSearch();
    }

    $scope.save = function () {
      if ($scope.holiday.status == null || $scope.holiday.status == "") {
        $scope.holiday.status = 1;
      }
      serviceUtil.requestServer('/holiday', 'post', function (data) {
        if (data.code == 0) {
          $msg.success("添加成功!请同步课表更新录像时间");
          $scope.holiday = {};
          $scope.pageSearch();
          $scope.organizationNames = '';
          $scope.operatOrganizationIds = [];
          $scope.operatOrganizationNames = [];
          $scope.checkAllBox = false;
        } else {
          $scope.holiday.status = null;
          $msg.error(data.msg);
        }
      }, $scope.holiday)
    }
    $scope.edit = function (index, data) {
      $scope.isEdit = $scope.isEdit && $scope.isEdit[index] !== undefined ? $scope.isEdit : [];
      $scope.isEdit[index] = !$scope.isEdit[index]
      if (!$scope.isEdit[index]) {
        var holidayVo = {};
        holidayVo.id = data.id;
        holidayVo.name = data.name;
        holidayVo.organizationIds = data.organizationIds;
        holidayVo.startTime = data.startTime;
        holidayVo.endTime = data.endTime;
        holidayVo.status = data.status;
        serviceUtil.requestServer('/holiday', 'put', function (data) {

          if (data.code == 0) {
            $msg.success("修改成功!请同步课表更新录像时间");
            $scope.pageSearch();
          } else {
            $msg.error(data.msg);
          }
        }, holidayVo);
      }
    }
    $scope.changeStatus = function (id) {
      serviceUtil.requestServer('/holiday/' + id, 'put', function (data) {
        if (data.code == 0) {
          $msg.success("操作成功!");
          $scope.pageSearch();
        }
      })
    }
    $scope.delete = function (id) {
      var ids = [];
      ids.push(id);
      lwUiModel.delete(function () {
        serviceUtil.requestServer('/holiday', 'delete', function (data) {
          if (data.code == 0) {
            $msg.success("删除成功!请同步课表更新录像时间");
            $scope.pageSearch();
          } else {
            $msg.success("删除失败!");
          }
        }, {
          id: ids
        })
      })
    }
    $scope.batchDelete = function () {
      lwUiModel.delete(function () {
          serviceUtil.requestServer('/holiday', 'delete', function (data) {
              if (data.code == 0) {
                  $msg.success("删除成功!请同步课表更新录像时间");
                  $scope.checkAll = false;
                  $scope.pageSearch();
              } else {
                  $msg.success("删除失败!");
              }
          }, {id: $scope.ids})
      })
    }
    $scope.checkAllBox = function ($event) {
      if ($event.target.checked) {
        $scope.ids = [];
        angular.forEach($scope.datas, function (data) {
          $scope.ids.push(data.id);
          data.checked = true;
        })
      } else {
        angular.forEach($scope.datas, function (data) {
          var index = $scope.ids.indexOf(data.id);
          $scope.ids.splice(index, 1);
          data.checked = false;
        })
      }
    }
    $scope.check = function ($event, id) {
      if ($event.target.checked) {
        $scope.ids.push(id);
        if ($scope.ids.length == $scope.datas.length) {
          $scope.checkAll = true;
        }
      } else {
        var index = $scope.ids.indexOf(id);
        $scope.ids.splice(index, 1);
        $scope.checkAll = false;
      }
    }
    $scope.getNow = function () {
      var date = new Date();
      $scope.now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    }

  }
]);

tpk_organization.controller('dailyschedule.input.ctrl', ['$scope', 'Garden', '$stateParams', 'serviceUtil', '$state', '$uibModal', 'lwGardenService',
  function ($scope, Garden, $stateParams, serviceUtil, $state, $uibModal, gardenService) {
    $scope.data = {};
    $scope.data.timeConfigs = [{}];
    $scope.times = [{}];
    $scope.organizationIds = [];
    $scope.organizationNames = "";
    $scope.notName = [];
    $scope.notTimesStart = [];
    $scope.notTimesEnd = [];
    $scope.compareTime = [];
    $scope.nowDate = new Date(new Date().Format('yyyy-MM-dd'));
    $scope.isStartTime = false;

    gardenService.getGardenInfo($stateParams.gardenId, (data) => {
      $scope.gardenName = data.gardenName;
      $scope.gardenId = data.gardenId;
      $scope.data.gardenId = $scope.gardenId;
    });

    // serviceUtil.requestServer('/garden/garden/gardenInfo', 'get',
    //   function (data) {
    //     $scope.gardenName = data.garden.name;
    //     $scope.gardenId = data.garden.id;
    //     $scope.data.gardenId = $scope.gardenId;
    //   }, {
    //     id: $stateParams.gardenId
    //   }
    // );

    Garden.gardenToggle($scope);
    $scope.id = $stateParams.id;
    if ($scope.id) {
      serviceUtil.requestServer('/timeTable/' + $scope.id, 'get',
        function (data) {
          var nowDate = new Date().toLocaleDateString();
          nowDate = new Date(Date.parse(nowDate.replace(/-/g, "/")));
          nowDate = nowDate.getTime();
          $scope.data = data.data;
          $scope.startTime = new Date(data.data.startTime);
          $scope.endTime = new Date(data.data.endTime);
          if($scope.startTime.getTime()  <= $scope.nowDate.getTime() ){
            $scope.isStartTime = true;
          }
          for (var i = 0; i < data.data.organizations.length; i++) {
            $scope.organizationIds.push(data.data.organizations[i].id);
            $scope.organizationNames += data.data.organizations[i].name + ";";
          }
          setTimes();
        })
    }


    function setTimes() {
      $scope.times = [];
      var datas = $scope.data.timeConfigs;
      angular.forEach(datas, function (data) {
        $scope.times.push({
          name: data.name,
          startTime: getDate(data.startTime),
          endTime: getDate(data.endTime)
        })
      })

      function getDate(dateStr) {
        var date = new Date("1970-01-01");
        var split = dateStr.split(":");
        date.setHours(split[0]);
        date.setMinutes(split[1]);
        return date;
      }
    }

    function getTimes() {
      $scope.data.timeConfigs = [];
      angular.forEach($scope.times, function (data) {
        $scope.data.timeConfigs.push({
          name: data.name,
          startTime: data.startTime.Format("hh:mm"),
          endTime: data.endTime.Format("hh:mm")
        });
      })
    }

    $scope.compare = function (datestr) {
      var d = new Date(datestr),
        d0 = new Date();
      if (+d0 > +d) return true
      return false
    }

    $scope.compareStartTime = function (t) {
      if (t) {
        var d = new Date(),
          h = d.getHours(),
          i = d.getMinutes(),
          s = d.getSeconds()
        var date = new Date("1970-01-01");
        date.setHours(h);
        date.setMinutes(i);
        date.setSeconds(s);
        if (t.getTime() < date) return true
      }
      return false
    }



    $scope.addTime = function () {
      $scope.times.push({});
    };

    $scope.minDate = new Date(new Date().Format('yyyy-MM-dd'));
    $scope.current = new Date()
    $scope.removeTime = function (index) {
      $scope.times.splice(index, 1);
    };

    $scope.toBack = function () {
      $state.go(sys + 'dailyschedule.index');
    };

    $scope.selectOrganization = function () {
      console.log($scope.startTime)
      if ($scope.id && $scope.current.getTime() > $scope.startTime.getTime()) return
      $uibModal.open({
        animation: true,
        scope: $scope,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        template: require('../views/organization.modal.html'),
        controller: 'organization.modal.ctrl'
      });
    };
    $scope.sureErrors = function () {
      $uibModal.open({
        animation: true,
        scope: $scope,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        template: require('../views/errors.modal.html'),
        controller: 'errors.modal.ctrl'
      });
    };

    $scope.validTime = function () {
      $scope.notDateStart = true;
      $scope.notDateEnd = true;
      var now = new Date(new Date().Format('yyyy-MM-dd') + ' 00:00:00');
      if ((now > $scope.data.startTime) || ($scope.data.startTime > $scope.data.endTime)) {
        $scope.compareDate = true;
      } else {
        $scope.compareDate = false;
      }
      for (var i = 0, len = $scope.times.length; i < len; i++) {
        $scope.notName[i] = true;
        $scope.notTimesStart[i] = true;
        $scope.notTimesEnd[i] = true;
        $scope.compareTime[i] = $scope.times[i].startTime > $scope.times[i].endTime;
      }
    };

    function vildTime() {
      $scope.validTime();
      var flag = false;
      if (!$scope.compareDate) {
        for (var i = 0, len = $scope.times.length; i < len; i++) {
          if ($scope.compareTime[i]) {
            flag = true;
            break;
          }
        }
      } else {
        flag = true;
      }
      return flag;
    }

    $scope.toSave = function (currStatus) {
      if (!vildTime()) {
        $scope.data.organizationId = $scope.organizationIds.toString();
        if ($scope.organizationIds.length == 0) {
          return false;
        }
        $scope.data.currStatus = currStatus ? currStatus : null;
        var method = "post";
        if ($scope.id) {
          method = "put";
        }
        // $scope.data.startTime = $scope.startTime.Format("yyyy-MM-dd");
        // $scope.data.endTime = $scope.endTime.Format("yyyy-MM-dd");
        if ($scope.data.status == undefined) {
          $scope.data.status = false;
        }
        getTimes();
        $scope.data.stageCount = $scope.data.timeConfigs.length;
        delete $scope.data.lastUpdateTime;
        var currData = {
          timeTableId: $scope.data.id,
          timeTableName: $scope.data.name,
          startTime: new Date($scope.data.startTime).getTime(),
          endTime: new Date($scope.data.endTime).getTime(),
          list: getCurrOrganization()
        }
        serviceUtil.requestServer('/timeTable', method,
          function (data) {
            if (data.code == 0) {
              $state.go(sys + 'dailyschedule.index');
            } else {
              $scope.conflicts = data.data;
              $scope.conflicts.unshift(currData);
              $scope.sureErrors();
            }
          }, $scope.data);
      }

      function getCurrOrganization() {
        var split = $scope.organizationNames.split(";");
        var list = [];
        for (var i = 0; i < $scope.organizationIds.length; i++) {
          list.push({
            id: $scope.organizationIds[i],
            name: split[i]
          })
        }
        return list;
      }
    }
  }
]);

tpk_dailyschedule.controller('dailyschedule.detail.ctrl', ['$scope', '$stateParams', 'serviceUtil', '$state', 'lwGardenService',
  function ($scope, $stateParams, serviceUtil, $state, gardenService) {
    serviceUtil.requestServer('/timeTable/' + $stateParams.id, 'get',
      function (data) {
        $scope.timeTable = data.data;
        getGarden(data.data.gardenId);
      })

    function getGarden(gardenId) {

      gardenService.getGardenInfo(gardenId, (data) => {
        $scope.gardenName = data.gardenName;
        $scope.gardenId = data.gardenId;
      });
      // serviceUtil.requestServer('/garden/garden/gardenInfo', 'get', function (data) {
      //   $scope.gardenName = data.garden.name;
      //   $scope.gardenId = data.garden.id;
      // }, {id: gardenId});
    }

    $scope.toBack = function () {
      $state.go(sys + 'dailyschedule.index');
    };

  }
]);

tpk_organization.controller('errors.modal.ctrl', ['$scope', '$uibModalInstance', '$msg', function ($scope, $uibModalInstance, $msg) {
  // var organizationIds = $scope.$parent.data.organizationId.split(",");
  var conflictIds = [];
  $scope.conflictIds = conflictIds;
  $scope.setCurrValid = function () {
    if ($scope.$parent.isChangeStatus) {
      $scope.conflictCallBack(true);
    } else {
      $scope.toSave(true);
    }
    $msg.success("添加成功!请同步课表更新录像时间");
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }

  $scope.notSaveConflict = function () {
    if ($scope.$parent.isChangeStatus) {
      $scope.conflictCallBack(false);
      $uibModalInstance.close();
      $msg.success("添加成功!请同步课表更新录像时间");
      return;
    }
    var array = $scope.$parent.data.organizationId.split(",");
    for (var i = 0; i < conflictIds.length; i++) {
      array.remove(conflictIds[i]);
    }
    if (array.length > 0) {
      $scope.$parent.organizationIds = array;
      $scope.toSave(true);
      $uibModalInstance.close();
      $msg.success("添加成功!请同步课表更新录像时间");
    } else {
      $msg.error("作用对象为空!");
    }
  }
  $scope.conflicts = $scope.$parent.conflicts;
  for (var i = 0; i < $scope.conflicts.length; i++) {
    var conflict = $scope.conflicts[i];
    for (var j = 0; j < conflict.list.length; j++) {
      if (conflict.list[j].status) {
        conflictIds.push(conflict.list[j].id);
      }
    }
  }

}]);

tpk_organization.controller('organization.modal.ctrl', ['$scope', '$uibModalInstance', 'serviceUtil', function ($scope, $uibModalInstance, serviceUtil) {
  $scope.organizationIds = [];
  $scope.organizationNames = "";
  if ($scope.$parent.organizationIds.length > 0) {
    for (var i = 0; i < $scope.$parent.organizationIds.length; i++) {
      $scope.organizationIds.push($scope.$parent.organizationIds[i]);
    }
    $scope.organizationNames = $scope.$parent.organizationNames;
  }
  $scope.ok = function () {
    $scope.$parent.organizationNames = $scope.organizationNames;
    $scope.$parent.organizationIds = $scope.organizationIds;
    $uibModalInstance.close();
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
  var gardenId = $scope.$parent.gardenId;
  serviceUtil.requestServer('/organization/grades', 'get', function (data) {
    $scope.organizations = data.data;
  }, {
    gardenId: gardenId
  });

  $scope.checkOrganization = function ($event, organizationId, organizationName) {
    var isChecked = $event.target.checked;
    if (isChecked) {
      $scope.organizationIds.push(organizationId);
      $scope.organizationNames = $scope.organizationNames + organizationName + ";";
    } else {
      var index = $scope.organizationIds.indexOf(organizationId);
      $scope.organizationIds.splice(index, 1);
      $scope.organizationNames = $scope.organizationNames.replace(organizationName + ";", "");
    }
  }
}]);