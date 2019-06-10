export default class drawCostUnit{
    constructor(){
        this.editForm.noticeMethods = ['system'];
    }

    getAllNotice(name,event){
        if(event.target.checked){
            this.editForm.noticeMethods.push(name);    
        }else{
            let index = this.editForm.noticeMethods.indexOf(name);
            this.editForm.noticeMethods.splice(index,1);
        }
    }

    auditThisTask(data){
        this.auditing = true;
        this.auditTask(data)
    }
    
    getTemplate(){
        return `<div class="repaDisposal_info">
        <form class="form-submit-valid"  novalidate  name="Form">
            <p class="file_preview_tit">
                <span>{{repairForm.editForm.taskTitle}}</span>
            </p>
            <div class="disposal_content" id="outlay">
                <div class="reDraft_list">
                    <span class="w200 word_center">项目造价单位：</span>
                    <span class="btn_bd word_center">抽签</span>
                </div>
                <div class="reDraft_list">
                    <span class="w200 word_center">通知造价单位的通知方式选择：</span>
                    <div class="check_list">
                        <div class="checkbox_list">
                            <input ng-disabled="true" checked="true" disabled='true' ng-click="repairForm.getAllNotice('system',$event)" type="checkbox" class="checkbox_class" id="checked" />
                            <label for="checked">系统消息</label>
                        </div>
                        <div class="checkbox_list">
                            <input ng-click="repairForm.getAllNotice('sms',$event)" type="checkbox" class="checkbox_class" id="checked2" />
                            <label for="checked2">短信</label>
                        </div>
                        <div class="checkbox_list">
                            <input ng-click="repairForm.getAllNotice('wechat',$event)" type="checkbox" class="checkbox_class" id="checked3" />
                            <label for="checked3">微信</label>
                        </div>
                        <div class="checkbox_list">
                            <input ng-click="repairForm.getAllNotice('email',$event)" type="checkbox" class="checkbox_class" id="checked4" />
                            <label for="checked4">邮件</label>
                        </div>
                    </div>
                </div>
                <div class="reDraft_list">
                    <span class="w200 word_center">完成时间状态：</span>
                    <span class="green_color word_center">
                        <i ng-if="repairForm.nextAuditInfo.statusDescription==='正常'" class="green_color">正常</i>
                        <i ng-if="repairForm.nextAuditInfo.statusDescription==='临期'" class="yellow_color">临期</i>
                        <i ng-if="repairForm.nextAuditInfo.statusDescription!=='正常'&&repairForm.nextAuditInfo.statusDescription!=='临期'&&repairForm.nextAuditInfo.statusDescription" class="red_color">{{repairForm.nextAuditInfo.statusDescription}}</i>
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
                    <select-options class="select_class selectW200 get_method" name="type" id="nextAuditor" ng-model="repairForm.editForm[repairForm.nextAuditInfo.assigneeVar]" name="user" ng-if="repairForm.nextAuditInfo.nextAuditorQoList[0]"
                          repeat-items="data in repairForm.nextAuditInfo.nextAuditorQoList" item-key="accountId"
                    >
                       {{data.displayName}}<span>({{data.gardenName}})</span>
                    </select-options>
                    <span ng-if="!repairForm.nextAuditInfo.nextAuditorQoList[0]" class="word_center gray">系统流程中下一步节点没有您可以选择操作人用户，请您联系平台管理员进行处理。</span>
                </div>
               <div class="reDraft_btn" style="padding:0">
                    <span class="btn_bd" ng-click="repairForm.isEdit!==undefined?closeThisDialog():repairForm.auditCancel()">取消</span>
                    <button class="btn_bg" ng-disabled="repairForm.auditing" form-submit-valid="repairForm.auditThisTask(repairForm.editForm)">确定</button>
                </div>
            </div>
        </form>
    </div>
    `;
    }
}