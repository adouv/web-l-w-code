import './repairType.css';
import repairType from './repairType.html';
export default function repairTypeDirective(RepairDictionaryInterface) {
    return {
        restrict: "AE",
        replace: true,
        template: repairType,
        scope: {
            show: "=",
            ids:'=',
            names:'=',
            chart:'&'
        },
        link($scope, ele) {
            let ztree = null;
            let selectIds = $scope.ids||'';
            /**
             * 点击文字操作
             * @param e
             * @param treeId
             * @param treeNode
             */
            let onClick = (e, treeId, treeNode) => {
                ztree.checkNode(treeNode, !treeNode.checked, true, true);
            };
            let setting = {
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                view: {
                    showLine: false
                },
                callback: {
                    onClick: onClick
                }
            };

            RepairDictionaryInterface.getProjectCategory().then(res=>{
                defaultChecked(res.data);
                ztree = $.fn.zTree.init($("#treeDemo"), setting, res.data);
            });

            let defaultChecked = (list)=>{
                list.forEach(data=>{
                    if(selectIds.indexOf(data.id)>-1){
                        data.checked = true;
                    }
                });
            };
            
            $scope.save = () => {
                let nodes = ztree.getCheckedNodes(true);
                let ids=[],names=[];
                nodes.forEach(node=>{
                    ids.push(node.id);
                    names.push(node.name);
                });
                $scope.ids = ids.toString();
                $scope.names = names.join(';');
                $scope.show = false;
                // 当选择完毕后,重新绘制折线图
                $scope.chart();
            };
            
            $scope.cancel = () => {
                $scope.show = false;
            };
        }
    }
}
repairTypeDirective.$inject = ['RepairDictionaryInterface'];