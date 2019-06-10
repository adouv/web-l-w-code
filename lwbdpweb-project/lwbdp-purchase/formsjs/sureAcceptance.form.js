/**
 * @Author hejialin
 * @Description 描述
 */
export default class sureAcceptance{
    constructor(dialogsManager){
        this.noSetting = true;
        this.dialogsManager = dialogsManager;
    }

    auditThisTask(){
        if(this.editForm.isSure!==true){
            this.dialogsManager.showMessage('存在必填项未填写，请填写后再提交！！',{className:'warning'});
            return;
        }
        this.auditing = true;
        this.auditTask(this.editForm);
    }

    getTemplate(){
        return `<form class="w5c-form" novalidate name="purchaseAuditForm">
            <h1 class="audit_task_title">{{purchaseForm.taskName}}</h1>
            <div class="audit_row col_height bor_gray dashed">
                <div style="width: 800px;margin: auto;">
                <p class="col_span">确定项目线下验收已完成：</p>
                <div class="col_div" style="margin: 0">
                    <input type="checkbox" class="box_checked" ng-model="purchaseForm.editForm.isSure">
                    <div class="box_wrapper" ng-show="!purchaseForm.editForm.isSure"><p>本项目验收线下验收已完成</p>（点击确认）</div>
                    <div class="box_wrapper box_line" ng-show="purchaseForm.editForm.isSure">本项目验收线下验收已完成 &nbsp;<i class="iconfont icon-duigou"></i></div>
                </div>
                </div>
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
            <div class="audit_row">
                <p class="col_span">下一步操作最晚完成任务的时间节点：</p>
                <p class="col_div">
                    <input type="text" id="laterDate" class="input_class gray_bor" ng-disabled="purchaseForm.noSetting" lw-laydate='YYYY-MM-DD' readonly="readonly" ng-model="purchaseForm.editForm.dueDate" name="laterDate" ng-required="!purchaseForm.noSetting" placeholder="年/月/日"/>
                    <i class="iconfont icon-llreservecalendar"></i>
                    <input type="checkbox" class="checkbox_class" ng-model="purchaseForm.noSetting" id="no-setting" ng-change="purchaseForm.editForm.dueDate =''">
                    <label for="no-setting">不设置</label>
                </p>
            </div>
            <div class="text_center footer">
                <button class="btn_bd" ng-click="auditCancel()">取消</button>
                <button class="btn_bg" ng-disabled="purchaseForm.nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0||purchaseForm.auditing" form-submit-valid="purchaseForm.auditThisTask()">确定</button>
            </div>
        </form>`;
    }
}
sureAcceptance.$inject = ['dialogsManager'];
