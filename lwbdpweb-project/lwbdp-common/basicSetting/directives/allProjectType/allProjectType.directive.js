/*
* 所有项目类型指令
* */
export default function allProjectTypeDirective() {
    return {
        restrict: "AE",
        replace: true,
        template: `<ul id="allProjectType" class="ztree"></ul>`,
        scope: {
            forProject:"="
        },
        link($scope, elem, attr) {
            let ztree = null;
            let zNodes =$scope.forProject;
            let onClick = (e, treeId, treeNode) => {
                ztree.checkNode(treeNode, !treeNode.checked, true, true);
            };
            // 获取到选中节点的id;
            let onCheck = (e,treeId,treeNode)=>{
                let treeObj = $.fn.zTree.getZTreeObj("allProjectType"),
                    projectTypenodes = treeObj.getCheckedNodes(true),
                    v = "";
                // projectTypenodes 所选中的节点
                    console.log(projectTypenodes)
                for (var i = 0 ;i<projectTypenodes.length;i++){
                    // 选中节点的name
                    // console.log(projectTypenodes[i].name);
                    //选中节点的id
                    // console.log(projectTypenodes[i].id);
                }

            }
            let setting = {
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                check: {
                    enable: true,
                },
                view: {
                    showIcon: false,
                    showLine:false
                },
                callback: {
                    onClick: onClick,
                    onCheck: onCheck
                }

            }

                // [
               //      { id:1, pId:0, name:"随意勾选 1", open:true},
               // ];
            ztree = $.fn.zTree.init($("#allProjectType"), setting, zNodes);
        }
    }
}
allProjectTypeDirective.$inject=[];


