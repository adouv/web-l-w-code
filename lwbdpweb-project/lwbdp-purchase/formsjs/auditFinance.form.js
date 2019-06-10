/**
 * @Author hejialin
 * @Description 描述
 */
export default class auditFinance{
    constructor($sessionStorage,ProjectInterface){
        this.editForm.attachments = [];
        this.ProjectInterface = ProjectInterface;
        this.garden = $sessionStorage.get('currentGarden');
    }

    auditThisTask(){
        this.auditing = true;
        this.auditTask(this.editForm);
    }

    /**
     * 切换选中通过/不通过
     */
    toggleResult(){
        this.ProjectInterface.getNextTaskAudit(
            null, this.currentTaskId,
            this.garden.gardenId,
            'approved', this.editForm.approved
        ).then(res => {
            let nextAuditInfo = {};
            let nextTaskInfoList = res.data.nextTaskInfoList;
            nextAuditInfo.taskInfoList = nextTaskInfoList||[];
            nextAuditInfo.dueDate = res.data.dueDate;
            nextAuditInfo.statusName = res.data.statusDescription;
            this.nextAuditInfo = nextAuditInfo;
            this.getFirstAuditor(nextAuditInfo.taskInfoList);
        })
    }

    getFirstAuditor(nextAuditInfo){
        if(nextAuditInfo && nextAuditInfo.length>0
            && nextAuditInfo[0].nextAuditorQoList.length>0){
            nextAuditInfo = nextAuditInfo[0];
            this.editForm[nextAuditInfo.assigneeVar] = nextAuditInfo.nextAuditorQoList[0].accountId;
        }else{
            this.editForm[nextAuditInfo.assigneeVar] = null;
        }
    }

    getTemplate(){
        return `<form class="w5c-form" novalidate name="purchaseAuditForm">
            <h1 class="audit_task_title">{{purchaseForm.taskName}}</h1>
            <div class="audit_row">
                <p class="col_span">财政局审核结果：</p>
                <div class="col_div">
                    <p class="audit_result audit_span">
                        <label><input class="radio_class" type="radio" ng-model="purchaseForm.editForm.approved" ng-change="purchaseForm.toggleResult()" value="true">通过</label>
                        <label><input class="radio_class" type="radio" ng-model="purchaseForm.editForm.approved" ng-change="purchaseForm.toggleResult()" value="false">不通过</label>
                    </p>
                </div>
            </div>
            <div class="bor_gray dashed upload_wrapper">
                <bdp-upload-file
                    required="true"
                    attachment-list="purchaseForm.editForm.attachments"
                    title="项目立项审批表原件（含签字盖章）扫描件"
                    message="只允许上传jpg、png、gif格式的图片，大小不超过5M"
                    type="{{purchaseForm.attachmentType.auditFinance}}"
                    size="{{5*1024*1024}}"
                    format="jpg,png,gif">
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
                <button class="btn_bg" ng-disabled="purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0||purchaseForm.auditing" form-submit-valid="purchaseForm.auditThisTask(purchaseForm.editForm)">确定</button>
            </div>
        </form>`;
    }
}
auditFinance.$inject = ['$sessionStorage','ProjectInterface'];
