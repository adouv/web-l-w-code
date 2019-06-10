/**
 * @Author hejialin
 * @Description 描述
 */
import validCtrl from '../services/baseValidate'
export default class purchaseReferPrice extends validCtrl{
    constructor(purchaseInterface,$stateParams,dialogManager,$scope,ProjectInterface,purchaseService,ngDialog,$sessionStorage,$location){
        super();
        this.$scope = $scope;
        this.$location = $location;
        this.$stateParams = $stateParams;
        this.dialogManager = dialogManager;
        this.ProjectInterface = ProjectInterface;
        this.purchaseService = purchaseService;
        this.purchaseInterface = purchaseInterface;
        this.ngDialog = ngDialog;
        this.session = $sessionStorage;
        this.init();
    }

    init(){
        this.reUpload = false;
        this.importUrl = this.purchaseInterface.getImportUrl(this.purchaseInterface.templateType.REPURCHASE);
        this.garden = this.session.get('currentGarden');
        if(!this.editForm&&this.isEdit!==undefined){
            this.getFormData(this.taskId);
        }else if(this.isEdit===undefined){
            this.getNextAuditInfo();
            this.getPurchaseList();
            this.editForm.projectId = this.$stateParams.id;
        }
        if(this.isEdit!==false){
            this.getNextAuditInfo();
        }
    }

    /**
     * 下一步审核人
     */
    getNextAuditInfo() {
        this.ProjectInterface.getNextTaskAudit(
            null, this.currentTaskId,
            this.session.get('currentGarden').gardenId,
            'approved', true
        ).then(res => {nextTaskInfoList
            this.nextAuditInfo = {};
            let nextTaskInfoList = res.data.nextTaskInfoList;
            this.nextAuditInfo = nextTaskInfoList[0];
            this.nextAuditInfo.statusName = res.data.statusDescription;
            this.nextAuditInfo.dueDate = res.data.dueDate;
            if(!this.editForm.nextOperator){
                this.editForm.nextOperatorField = nextTaskInfoList[0].assigneeVar;
                this.editForm.nextOperator = nextTaskInfoList[0].nextAuditorQoList[0].accountId;
            }
        })
    }

    /**
     * 获取采购清单
     */
    getPurchaseList(){
        this.purchaseInterface.getPurchaseList(this.$stateParams.id).then(res=>{
            this.editForm.projectPurchaseItemList = angular.copy(res.data);
        });
    }

    /**
     * 获取外置表单数据
     * @param taskId
     */
    getFormData(taskId){
        this.totalPrice = 0;
        this.ProjectInterface.getTaskFormData(taskId).then(res => {
            let numKey = 'buyNum';
            if(!res.data.reUpload&&res.data.projectPurchaseItemList[0].auditNum!==null){
                numKey = 'auditNum';
            }
            res.data.projectPurchaseItemList.forEach(data=>{
                data.totalPrice = (data[numKey]*data.maxPrice).toFixed(2);
                this.totalPrice += data[numKey]*data.maxPrice;
            });
            this.totalPrice = this.totalPrice.toFixed(2)
            this.editForm = angular.copy(res.data);
        });
    }
    
    /**
     * 获取导入参数
     */
    getImportData(data,file){
        this.purchaseService.importError(data,file,list=>{
            this.cacheList = angular.copy(this.editForm.projectPurchaseItemList);
            this.editForm.reUpload = true;
            this.totalPrice = 0;
            list.forEach(data=>{
                data.totalPrice = (data.buyNum*data.maxPrice).toFixed(2);
                this.totalPrice += data.buyNum*data.maxPrice;
            });
            this.totalPrice = this.totalPrice.toFixed(2);
            this.editForm.projectPurchaseItemList = list;
        })
    }

    /**
     * 清空重传采购清单
     */
    cleanPurchaseList(){
        this.editForm.reUpload = false;
        this.totalPrice = 0; // 清空总价
        this.cacheList.forEach(data=>{
            this.totalPrice
        });
        let numKey = 'buyNum';
        if(!this.editForm.reUpload&&this.cacheList[0].auditNum!==null){
            numKey = 'auditNum';
        }
        this.cacheList.forEach(data=>{
            data.totalPrice = (data[numKey]*data.maxPrice).toFixed(2);
            this.totalPrice += data[numKey]*data.maxPrice;
        });
        this.totalPrice = this.totalPrice.toFixed(2)
        this.editForm.projectPurchaseItemList = angular.copy(this.cacheList);
    }

