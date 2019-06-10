/**
 * @Author hejialin
 * @Description 描述
 */
export default class purchaseNumber{
    constructor(purchaseInterface,$stateParams,dialogManager,$scope,ngDialog,$location){
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$location = $location;
        this.dialogManager = dialogManager;
        this.purchaseInterface = purchaseInterface;
        this.ngDialog = ngDialog;
        this.init();
    }

    init(){
        this.getPurchaseList();
        this.reUpload = false;
    }

    /**
     * 获取采购清单
     */
    getPurchaseList(){
        this.purchaseInterface.getPurchaseList(this.$stateParams.id).then(res=>{
            this.purchaseList = res.data;
        });
    }

    /**
     * 编辑保存数据
     */
    saveDialogData(){
        this.$scope.$emit('formData', this.editForm);
        this.$scope.closeThisDialog();
    }

    /**
     * 审核
     */
    saveAuditData(){
        let nextOperatorField = this.nextAuditInfo.taskInfoList[0].assigneeVar;
        let nextOperator = this.editForm[nextOperatorField];
        let data = {projectId:this.$stateParams.id,reUpload:this.reUpload,projectPurchaseItemList:this.purchaseList,nextOperator:nextOperator,nextOperatorField:nextOperatorField,taskId:this.currentTaskId};
        this.purchaseInterface.updatePurchasePrice(data).then(res=>{
            this.dialogManager.showMessage('操作成功！',{
                className:'success',
                callback:()=>{
                    this.auditCancel();
                }
            })
        })
    }

    /**
     * 固定资产最低使用年限标准弹窗
     */
    showFixedAsset(){
        this.ngDialog.open({
            closeByDocument: false,
            disableAnimation: true,
            className: 'bdp layer_fixed',
            template: require('../components/fixedAsset/fixedAsset.html'),
            plain: true,
            controller: 'purchaseFixedAssetCtrl',
            controllerAs: 'purchaseFixedAsset',
            scope:this.$scope
        })
    }

    /**
     *  校验审批数量 / 计算总数
     */

    integer(data){
        let number = data.auditNum;
        if(data.auditNum){
            data.auditNum = number.replace(/[^\d]/g, "");
            data.totalPrice = (data.auditNum * data.price).toFixed(2);
        }else{
            data.totalPrice = 0;
        }
        this.totalPrice = 0;
        this.purchaseList.forEach(data=>{
            if(data.auditNum){
                this.totalPrice += data.auditNum * data.price
            }
        });
        if(this.totalPrice ){
            this.totalPrice = this.totalPrice.toFixed(2);
        }
    }

    auditThisTask(){
        this.auditing = true;
        if(this.isEdit===undefined){
            this.saveAuditData()
        }
    }

    getTemplate(){
        return `
            <form class="w5c-form" name="purchaseAuditForm" novalidate
                ng-if='purchaseForm.isEdit===true||purchaseForm.isEdit===undefined'>
            <h1 class="audit_task_title">{{purchaseForm.taskName}}</h1>
            <span class='audit_task_dialog' ng-click="purchaseForm.showFixedAsset()">固定资产最低使用年限标准</span>
            <div class="table_box overflow_box_sm" style="padding-bottom:0;" ng-class="{'height_350':purchaseForm.purchaseList.length>5&&!showList}">
                <table class="listTable">
                    <thead>
                        <th>序号</th>
                        <th>设备名称</th>
                        <th>品牌</th>
                        <th>规格型号</th>
                        <th>单位</th>
                        <th>现有数量</th>
                        <th>采购数量</th>
                        <th width="15%">审批数量</th>
                        <th>采购单价（元）</th>
                        <th>最高限单价（元）</th>
                        <th>总价（元）</th>
                    </thead>
                    <tbody>
                        <tr ng-repeat="purchase in purchaseForm.purchaseList track by $index">
                            <td>{{$index+1}}</td>
                            <td>{{purchase.itemName}}</td>
                            <td>{{purchase.brand}}</td>
                            <td>{{purchase.specifications}}</td>
                            <td>{{purchase.unit}}</td>
                            <td>{{purchase.nowNum}}</td>
                            <td>{{purchase.buyNum}}</td>
                            <td><input type="text" ng-model='purchase.auditNum' class="table_input input_class" placeholder="0和正整数，必填" ng-change="purchaseForm.integer(purchase)" required name="auditNum{{$index}}" maxlength="10"></td>
                            <td>{{purchase.price}}</td>
                            <td ng-if="purchase.maxPrice">{{purchase.maxPrice}}</td>
                            <td ng-if="!purchase.maxPrice" class="col999">待审定</td>
                            <td>{{purchase.totalPrice||0}}</td>
                        </tr>
                        <tr>
                            <td colspan="10" style="text-align:right;">合计（元）</td>
                            <td>{{purchaseForm.totalPrice||0}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="audit_row control_list" ng-show="purchaseForm.purchaseList.length>5">
                <p ng-show="!showList">点击展开上部全部内容</p>
                <p ng-show="showList">点击收起上部全部内容</p>
                <span class="iconfont" ng-class="{'icon-arrowLook':!showList,'icon-arrowStop':showList}" ng-click="showList=!showList"></span>
            </div>
            <div class="audit_row">
                <p class="col_span">完成时间状态：</p>
                <p class="col_div" ng-switch="purchaseForm.nextAuditInfo.statusName">
                    <span class="green_color" ng-switch-when="正常">正常</span>
                    <span class="yellow_color" ng-switch-when="临期">临期</span>
                    <span class="red_color" ng-switch-default="">{{purchaseForm.nextAuditInfo.statusName}}</span>
                </p>
            </div>
            <div class="audit_row">
                <p class="col_span">最晚完成任务日期节点：</p>
                <p class="col_div">{{purchaseForm.nextAuditInfo.dueDate|date:'yyyy/MM/dd'}}</p>
            </div>
            <div ng-repeat="nextAuditInfo in purchaseForm.nextAuditInfo.taskInfoList">
                <div class="audit_row">
                    <p class="col_span">下一步操作节点名称：</p>
                    <p class="col_div">{{nextAuditInfo.taskName}}</p>
                </div>
                <div class="audit_row">
                    <p class="col_span">下一步操作人：</p>
                    <p class="col_div">
                        
                        <select-options class="next_auditor" ng-model="purchaseForm.editForm[nextAuditInfo.assigneeVar]" name="assigneeVar" repeat-items="data in nextAuditInfo.nextAuditorQoList" item-key="accountId" required>
                            {{data.displayName}} <span>（{{data.gardenName}}）</span>
                        </select-options>
                    </p>
                </div>
                <div class="audit_row" ng-if="nextAuditInfo.nextAuditorQoList.length<=0">
                    <p class="col_span"></p>
                    <p class="col_div red_color"><i class="iconfont icon-alarmPrompt yellow_color"></i>系统检测到当前项目在下一节点无任何满足条件的操作用户接收，这将导致本项目永远无法推进，请迅速联系系统管理员配置相关节点操作用户！</p>
                </div>
            </div>
            <div class="text_center footer">
                <button class="btn_bd" ng-click="auditCancel()">取消</button>
                <button class="btn_bg" type="submit" form-submit-valid="purchaseForm.auditThisTask()" ng-disabled="purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0||purchaseForm.auditing">确定</button>
            </div>
        </form>
        `;
    }
}
purchaseNumber.$inject = ['purchaseInterface','$stateParams','dialogsManager','$scope','ngDialog','$location'];
