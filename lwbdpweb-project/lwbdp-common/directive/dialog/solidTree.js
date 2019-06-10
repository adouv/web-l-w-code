/**
 * Created by lw-yf-011 on 2017/7/13.
 * 立体树弹窗(zTree弹窗)
 */
export default function solidTreeDirective() {
    return {
        restrict: "AE",
        replace: true,
        template: `<div id="treeDemo" class="ztree"></div>`,
        scope: {
            list: '=', //初始化zTree的数据
            typeName: '=', //选中的节点名称
            typeId: '=', //选中的节点id
            single: '='
        },
        link($scope, ele) {
            let ztree = null;
            /**
             * 点击文字操作
             * @param e
             * @param treeId
             * @param treeNode
             */
            let onClick = (e, treeId, treeNode) => {
                ztree.checkNode(treeNode, !treeNode.checked, true, true);
                clickNode();
            };

            /*
             * 获取选中的节点名称及id
             * */
            let clickNode = () => {
                let nodes = ztree.getCheckedNodes(true);
                let ids = [];
                let names = [];
                nodes.forEach(node => {
                    ids.push(node.id);
                    names.push(node.name)
                });
                if(names.length > 1){
                    $scope.typeName = names.join('；')+"；";
                }else if(names.length === 1){
                    $scope.typeName = names.join('')+'；';
                }else if(names.length === 0){
                    $scope.typeName = names.join('')
                }
                $scope.typeId = ids;
                $scope.$apply();
            };
            $scope.$watch('$scope.list', () => {
                initTree();
            });

            let setting = {
                check: {
                    chkStyle: $scope.single,
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
                    onClick: onClick,
                    onCheck: clickNode
                }
            };
            if ($scope.single) {
                setting.check.chkStyle = "radio";
                setting.check.radioType = "all";
            }else{
                setting.check.chkStyle = "checkbox";
            }
            /*
             * 初始化zTree
             * */
            let initTree = () => {
                ztree = $.fn.zTree.init($("#treeDemo"), setting, $scope.list);
                $scope.typeId&&echoNode();
            };
            /*
             * 初始化时,对选中的节点进行回显
             * */
            let echoNode = () => {
                let checkedNodeArr = $scope.typeId ? $scope.typeId : '';
                if($scope.single){
                    let checkedNode = ztree.getNodeByParam('id', checkedNodeArr, null);
                    ztree.checkNode(checkedNode, true, true);
                }else{
                    for (let index in checkedNodeArr) {
                        let checkedNode = ztree.getNodeByParam('id', checkedNodeArr[index], null);
                        ztree.checkNode(checkedNode, true, true);
                    }
                }
            };
        }
    }
}