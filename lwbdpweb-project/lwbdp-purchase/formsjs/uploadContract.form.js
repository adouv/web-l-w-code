/**
 * @Author hejialin
 * @Description 描述
 */
export default class uploadContract{
    constructor(purchaseService,ProjectInterface,$stateParams,$scope){
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.purchaseService = purchaseService;
        this.ProjectInterface = ProjectInterface;
        if(this.isEdit!==undefined&&!this.editForm){
            this.getFormData()
        }
        this.bidAmountfield = this.configCache.bidAmount.field;
        this.getUsefulData();
    }

    /**
     * 确定审核
     */
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
     * 获取外置表单数据
     * @param taskId
     */
    getFormData(){
        this.ProjectInterface.getTaskFormData(this.taskId).then(res => {
            this.editForm = res.data.properties;
            this.editForm.attachments = res.data.attachments;
        });
    }

    /**
     * 获取使用数据
     */
    getUsefulData(){
        this.ProjectInterface.getUsefulData(this.$stateParams.id).then(res=>{
            this.bidAmount = parseFloat(JSON.parse(res.data[this.bidAmountfield].value));
        });
    }

    /**
     * 设置需要使用的参数
     */
    setUsefulData(){
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.originalContract.field,
            this.getTypeAttachments(this.attachmentType.originalContract)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.contractProve.field,
            this.getTypeAttachments(this.attachmentType.contractProve)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.legalAdvice.field,
            this.getTypeAttachments(this.attachmentType.legalAdvice)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.recordNotice.field,
            this.getTypeAttachments(this.attachmentType.recordNotice)
        );
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.configCache.meetingMinutes.field,
            this.getTypeAttachments(this.attachmentType.meetingMinutes)
        );
    }

    /**
     * 保存弹窗里面的数据
     */
    saveDialogData(){
        this.$scope.$emit('formData', this.editForm);
        this.$scope.closeThisDialog();
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
        return `<form class="w5c-form audit_info" novalidate name="purchaseAuditForm" ng-if="purchaseForm.isEdit!==false">
            <h1 class="audit_task_title">{{purchaseForm.taskName}}</h1>
            <div class="bor_gray upload_wrapper mw_910">
                <bdp-upload-file
                    required="true"
                    attachment-list="purchaseForm.editForm.attachments"
                    title="项目合同原件（含签字盖章）扫描件"
                    message="只允许上传jpg、png、gif格式的图片，大小不超过5M"
                    type="{{purchaseForm.attachmentType.originalContract}}"
                    size="{{5*1024*1024}}"
                    format="jpg,jpeg,png">
                </bdp-upload-file>
            </div>
            <div class="bor_gray upload_wrapper mw_910">
                <bdp-upload-file
                    required="true"
                    attachment-list="purchaseForm.editForm.attachments"
                    title="项目合同乙方资质证明原件扫描件"
                    message="乙方的营业执照和其他与项目相关的资质证明等。只允许上传jpg、png、gif格式的图片，大小不超过5M。"
                    type="{{purchaseForm.attachmentType.contractProve}}"
                    size="{{5*1024*1024}}"
                    format="jpg,jpeg,png">
                </bdp-upload-file>
            </div>
            <div ng-if="purchaseForm.bidAmount>=50000">
            <div class="bor_gray upload_wrapper mw_910">
                <bdp-upload-file
                    required="true"
                    attachment-list="purchaseForm.editForm.attachments"
                    title="法律意见书原件扫描件"
                    message="只允许上传jpg、png、gif格式的图片，大小不超过5M"
                    type="{{purchaseForm.attachmentType.legalAdvice}}"
                    size="{{5*1024*1024}}"
                    format="jpg,jpeg,png">
                </bdp-upload-file>
            </div>
            <div class="bor_gray upload_wrapper mw_910">
                <bdp-upload-file
                    required="true"
                    attachment-list="purchaseForm.editForm.attachments"
                    title="备案通知书原件扫描件"
                    message="只允许上传jpg、png、gif格式的图片，大小不超过5M"
                    type="{{purchaseForm.attachmentType.recordNotice}}"
                    size="{{5*1024*1024}}"
                    format="jpg,jpeg,png">
                </bdp-upload-file>
            </div>
            <div class="bor_gray dashed upload_wrapper">
                <bdp-upload-file
                    required="true"
                    attachment-list="purchaseForm.editForm.attachments"
                    title="会议纪要原件扫描件"
                    message="只允许上传jpg、png、gif格式的图片，大小不超过5M；"
                    type="{{purchaseForm.attachmentType.meetingMinutes}}"
                    size="{{5*1024*1024}}"
                    format="jpg,jpeg,png">
                </bdp-upload-file>
            </div>
            <div class="audit_row">
                <p class="col_span">完成时间状态：</p>
                <p class="col_div" ng-switch="purchaseForm.nextAuditInfo.statusName">
                    <span class="green_color" ng-switch-when="正常">正常</span>
                    <span class="yellow_color" ng-switch-when="临期">临期</span>
                    <span class="red_color" ng-switch-default="">{{purchaseForm.nextAuditInfo.statusName}}</span>
                </p>
            </div>
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
                                               
                        <select-options class="get_method" ng-model="purchaseForm.editForm[nextAuditInfo.assigneeVar]" name="assigneeVar" repeat-items="data in nextAuditInfo.nextAuditorQoList" item-key="accountId" required>
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
                <button class="btn_bd" ng-click="purchaseForm.isEdit!==undefined?closeThisDialog():auditCancel()">取消</button>
                <button class="btn_bg" ng-disabled="purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0||purchaseForm.auditing" form-submit-valid="purchaseForm.auditThisTask(purchaseForm.editForm)">确定</button>
            </div>
        </form>
        <div ng-if="purchaseForm.isEdit===false">
            <div class="reDraft_list width870" style="overflow:inherit;">
                <span class="width250 word_center">项目合同原件（含签字盖章）扫描件：</span>
                <div class="width600" style="display:inline-block;">
                    <pic-view ng-repeat="file in purchaseForm.editForm.attachments" ng-if="file.type==purchaseForm.attachmentType.originalContract" file-name="file.name" file-path="file.url"></pic-view>
                </div>
            </div>
            <div class="reDraft_list width870" style="overflow:inherit;">
                <span class="width250 word_center">项目合同乙方资质证明原件扫描件：</span>
                <div class="width600" style="display:inline-block;">
                    <pic-view ng-repeat="file in purchaseForm.editForm.attachments" ng-if="file.type==purchaseForm.attachmentType.contractProve" file-name="file.name" file-path="file.url"></pic-view>
                </div>
            </div>
            <div ng-if="purchaseForm.bidAmount>=50000">
            <div class="reDraft_list width870" style="overflow:inherit;">
                <span class="width250 word_center">法律意见书原件扫描件：</span>
                <div class="width600" style="display:inline-block;">
                    <pic-view ng-repeat="file in purchaseForm.editForm.attachments" ng-if="file.type==purchaseForm.attachmentType.legalAdvice" file-name="file.name" file-path="file.url"></pic-view>
                </div>
            </div>
            <div class="reDraft_list width870" style="overflow:inherit;">
                <span class="width250 word_center">备案通知书原件扫描件：</span>
                <div class="width600" style="display:inline-block;">
                    <pic-view ng-repeat="file in purchaseForm.editForm.attachments" ng-if="file.type==purchaseForm.attachmentType.recordNotice" file-name="file.name" file-path="file.url"></pic-view>
                </div>
            </div>
            <div class="reDraft_list width870" style="overflow:inherit;">
                <span class="width250 word_center">会议纪要原件扫描件：</span>
                <div class="width600" style="display:inline-block;">
                    <pic-view ng-repeat="file in purchaseForm.editForm.attachments" ng-if="file.type==purchaseForm.attachmentType.meetingMinutes" file-name="file.name" file-path="file.url"></pic-view>
                </div>
            </div>
            </div>
            <div class="reDraft_btn" style="padding:0">
                <button class="btn_bd" ng-click="closeThisDialog()">返回</button>
            </div>
        </div>`;
    }
}
uploadContract.$inject = ['purchaseService','ProjectInterface','$stateParams','$scope'];
