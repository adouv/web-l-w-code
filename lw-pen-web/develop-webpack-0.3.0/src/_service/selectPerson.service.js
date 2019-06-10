import Vue from 'vue'

export default{
    /**
    * 
    * @param arr 线性数组转化树形结构
    * @param parentId 
    * @param _id 
    * @param _pId 
    * @param childArrName 
    */
   getTree(arr, parentId, _id, _pId, childArrName = '') {
    let id = _id || 'id';
    let pId = _pId || 'pId';
    let childArrStr = childArrName || 'children';
    // 递归方法
    function getNode(id) {
      let nodes = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][pId] == id) {
          let childrenArr = getNode(arr[i].id);
          if (childrenArr) {
            arr[i][childArrStr] = childrenArr;
            arr[i].isLeaf = false;
          } else {
            arr[i].isLeaf = true;
          }
          arr[i].title = arr[i].name;
          arr[i].key = arr[i].id;
          nodes.push(arr[i])
        }
      }
      if (nodes.length == 0) {
        return;
      } else {
        return nodes;
      }
    }
    // 使用根节点
    return getNode(parentId);
  },
}