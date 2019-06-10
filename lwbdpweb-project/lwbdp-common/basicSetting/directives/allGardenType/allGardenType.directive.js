/*
* 所有园区类型指令
* */
export default function allGardenTypeDirective() {
    return {
        restrict: "AE",
        replace: true,
        template: `<ul id="allGardenType" class="ztree"></ul>`,
        scope:{
            forGarden : "="

        },
        link($scope, elem, attr) {
            let ztree = null;
            let zNodes = $scope.forGarden;
            let onClick = (e, treeId, treeNode) => {
                ztree.checkNode(treeNode, !treeNode.checked, true, true);
            };
            // 获取到选中节点的id;
            let onCheck = (e,treeId,treeNode)=>{
                let treeObj = $.fn.zTree.getZTreeObj("allGardenType"),
                    gardenTypenodes = treeObj.getCheckedNodes(true);
                // gardenTypenodes 所选中的节点
                    console.log(gardenTypenodes)
                for (var i = 0 ;i<gardenTypenodes.length;i++){
                //     // 选中节点的name
                    console.log(gardenTypenodes[i].name);
                //     //选中节点的id
                    console.log(gardenTypenodes[i].id);
                }

            }
            let setting = {
                data: {
                    simpleData: {
                        // 选取值为允许
                        enable: true
                    }
                },
                check: {
                    enable: true
                },
                view: {
                    showIcon: false,
                    showLine:false
                },
                callback: {
                    onClick: onClick,
                    onCheck: onCheck
                }
            };
            ztree = $.fn.zTree.init($("#allGardenType"), setting, zNodes);
        }
    }
}
allGardenTypeDirective.$inject=[];

