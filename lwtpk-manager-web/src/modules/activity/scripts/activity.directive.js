/**
 * Created by lw-yf-024 on 2017/01/12.
 */
tpk_camera.directive('areaCameraTreeInit', ['serviceUtil', 'lwUiModel', '$stateParams', '$q', 'lwGardenService', function (serviceUtil, lwUiModel, $stateParams, $q, gardenService) {
    return {
        replace: true,
        template: '<ul class="ztree" id="zTree"></ul>',
        link: function (scope, elem, attrs) {
            var setting = {
                view: {
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom,
                    selectedMulti: false,
                    showIcon: false
                },
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    removeTitle: '删除',
                    renameTitle: '编辑',
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
                    beforeDrag: function () {
                        return false;
                    }
                }
            };
            var className = "dark";
            var newCount = 0;
            var gardenId = $stateParams.gardenId;

            function beforeEditName(treeId, treeNode) {
                return true;
            }

            function beforeRemove(treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                zTree.selectNode(treeNode);
                var flag = false;
                lwUiModel.delete(function () {
                    $.ajax({
                        type: "delete",
                        contentType: "application/json; charset=utf-8",
                        url: '/lwtpk-web/area/' + treeNode.id + '?gardenId=' + gardenId + '&TOKEN=' + sessionStorage.getItem('TOKEN'),
                        async: false,
                        success: function (data) {
                            flag = !data.code;
                            flag && zTree.removeNode(treeNode);
                        }
                    });
                });
                return flag;
            }

            function onRemove(e, treeId, treeNode) {
                return false;
            }

            function beforeRename(treeId, treeNode, newName, isCancel) {
                className = (className === "dark" ? "" : "dark");
                if (newName.length == 0) {
                    setTimeout(function () {
                        var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                        zTree.cancelEditName();
                    }, 0);
                    return false;
                }
                if (('org' + (100 + newCount - 1)) == treeNode.id) {
                    serviceUtil.requestServer('/area', 'post', function (data) {
                        treeNode.id = data.data;
                    }, {pId: treeNode.pId, name: newName, gardenId: gardenId})
                } else if (treeNode.name != newName) {
                    serviceUtil.requestServer('/area', 'put', {
                        id: treeNode.id,
                        name: newName,
                        pId: newName.pId,
                        gardenId: gardenId
                    })
                }
                return true;
            }

            function beforeClick(treeId, treeNode, id) {
                scope.areaSelected = true;
                scope.areaCode = treeNode.id;
                serviceUtil.requestServer('/area/cameras', 'get', function (data) {
                    scope.selectedCameras = data.data;
                    var cameras = scope.cacheCameras;
                    if (data.data[0]) {
                        scope.cameras = [];
                        for (var j = 0, leng = cameras.length; j < leng; j++) {
                            for (var i = 0, len = data.data.length; i < len; i++) {
                                if (data.data[i].id == cameras[j].id) {
                                    break;
                                } else if (i == len - 1 && data.data[i].id != cameras[j].id) {
                                    scope.cameras.push(cameras[j]);
                                }
                            }
                        }
                    } else {
                        scope.cameras = scope.cacheCameras;
                    }
                }, {gardenId: gardenId, areaCode: treeNode.id});
            }

            function onRename(e, treeId, treeNode, isCancel) {
            }

            function showRemoveBtn(treeId, treeNode) {
                // return !treeNode.isFirstNode;x
                //return treeNode.getParentNode();
                return false;
            }

            function showRenameBtn(treeId, treeNode) {
                // return !treeNode.isFirstNode;
                return false;
            }

            function addHoverDom(treeId, treeNode) {
                return false;
                var sObj = $("#" + treeNode.tId + "_span");
                if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                    + "' title='添加' onfocus='this.blur();'></span>";
                sObj.after(addStr);
                var btn = $("#addBtn_" + treeNode.tId);
                if (btn) btn.bind("click", function () {
                    var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                    var cNode = zTree.addNodes(treeNode, {
                        id: 'org' + (100 + newCount),
                        pId: treeNode.id,
                        name: "新建组织结构" + (newCount++)
                    });
                    zTree.editName(cNode[0]);
                    return false;
                });
            };

            function removeHoverDom(treeId, treeNode) {
                $("#addBtn_" + treeNode.tId).unbind().remove();
            };

            function selectAll() {
                var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
            }

            gardenService.getGardenInfo($stateParams.gardenId, (data) => {
                var pId = null;
                var gardenId = data.gardenId;
                var gardenName = data.gardenName;
                var rootNode = {id: 0, 'name': gardenName, pId: pId, gardenId: gardenId};
                serviceUtil.requestServer('/area', 'get', function (data) {
                    data.data.unshift(rootNode);
                    var zTree = $.fn.zTree.init($(elem), setting, data.data);
                    $("#selectAll").bind("click", selectAll);
                    zTree.expandAll(true);
                }, {gardenId: gardenId});
            });
            // serviceUtil.requestServer('/garden/garden/gardenInfo', 'get', function (data) {
            //   var pId = null;
            //   var gardenId = data.garden.id;
            //   var gardenName = data.garden.fullName;
            //   var rootNode = {id: 0, 'name': gardenName, pId: pId, gardenId: gardenId};
            //   serviceUtil.requestServer('/area', 'get', function (data) {
            //     data.data.unshift(rootNode);
            //     var zTree = $.fn.zTree.init($(elem), setting, data.data);
            //     $("#selectAll").bind("click", selectAll);
            //     zTree.expandAll(true);
            //   }, {gardenId: gardenId});
            // }, {id: $stateParams.gardenId});
        }
    }
}]);


