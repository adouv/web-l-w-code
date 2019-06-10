/**
 * @Author hejialin
 * @Description 审核标配类别
 */
export default class auditCategory{
    constructor(purchaseInterface,ProjectInterface,$sessionStorage,purchaseService){
        this.purchaseInterface = purchaseInterface;
        this.$sessionStorage = $sessionStorage;
        this.ProjectInterface = ProjectInterface;
        this.purchaseService = purchaseService;
        this.init();
    }

    /**
     * 初始化
     */
    init(){
        this.getKindList();
        this.kindField = this.configCache.kindCategory.field;
    }
    
    /**
     * 获取配标类别
     */
    getKindList(){
        this.purchaseInterface.getProjectKind().then(res=>{
            this.kindList = res.data;
            this.editForm.kind = res.data[0].itemValue;
            this.getNextAuditInfo(this.editForm.kind,res.data[0].itemName);
        });
    }

    /**
     * 获取下一步审核人信息
     * @param val
     */
    getNextAuditInfo(val,name){
        this.purchaseService.setPurchaseCacheField(
            this.editForm,
            this.kindField,
            name
        );
        this.ProjectInterface.getNextTaskAudit(
            null, this.currentTaskId,
            this.$sessionStorage.get('currentGarden').gardenId,
            'systemAudit', !!(val*1)
        ).then(res => {
            this.nextAuditInfo = {};
            let nextTaskInfoList = res.data.nextTaskInfoList;
            this.nextAuditInfo.taskInfoList = nextTaskInfoList||[];
            this.nextAuditInfo.dueDate = res.data.dueDate;
            this.nextAuditInfo.statusName = res.data.statusDescription;
            this.sanitizeKind(nextTaskInfoList);
        })
    }

    /**
     * 处理标配类别
     * @param nextTaskInfoList
     */
    sanitizeKind(nextTaskInfoList){
        this.editForm[this.userAttr] = null;
        if(nextTaskInfoList[0].isMulti){
            let accountIds = [];
            nextTaskInfoList[0].nextAuditorQoList.forEach(auditInfo=>{
                accountIds.push(auditInfo.accountId);
            });
            this.editForm[nextTaskInfoList[0].assigneeVar] = accountIds.toString();
            this.editForm.multi = nextTaskInfoList[0].assigneeVar;
        }else{
            this.editForm.multi = null;
            this.editForm[nextTaskInfoList[0].assigneeVar] = nextTaskInfoList[0].nextAuditorQoList[0].accountId;
        }
        this.userAttr = nextTaskInfoList[0].assigneeVar;
    }

    auditThisTask(){
        this.auditing = true;
        this.auditTask(this.editForm);
    }
    
    getTemplate(){
        return `<form class="w5c-form" novalidate name="purchaseAuditForm">
            <h1 class="audit_task_title">{{purchaseForm.taskName}}</h1>
            <div class="bor_gray dashed audit_row">
                <p class="col_span">该项目所属类别：</p>
                <div class="col_div">
                    <p class="audit_result">
                        <label ng-repeat="kind in purchaseForm.kindList"><input class="radio_class" type="radio" 
                            ng-change="purchaseForm.getNextAuditInfo(kind.itemValue,kind.itemName)"
                            ng-model="purchaseForm.editForm.kind" ng-value="kind.itemValue">{{kind.itemName}}
                        </label>
                    </p>
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
                    <p class="col_div" ng-if="!nextAuditInfo.isMulti">
                                
                        <select-options class="next_auditor" ng-model="purchaseForm.editForm[nextAuditInfo.assigneeVar]" name="assigneeVar" repeat-items="data in nextAuditInfo.nextAuditorQoList" item-key="accountId" required>
                            {{data.displayName}} <span>（{{data.gardenName}}）</span>
                        </select-options>
                    </p>
                    <p class="col_div no_line" ng-if="nextAuditInfo.isMulti">
                        <span class="word_span" ng-repeat="auditor in nextAuditInfo.nextAuditorQoList">{{auditor.displayName}}（{{auditor.gardenName}}）<span ng-if="$index!=nextAuditInfo.nextAuditorQoList.length-1">或</span> </span>
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
auditCategory.$inject = ['purchaseInterface','ProjectInterface','$sessionStorage','purchaseService'];
