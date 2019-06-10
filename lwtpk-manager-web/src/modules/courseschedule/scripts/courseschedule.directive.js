/**
 * Created by lw-yf-015 on 2016/12/3.
 */

tpk_courseschedule.directive('courseSelectPerson', ['SelectPerson',  function (SelectPerson) {
    return {
        link:function (scope, elem, attrs) {
            $(elem).click(function () {
                var selected = [];
                if(scope.classInfo.teacherId){
                    selected = [scope.classInfo.teacherId];
                }
                SelectPerson.dialog({
                    single:!attrs.multi||true,
                    ids:selected
                },(person)=>{
                    scope.data.teacherName = person.personList.length == 0 ? null : person.personList[0].name;
                    scope.data.teacherId = person.ids.length == 0 ? null : person.ids.toString();
                });
                // var simpleParams = {
                //     selected: selected,
                //     multi: attrs.multi || false,//是否多选
                //     successFn: function (data) {
                //         scope.$apply(function () {
                //             scope.data.teacherName = data[0].name;
                //             scope.data.teacherId = data[0].id;
                //         });
                //     }
                // };
                // $.accountSelector(simpleParams);
            });
        }
    }
}]);

tpk_courseschedule.directive('areaZtree',['$stateParams','serviceUtil','lwGardenService',function ($stateParams,serviceUtil,gardenService) {
    return {
        replace:true,
        template:'<ul class="ztree" id="zTree"></ul>',
        link :function (scope,elem,attrs) {
            var setting = {
                view:{
                    showIcon:false,
                    selectedMulti: false
                },
                // check: {
                //     enable: true,
                //     chkStyle: "radio",
                //     radioType: "all"
                // },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeClick:beforeClick
                }
            };

            function selectAll() {

                var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
            }

            var searchNode = angular.element(document.querySelector('#searchCamera'));
            searchNode.bind('click',function () {
                scope.searchRootName();
                selectFirstNode();
            });

            function selectFirstNode(){
                var zTree = $.fn.zTree.getZTreeObj("zTree");
                var node = zTree.getNodeByParam('id',firstAreaCode);
                    zTree.selectNode(node);
            }

            function beforeCheck(treeId, treeNode) {
                return (treeNode.doCheck !== false);
            }

            function onCheck(e, treeId, treeNode) {
            }

            var gardenId = $stateParams.gardenId;
            function beforeClick(treeId,treeNode,id) {
                scope.searchRootName()
                // if(treeNode.checked){
                    if(!scope.cfgCourse){
                        scope.data.areaName = treeNode.name;
                        scope.data.areaCode = treeNode.id;
                    }else if(scope.cfgCourse){
                        scope.data.areaName = treeNode.name;
                        scope.data.areaCode = treeNode.id;
                    }
                /*}else{
                    if(!scope.cfgCourse){
                        scope.data.areaName = '';
                        scope.data.areaCode = null;
                    }else if(scope.cfgCourse){
                        scope.data.areaName = '';
                        scope.data.areaCode = null;
                    }
                }*/
                scope.firstArea = true;
                scope.$apply();

                serviceUtil.requestServer('/area/cameras','get',function (data) {
                    scope.cameras = data.data;
                  console.log(scope.selectedCameras)
                  console.log(scope.courseSelectedCameras)
                    for (var i = 0; i < scope.cameras.length; i++) {
                        for (var j = 0; j < scope.courseSelectedCameras.length; j++) {
                            if(scope.cameras.length == 0) {
                                return false;
                            }
                            if (scope.cameras[i].name == scope.courseSelectedCameras[j].name) {
                                scope.cameras.splice(i,1);
                            }
                        }
                    }
                    var cameras = scope.cacheCameras;
                },{gardenId:gardenId,areaCode:treeNode.id});
            }

            var firstAreaCode = null;
            function getFirstAreaCode(codeList) {
                for(var i = 0; i < codeList.length; i ++){
                    if (codeList[i].pId == '0') {
                        firstAreaCode = codeList[i].id;
                    }
                }
            }

            var checkedArea = null;
            scope.$watch('data.areaCode',function (newVal,scope) {
                var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                checkedArea = newVal||checkedArea;
                if(zTree&&checkedArea){
                    var node = zTree.getNodeByParam('id',checkedArea);
                    zTree.checkNode(node,!!newVal,true);
                }
            });

            gardenService.getGardenInfo($stateParams.gardenId, (data) =>{
                var pId = null;
                var gardenId = data.gardenId;
                var gardenName = data.gardenName;
                var rootNode = {id:0,'name':gardenName,pId:pId,gardenId:gardenId};
                serviceUtil.requestServer('/area','get',function (data) {
                    getFirstAreaCode(data.data);
                    if (angular.isArray(data.data)) {
                        data.data.unshift(rootNode);
                        var zTree = $.fn.zTree.init($(elem), setting, data.data);
                        $("#selectAll").bind("click", selectAll);
                        zTree.expandAll(true);
                        var code = null;
                        if(scope.$parent.cfgCourse&&scope.$parent.cfgCourse.areaCode||scope.data.areaCode){
                            code = scope.data.areaCode;
                            if(code){
                                var node = zTree.getNodeByParam('id',code);
                                zTree.checkNode(node,true,true);
                            }
                        }else if(!scope.$parent.cfgCourse){
                            code = scope.$parent.cfgClass.areaCode;
                            if(code){
                                var node = zTree.getNodeByParam('id',code);
                                zTree.checkNode(node,true,true);
                            }
                        }
                    }
                },{gardenId:gardenId});
            });
            // serviceUtil.requestServer('/garden/garden/gardenInfo','get',{
            //     id:$stateParams.gardenId
            // },function (data) {
            //     var pId = null;
            //     var gardenId = data.garden.id;
            //     var gardenName = data.garden.fullName;
            //     var rootNode = {id:0,'name':gardenName,pId:pId,gardenId:gardenId};
            //     serviceUtil.requestServer('/area','get',function (data) {
            //         getFirstAreaCode(data.data);
            //         if (angular.isArray(data.data)) {
            //             data.data.unshift(rootNode);
            //             var zTree = $.fn.zTree.init($(elem), setting, data.data);
            //             $("#selectAll").bind("click", selectAll);
            //             zTree.expandAll(true);
            //             var code = null;
            //             if(scope.$parent.cfgCourse&&scope.$parent.cfgCourse.areaCode||scope.data.areaCode){
            //                 code = scope.data.areaCode;
            //                 if(code){
            //                     var node = zTree.getNodeByParam('id',code);
            //                     zTree.checkNode(node,true,true);
            //                 }
            //             }else if(!scope.$parent.cfgCourse){
            //                 code = scope.$parent.cfgClass.areaCode;
            //                 if(code){
            //                     var node = zTree.getNodeByParam('id',code);
            //                     zTree.checkNode(node,true,true);
            //                 }
            //             }
            //         }
            //     },{gardenId:gardenId});
            //
            // });
        }
    }
}]);