tpk_camera.directive('accountTreeInit', ['serviceUtil', 'lwUiModel', '$stateParams', '$q', 'lwGardenService', function (serviceUtil, lwUiModel, $stateParams, $q, gardenService) {
    return {
        replace: true,
        template: '<ul class="ztree" id="zTree"></ul>',
        link: function (scope, elem, attrs) {
            var setting = {
                view: {
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom,
                    selectedMulti: false,
                    showIcon: false
                },
                edit: {
                    enable: true,
                    editNameSelectAll: true,
                    removeTitle: '删除',
                    renameTitle: '编辑',
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
                    beforeDrag: function () {
                        return false;
                    }
                }
            };
            var className = "dark";
            var newCount = 0;
            var gardenId = $stateParams.gardenId;

            function beforeEditName(treeId, treeNode) {
                return true;
            }

            function beforeRemove(treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                zTree.selectNode(treeNode);
                var flag = false;
                lwUiModel.delete(function () {
                    $.ajax({
                        type: "delete",
                        contentType: "application/json; charset=utf-8",
                        url: '/lwtpk-web/area/' + treeNode.id + '?gardenId=' + gardenId + '&TOKEN=' + sessionStorage.getItem('TOKEN'),
                        async: false,
                        success: function (data) {
                            flag = !data.code;
                            flag && zTree.removeNode(treeNode);
                        }
                    });
                });
                return flag;
            }

            function onRemove(e, treeId, treeNode) {
                return false;
            }

            function beforeRename(treeId, treeNode, newName, isCancel) {
                className = (className === "dark" ? "" : "dark");
                if (newName.length == 0) {
                    setTimeout(function () {
                        var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                        zTree.cancelEditName();
                    }, 0);
                    return false;
                }
                if (('org' + (100 + newCount - 1)) == treeNode.id) {
                    serviceUtil.requestServer('/area', 'post', function (data) {
                        treeNode.id = data.data;
                    }, {pId: treeNode.pId, name: newName, gardenId: gardenId})
                } else if (treeNode.name != newName) {
                    serviceUtil.requestServer('/area', 'put', {
                        id: treeNode.id,
                        name: newName,
                        pId: newName.pId,
                        gardenId: gardenId
                    })
                }
                return true;
            }

            function beforeClick(treeId, treeNode, id) {
                scope.areaSelected = true;
                scope.areaCode = treeNode.id;
                serviceUtil.requestServer('/area/cameras', 'get', function (data) {
                    scope.selectedCameras = data.data;
                    var cameras = scope.cacheCameras;
                    if (data.data[0]) {
                        scope.cameras = [];
                        for (var j = 0, leng = cameras.length; j < leng; j++) {
                            for (var i = 0, len = data.data.length; i < len; i++) {
                                if (data.data[i].id == cameras[j].id) {
                                    break;
                                } else if (i == len - 1 && data.data[i].id != cameras[j].id) {
                                    scope.cameras.push(cameras[j]);
                                }
                            }
                        }
                    } else {
                        scope.cameras = scope.cacheCameras;
                    }
                }, {gardenId: gardenId, areaCode: treeNode.id});
            }

            function onRename(e, treeId, treeNode, isCancel) {
            }

            function showRemoveBtn(treeId, treeNode) {
                // return !treeNode.isFirstNode;x
                //return treeNode.getParentNode();
                return false;
            }

            function showRenameBtn(treeId, treeNode) {
                // return !treeNode.isFirstNode;
                return false;
            }

            function addHoverDom(treeId, treeNode) {
                return false;
                var sObj = $("#" + treeNode.tId + "_span");
                if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                    + "' title='添加' onfocus='this.blur();'></span>";
                sObj.after(addStr);
                var btn = $("#addBtn_" + treeNode.tId);
                if (btn) btn.bind("click", function () {
                    var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                    var cNode = zTree.addNodes(treeNode, {
                        id: 'org' + (100 + newCount),
                        pId: treeNode.id,
                        name: "新建组织结构" + (newCount++)
                    });
                    zTree.editName(cNode[0]);
                    return false;
                });
            };

            function removeHoverDom(treeId, treeNode) {
                $("#addBtn_" + treeNode.tId).unbind().remove();
            };

            function selectAll() {
                var zTree = $.fn.zTree.getZTreeObj(elem[0].id);
                zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
            }

            gardenService.getGardenInfo($stateParams.gardenId, (data) => {
                var pId = null;
                var gardenId = data.gardenId;
                var gardenName = data.gardenName;
                var rootNode = {id: 0, 'name': gardenName, pId: pId, gardenId: gardenId};
                serviceUtil.requestServer('/area', 'get', function (data) {
                    data.data.unshift(rootNode);
                    var zTree = $.fn.zTree.init($(elem), setting, data.data);
                    $("#selectAll").bind("click", selectAll);
                    zTree.expandAll(true);
                }, {gardenId: gardenId});
            });
            // serviceUtil.requestServer('/garden/garden/gardenInfo', 'get', function (data) {
            //   var pId = null;
            //   var gardenId = data.garden.id;
            //   var gardenName = data.garden.fullName;
            //   var rootNode = {id: 0, 'name': gardenName, pId: pId, gardenId: gardenId};
            //   serviceUtil.requestServer('/area', 'get', function (data) {
            //     data.data.unshift(rootNode);
            //     var zTree = $.fn.zTree.init($(elem), setting, data.data);
            //     $("#selectAll").bind("click", selectAll);
            //     zTree.expandAll(true);
            //   }, {gardenId: gardenId});
            // }, {id: $stateParams.gardenId});
        }
    }
}]);

