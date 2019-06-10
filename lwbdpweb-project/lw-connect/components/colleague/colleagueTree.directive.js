import './colleagueTree.css';
export default function colleagueTreeDirective($config){
    return {
        restrict : "E",
        replace : "true",
        template : `<div class="person_tree">
                        <ul id="colleagueTree" class="ztree colleague_tree origin_tree"></ul>
                        <ul id="colleagueResultTree" class="ztree colleague_tree colleague_result_tree"></ul>
                    </div>`,
        link(scope,elem,attrs){
            let ztree = null,
                parentsArr = [],
                parentsName = '',
                resultTree = null,
                timer = null,
                listData = null; //部门名称
                let filePath = $config.file.SHOWIMG;
            /**
             * 点击文字操作
             * @param e
             * @param treeId
             * @param treeNode
             */
            let onClick = (e, treeId, treeNode) => {
                // 判断点击的是否是搜索结果
                let isResult = treeNode.tId.indexOf("Result") >-1,
                    originNode = treeNode;
                console.log("shi"+isResult)
                parentsName = '';
                parentsArr = [];
                let showName = 'detail';
                if(isResult){
                    showName = 'result_detail';
                 }
                // 如果当前节点不是父节点
                if(!treeNode.isParent){
                    // 遍历父节点数组,取出每个的id,name放入一个对象,由一个数组包裹
                    treeNode.pIdArr.forEach(function(element) {
                        let parentNode = ztree.getNodeByParam('id',element,null);
                        let obj = {};
                        obj.id = parentNode.id;
                        parentsName = '';
                        getParentsName(parentNode,parentsName);
                        obj.name = parentsName; 
                        parentsArr.push(obj);
                    });
                    // 为当前选中节点的parentsArr赋值
                    treeNode.parentsArr = parentsArr;
                    // 调用controller中的方法,展示右侧数据
                    scope.showDetail(treeNode,showName);
                }else{
                    // 如果当前节点是父节点 并且点击的是搜索结果
                    if(isResult){
                        // 在搜索结果的树上,展开这个节点
                        resultTree.expandNode(originNode);
                    }else{
                        // 在完整树上,展开这个节点
                        ztree.expandNode(treeNode);
                    }
                    let name = '';
                    // 如果当前节点不是根节点
                    if(treeNode.level !== 0){
                        // 获取所有父节点的名称(parentsName)
                        getParentsName(treeNode.getParentNode(),name);
                    }
                    let ids = [];
                    // 获取节点总人数(ids数组)
                    getAllPersonByDepartment(treeNode,ids);
                    let group =  {
                        id : treeNode.id,
                        num : ids.length,
                        parentsName : parentsName,
                        name :  treeNode.name,
                        type:'group'
                    };
                    scope.showDetail(group,showName);
                }
            };
            /**
             * 初始化ztree
             * @param {*} zNodes 数据 
             */
            let initTree = (zNodes)=>{
                let setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    check: {
                        enable: false
                    },
                    view: {
                        showIcon: false,
                        showLine:false,
                        dblClickExpand : false,
                        addDiyDom: addDiyDom,
                    },
                    callback:{
                        onClick:onClick,
                    }
                };
                ztree = $.fn.zTree.init($(elem).children().eq(0), setting, zNodes);
                if(scope.selectedDepartment){
                    //选中并展开选中节点
                    let treeNode = ztree.getNodeByParam('id',scope.selectedDepartment,null);
                    ztree.selectNode(treeNode);
                    if(!treeNode.open){
                        onClick(null,null, treeNode);
                    }
                }
            };
            
            scope.$watch('treeData',list=>{
                if(list&&list[0]){
                    initTree(list);
                }
            });
            /**
             * 图标移动到A标签内
             * @param treeId
             * @param treeNode
             */
            function addDiyDom(treeId, treeNode) {
                var spaceWidth = 5;
                var switchObj = $("#" + treeNode.tId + "_switch"),
                icoObj = $("#" + treeNode.tId + "_ico"),
                name = $("#" + treeNode.tId + "_span");
                switchObj.remove();
                icoObj.before(switchObj);
                if (treeNode.level > 1) {
                    let spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
                    switchObj.before(spaceStr);
                }
                if(!treeNode.isParent){
                     let  imgStr = treeNode.imgUrl && treeNode.imgUrl!=='' ? "<img class='tree_user_img' src='"+filePath+treeNode.imgUrl+"'>" : "<span class='tree_user_head'></span>" ;
                     name.before(imgStr);
                }
            }
            /**
             * 获取所有父元素名称
             * @param pnode 父节点
             * @param name 已有名称字符串
             */
            function getParentsName(pnode, name) {
                if (pnode.getParentNode() !== null) {
                    let curName = name ==='' ?  pnode['name'] : pnode['name'] + '-' + name;
                    let curNode = pnode.getParentNode();
                    getParentsName(curNode, curName);
                }else{
                     parentsName = name ===''? pnode['name'] : pnode['name'] + '-' + name;
                } 
            }
           /**
            * 获取当前节点总人数 
            * @param treeNode 当前节点
            * @param arr 无子元素的子节点id数组(去重)
            */
            function getAllPersonByDepartment(treeNode,arr){
                let childrenNodes = treeNode.children;
                if(childrenNodes){
                    for(let item of childrenNodes){
                        if(item.id && arr.indexOf(item.id) === -1 && !item.isParent){
                            arr.push(item.id)
                        }
                        if(item.isParent){
                            getAllPersonByDepartment(item,arr);
                        }
                    }
                }
                
            }
            //绑定搜索事件
             $("#colleagueSearch").bind("input", function(){
                if(!$("#colleague_nores").is(":hidden")){
                    $("#colleague_nores").hide();
                }
                 if(timer){
                     clearTimeout(timer);
                 }
                 timer = setTimeout(searchData,500);
             });
             $("#cleanAll").click(function(){
                searchData();
             });
             /**
              * 在树节点中搜索,取得数据拼装出结果树
              */
             function searchData(){
                 // 取得搜索的关键字
                let keyWord =  $("#colleagueSearch").val().trim();
                if(keyWord === '' || !keyWord){
                    $("#colleagueResultTree").hide();
                    $("#colleagueTree").show();
                    return false;
                }
                // 根据关键字获取相应的节点
                var nodeList = ztree.getNodesByFilter(filter);
                if(nodeList.length<1){
                    $("#colleague_nores").show();
                    return false;
                }
                
                
                let idArr =[],
                personArr = [],
                departmentArr = [];
                for(let key in nodeList){   
                    let item = nodeList[key];
                    // 如果节点id在数组中不存在,则push进去,并设置为已搜索
                    if(idArr.indexOf(item.id)<0){
                        idArr.push(item.id);
                        item.isSearch = true;
                        // 如果节点有父节点,就放入部门数组,否则,就放入人员数组
                        if(item.isParent){
                            departmentArr.push(item);
                        }else{
                            item.pId = '';
                            personArr.push(item)
                        }
                    }
                }
                let setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    check: {
                        enable: false
                    },
                    view: {
                        showIcon: false,
                        showLine:false,
                        dblClickExpand : false,
                        addDiyDom: addDiyDom
                    },
                    callback:{
                        onClick:onClick
                    }
                };
                 // 合并部门数组和人员数组
                let resultList = personArr.concat(departmentArr);
                // 初始化ztree,生成搜索结果树
                resultTree = $.fn.zTree.init($(elem).children().eq(1), setting, resultList);
                // 默认选中第一个节点,并在右侧展示结果
                let nodes = resultTree.getNodes();
                resultTree.selectNode(nodes[0]);
                onClick(null,resultTree.setting.treeId,nodes[0]);
                $("#colleagueTree").hide();
                $("#colleagueResultTree").show();
             }
             //过滤搜索结果
             function filter(node){
                 let keyWord =  $("#colleagueSearch").val();
                 return ( (node.pinyin && node.pinyin.indexOf(keyWord) >-1) || node.name.indexOf(keyWord)>-1);
             }
             //点击展开定位部门
             $(".account_detail").on('click','.toDepartment',function(){
                let id = $(this).children().text();
                let treeNode = ztree.getNodeByParam('id',id,null);
                let result = document.querySelector("#colleagueResultTree");
                let isShow = window.getComputedStyle(result).display;
                if(isShow==='block'){
                     document.querySelector("#cleanAll").click();
                }
                //选中并展开选中节点
                ztree.selectNode(treeNode);
                if(!treeNode.open){
                    onClick(null,null, treeNode);
                }
             });

        }
    }
}
colleagueTreeDirective.$inject = ['$config'];