    /**
     * 下载采购模版
     */
    downloadTemplate(){
        this.purchaseInterface.downloadTemplate(this.purchaseInterface.templateType.REPURCHASE);
    }

    auditThisTask(){
        this.auditing = true;
        if(this.isEdit===undefined){
            this.saveAuditData(this.editForm);
        }else{
            this.$scope.$emit('formData',this.editForm);
            this.$scope.closeThisDialog();
        }
    }

    /**
     * 审核
     */
    saveAuditData(data){
        data.taskId = this.currentTaskId;
        this.purchaseInterface.updatePurchasePrice(data)
            .then(res=>{
                this.dialogManager.showMessage('操作成功！',{
                    className:'success',
                    callback:()=>{
                        this.auditCancel();
                    }
                })
            })
    }

    /**
     * 控制最高单价输入 / 计算总价
     * @param data
     */
    controlPrice(data){
        let numKey = data.auditNum!==null?'auditNum':'buyNum';
        if(data.maxPrice){
            data.maxPrice = this.validPrice(data.maxPrice);
            data.totalPrice = (data[numKey] * data.maxPrice).toFixed(2);
        }else{
            data.totalPrice = '';
        }
        this.totalPrice = 0;
        this.editForm.projectPurchaseItemList.forEach(data=>{
            if(data.maxPrice){
                this.totalPrice += data[numKey] * data.maxPrice;
            }
        });
        if(this.totalPrice){
            this.totalPrice = this.totalPrice.toFixed(2);
        }
    }

    /**
     * 相关政策查看弹窗
     */
    showPolicy(){
        this.ngDialog.open({
            closeByDocument: false,
            disableAnimation: true,
            className: 'bdp layer_fixed',
            template: require('../components/fixedAsset/relatedPolicy.html'),
            plain: true,
            controller: 'purchaseFixedAssetCtrl',
            controllerAs: 'purchaseFixedAsset',
            scope:this.$scope,
            onOpenCallback: () => {
                this.$scope.$broadcast('data',{
                    data:'policyData'
                });
            }
        })
    }
    
