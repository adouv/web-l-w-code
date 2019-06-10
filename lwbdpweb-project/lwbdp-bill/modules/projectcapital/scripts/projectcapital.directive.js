var bdp_projectcapital = angular.module('bdp.projectcapital');
bdp_projectcapital.directive('showTrs', [function () {
    return {
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                var box = $(this).parents("tr").siblings();
                if ($(this).hasClass("cur")) {
                    box.hide();
                    $(this).removeClass("cur");
                } else {
                    box.show();
                    $(this).addClass("cur");
                }
            });
        }
    }
}]);
bdp_projectcapital.directive('showMessage',  ['$timeout', function ($timeout)  {
    return {
        replace: true,
        template:"<span class='billiconfont icon_prompt' style='font-size: 16px'></span>",
        link: function (scope, elem, attrs) {
            $(".operate_prompt").hide();
            elem.on("click",function(){
                $timeout(function(){
                    $(".operate_prompt").show();
                },200)
            });
            $(document).on('click',function(e){
            	e.stopPropagation();
            	if(!$(".operate_prompt").is(":hidden")){
            		$(".operate_prompt").hide();
            	}
            })
        }
    }
}]);
bdp_projectcapital.directive('zTree', ['serviceUtil','$timeout', function (serviceUtil,$timeout) {
    return {
        scope: false,
        replace: true,
        template: require('../views/projectcapital.incurExpense.html'),
        link: function (scope, elem, attrs) {
            var pidArr = [];
            bulidSelectBox();
            var name = attrs.setname,expenseTypeName;
            scope.showName = null;
            scope.showExpense=function () {
                scope.expenseTypeItemName = expenseTypeName;
            }
            serviceUtil.requestServer(
                '/bill/payout/expenseType', 'get',
                function (data) {
                    scope.canUseData = data;
                    angular.forEach(scope.canUseData, function (v, k) {
                        if (v.pId) {
                            pidArr.push(v.pId);
                        }
                    });
                    angular.forEach(scope.canUseData, function (v, k) {
                        if (pidArr.indexOf(v.id) != -1) {
                            scope.canUseData[k].nocheck = true;
                        }
                    });
                    bulidSelectBox();
                });
            function bulidSelectBox() {
                //构建树结构
                bulidZtreeBox();
                expandAll();
            }

            // 构建树状结构
            function bulidZtreeBox(mofile) {
                var setting = {
                    check: {
                        enable: true,
                        chkStyle: "radio",
                        radioType: "all"
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    view: {
                        showIcon: false,  //不显示图标
                        showLine: false
                    },
                    callback: {
                        onCheck: onCheck,
                        beforeMouseDown: zTreeBeforeMouseDown,
                        beforeClick: beforeClick
                    }
                };
                $.fn.zTree.init($("#nameTree"), setting, scope.canUseData);
                $(".tree").find("a").attr("href", "javascript:void(0);");
            }

            function expandAll(treeId, treeNode) {
                if ($("#nameTree").length != 0) {
                    var zTree = $.fn.zTree.getZTreeObj("nameTree");
                    /*zTree.expandAll(true);*/
                }
            }

            function zTreeBeforeMouseDown(treeId, treeNode) {
                return false;
            }

            function onCheck(event, treeId, treeNode) {
                var treeObj = $.fn.zTree.getZTreeObj("nameTree");
                var nodes = treeObj.getCheckedNodes();
                if (nodes.length > 0) {
                    var name = nodes[0]['name'];//获取当前选中节点
                    var pnode = nodes[0].getParentNode();
                    getParentNodes(pnode, name);
                } else {
                    scope.expenseTypeItemName = null;
                }
                scope.expenseTypeItemId = scope.$parent.expenseTypeItemId = treeNode.id;
                scope.$apply();
            }

            //获取所有父元素名称
            function getParentNodes(pnode, name) {
                if (pnode.getParentNode() !== null) {
                    name = pnode['name'] + ' - ' + name;
                    curNode = pnode.getParentNode();
                    getParentNodes(curNode, name);
                } else {
                    //根节点
                    expenseTypeName = pnode['name'] + ' - ' + name;
                }
            }

            // 点击文字选中checkbox框
            function beforeClick(treeId, treeNode) {
                if (treeNode.isParent) {
                    return false;
                }
                var zTree = $.fn.zTree.getZTreeObj("nameTree");
                zTree.checkNode(treeNode, true, null, true);
            }

            $("#treeData").on('click', function (e) {
                $("#show_tree").show();
                $timeout(function () {
                    $('#back').show();
                },200)
                e.stopPropagation();
            });
            $("#show_tree").on('click', function (e) {
                e.stopPropagation();
            });
            // $(".income_title").on('click',function(e){
            // 	if(!$("#show_tree").is(":hidden")){
            // 		$("#show_tree").hide();
            // 	}
            // })
        }
    }
}]);

bdp_projectcapital.directive('incomeTree', ['serviceUtil', function (serviceUtil) {
    return {
        scope: false,
        link: function (scope, elem, attrs) {
            var ztreeId = attrs.id,
                url = attrs.url;
            scope.incomeTreeInit = function (params) {
                serviceUtil.requestServer(
                    url, 'get',
                    function (data) {
                        scope.canUseData = data;
                        bulidSelectBox();
                    }, params);
            };
            scope.incomeTreeInit();
            function bulidSelectBox() {
                //构建树结构
                bulidZtreeBox();
            }

            // 构建树状结构
            function bulidZtreeBox(mofile) {
                var setting = {
                    check: {
                        chkDisabledInherit: true,
                        chkStyle: 'checkbox',
                        enable: true,
                        chkboxType: {"Y": "s"}
                    },
                    data: {
                        simpleData: {
                            enable: false
                        },
                        key: {
                            name: 'nameAndCounts'
                        }
                    },
                    view: {
                        showIcon: false,  //不显示图标
                        showLine: false
                    },
                    callback: {
                        onCheck: onCheck,
                        beforeMouseDown: zTreeBeforeMouseDown,
                        beforeClick: beforeClick
                    }
                };
                $.fn.zTree.init($("#" + ztreeId), setting, scope.canUseData);
                $(".tree").find("a").attr("href", "javascript:void(0);");
            }

            function zTreeBeforeMouseDown(treeId, treeNode) {
                return false;
            }

            function onCheck(event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(ztreeId);
                nodeSelected(zTree, treeNode.getParentNode(), true);
            }

            // 点击文字选中checkbox框
            function beforeClick(treeId, treeNode) {
                scope.multipleChooseOrderTypeForHitsPayout = null;
                scope.multipleChooseOrderTypeForPayout = null;
                scope.payoutMultipleChooseContext = [];
                if (scope.condition.sourceTypeIdList) {
                    scope.condition.multipleChooseContext = [];
                    scope.condition.multipleChooseOrderType = [];
                    scope.removePayoutTree();
                }
                scope.removeNode = removeCheckedNode;
                var zTree = $.fn.zTree.getZTreeObj(ztreeId);
                !treeNode.checked && zTree.checkNode(treeNode, !treeNode.checked, true);
                nodeSelected(zTree, treeNode.getParentNode());
            }

            var removeCheckedNode = function (node) {
                var zTree = $.fn.zTree.getZTreeObj(ztreeId);
                zTree.checkNode(node, false, true);
                scope.selectedIds.splice(scope.selectedIds.indexOf(node.id), 1);
                var nodes = zTree.getCheckedNodes(true);
                scope.optionTypeList = nodes;
                scope.condition.sourceTypeIdList = scope.selectedIds;
                scope.$parent.pageSearch();
                scope.refreshSourceNum();
            };

            function nodeSelected(zTree, parentNode, isCancel) {
                var otherTree = $.fn.zTree.getZTreeObj("expenseType");
                var otherNodes = otherTree.getCheckedNodes(true);
                if (otherNodes.length > 0) {
                    otherTree.checkAllNodes(false);
                }
                var nodes = zTree.getCheckedNodes(true);
                scope.selectedIds = [];
                isCancel && parentNode && cancel(zTree, parentNode);
                for (var i = 0, len = nodes.length; i < len; i++) {
                    if (nodes[i].checked) {
                        scope.selectedIds.push(nodes[i].id);
                    }
                }
                scope.optionTypeList = nodes;
                !isCancel && parentNode && selected(zTree, parentNode);
                scope.condition.sourceTypeIdList = scope.selectedIds;
                scope.$parent.pageSearch();
                scope.refreshSourceNum();
                scope.$apply();
            }

            function cancel(zTree, parentNode) {
                zTree.checkNode(parentNode, false, false);
                var newNodes = zTree.getCheckedNodes(true)
                scope.optionTypeList = newNodes;
                scope.selectedIds.splice(scope.selectedIds.indexOf(parentNode.id), 1);
            }

            scope.removeIncomeTree = function () {
                var treeObj = $.fn.zTree.getZTreeObj(ztreeId);
                treeObj.checkAllNodes(false);
                scope.condition.sourceTypeIdList = [];
            };
            function selected(zTree, parentNode) {
                var flag = true;
                for (var i = 0, len = parentNode.children.length; i < len; i++) {
                    if (scope.selectedIds.indexOf(parentNode.children[i].id) < 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    zTree.checkNode(parentNode, true, true);
                    scope.selectedIds.push(parentNode.id);
                    var newNodes = zTree.getCheckedNodes(true);
                    scope.optionTypeList = newNodes;
                }
            }
        }
    }
}]);
bdp_projectcapital.directive('payoutTree', ['serviceUtil', function (serviceUtil) {
    return {
        scope: false,
        link: function (scope, elem, attrs) {
            var ztreeId = attrs.id,
                url = attrs.url;

            scope.payoutTreeInit = function (params) {
                serviceUtil.requestServer(
                    url, 'get',
                    function (data) {
                        scope.expenseTypeGroupNumList = data;
                        bulidSelectBox();
                    }, params);
            };
            scope.payoutTreeInit();
            function bulidSelectBox() {
                //构建树结构
                bulidZtreeBox();
            }

            // 构建树状结构
            function bulidZtreeBox(mofile) {
                var setting = {
                    check: {
                        chkDisabledInherit: true,
                        chkStyle: 'checkbox',
                        enable: true,
                        chkboxType: {"Y": "s"}
                    },
                    data: {
                        simpleData: {
                            enable: false
                        },
                        key: {
                            name: 'nameAndCounts'
                        }
                    },
                    view: {
                        showIcon: false,  //不显示图标
                        showLine: false
                    },
                    callback: {
                        onCheck: onCheck,
                        beforeMouseDown: zTreeBeforeMouseDown,
                        beforeClick: beforeClick
                    }
                };
                $.fn.zTree.init($("#" + ztreeId), setting, scope.expenseTypeGroupNumList);
                $(".tree").find("a").attr("href", "javascript:void(0);");
            }

            function zTreeBeforeMouseDown(treeId, treeNode) {
                return false;
            }

            function onCheck(event, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj(ztreeId);
                nodeSelected(zTree, treeNode.getParentNode(), true);
            }

            scope.removePayoutTree = function () {
                var treeObj = $.fn.zTree.getZTreeObj(ztreeId);
                treeObj.checkAllNodes(false);
                scope.condition.expenseTypeIdList = [];
            };
            // 点击文字选中checkbox框
            function beforeClick(treeId, treeNode) {
                scope.multipleChooseOrderTypeForIncome = null;
                scope.multipleChooseOrderTypeForHitsIncome = null;
                scope.incomeMultipleChooseContext = [];
                if (scope.condition.expenseTypeIdList) {
                    scope.removeIncomeTree();
                    scope.condition.multipleChooseContext = [];
                    scope.condition.multipleChooseOrderType = [];
                }
                scope.removeNode = removeCheckedPayNode;
                var zTree = $.fn.zTree.getZTreeObj(ztreeId);
                !treeNode.checked && zTree.checkNode(treeNode, !treeNode.checked, true);
                nodeSelected(zTree, treeNode.getParentNode());
            }

            var removeCheckedPayNode = function (node) {
                var zTree = $.fn.zTree.getZTreeObj(ztreeId);
                zTree.checkNode(node, false, true);
                scope.selectedIds.splice(scope.selectedIds.indexOf(node.id), 1);
                var nodes = zTree.getCheckedNodes(true);
                scope.optionTypeList = nodes;
                scope.condition.expenseTypeIdList = scope.selectedIds;
                scope.$parent.pageSearch();
                scope.refreshSourceNum();
            };

            function nodeSelected(zTree, parentNode, isCancel) {
                var otherTree = $.fn.zTree.getZTreeObj("sourceList");
                var otherNodes = otherTree.getCheckedNodes(true);
                if (otherNodes.length > 0) {
                    otherTree.checkAllNodes(false);
                }
                var nodes = zTree.getCheckedNodes(true);
                scope.optionTypeList = nodes;
                scope.selectedIds = [];
                isCancel && parentNode && cancel(zTree, parentNode);
                for (var i = 0, len = nodes.length; i < len; i++) {
                    if (nodes[i].checked) {
                        scope.selectedIds.push(nodes[i].id)
                    }
                }
                !isCancel && parentNode && selected(zTree, parentNode);
                scope.condition.expenseTypeIdList = scope.selectedIds;
                scope.$parent.pageSearch();
                scope.refreshSourceNum();
                scope.$apply();
            }

            function cancel(zTree, parentNode) {
                zTree.checkNode(parentNode, false, false);
                var newNodes = zTree.getCheckedNodes(true);
                scope.optionTypeList = newNodes;
                scope.selectedIds.splice(scope.selectedIds.indexOf(parentNode.id), 1);
            }

            function selected(zTree, parentNode) {
                var flag = true;
                for (var i = 0, len = parentNode.children.length; i < len; i++) {
                    if (scope.selectedIds.indexOf(parentNode.children[i].id) < 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    zTree.checkNode(parentNode, true, true);
                    scope.selectedIds.push(parentNode.id);
                    var newNodes = zTree.getCheckedNodes(true);
                    scope.optionTypeList = newNodes;
                }
            }
        }
    }
}]);
