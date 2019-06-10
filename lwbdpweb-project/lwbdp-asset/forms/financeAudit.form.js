export default class financeAudit{
    constructor(WorkflowInterface,$sessionStorage,ProjectInterface){
        this.WorkflowInterface = WorkflowInterface;
        this.getNoticeMethods();
        this.ProjectInterface = ProjectInterface;
        this.garden = $sessionStorage.get('currentGarden');
    }

    getNoticeMethods(){
        this.WorkflowInterface.getNoticeMethods(data=>{
            this.noticeMethodList = data.list;
            this.defaultMethod = data.default;
            this.editForm.noticeMethods = [data.default];
        });
    }
    
    getAllNotice(name,event){
        if(event.target.checked){
            this.editForm.noticeMethods.push(name);    
        }else{
            let index = this.editForm.noticeMethods.indexOf(name);
            this.editForm.noticeMethods.splice(index,1);
        }
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
                <span class="lf_name">财政局审核结果：</span>
                <span class="rg_con" style="width: 580px;display: inline-block;">
                    <label for="pass"><input ng-model="assetForm.editForm.approved" type="radio" ng-change="assetForm.toggleResult()" class="radio_class" id="pass" value="true">通过</label>
                    <label for="notpass"><input ng-model="assetForm.editForm.approved" type="radio" ng-change="assetForm.toggleResult()" class="radio_class" id="notpass" value="false">不通过</label>
                    <a class="fr" style="color:#0096ff;" href="javascript:void(0);" ng-click="assetForm.findAuditedNodeArea('#applyOrder')">查看需审批内容&gt;&gt;</a>
                </span>
            </p>
            <p>
                <span class="lf_name">审核意见：</span>
                <span class="rg_con"><textarea ng-model="assetForm.editForm.comment.message" class="textarea_class" name="message" maxlength="500" placeholder="500个汉字以内,不必填"></textarea></span>
            </p>
            <p class="choose_way">
                <span class="lf_name">通知学校资产管理员的通知方式选择：</span>
                <span class="rg_con">
                    <label for="notice{{data.itemValue}}" ng-repeat="data in assetForm.noticeMethodList"><input ng-disabled="assetForm.defaultMethod==data.itemValue" ng-checked="assetForm.editForm.noticeMethods.indexOf(data.itemValue)>-1" ng-click="assetForm.getAllNotice(data.itemValue,$event)" type="checkbox" class="checkbox_class" id="system" checked>{{data.itemName}}</label>
                </span>
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
                <span class="lf_name">下一步操作人：</span>
                  
                <select-options class="selectWid400 get_method" ng-model="assetForm.editForm[assetForm.nextAuditInfo.assigneeVar]" ng-if="assetForm.nextAuditInfo.nextAuditorQoList[0]" repeat-items="data in assetForm.nextAuditInfo.nextAuditorQoList" item-key="accountId" required>
                            {{data.displayName}} <span>（{{data.gardenName}}）</span>
                </select-options>
                <span class="rg_con gray" ng-if="!assetForm.nextAuditInfo.nextAuditorQoList[0]">系统流程中下一步节点没有您可以选择操作人用户，请您联系平台管理员进行处理。</span>
            </p>
            <p ng-if="assetForm.editForm.approved==='true'" class="choose_way">
                <span class="lf_name">下一步操作最晚完成任务时间截点：</span>
                <input type="text" class="input_class" id="date" readonly lw-laydate value="{{assetForm.editForm.dueDate | date:'yyyy/MM/dd'}}" ng-model="assetForm.editForm.dueDate">
            </p>
            <div class="btn_box">
                <span class="btn_bd" ng-click="assetForm.auditCancel()">取消</span>
                <button class="btn_bg" ng-disabled="assetForm.auditing" ng-click="assetForm.auditThisTask(assetForm.editForm)">确定</button>
            </div>
        </div>`
    }
}
financeAudit.$inject = ['WorkflowInterface','$sessionStorage','ProjectInterface'];
