/**
 * Created by lw-yf-015 on 2016/12/3.
 */
tpk_organization.directive('organizationTreeInit',['serviceUtil','lwUiModel','$stateParams','permissions','$msg', 'lwGardenService', function (serviceUtil,lwUiModel,$stateParams,permissions,$msg, gardenService) {
    return {
        replace:true,
        template:'<ul class="ztree" id="zTree"></ul>',
        link: function (scope, elem, attrs) {
            var setting = {
                view: {
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom,
                    selectedMulti: false,
                    showIcon:false
                },
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    removeTitle:'删除',
                    renameTitle:'编辑',
                    showRemoveBtn: showRemoveBtn,
                    showRenameBtn: showRenameBtn
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeEditName: beforeEditName,
                    beforeRemove: beforeRemove,
                    beforeRename: beforeRename,
                    onRemove: onRemove,
                    onRename: onRename,
                    beforeClick: beforeClick,
                    beforeDrag:function(){return false;}
                }
            };
            var className = "dark";
            var newCount = 0;
            var gardenId = $stateParams.gardenId;
            function beforeEditName(treeId, treeNode) {
                /*className = (className === "dark" ? "":"dark");
                var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                zTree.selectNode(treeNode);
                setTimeout(function() {
                    if (confirm("Start node '" + treeNode.name + "' editorial status?")) {
                        setTimeout(function() {
                            zTree.editName(treeNode);
                        }, 0);
                    }
                }, 0);*/
                return true;
            }
            function beforeRemove(treeId, treeNode) {
                className = (className === "dark" ? "":"dark");
                var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                zTree.selectNode(treeNode);
                className = (className === "dark" ? "":"dark");
                var flag = false;
                lwUiModel.delete(function () {
                    $.ajax({
                        type: "delete",
                        contentType: "application/json; charset=utf-8",
                        url: '/lwtpk-web/organization/'+treeNode.id+'?gardenId='+gardenId+'&TOKEN='+sessionStorage.getItem('TOKEN'),
                        async: false,
                        success: function(data) {
                            flag = !data.code;
                            flag&&zTree.removeNode(treeNode);
                            if(!flag){
                              $msg.error(data.msg);
                            }
                        }
                    });
                });
                return flag;
                // return confirm("Confirm delete node '" + treeNode.name + "' it?");
            }
            function onRemove(e, treeId, treeNode) {
                return false;
            }
            function beforeRename(treeId, treeNode, newName, isCancel) {
                className = (className === "dark" ? "":"dark");
                if (newName.length == 0) {
                    setTimeout(function() {
                        var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                        zTree.cancelEditName();
                        alert("节点名称不能为空！");
                    }, 0);
                    return false;
                }
                if(('org'+(100 + newCount-1))==treeNode.id){
                    serviceUtil.requestServer('/organization','post',function (data) {
                        treeNode.id = data.data;
                    },{pid:treeNode.pId,name:newName,gardenId:gardenId})
                }else if(treeNode.name!=newName){
                    serviceUtil.requestServer('/organization','put',{id:treeNode.id,name:newName})
                }
                return true;
            }
            function beforeClick(treeId,treeNode,id) {
                scope.organizationId = treeNode.id;
                scope.isAssign = true;
                serviceUtil.requestServer('/organization/teachers/'+treeNode.id,'get',function (data) {
                    scope.teachers = data.data;
                });
                serviceUtil.requestServer('/organization/subjects','get',function (data) {
                    scope.subjects = data.data;
                },{gradeId:treeNode.id});
            }
            function onRename(e, treeId, treeNode, isCancel) {
                console.log('正在编辑……')
            }
            function showRemoveBtn(treeId, treeNode) {
                // return !treeNode.isFirstNode;
                //if (permissions.hasPermission('organization:delete')) {
                    return treeNode.getParentNode();
                //}
            }
            function showRenameBtn(treeId, treeNode) {
                // return !treeNode.isFirstNode;
                //if (permissions.hasPermission('organization:delete')) {
                    return treeNode.getParentNode();
                //}
            }

            function addHoverDom(treeId, treeNode) {
                var sObj = $("#" + treeNode.tId + "_span");
                // || !permissions.hasPermission('organization:create')
                if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0 || (treeNode.pId && !treeNode.isParent)  ) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                    + "' title='添加组织结构' onfocus='this.blur();' ></span>";
                sObj.after(addStr);
                var btn = $("#addBtn_"+treeNode.tId);
                if (btn) btn.bind("click", function(){
                    var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                    var cNode = zTree.addNodes(treeNode, {id:'org'+(100 + newCount), pId:treeNode.id, name:"新建组织结构" + (newCount++)});
                    zTree.editName(cNode[0]);
                    console.log(treeNode)
                    return false;
                });
            };
            function removeHoverDom(treeId, treeNode) {
                $("#addBtn_"+treeNode.tId).unbind().remove();
            };
            function selectAll() {
                var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
            }

            gardenService.getGardenInfo($stateParams.gardenId, (data) =>{
                var pId = null;
                var gardenId = data.gardenId;
                var gardenName = data.gardenName;
                var rootNode = {id:0,'name':gardenName,pId:pId,gardenId:gardenId};
                serviceUtil.requestServer('/organization/garden/'+gardenId,'get',function (data) {
                    data.data.unshift(rootNode);
                    console.log(data.data);
                    var zTree = $.fn.zTree.init($(elem), setting, data.data);
                    $("#selectAll").bind("click", selectAll);
                    zTree.expandAll(true)
                });
            });
            // serviceUtil.requestServer('/garden/garden/gardenInfo','get',function (data) {
            //
            // },{id:$stateParams.gardenId});
        }
    }
}]);

