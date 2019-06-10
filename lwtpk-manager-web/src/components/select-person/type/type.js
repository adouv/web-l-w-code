/**
 * @author hejialin
 * @desc 园区类型指令
 */

import './type.css'

export default class selectGardenType {
    constructor(dictionaryService) {
        this.dictionaryService = dictionaryService;
        this.restrict = 'E';
        this.replace = true;
        this.template = `
            <div class="garden-content-left">
                <ul id="selectPersonTree" class="ztree"></ul>
            </div>
        `;
    }
    
    link(scope,elem,attrs){
        let ztree = null;
        scope.type = {ids:[]};

        /**
         * 获取树节点数据
         */
        let getTreeNodes = ()=>{
            this.dictionaryService.getGardenTypeList(res => {
                scope.type.typeList = res.data;
                scope.gardenTypeList = res.data;
            });
        };
        
        scope.$watch('type.typeList',types=>{
            if(types&&types[0]){
                initTree(types);
            }
        });
        
        /**
         * 初始化ztree
         * @param zNodes
         */
        let initTree = (zNodes)=>{
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
                    showLine:false
                },
                callback: {
                    onCheck: onCheck,
                    onClick:onClick
                }
            };
            ztree = $.fn.zTree.init($(elem).children().eq(0), setting, zNodes);
            ztree.expandAll(true);
        };

        /**
         * 选中节点后
         * @param e
         * @param treeId
         * @param treeNode
         */
        let onCheck = (e, treeId, treeNode) => {
            let nodes = ztree.getCheckedNodes(true);
            scope.type.ids = [];
            nodes.forEach(node=>{
                scope.type.ids.push(node.id);
            });
            scope.$apply();
        };

        /**
         * 点击文字操作
         * @param e
         * @param treeId
         * @param treeNode
         */
        let onClick = (e, treeId, treeNode) => {
            ztree.checkNode(treeNode, !treeNode.checked, true, true);
        };
        
        getTreeNodes();
    }
}
