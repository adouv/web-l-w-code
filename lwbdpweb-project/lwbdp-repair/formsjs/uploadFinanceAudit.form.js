import baseForm from './base.form';
export default class uploadFinanceAudit extends baseForm{
    constructor($scope){
        super();
        this.$scope = $scope;
    }

    clearNoNum(data,name){
        if(data[name]){
            let newValue = data[name].toString();
            if (newValue != '' && newValue.substring(0, 1) == '.') {
                newValue = "";
            }
            newValue = newValue.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
            newValue = newValue.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            newValue = newValue.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            if (newValue.indexOf(".") != -1) {
                newValue = newValue.substr(0, newValue.indexOf(".") + 7);
            }
            if (newValue.indexOf(".") < 0 && newValue != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                newValue = parseFloat(newValue);
            }
            data[name] = newValue;
        }
    }

    auditThisTask(data){
        this.auditing = true;
        data.usefulVars = [{name:'approveAmount',value:data.keywords}];
        this.auditTask(data)
    }
    
    getTemplate(){
        return `
            <div class="repaDisposal_info" ng-if="repairForm.isEdit===true||repairForm.isEdit===undefined">
            <form class="w5c-form" novalidate  name="addConfigForm">
                <p class="file_preview_tit">
                    <span>{{repairForm.editForm.taskTitle}}</span>
                </p>
                <div class="disposal_content">
                    <div class="reDraft_list" style="width: 880px;">
                        <span class="w250 word_center">项目预算评审报告审定金额：</span>
                        <span class="word_center">
                            <input type="text" class="input_class" ng-change="repairForm.clearNoNum(repairForm.editForm,'keywords')" ng-model="repairForm.editForm.keywords" name="keyword" required>万元   <i class="msgInfo2">&nbsp;&nbsp;&nbsp;所填金额必须和财政预算评审报告原件上的审定金额项完全相同</i>
                        </span>
                    </div>
                    <bdp-upload-file
                            required='true'
                            attachment-list="repairForm.editForm.attachments"
                            title="财政预算评审报告原件扫描件"
                            remark-file="加盖公章和签字，只允许上传jpeg、jpg、png格式的文档，单个大小不超过10M"
                            type="financeBudget"
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
                    <span class="w250 word_center fl">财政预算评审报告原件扫描件：</span>
                    <div class="bale_list fl">
                        <pic-view ng-repeat="x in repairForm.detailForm.attachments track by $index" file-name="x.name" file-path="x.url"></pic-view>
                    </div>
                </div>
                <div class="report_btn bottom_btn">
                    <span class="btn_bd" ng-click="closeThisDialog()">返回</span>
                </div>
            </div>
        </div>
        `
    }
}
uploadFinanceAudit.$inject = ['$scope'];
