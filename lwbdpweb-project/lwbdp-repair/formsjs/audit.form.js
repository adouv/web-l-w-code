export default class auditForm{
    constructor(ProjectInterface,$sessionStorage){
        this.ProjectInterface = ProjectInterface;
        this.garden = $sessionStorage.get('currentGarden');
    }

    toggleAuditResult(){
        this.ProjectInterface.getNextTaskAudit(
            null,
            this.currentTaskId,
            this.garden.gardenId,
            'approved',this.editForm.approved
        ).then(res => {
            let nextTaskInfoList = res.data.nextTaskInfoList[0];
            let nextAuditInfo = nextTaskInfoList||{};
            nextAuditInfo.dueDate = res.data.dueDate;
            nextAuditInfo.statusDescription = res.data.statusDescription;
            this.nextAuditInfo = nextAuditInfo;
            this.getFirstAuditor(nextAuditInfo);
        })
    }

    getFirstAuditor(nextAuditInfo){
        if(nextAuditInfo && nextAuditInfo.nextAuditorQoList.length>0){
            this.editForm[nextAuditInfo.assigneeVar] = nextAuditInfo.nextAuditorQoList[0].accountId;
        }else{
            this.editForm[nextAuditInfo.assigneeVar] = null;
        }
    }

    auditThisTask(data){
        this.auditing = true;
        this.auditTask(data)
    }

    getTemplate(){
        return `<div class="repaDisposal_info" name="auditForm">
    <form class="w5c-form" novalidate  name="addConfigForm">
        <p class="file_preview_tit">
            <span>{{repairForm.editForm.taskTitle}}</span>
        </p>
        <div class="disposal_content" id="outlay">
            <!--<div class="reDraft_list" ng-if="repairForm.auditInfo.length > 0">
                <span class="w200 word_center">重新提交且待审核内容：</span>
                <span class="word_center lookApproveInfo" ng-click="repairForm.findAttachmentHTMLNode()">查看需审批内容 &gt;&gt;</span>
            </div>-->
            <div class="reDraft_list">
                <span class="w200 word_center">审核结果：</span>
                <span class="word_center lookApproveCon">
                    <label>
                        <input type="radio" class="radio_class" ng-model="repairForm.editForm.approved" ng-change="repairForm.toggleAuditResult()" value="true">通过
                    </label>
                    <label>
                        <input type="radio" ng-model="repairForm.editForm.approved" class="radio_class" ng-change="repairForm.toggleAuditResult()" value="false">不通过
                    </label>
                    <span class="word_center lookApproveInfo" style="float: right" ng-click="repairForm.findAttachmentHTMLNode(repairForm.auditedTaskKey?'projectApproval':'applyOrder')">查看需审批内容 &gt;&gt;</span>
                </span>
            </div>
            <div class="reDraft_list">
                <span class="w200 word_center fl">审核意见：</span>
                <textarea maxlength="500" ng-model="repairForm.editForm.comment.message"
                          class="word_center textarea_class" placeholder="500个汉字以内，非必填" name="comment"></textarea>
            </div>

            <div class="reDraft_list">
                <span class="w200 word_center">完成时间状态：</span>
                <span class="green_color word_center">
                    <i ng-if="repairForm.nextAuditInfo.statusDescription==='正常'" class="green_color">正常</i>
                    <i ng-if="repairForm.nextAuditInfo.statusDescription==='临期'" class="yellow_color">临期</i>
                    <i ng-if="repairForm.nextAuditInfo.statusDescription!=='正常'&&repairForm.nextAuditInfo.statusDescription!=='临期'&&repairForm.nextAuditInfo.statusDescription"
                       class="red_color">{{repairForm.nextAuditInfo.statusDescription}}</i>
            </span>
            </div>
            <div class="reDraft_list" ng-if="repairForm.nextAuditInfo.dueDate">
                <span class="w200 word_center">最晚完成任务日期截点：</span>
                <span class="word_center">{{ repairForm.nextAuditInfo.dueDate | date:'yyyy-MM-dd' }}</span>
            </div>
            <div class="reDraft_list">
                <span class="w200 word_center">下一步操作名称：</span>
                <span class="word_center">
                    {{ repairForm.nextAuditInfo.taskName }}
                </span>
            </div>
            <div class="reDraft_list">
                <span class="w200 word_center">下一步操作人：</span>
                <select-options class="select_class selectW200 get_method" name="type" id="nextAuditor"
                        ng-model="repairForm.editForm[repairForm.nextAuditInfo.assigneeVar]" name="user"
                        repeat-items="data in repairForm.nextAuditInfo.nextAuditorQoList" item-key="accountId"
                        ng-if="repairForm.nextAuditInfo.nextAuditorQoList[0]">
                        {{data.displayName}}<span>({{data.gardenName}})</span>
                </select-options>
                <span ng-if="!repairForm.nextAuditInfo.nextAuditorQoList[0]" class="word_center gray">系统流程中下一步节点没有您可以选择操作人用户，请您联系平台管理员进行处理。</span>
            </div>
            <div class="reDraft_btn" style="padding:0">
                <span class="btn_bd" ng-click="repairForm.auditCancel()">取消</span>
                <button class="btn_bg" ng-disabled="repairForm.auditing" form-submit-valid="repairForm.auditThisTask(repairForm.editForm)">确定</button>
            </div>
        </div>
    </form>
</div>`;
    }
}
auditForm.$inject = ['ProjectInterface','$sessionStorage'];
