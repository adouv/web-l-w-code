/**
 * Created by cuishiyong on 2018/1/9.
 */
tpk_normalmanage.directive('normalmanageTree',['serviceUtil','$stateParams', 'lwGardenService',
    function(serviceUtil,$stateParams,gardenService){
        let ztree = {};
        return {
            replace:true,
            template:'<div class="normalmanageTreediv">{{data.normalType}}<ul class="ztree normalmanageTree" id="normalmanageTree"></ul></div>',
            scope:{
                nodecheck:'&nodeSelect'
            },
            link:function(scope, elem, attrs){
                if(scope.treeData)scope.treeData = [];
                let rootNode = {};
                let onCheck = (e, treeId, treeNode)=>{
                    scope.nodecheck({selectData:getSubmitData(dealCheckData(ztree.getCheckedNodes(true)))});
                };
                let onClick = (e, treeId, treeNode) => {
                    ztree.checkNode(treeNode, !treeNode.checked, true, true);
                };

                let initTree = ()=> {
                    gardenService.getGardenInfo($stateParams.gardenId, (data) =>{
                        var pId = null;
                        var gardenId = data.gardenId;
                        var gardenName = data.gardenName;
                        rootNode = {id:0,name:gardenName,pId:pId,gardenId:gardenId};
                        console.log(rootNode);
                        scope.treeData.unshift(rootNode);
                        //initTree();
                        let setting = {
                            data: {
                                simpleData: {
                                    enable: true
                                }
                            },
                            check: {
                                enable: true
                            },
                            view: {
                                showIcon: false,
                                showLine:true
                            },
                            callback: {
                                onCheck:onCheck,
                                onClick:onClick
                            }
                        };
                        ztree = $.fn.zTree.init($(elem).children().eq(0), setting, scope.treeData);
                        showTreeByLevel(true,ztree,1);
                    });
                }
                scope.$on("toTreeDataChange", function(e, m) {
                    //if(m.length==0)return;
                    scope.treeData = m;
                    initTree();
                })
            }
        };
        // 保证获得节点都是子节点
        function dealCheckData(checks){
            var result = [];
            for(var i=0;i<checks.length;i++){
                if(!checks[i].isParent)result.push(checks[i]);
            }
            return result;
        }
        // 创造请求数据
        function getSubmitData(checkary){
            var results = [];
            var splitstr = '|';
            for(var i=0;i<checkary.length;i++){
                var restultstr = '';
                if(checkary[i].level == 3){
                    restultstr = checkary[i].getParentNode().getParentNode().id+splitstr+checkary[i].getParentNode().id+splitstr+checkary[i].id;
                }else if (checkary[i].level == 2){
                    restultstr = checkary[i].getParentNode().id+splitstr+checkary[i].id+splitstr;
                }
                results.push(restultstr);
            }
            return results;
        }
        // 设置选中级别
        function showTreeByLevel(flag,treeobj,level){
            if(flag){
                var znodes = treeobj.getNodes();
                showTreeByLevel(false,znodes,level);
             }else {
                if(treeobj==null)return;
                var len=treeobj.length?treeobj.length:-1;
                checkDisable(treeobj);
                if(!(treeobj==null)&&len>0){
                    if(level<treeobj[0].level){
                        return;
                    }else{
                        for (var i = 0; i < len; i++) {
                            ztree.expandNode(treeobj[i], true, false, false, true);
                            var child=treeobj[i].children;
                            showTreeByLevel(false,child,level);//递归
                        }
                    }
                }
            }
        }

        function checkDisable(treeobj){
            for(var i=0;i<treeobj.length;i++){
                if(!checkNodeEnable(treeobj[i])){
                    ztree.setChkDisabled(treeobj[i],true);
                    document.getElementById(treeobj[i].tId).setAttribute('class','normal-tree-disable');
                }
            }
            function checkNodeEnable(node){
                if(node.level == 3){
                    return true;
                }
                if(node.children==null||node.children.length==0){
                    return false;
                }

                for(var i=0;i<node.children.length;i++){
                    if(checkNodeEnable(node.children[i]))return true;
                }
                return false;
            }

        }

}]);

tpk_normalmanage.directive('normalSelect',['serviceUtil', 'SelectPerson', function (serviceUtil, SelectPerson) {
    return {
        scope:{
            select:'=',
            type:'=',
            mode:'=',
            gardenId:'=',
            permissionIds:'=',
            disable:'=',
            refreshData:'&'
        },
        link : function (scope,elem,attrs) {
            $(elem).click(function () {
                if(scope.disable)return;
                if(scope.select==null)scope.select=[];
                var selected = [];
                var ids = [];
                for(var i=0;i<scope.select.length;i++){
                    ids.push(scope.select[i].accountId);
                }
                SelectPerson.dialog({
                    single:!attrs.multi||false,
                    ids:ids
                },(person)=>{
                    serviceUtil.requestServer('/tpk/permission/account','post',function(data){
                        scope.refreshData();
                    },{
                        type:scope.type,
                        mode:scope.mode,
                        permissionIds:scope.permissionIds.join(','),
                        gardenId:scope.gardenId,
                        accountIds:person.ids.join(',')
                    });
                });
            });
        }

    }
}]);