tpk_organization.directive('activityGardenSelect', ['serviceUtil', '$msg', 'SelectPerson', function (serviceUtil, $msg, SelectPerson) {
    return {
        link: function (scope, elem, attrs) {
            $(elem).click(function () {
                if (scope.activity.publicScope == 2) {
                    scope.activity.publicIds = [];
                    var selected = [];
                    for (var i = 0; i < scope.activity.publicList.length; i++) {
                        selected.push(scope.activity.publicList[i].id);
                    }
                    SelectPerson.dialog({
                        single: !attrs.multi || false,
                        ids: selected
                    }, (person) => {
                        var publicList = [];
                        for (var i = 0, len = person.personList.length; i < len; i++) {
                            if (person.personList[i].id && i != 0) {
                                scope.activity.publicIds = scope.activity.publicIds + "," + person.personList[i].id;
                                publicList.push({id: person.personList[i].id, name: person.personList[i].name});
                            }
                            if (person.personList[i].id && i == 0) {
                                scope.activity.publicIds = person.personList[i].id;
                                publicList.push({id: person.personList[i].id, name: person.personList[i].name});
                            }
                        }
                        if (publicList.length == 0) {
                            $msg.error('当前没有选择任何用户');
                            return false;
                        }
                        scope.activity.publicList = publicList;
                    });
                }
            });
        }
    }
}]);
