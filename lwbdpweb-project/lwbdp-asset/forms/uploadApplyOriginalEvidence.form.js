export default class uploadEvidence{
    constructor($scope){
        this.$scope = $scope;
    }
    
    saveAudit(){
        this.$scope.$emit('formData',this.editForm);
        this.$scope.closeThisDialog();
    }

    auditThisTask(data){
        this.auditing = true;
        this.auditTask(data)
    }
    
    getTemplate(){
        return `<div class="rg_con_long" ng-if="assetForm.isEdit===true||assetForm.isEdit==undefined">
            <form class="w5c-form"  novalidate  name="assetName">
                <p style="line-height: 40px;">
                    <span class="lf_name">资产是否处置 :</span>
                    <span class="rg_con">
                        <label for="pass">
                            <input ng-model="assetForm.editForm.isDispose" type="radio" value="true" class="radio_class" id="pass">是
                        </label>
                        <label for="notpass">
                            <input ng-model="assetForm.editForm.isDispose" type="radio" value="false" class="radio_class" id="notpass">否
                        </label>
                    </span>
                </p>
                <bdp-upload-file
                        required='true'
                        attachment-list="assetForm.editForm.attachments"
                        title="申报表的签字盖章原件扫描件"
                        remark-file="只允许上传jpg png gif格式图片,大小不超过10M;请保证图片文件清晰可见"
                        type="applyOriginEvidence"
                        size="{{10*1024*1024}}"
                        format="jpg,png,gif">
                </bdp-upload-file>
                <p ng-if="assetForm.nextAuditInfo.dueDate">
                    <span class="lf_name">最晚完成任务日期截点：</span>
                    <span class="rg_con">
                         {{ assetForm.nextAuditInfo.dueDate | date:'yyyy-MM-dd' }}
                    </span>
                </p>
                <p ng-if="assetForm.nextAuditInfo.statusDescription">
                    <span class="lf_name">完成时间状态：{{assetForm.nextAuditTaskInfo.statusDescription}}</span>
                    <span class="rg_con" ng-switch="assetForm.nextAuditInfo.statusDescription">
                        <i ng-switch-when='正常' class="green_color">{{assetForm.nextAuditInfo.statusDescription}}</i>
                        <i ng-switch-when='临期' class="yellow_color">{{assetForm.nextAuditInfo.statusDescription}}</i>
                        <i ng-switch-default="" class="red_color">{{assetForm.nextAuditInfo.statusDescription}}</i>
                    </span>
                </p>
                <p>
                    <span class="lf_name">下一步操作名称：</span>
                    <span class="rg_con">
                        {{ assetForm.nextAuditInfo.taskName }}
                    </span>
                </p>
                <p>
                    <span class="lf_name mid">下一步操作人：</span>
                    <span class="rg_con" ng-if="assetForm.nextAuditInfo.nextAuditorQoList[0]">
                        
                        <select-options class="selectWid400 get_method" ng-model="assetForm.editForm[assetForm.nextAuditInfo.assigneeVar]" repeat-items="data in assetForm.nextAuditInfo.nextAuditorQoList" item-key="accountId" required>
                            {{data.displayName}} <span>（{{data.gardenName}}）</span>
                        </select-options>
                    </span>
                    <span class="rg_con gray" ng-if="!assetForm.nextAuditInfo.nextAuditorQoList[0]">系统流程中下一步节点没有您可以选择操作人用户，请您联系平台管理员进行处理。</span>
                </p>
                <div class="btn_box">
                    <span class="btn_bd" ng-click="assetForm.isEdit===undefined?assetForm.auditCancel():closeThisDialog()">取消</span>
                    <span class="btn_bg" ng-disabled="assetForm.auditing" form-submit-valid="assetForm.isEdit===undefined?assetForm.auditThisTask(assetForm.editForm):assetForm.saveAudit()">确定</span>
                </div>
            </form>
        </div>
        <div ng-if="assetForm.isEdit===false" class="rg_con_long">
            <div class="overflow_hide">
                <p>
                    <span class="lf_name">申报表的签字盖章原件扫描件：</span>
                </p>
                <div class="add_img_box" style="margin-left:250px;">
                    <pic-view ng-repeat="x in assetForm.detailForm.attachments track by $index" ng-if="x.type=='applyOriginEvidence'" file-name="x.name" file-path="x.url"></pic-view>
                </div>
            </div>
        </div>`;
    }
}
uploadEvidence.$inject = ['$scope'];