    getTemplate(){
        return `<form class="w5c-form audit_info" novalidate name="purchaseAuditForm">
            <h1 class="audit_task_title">{{purchaseForm.taskName}}</h1>
            <div class="table_box">
                <div ng-if='purchaseForm.isEdit!==false'>
                    <import-file re-upload-file="true" ng-show="!purchaseForm.cacheList || !purchaseForm.editForm.reUpload" class='audit_result import_btn' size="{{10*1024*1024}}" url="purchaseForm.importUrl" file-name='重传采购清单' params="{folder: 'bdp'}" 
                        callback-success="purchaseForm.getImportData($importData,$importFile)">
                    </import-file>
                    <button ng-show="purchaseForm.cacheList&&purchaseForm.editForm.reUpload" class='audit_result import_btn btn_bd' ng-click="purchaseForm.cleanPurchaseList()">清空重传清单</button>
                    <a class="font_color" href="javascript:void(0)" ng-click="purchaseForm.downloadTemplate()">下载清单模版文件</a>
                </div>
                <div class="table_box overflow_box_sm" style="width:auto;margin:auto;padding-bottom:0;" ng-class="{'height_350':purchaseForm.editForm.projectPurchaseItemList.length>5&&!showList}">
                <table class="listTable" ng-if="purchaseForm.editForm.projectPurchaseItemList[0].brand">
                    <thead>
                        <th>序号</th>
                        <th>设备名称</th>
                        <th>品牌</th>
                        <th>规格型号</th>
                        <th>单位</th>
                        <th>现有数量</th>
                        <th>采购数量</th>
                        <th>审批数量</th>
                        <th>采购单价（元）</th>
                        <th>最高限单价（元）</th>
                        <th>总价（元）</th>
                    </thead>
                    <tbody>
                        <tr ng-repeat="purchase in purchaseForm.editForm.projectPurchaseItemList track by $index">
                            <td>{{$index+1}}</td>
                            <td>{{purchase.itemName}}</td>
                            <td>{{purchase.brand}}</td>
                            <td>{{purchase.specifications}}</td>
                            <td>{{purchase.unit}}</td>
                            <td>{{purchase.nowNum}}</td>
                            <td>{{purchase.buyNum}}</td>
                            <td>{{purchase.auditNum}}</td>
                            <td>{{purchase.price}}</td>
                            <td>
                                <input type="text" ng-model='purchase.maxPrice' ng-if="purchaseForm.isEdit!==false" ng-change="purchaseForm.controlPrice(purchase)" placeholder="0和正整数，必填" class="table_input input_class" required name="maxPrice{{$index}}">
                                <span ng-if="purchaseForm.isEdit===false">{{purchase.maxPrice}}</span>
                            </td>
                            <td>{{purchase.totalPrice||0}}</td>
                        </tr>
                        <tr>
                            <td colspan="10" style="text-align: right;">合计（元）</td>
                            <td>{{purchaseForm.totalPrice||0}}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="listTable" ng-if="!purchaseForm.editForm.projectPurchaseItemList[0].brand">
                    <thead>
                        <th>序号</th>
                        <th>设备名称</th>
                        <th>规格型号</th>
                        <th>采购数量</th>
                        <th>最高限单价（元）</th>
                        <th>总价（元）</th>
                    </thead>
                    <tbody>
                        <tr ng-repeat="purchase in purchaseForm.editForm.projectPurchaseItemList track by $index">
                            <td>{{$index+1}}</td>
                            <td>{{purchase.itemName}}</td>
                            <td>{{purchase.specifications}}</td>
                            <td>{{purchase.buyNum}}</td>
                            <td>{{purchase.maxPrice}}</td>
                            <td>{{purchase.totalPrice}}</td>
                        </tr>
                        <tr>
                            <td colspan="5" style="text-align: right;">合计（元）</td>
                            <td>{{purchaseForm.totalPrice}}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
            <div class="audit_row control_list" ng-show="purchaseForm.editForm.projectPurchaseItemList.length>5">
                <p ng-show="!showList">点击展开上部全部内容</p>
                <p ng-show="showList">点击收起上部全部内容</p>
                <span class="iconfont" ng-class="{'icon-arrowLook':!showList,'icon-arrowStop':showList}" ng-click="showList=!showList"></span>
            </div>
            <div ng-if="purchaseForm.isEdit!==false">
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
                <div class="audit_row">
                    <p class="col_span">下一步操作节点名称：</p>
                    <p class="col_div">{{purchaseForm.nextAuditInfo.taskName}}</p>
                </div>
                <div class="audit_row">
                    <p class="col_span">下一步操作人：</p>
                    <p class="col_div">
                        
                        <select-options class="next_auditor" ng-model="purchaseForm.editForm.nextOperator" name="assigneeVar" repeat-items="data in purchaseForm.nextAuditInfo.nextAuditorQoList" item-key="accountId" required>
                            {{data.displayName}} <span>（{{data.gardenName}}）</span>
                        </select-options>
                    </p>
                </div>
                <div class="audit_row" ng-if="nextAuditInfo.nextAuditorQoList.length<=0">
                    <p class="col_span"></p>
                    <p class="col_div red_color"><i class="iconfont icon-alarmPrompt yellow_color"></i>系统检测到当前项目在下一节点无任何满足条件的操作用户接收，这将导致本项目永远无法推进，请迅速联系系统管理员配置相关节点操作用户！</p>
                </div>
                <div class="text_center footer">
                    <button class="btn_bd" ng-click="purchaseForm.isEdit===undefined?auditCancel():closeThisDialog()">取消</button>
                    <button class="btn_bg" ng-disabled="purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0||purchaseForm.auditing" 
                        type="submit" form-submit-valid="purchaseForm.auditThisTask()">确定</button>
                </div>
            </div>
             <div class="text_center footer" ng-if="purchaseForm.isEdit===false">
                <button class="btn_bd" ng-click="closeThisDialog()">返回</button>
            </div>
        </form>`;
    }
}
purchaseReferPrice.$inject = ['purchaseInterface','$stateParams','dialogsManager','$scope','ProjectInterface','purchaseService','ngDialog','$sessionStorage','$location'];
