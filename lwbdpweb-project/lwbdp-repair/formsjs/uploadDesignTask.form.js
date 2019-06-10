export default class uploadDesignTask{
    constructor(){
        this.noSetting = true;
        this.editForm.noticeMethods = ['system'];
    }
    
    getAllNotice(name,$event){
        let checked = $event.target.checked;
        if(checked){
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
        return `<div class="repaDisposal_info" ng-if="repairForm.isEdit===true||repairForm.isEdit===undefined">
            <form class="w5c-form" novalidate  name="addConfigForm">
                <p class="file_preview_tit">
                    <span>{{repairForm.editForm.taskTitle}}</span>
                </p>
                <div class="disposal_content auditFormWidth">
                <bdp-upload-file
                        required='true'
                        attachment-list="repairForm.editForm.attachments"
                        title="发布项目设计任务书"
                        remark-file="只允许上传doc、docx、xls、xlsx、ppt、pptx、rar和pdf格式的文档，大小不超过10M；"
                        type="publishProject"
                        size="{{10*1024*1024}}"
                        format="doc,docx,xls,xlsx,ppt,pptx,rar,pdf">
                </bdp-upload-file>
                    <div class="reDraft_list">
                        <span class="w250 word_center">通知设计单位的通知方式选择：</span>
                        <div class="check_list">
                            <div class="checkbox_list">
                                <input disabled="true" ng-checked="repairForm.editForm.noticeMethods.indexOf('system')>-1" ng-click="repairForm.getAllNotice('system',$event)" type="checkbox" class="checkbox_class" id="checked"/>
                                <label for="checked">系统消息</label>
                            </div>
                            <div class="checkbox_list">
                                <input ng-click="repairForm.getAllNotice('sms',$event)" type="checkbox" ng-checked="repairForm.editForm.noticeMethods.indexOf('sms')>-1" class="checkbox_class" id="checked2"/>
                                <label for="checked2">短信</label>
                            </div>
                            <div class="checkbox_list">
                                <input ng-click="repairForm.getAllNotice('wechat',$event)" ng-checked="repairForm.editForm.noticeMethods.indexOf('wechat')>-1" type="checkbox" class="checkbox_class" id="checked3"/>
                                <label for="checked3">微信</label>
                            </div>
                            <div class="checkbox_list">
                                <input ng-click="repairForm.getAllNotice('email',$event)" ng-checked="repairForm.editForm.noticeMethods.indexOf('email')>-1" type="checkbox" class="checkbox_class" id="checked4" />
                                <label for="checked4">邮件</label>
                            </div>
                        </div>
                    </div>
                    <div class="reDraft_list">
                        <span class="w250 word_center">完成时间状态：</span>
                         <span class="green_color word_center">
                                <i ng-if="repairForm.nextAuditInfo.statusDescription==='正常'" class="green_color">正常</i>
                                <i ng-if="repairForm.nextAuditInfo.statusDescription==='临期'" class="yellow_color">临期</i>
                                <i ng-if="repairForm.nextAuditInfo.statusDescription!=='正常'&&repairForm.nextAuditInfo.statusDescription!=='临期'&&repairForm.nextAuditInfo.statusDescription" class="red_color">{{repairForm.nextAuditInfo.statusDescription}}</i>
                              </span>
                    </div>
                    <div class="reDraft_list">
                        <span class="w250 word_center">最晚完成任务日期截点：</span>
                        <span class="word_center">{{ repairForm.nextAuditInfo.dueDate | date:'yyyy-MM-dd' }}</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="w250 word_center">下一步操作名称：</span>
                        <span class="word_center">
                        {{ repairForm.nextAuditInfo.taskName }}
                    </span>
                    </div>
                    <div class="reDraft_list">
                        <span class="w250 word_center">下一步操作人：</span>
                        <select-options class="select_class selectW200 get_method" name="type" id="nextAuditor" ng-model="repairForm.editForm[repairForm.nextAuditInfo.assigneeVar]" name="user" ng-if="repairForm.nextAuditInfo.nextAuditorQoList[0]"
                            repeat-items="data in repairForm.nextAuditInfo.nextAuditorQoList" item-key="accountId"
                        >
                            {{data.displayName}}<span>({{data.gardenName}})</span>
                        </select-options>
                        <i ng-if="!repairForm.nextAuditInfo.nextAuditorQoList[0]">系统流程中下一步节点没有您可以选择操作人用户，请您联系平台管理员进行处理。</i>
                    </div>
                    <div class="reDraft_list">
                        <span class="w250 word_center">下一步操作最晚完成任务的时间截点：</span>
                        <div class="word_center dueDateDiv" ng-class="{'disabled':repairForm.noSetting}">
                            <input type="text" class="input_class" id="date" lw-laydate value="{{repairForm.editForm.dueDate | date:'yyyy/MM/dd'}}" ng-model="repairForm.editForm.dueDate" name="dueDate" ng-disabled="repairForm.noSetting"  ng-required="!repairForm.noSetting">
                            <span class="iconfont icon-llreservecalendar dueDateBtn"></span>
                        </div>
                        <span class="no_setting">
                            <input type="checkbox" class="checkbox_class" id="checkbox" ng-model="repairForm.noSetting"><label for="checkbox">不设置</label>
                        </span>
                    </div>
                    <div class="reDraft_btn" style="padding:0">
                        <span class="btn_bd" ng-click="repairForm.isEdit!==undefined?closeThisDialog():repairForm.auditCancel()">取消</span>
                        <span class="btn_bg" ng-disabled="repairForm.auditing" form-submit-valid="repairForm.auditThisTask(repairForm.editForm)">确定</span>
                    </div>
                </div>
            </form>
        </div>
        <div class="repaDisposal_info" ng-if="repairForm.isEdit===false">
            <div class="disposal_content">
                <div class="reDraft_list">
                    <span class="w250 word_center fl">发布项目设计任务书：</span>
                    <div class="bale_list fl">
                        <pic-view ng-repeat="x in repairForm.detailDataAttachments.publishProject track by $index" file-name="x.name" file-path="x.url"></pic-view>
                    </div>
                </div>
                <div class="report_btn bottom_btn">
                    <span class="btn_bd" ng-click="closeThisDialog()">返回</span>
                </div>
            </div>
        </div>`;
    }
}
