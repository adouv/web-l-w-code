export default class assetDisposalAudit{
    constructor($sessionStorage,ProjectInterface,$scope){
        this.$scope = $scope;
        this.ProjectInterface = ProjectInterface;
        this.garden = $sessionStorage.get('currentGarden');
        this.getAuditedAreaId(500);
    }

    getAuditedAreaId(time){
        this.$scope.$watch('assetForm.nextAuditInfo',nextAuditInfo=>{
            if(nextAuditInfo){
            console.log(nextAuditInfo)
                let flag = this.editForm.approved==='true';
                if(flag&&(!this.nextAuditInfo || !this.nextAuditInfo.taskKey)){
                    this.auditedTargetId = '#lastApplyAttachment';
                }else if(!flag&&this.nextAuditInfo.taskKey=='usertask12-redosame'){
                    this.auditedTargetId = '#lastApplyAttachment';
                }else if(flag&&this.nextAuditInfo.taskKey=='usertask12-redosame'){
                    this.auditedTargetId = '#approvalAttachment';
                }else if(!flag&&this.nextAuditInfo.taskKey=='usertask09-uploadEvidence-redosame-dispose'){
                    this.auditedTargetId = '#approvalAttachment';
                }else{
                    this.auditedTargetId = '#applyOrder';
                }
            }
        });
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
            let nextTaskInfoList = res.data.nextTaskInfoList;
            let nextAuditInfo = nextTaskInfoList[0]||[];
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
        return `<div id="auditApplyOrder">
            <p>
                <span class="lf_name">审核结果：</span>
                <span class="rg_con" style="width: 580px;display: inline-block;">
                    <label for="pass"><input ng-model="assetForm.editForm.approved" type="radio" ng-change="assetForm.toggleResult()" class="radio_class" id="pass" value="true">通过</label>
                    <label for="notpass"><input ng-model="assetForm.editForm.approved" type="radio" ng-change="assetForm.toggleResult()" class="radio_class" id="notpass" value="false">不通过</label>
                    <a class="fr" style="color:#0096ff;" href="javascript:void(0);" ng-click="assetForm.findAuditedNodeArea(assetForm.auditedTargetId)">查看需审批内容&gt;&gt;</a>
                </span>
            </p>
            <p>
                <span class="lf_name">审核意见：</span>
                <span class="rg_con"><textarea ng-model="assetForm.editForm.comment.message" class="textarea_class" name="" placeholder="500个汉字以内,不必填"></textarea></span>
            </p>
            <p class="choose_way" ng-if="assetForm.nextAuditInfo.dueDate">
                <span class="lf_name">最晚完成任务日期截点：</span>
                <span class="rg_con">{{ assetForm.nextAuditInfo.dueDate | date:'yyyy-MM-dd' }}</span>
            </p>
            <p ng-if="assetForm.nextAuditInfo.statusDescription">
                <span class="lf_name">完成时间状态：</span>
                <span class="rg_con">
                    <i ng-if="assetForm.nextAuditInfo.statusDescription==='正常'" class="green_color">{{assetForm.nextAuditInfo.statusDescription}}</i>
                    <i ng-if="assetForm.nextAuditInfo.statusDescription==='临期'" class="yellow_color">{{assetForm.nextAuditInfo.statusDescription}}</i>
                    <i ng-if="assetForm.nextAuditInfo.statusDescription!=='正常'&&assetForm.nextAuditInfo.statusDescription!=='临期'" class="red_color">{{assetForm.nextAuditInfo.statusDescription}}</i>
                </span>
            </p>
            <p ng-if="assetForm.nextAuditInfo.taskName">
                <span class="lf_name">下一步操作名称：</span>
                <span class="rg_con">
                    {{ assetForm.nextAuditInfo.taskName }}
                </span>
            </p>
            <p ng-if="assetForm.nextAuditInfo.nextAuditorQoList.length>0">
                <span class="lf_name mid">下一步操作人：</span>
                <span class="rg_con" ng-if="assetForm.nextAuditInfo.nextAuditorQoList[0]">
                   
                    <select-options class="selectWid400 get_method" ng-model="assetForm.editForm[assetForm.nextAuditInfo.assigneeVar]" repeat-items="data in assetForm.nextAuditInfo.nextAuditorQoList" item-key="accountId" required>
                            {{data.displayName}} <span>（{{data.gardenName}}）</span>
                    </select-options>
                </span>
                <span class="rg_con gray" ng-if="!assetForm.nextAuditInfo.nextAuditorQoList[0]">系统流程中下一步节点没有您可以选择操作人用户，请您联系平台管理员进行处理。</span>
            </p>
            <div class="btn_box">
                <span class="btn_bd" ng-click="assetForm.auditCancel()">取消</span>
                <button class="btn_bg" ng-disabled="assetForm.auditing" ng-click="assetForm.auditThisTask(assetForm.editForm)">确定</button>
            </div>
        </div>`;
    }
}
assetDisposalAudit.$inject = ['$sessionStorage','ProjectInterface','$scope']
