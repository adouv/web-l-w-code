/**
 * Created by lw-yf-015 on 2016/12/3.
 */
import "../styles/assign.subject.css";
import "../styles/organization.css";

tpk_organization.controller('organization.area.ctrl', ['$scope', '$state', '$stateParams', '$uibModal', 'serviceUtil', 'lwUiModel','Garden',
    function ($scope, $state, $stateParams, $uibModal, serviceUtil, lwUiModel,Garden) {
        Garden.gardenToggle($scope);
        $scope.subjectAssign = function () {
            $uibModal.open({
                animation: true,
                size: 'sm',
                scope:$scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                template: require('../views/assign.subject.html'),
                controller: 'assign.subject.ctrl'
            });
        };
        $scope.deleteTeacher = function (id, index) {
            lwUiModel.delete(function () {
                serviceUtil.requestServer('/organization/teacher', 'delete',
                    function (data) {
                        $scope.teachers.splice(index, 1);
                    }, {organizationId: $scope.organizationId, teacherId: id})
            })
        };
        $scope.deleteSubject = function (id, index) {
            lwUiModel.delete(function () {
                serviceUtil.requestServer('/organization/subject', 'delete',
                    function (data) {
                        $scope.subjects.splice(index, 1);
                    }, {organizationId: $scope.organizationId, subjectId: id})
            })
        };
        $scope.alertClose = function () {
            $scope.alertShow = false;
        };
    }]);

tpk_organization.controller('assign.subject.ctrl', ['$scope', '$uibModalInstance', 'serviceUtil', '$timeout','$stateParams',
    function ($scope, $uibModalInstance, serviceUtil, $timeout,$stateParams) {
        var gardenId = sessionStorage.getItem('gardenId');
        $scope.subjectIds = [];
        $scope.subjectsId = [];
        serviceUtil.requestServer('/system/subject', 'get',
            function (data) {
                $scope.subjects = data.data;
                $scope.cacheSubjects = data.data;
                var subjects = $scope.$parent.subjects;
                for(var i=0,len=data.data.length;i<len;i++){
                    for(var j=0,leng=subjects.length;j<leng;j++){
                        if(data.data[i].id == subjects[j].id){
                            data.data[i].checked = true;
                            $scope.subjectIds.push(data.data[i].id);
                            break;
                        }
                    }
                }
            });
        $scope.ok = function () {
            var parentsubjects = $scope.$parent;
            var organizationId = $scope.$parent.organizationId;
            serviceUtil.requestServer('/organization/subject','post',function (data) {
                parentsubjects.subjects = [];
                for(var j=0,leng=$scope.subjectIds.length;j<leng;j++){
                    for (var i=0,len=$scope.subjects.length;i<len;i++){
                        if($scope.subjectIds[j]==$scope.subjects[i].id){
                            parentsubjects.subjects.push($scope.subjects[i]);
                            break;
                        }
                    }
                }
            },{
                organizationId:organizationId,
                subjectIds:$scope.subjectIds.toString()
            });
            $uibModalInstance.close();
        };
        $scope.cancle = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.allChecked = function (event) {
            var checked = event.target.checked;
            $scope.isCheckedAll = checked;
            if(checked){
                angular.forEach($scope.subjects, function (subject,index) {
                    subject.checked = checked;
                    $scope.subjectIds.push(subject.id);
                });
            }else {
                angular.forEach($scope.subjects, function (subject,index) {
                    subject.checked = checked;
                });
                $scope.subjectIds = [];
            }
        };
        $scope.singleChecked = function (event, id) {
            var checked = event.target.checked;
            var index = $scope.subjectIds.indexOf(id);
            if(checked && index < 0){
                $scope.subjectIds.push(id);
            }else if(!checked && index > -1){
                $scope.subjectIds.splice(index,1);
            }
        };
        $scope.searchSubject = function (name) {
            return !$scope.subjectKeyword||name.indexOf($scope.subjectKeyword)>-1;
        }
    }]);