tpk_organization.directive('gardenSelect',['serviceUtil','$msg', 'SelectPerson', function (serviceUtil,$msg, SelectPerson) {
    return {
        link : function (scope,elem,attrs) {
            $(elem).click(function () {
                var selected = [];
                for(var i=0,len=scope.teachers.length;i<len;i++){
                    selected.push(scope.teachers[i].teacherId);
                }
                var rensId = [], teachers = [];

                SelectPerson.dialog({
                    single:!attrs.multi||false,
                    ids:selected
                },(person)=>{
                    for (var i = 0, len = person.personList.length; i < len; i++) {
                        rensId.push(person.personList[i].id);
                        teachers.push({teacherId:person.personList.id,teacherName:person.personList.name});
                    }
                    setTimeout(function () {
                        serviceUtil.requestServer('/organization/teacher','post',function () {
                            $msg.success();
                        },{teacherIds:rensId.toString(),organizationId:scope.organizationId})
                        scope.teachers = teachers;
                    }, 100);
                });
                // var simpleParams = {
                //     selected: selected,
                //     multi: attrs.multi || false,//是否多选
                //     successFn: function (data) {
                //         for (var i = 0, len = data.length; i < len; i++) {
                //             rensId.push(data[i].id);
                //             teachers.push({teacherId:data[i].id,teacherName:data[i].name});
                //         }
                //         setTimeout(function () {
                //             serviceUtil.requestServer('/organization/teacher','post',function () {
                //                 $msg.success();
                //             },{teacherIds:rensId.toString(),organizationId:scope.organizationId})
                //             scope.teachers = teachers;
                //         }, 100);
                //     }
                // };
                // $.accountSelector(simpleParams);
            });
        }

    }
}]);
// camera:list,area:delete,liveActivity:delete,courseTable:create,camera:sync,cameraArea:assign,liveActivity:update,timeTable:update,timeTable:create,area:create,courseTable:export,timeTable:list,streamMedia:list,unicastActivity:delete,unicastActivity:update,streamMedia:update,unicastActivity:create,courseTable:update,organization:update,streamMedia:create,timeTable:delete,organization:create,organization:subject,area:update,streamMedia:delete,organization:account,liveActivity:list,area:list,courseTable:import,courseTable:sync,organization:delete,liveActivity:create,unicastActivity:list
