/**
 * @Author hejialin
 * @Description 通用公共审核
 */
export default class auditCommon{
    constructor(WorkflowInterface,purchaseInterface,$stateParams,$sessionStorage,ProjectInterface){
        this.$stateParams = $stateParams;
        this.WorkflowInterface = WorkflowInterface;
        this.purchaseInterface = purchaseInterface;
        this.ProjectInterface = ProjectInterface;
        this.garden = $sessionStorage.get('currentGarden');
        this.getAuditedTaskInfo();
    }

    /**
     * 获取被审核节点
     * @param this.currentTaskId 从外边传进来
     */
    getAuditedTaskInfo(){
        this.WorkflowInterface.getAuditedTaskInfo(this.currentTaskId).then(res=>{
            this.auditedTask = res.data;
        });
    }

    /**
     * 切换选中通过/不通过
     */
    toggleResult(){
        this.ProjectInterface.getNextTaskAudit(
            null, this.currentTaskId,
            this.garden.gardenId,
            'approved', this.editForm.agreed||true
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

    auditThisTask(){
        this.auditing = true;
        this.auditTask(this.editForm);
    }

    getTemplate(){
        return `<form class="w5c-form" novalidate name="purchaseAuditForm">
            <a href="javascript:void()0;" name="{{purchaseForm.auditedTask.taskKey}}audit"></a>
            <h1 class="audit_task_title">{{purchaseForm.taskName}}</h1>
            <div class="audit_row">
                <p class="col_span">审核结果：</p>
                <div class="col_div" style="width:600px;">
                    <p class="audit_result audit_span">
                        <label><input class="radio_class" type="radio" ng-model="purchaseForm.editForm.agreed" ng-change="purchaseForm.toggleResult()" value="true">通过</label>
                        <label><input class="radio_class" type="radio" ng-model="purchaseForm.editForm.agreed" ng-change="purchaseForm.toggleResult()" value="false">不通过</label>
                    </p>
                    <a class="col_span look_link" href="#{{purchaseForm.auditedTask.taskKey}}" ng-click="purchaseForm.lookAuditedTask(purchaseForm.auditedTask.taskKey)">查看需审批内容&gt;&gt;</a>
                </div>
            </div>
            <div class="bor_gray dashed">
                <p class="col_span textarea_title">审核意见：</p>
                <p class="col_span">
                    <textarea class="bor_gray overflow_box_sm" placeholder="500个汉字以内，不必填" ng-model="purchaseForm.editForm.comment.message" maxlength="500"></textarea>
                </p>
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
                                                
                        <select-options class="next_auditor" ng-model="purchaseForm.editForm[nextAuditInfo.assigneeVar]" repeat-items="data in nextAuditInfo.nextAuditorQoList" name="assigneeVar" item-key="accountId" required>
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

auditCommon.$inject = ['WorkflowInterface','purchaseInterface','$stateParams','$sessionStorage','ProjectInterface'];
