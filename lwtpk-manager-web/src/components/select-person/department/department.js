/**
 * @author hejialin
 * @desc 部门条件选择指令
 */
import './department.css';

export default class selectDepartmentTree{
    constructor($timeout){
        this.restrict = 'E';
        this.replace = true;
        this.$timeout = $timeout;
        this.template = `
            <div class="garden-content-left department-tree">
                <ul id="selectDepartmentTree" class="ztree"></ul>
            </div>
        `;
    }
    
    link(scope,elem,attrs){
        let ztree = null;
        scope.department = {ids:[]};
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
                callback:{
                    onCheck:onCheck,
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
            scope.department.ids = [];
            nodes.forEach(node=>{
                scope.department.ids.push(node.id);
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
        scope.$watch('person.personList',list=>{
            if(list&&list[0]){
                echoDepartment(getDepartmentId(list));
            }
        });
        /**
         * 添加树节点数据监听（数据改变自动改变树结构）
         */
        scope.$watch('department.departmentList',list=>{
            if(list&&list[0]){
                initTree(list);
            }
        });
        
        let getDepartmentId = (personList)=>{
            let departmentIds = [];
            personList.forEach(person=>{
                departmentIds.push(person.pId);
            });
            departmentIds = departmentIds.toString().split(',');
            return Array.from(new Set(departmentIds));
        };
       
        /**
         * 回显部门
         * @param departmentList
         */
        let echoDepartment = (departmentIds)=>{
            if(ztree&&departmentIds&&departmentIds[0]){
                let echoIds = departmentIds;
                this.$timeout(()=>{
                    for(let id of echoIds){
                        let node = ztree.getNodeByParam("id", id, null);
                        ztree.checkNode(node, true, true, true);
                    }
                },100);
            }
        }
    }
}