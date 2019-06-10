/**
 * @Author hejialin
 * @Description 描述
 */

export default class uploadAcceptanceMaterial{
    constructor($stateParams,purchaseInterface,ProjectInterface,ProjectService,$scope,purchaseService){
        this.$stateParams = $stateParams;
        this.$scope = $scope;
        this.purchaseInterface = purchaseInterface;
        this.ProjectInterface = ProjectInterface;
        this.ProjectService = ProjectService;
        this.purchaseService = purchaseService;
        this.init();
    }
    
    init(){
        this.getUsefulData();
        if(this.isEdit!==undefined&&!this.editForm){
            this.getFormData();
        }
    }

    /**
     * 获取外置表单数据
     * @param taskId
     */
    getFormData(){
        this.ProjectInterface.getTaskFormData(this.taskId).then(res => {
            this.editForm = this.ProjectService.formatCacheData(res.data.properties);
            this.editForm.attachments = res.data.attachments;
        });
    }

    auditThisTask(){
        this.auditing = true;
        this.setUsefulData();
        if(this.isEdit===undefined){
            this.auditTask(this.editForm);
        }else{
            this.$scope.$emit('formData',this.editForm);
            this.$scope.closeThisDialog();
        }
    }

    /**
     * 控制错误信息显示隐藏
     */
    showErrorMsg(show) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this[show] = !this[show];
    }

    /**
     * 获取使用数据
     */
    getUsefulData(){
        let field = this.configCache.qualifiedProve.field;
        this.ProjectInterface.getUsefulData(this.$stateParams.id).then(res=>{
            if(res.data[field]){
                this.editForm.purchaseList = JSON.parse(res.data[field].value).list;
            }
        });
    }

    setUsefulData(){
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.acceptDocument.field,
            this.getTypeAttachments(this.attachmentType.acceptDocument)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.providerGoods.field,
            this.getTypeAttachments(this.attachmentType.providerGoods)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.selfCheckDocument.field,
            this.getTypeAttachments(this.attachmentType.selfCheckDocument)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.acceptanceForm.field,
            this.getTypeAttachments(this.attachmentType.acceptanceForm)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.businessCard.field,
            this.getTypeAttachments(this.attachmentType.businessCard)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.productQuality.field,
            this.getTypeAttachments(this.attachmentType.productQuality)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.acceptanceOther.field,
            this.getTypeAttachments(this.attachmentType.acceptanceOther)
        );
    }

    /**
     * 获取对应类型的附件
     * @param type
     * @return {Array}
     */
    getTypeAttachments(type){
        let attachmentList = [];
        this.editForm.attachments.forEach(attachment=>{
            if(type==attachment.type){
                attachmentList.push(attachment)
            }
        });
        return attachmentList;
    }

    getTemplate(){
        return `<div class="purchaseDraft uploadAcceptanceMaterial">
            <form class="w5c-form dev_upload_list" novalidate name="addConfigForm">
                <div class="reDraft_list wp_90">
                    <bdp-upload-file
                        required="true"
                        upload="purchaseForm.isEdit"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="项目验收申请报告原件（签字盖章）扫描件"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                        type="{{purchaseForm.attachmentType.acceptDocument}}"
                        size="{{5*1024*1024}}"
                        format="jpg,jpeg,png">
                    </bdp-upload-file>
                </div>
                <div class="reDraft_list wp_90">
                    <bdp-upload-file
                        required="true"
                        upload="purchaseForm.isEdit"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="学校供货一览表原件（签字盖章）扫描件"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                        type="{{purchaseForm.attachmentType.providerGoods}}"
                        size="{{5*1024*1024}}"
                        format="jpg,jpeg,png">
                    </bdp-upload-file>
                </div>
                <div class="reDraft_list wp_90">
                    <bdp-upload-file
                        required="true"
                        upload="purchaseForm.isEdit"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="使用单位自检报告原件（签字盖章）扫描件"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                        type="{{purchaseForm.attachmentType.selfCheckDocument}}"
                        size="{{5*1024*1024}}"
                        format="jpg,jpeg,png">
                    </bdp-upload-file>
                </div>
                <div class="reDraft_list wp_90">
                    <bdp-upload-file
                        required="true"
                        upload="purchaseForm.isEdit"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="项目验收单原件（签字盖章）扫描件"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                        type="{{purchaseForm.attachmentType.acceptanceForm}}"
                        size="{{5*1024*1024}}"
                        format="jpg,jpeg,png">
                    </bdp-upload-file>
                </div>
                <div class="reDraft_list">
                    <span class="width300 word_center">产品质量合格证明资料：</span>
                </div>
                <table class="itemTable">
                    <tr class="productOrder-table">
                        <td width="60">序号</td>
                        <td width="150">品目</td>
                        <td width="335">具体产品型号</td>
                        <td width="465">合格证</td>
                        <td width="160">备注</td>
                    </tr>
                    <tr class="productOrder-table" ng-repeat="data in purchaseForm.editForm.purchaseList">
                        <td width="60">{{$index+1}}</td>
                        <td width="150">{{data.itemName||data.category}}</td>
                        <td width="335">{{data.specifications}}</td>
                        <td width="465" class="add_img_td">
                            <pic-view file-name="attachment.name" hide-name="true" file-path="attachment.url" ng-repeat="attachment in data.attachments"></pic-view>
                        </td>
                        <td width="160">
                            {{data.remark}}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <span class="width60">其他资料</span>
                            <span>1.公司营业性质</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <span class="width60"></span>
                            <span>2.供应商《产品质量承诺书》</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <span class="width60"></span>
                            <span>3.其他材料</span>
                        </td>
                    </tr>
                </table>
        
                <div class="reDraft_list wp_90">
                    <bdp-upload-file
                        required="true"
                        upload="purchaseForm.isEdit"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="公司营业资质原件（签字盖章）扫描件"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                        type="{{purchaseForm.attachmentType.businessCard}}"
                        size="{{5*1024*1024}}"
                        format="jpg,jpeg,png">
                    </bdp-upload-file>
                </div>
                <div class="reDraft_list wp_90">
                    <bdp-upload-file
                        required="true"
                        upload="purchaseForm.isEdit"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="产品质量承诺书原件（签字盖章）扫描件"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                        type="{{purchaseForm.attachmentType.productQuality}}"
                        size="{{5*1024*1024}}"
                        format="jpg,jpeg,png">
                    </bdp-upload-file>
                </div>
                <div class="reDraft_list wp_90">
                    <bdp-upload-file
                        upload="purchaseForm.isEdit"
                        attachment-list="purchaseForm.editForm.attachments"
                        title="其他材料（非必填）"
                        message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                        type="{{purchaseForm.attachmentType.acceptanceOther}}"
                        size="{{5*1024*1024}}"
                        format="jpg,jpeg,png">
                    </bdp-upload-file>
                </div>
                <div ng-if="purchaseForm.isEdit!==false">
                <!--已填写的表格下方的虚线-->
                <div class="table_dashed"></div>
                <!--审核表单-->
                <div class="reDraft_content2">
                    <div class="reDraft_list">
                        <span class="width160 word_center">完成时间状态：</span>
                        <p class="word_center maleft10" ng-switch="purchaseForm.nextAuditInfo.statusName">
                            <span class="green_color" ng-switch-when="正常">正常</span>
                            <span class="yellow_color" ng-switch-when="临期">临期</span>
                            <span class="red_color" ng-switch-default="">{{purchaseForm.nextAuditInfo.statusName}}</span>
                        </p>
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">最晚完成任务日期截点：</span>
                        <span class="word_center">{{purchaseForm.nextAuditInfo.dueDate|date:'yyyy/MM/dd'}}</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">下一步操作节点名称：</span>
                        <span class="word_center">{{purchaseForm.nextAuditInfo.taskInfoList[0].taskName}}</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="width160 word_center">下一步操作人：</span>
                        
                        <select-options class="get_method selectWid400" ng-model="purchaseForm.editForm[purchaseForm.nextAuditInfo.taskInfoList[0].assigneeVar]" name="assigneeVar" repeat-items="data in purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList" item-key="accountId" required>
                            {{data.displayName}} <span>（{{data.gardenName}}）</span>
                        </select-options>
                    </div>
                    <div class="reDraft_list" ng-if="purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0">
                        <p class="width160 word_center"></p>
                        <p class="word_center red_color"><i class="iconfont icon-alarmPrompt yellow_color"></i>系统检测到当前项目在下一节点无任何满足条件的操作用户接收，这将导致本项目永远无法推进，请迅速联系系统管理员配置相关节点操作用户！</p>
                    </div>
                </div>
                <!--按钮-->
                <div class="reDraft_btn" style="padding:0">
                    <button class="btn_bd" ng-click="purchaseForm.isEdit===undefined?auditCancel():closeThisDialog()">取消</button>
                    <button class="btn_bg" ng-disabled="purchaseForm.auditing || purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0" form-submit-valid="purchaseForm.auditThisTask()">确定</button>
                </div>
                </div>
                <div class="reDraft_btn" style="padding:0" ng-if="purchaseForm.isEdit===false">
                    <button class="btn_bd" ng-click="closeThisDialog()">返回</button>
                </div>
            </form>
        </div>`
    }
}
uploadAcceptanceMaterial.$inject = ['$stateParams','purchaseInterface','ProjectInterface','ProjectService','$scope','purchaseService'];
