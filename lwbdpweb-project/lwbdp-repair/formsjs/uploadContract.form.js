import baseForm from './base.form';
export default class uploadContract extends baseForm{
    constructor($scope){
        super();
        this.$scope = $scope;
    }

    auditThisTask(data){
        this.auditing = true;
        this.auditTask(data)
    }

    getTemplate(){
        return `<div class="repaDisposal_info" ng-if="repairForm.isEdit===true||repairForm.isEdit===undefined">
                <form class="w5c-form"  novalidate  name="addConfigForm">
                    <p class="file_preview_tit">
                        <span>{{repairForm.editForm.taskTitle}}</span>
                    </p>
                    <div class="disposal_content" style="width:870px;">
                        <bdp-upload-file
                                required="true"
                                attachment-list="repairForm.editForm.attachments"
                                title="项目合同原件扫描件"
                                remark-file="加盖公章和签字只允许上传jpeg、jpg、png格式的文档，单个大小不超过10M"
                                type="projectAgreementScript"
                                size="{{10*1024*1024}}"
                                format="jpg,jpeg,png">
                        </bdp-upload-file>
                        <bdp-upload-file
                                required="true"
                                attachment-list="repairForm.editForm.attachments"
                                title="项目合同律师意见书"
                                remark-file="只允许上传jpeg、jpg、png格式的文档，单个大小不超过10M"
                                type="projectAgreementLawyer"
                                size="{{10*1024*1024}}"
                                format="jpg,jpeg,png">
                        </bdp-upload-file>
                        <bdp-upload-file
                                required="true"
                                attachment-list="repairForm.editForm.attachments"
                                title="项目备案通知书"
                                remark-file="只允许上传jpeg、jpg、png格式的文档，单个大小不超过10M"
                                type="projectRecord"
                                size="{{10*1024*1024}}"
                                format="jpg,jpeg,png">
                        </bdp-upload-file>
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
                            <span ng-if="!repairForm.nextAuditInfo.nextAuditorQoList[0]" class="word_center gray">系统流程中下一步节点没有您可以选择操作人用户，请您联系平台管理员进行处理。</span>
                        </div>
                        <div class="reDraft_btn" ng-class="{'bottom_btn':repairForm.isEdit!==undefined}">
                            <span class="btn_bd" ng-click="repairForm.isEdit!==undefined?closeThisDialog():repairForm.auditCancel()">取消</span>
                            <button class="btn_bg" ng-disabled="repairForm.auditing" form-submit-valid="repairForm.isEdit!==undefined?repairForm.saveAuditInfo():repairForm.auditThisTask(repairForm.editForm)">确定</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="repaDisposal_info" ng-if="repairForm.isEdit===false">
                <div class="disposal_content">
                    <div class="reDraft_list">
                        <span class="w250 word_center fl">项目合同原件扫描件：</span>
                        <div class="bale_list fl">
                            <pic-view ng-repeat="x in repairForm.detailForm.attachments track by $index" ng-if="x.type=='projectAgreementScript'" file-name="x.name" file-path="x.url"></pic-view>
                        </div>
                    </div>
                    <div class="reDraft_list">
                        <span class="w250 word_center fl">项目合同律师意见书：</span>
                        <div class="bale_list fl">
                            <pic-view ng-repeat="x in repairForm.detailForm.attachments track by $index" ng-if="x.type=='projectAgreementLawyer'" file-name="x.name" file-path="x.url"></pic-view>
                        </div>
                    </div>
                    <div class="reDraft_list">
                        <span class="w250 word_center fl">项目备案通知书：</span>
                        <div class="bale_list fl">
                            <pic-view ng-repeat="x in repairForm.detailForm.attachments track by $index" ng-if="x.type=='projectRecord'" file-name="x.name" file-path="x.url"></pic-view>
                        </div>
                    </div>
                    <div class="report_btn bottom_btn">
                        <span class="btn_bd" ng-click="closeThisDialog()">返回</span>
                    </div>
                </div>
            </div>`;
    }
}
uploadContract.$inject = ['$scope'];
