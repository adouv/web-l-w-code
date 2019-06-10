
export default class ApplyService {
    constructor(ProjectInterface,$rootScope,ngDialog) {
        this.ProjectInterface = ProjectInterface;
        this.$rootScope = $rootScope;
        this.ngDialog = ngDialog
    }

    /**
     * 获取外置表单详情,计算资产原值总数,资产数量总数
     * @param taskId 任务id
     * @return callback
     */
    getFormData(taskId, callback) {
        this.ProjectInterface.getTaskFormData(taskId).then(res => {
            let formData = res.data;
            let assetDisposeDetailList = res.data.assetDisposeDetailList;// 申请处置的资产明细列表
            let computedSum = this.assetComputed(assetDisposeDetailList);
            angular.extend(formData,computedSum);
            callback(formData)
        });
    }

    /**
     * 获取申请单详情,计算资产原值总数,资产数量总数
     * @param orderId 申请单id
     * @return callback
     */
    getApplyOrder(orderId, callback) {
        this.ProjectInterface.getApplicationDetail(moduleAlias.ASSET,orderId).then(res => {
            let orderData = res.data;
            let assetDisposeDetailList = res.data.assetDisposeDetailList;// 申请处置的资产明细列表
            let computedSum = this.assetComputed(assetDisposeDetailList);
            angular.extend(orderData,computedSum);
            callback(orderData)
        })
    }

    /**
     * 计算资产原值总数，以及资产数量总数
     * @param assetDisposeDetailList 申请处置的资产明细列表
     * @return {key:value}
     */
    assetComputed(assetDisposeDetailList) {
        let assetTotalAmountSum = 0; //资产原值总数
        let assetCountSum = 0; //资产数量总数
        assetDisposeDetailList.map((v) => {
            assetTotalAmountSum = Number((assetTotalAmountSum +parseFloat(v.assetTotalAmount || 0)).toFixed(2));
            assetCountSum += parseInt(v.assetCount);
        });
        return {assetTotalAmountSum:assetTotalAmountSum,assetCountSum:assetCountSum}
    }

    /**
     * 验证资产编号,更新资产编号总数
     * @param No 资产编号
     * @param assetDisposeDetailList 申请处置的资产明细列表
     * @param idx 申请处置的资产明细列表某一项的索引
     * @return {key:value}
     */
    computedNumber(No,assetDisposeDetailList,idx) {
        //去除所有空格
        No = No || '';
        No = No.replace(/\s+/g, "");
        //计算有多少需要处理的
        let lineIndex = No.indexOf('-');
        let startNum = parseInt(No.substring(lineIndex - 6, lineIndex));
        let endNum = '';
        if (No.indexOf('\\') !== -1) {
            let biasIndex = No.indexOf('\\');
            endNum = parseInt(No.substring(lineIndex + 1, biasIndex))
        } else {
            endNum = parseInt(No.substring(lineIndex + 1, No.length))
        }
        let D_value = endNum - startNum;
        let len = (No.split('\\')).length || 0;
        let totalNum = D_value + len;
        if (lineIndex === -1 && No.indexOf('\\') === -1 && No.length >= 6) {
            totalNum = 1
        }
        assetDisposeDetailList[idx].assetCount = totalNum;//修改当前行的数量
        let computedSum = this.assetComputed(assetDisposeDetailList);
        return computedSum;
    }


    /**
     *  验证账面原值,更新账面原值总数量
     * @param paperValue 账面原值
     * @param assetDisposeDetailList 申请处置的资产明细列表
     * @param idx 申请处置的资产明细列表某一项的索引
     * @return {key:value}
     */
    clearNoNum(paperValue,assetDisposeDetailList,idx) {
        //修复第一个字符是小数点 的情况.
        var paperValue = paperValue;
        if(paperValue == '' || paperValue == undefined){
            paperValue = '';
        }
        if (paperValue != '' && paperValue.substring(0, 1) == '.') {
            paperValue = "";
        }
        paperValue = paperValue.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
        paperValue = paperValue.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        paperValue = paperValue.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        paperValue = paperValue.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
        // 限制账面原值只能输入15位
        paperValue = paperValue.substring(0, 15);
        if (paperValue.indexOf(".") < 0 && paperValue != "") {
            //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            paperValue = parseFloat(paperValue);
        }
        assetDisposeDetailList[idx].assetTotalAmount = paperValue;//修改当前行的账面原值
        let computedSum = this.assetComputed(assetDisposeDetailList);
        return computedSum;
    }
    /*
     * 更多条件搜索弹窗
     * */
    getMoreSearch(condition,callback,allunits,isLibrary){
        let scope = this.$rootScope.$new();
        scope.callback = callback;
        scope.condition = condition;
        scope.isAllunits = allunits;
        scope.isLibrary = isLibrary;
        this.ngDialog.open({
            /*disableAnimation: true,*/
            closeByDocument: false,
            className: 'bdp layer_fixed',
            template: require('../components/search/search.html'),
            plain: true,
            controller: 'assetSearchCtrl',
            controllerAs: 'assetSearch',
            scope:scope
        })
    }
}

ApplyService.$inject = ['ProjectInterface','$rootScope','ngDialog'];
