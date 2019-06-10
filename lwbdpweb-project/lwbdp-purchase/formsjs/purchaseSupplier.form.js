/**
 * @Author hejialin
 * @Description 描述
 */
export default class purchaseSupplier {
    constructor($filter,ProjectInterface,SelectItemService,$scope,lwGardenService,$sessionStorage,purchaseInterface,$stateParams,purchaseService,ProjectService,dialogsManager) {
        this.$scope = $scope;
        this.$filter = $filter;
        this.dialogsManager = dialogsManager;
        this.ProjectService = ProjectService;
        this.gardenService = lwGardenService;
        this.SelectItemService = SelectItemService;
        this.ProjectInterface = ProjectInterface;
        this.purchaseService = purchaseService;
        this.purchaseInterface = purchaseInterface;
        this.$stateParams = $stateParams;
        this.$sessionStorage = $sessionStorage;
        this.init();
    }

    init(){
        this.paramsInit();
        this.getGardenList();
        if(this.isEdit!==false){
            this.nextTwoAuditInfo();
        }
    }
    
    paramsInit(){
        if(this.isEdit===undefined){
            this.getPurchaseMethod(()=>{
                this.getPurchaseProject();
            });
            this.editForm.projectName = this.project.projectName;
            this.editForm.message = this.project.content;
        }else if(!this.editForm){
            this.ProjectInterface.getTaskFormData(this.taskId).then(res => {
                this.editForm = this.ProjectService.formatCacheData(res.data.properties);//nextStepCount
            });
        }
    }

    nextTwoAuditInfo() {
        this.ProjectInterface.getNextTaskAudit(
            null, this.currentTaskId,
            this.$sessionStorage.get('currentGarden').gardenId,
            'approved', true,2
        ).then(res => {
            let nextTaskInfoList = res.data.nextTaskInfoList;
            this.nextTwoAuditInfo = nextTaskInfoList[0]||{};
            if(!this.editForm[this.nextTwoAuditInfo.assigneeVar]){
                this.editForm[this.nextTwoAuditInfo.assigneeVar] = this.nextTwoAuditInfo.nextAuditorQoList[0]&&
                    this.nextTwoAuditInfo.nextAuditorQoList[0].accountId;
            }
        })
    }

    /**
     * 获取所有采购方式
     */
    getPurchaseMethod(callback){
        this.purchaseInterface.getPurchaseMethod().then(res=>{
            this.purchaseMethods = res.data;
            callback&&callback();
        });
    }

    /**
     * 获取项目编号
     */
    getPurchaseProject(){
        this.purchaseInterface.getPurchaseProject(this.$stateParams.id).then(res=>{
            this.editForm.projectNo = res.data.projectNum;
            for(let method of this.purchaseMethods){
                if(method.itemValue==res.data.purchaseMethod){
                    this.editForm.opinions = `      ${this.project.projectGarden}${method.itemName}项目，${res.data.purchaseCompanyName||res.data.approvalCompany}经过相关程序审批，依据批复意见：执行设备询价采购供货。
                    采购小组本着公开、公正、公平的原则，主要依据以下标准确定供应商：
                        第一，依法依规。按照政府采购相关规定选用三家符合资质的供货服务商进行询价；
                        第二，严格资质。选用的供货服务商需具备供货资质要求，且没有违法违规记录；
                        第三，信誉良好。选用的服务商，需无不良供货记录，且售后服务良好。
                    基于以上原则，我们依据设备询价采购供货的相关要求，结合学校实际设备使用需求，经小组讨论决定，推选以下公司作为本项目参与询价的服务商：`;
                    break;
                }
            }
        });
    }
    
    /**
     * 配置服务商
     */
    selectCompany(){
        this.SelectItemService.open({
            idField:'gardenId',
            eachIds:this.editForm.companyIds,
            nameField:'gardenName',
            className:'lw-next-garden',
            title:'配置服务商',
            selectItemTitle:'已选择的公司',
            itemList:this.gardenList,
            callback:(data)=>{
                this.editForm.companyIds = data.ids;
                this.editForm.companyNames = data.names;
                this.editForm.providerList = data.list;
            }
        })
    }

    /**
     * 获取园区关系对应的园区
     */
    getGardenList(){
        this.gardenService.getVisualGardenList(false,res=>{
            this.gardenList = res.data;
        })
    }
    
    /**
     * 选择下一步审核人
     */
    selectNextAuditAuditor(){
        let nextAuditInfo = this.nextAuditInfo.taskInfoList[0];
        this.editForm.multi = nextAuditInfo.isMulti?nextAuditInfo.assigneeVar:null;
        this.SelectItemService.open({
            idField:'accountId',
            eachIds:this.editForm.memberNames?this.editForm[nextAuditInfo.assigneeVar]:[],
            nameField:'displayName',
            className:'lw-next-auditor',
            title:'配置成员',
            selectItemTitle:'已选择的成员',
            itemList:nextAuditInfo.nextAuditorQoList,
            callback:(data)=>{
                this.editForm[nextAuditInfo.assigneeVar] = data.ids.toString();
                this.editForm.memberNames = data.names.join('；')+'；';
            }
        })
    }

    getNextTwoAuditor(callback){
        let nextTwoAuditors = this.nextTwoAuditInfo.nextAuditorQoList;
        for(let auditor of nextTwoAuditors){
            if(auditor.accountId==this.editForm[this.nextTwoAuditInfo.assigneeVar]){
                this.editForm.nextTwoAuditor = auditor.displayName+'（'+auditor.gardenName+'）';
                callback&&callback();
                break;
            }
        }
    }

    /**
     * 确认审核
     */
    auditThisTask(){
        if(this.editForm.companyNames.length>=2){
            this.auditing = true;
            let nextAuditInfo = this.nextAuditInfo.taskInfoList[0];
            this.editForm[nextAuditInfo.assigneeVar] = this.editForm[nextAuditInfo.assigneeVar].toString();
            this.getNextTwoAuditor();
            this.purchaseService.setPurchaseCacheField(
                this.editForm,
                this.configCache.providerRecord.field,
                this.editForm
            );
            if(this.editForm.providerList && this.editForm.providerList.length>0){
                this.purchaseService.setPurchaseCacheField(
                    this.editForm,
                    this.configCache.providerList.field,
                    this.editForm.providerList
                );
            }
            if(this.isEdit===undefined){
                this.auditTask(this.editForm);
            }else{
                this.$scope.$emit('formData',this.editForm);
                this.$scope.closeThisDialog();
            }
        }else{
            this.dialogsManager.showMessage('供货商不能少于两家！',{className:'warning'})
        }
    }
    
    getTemplate() {
        return `<div class="purchaseDraft">
            <form class="w5c-form" novalidate name="addConfigForm">
            <div class="draft_title">
                <p class="draft_detail">生成设备采购项目供货商选用记录单</p>
            </div>
            <div class="draft_title">
                <p class="draft_detail_second">设备采购项目会议纪要</p>
            </div>
            <div class="name_time">
                <div class="name_time_left">项目编号：{{purchaseForm.editForm.projectNo}}</div>
                <div class="name_time_left">项目名称：{{purchaseForm.editForm.projectName}}</div>
            </div>
            <div class="line_strip"></div>
            <table class="itemTable">
                <tr>
                    <td width="100" class="text-center">地点</td>
                    <td>
                        <input type="text" class="input_class" placeholder="20个汉字以内,必填" maxlength="20" ng-disabled="purchaseForm.isEdit===false" ng-model="purchaseForm.editForm.address" required name="area">
                    </td>
                    <td width="100" class="text-center">日期</td>
                    <td width="200">
                        <input type="text" class="input_date td_ab" style="padding-left:10px;" ng-if="purchaseForm.isEdit!==false" ng-model="purchaseForm.editForm.createDate" required name="createDate" id="taskTimeStart" lw-laydate='YYYY-MM-DD' readonly="readonly" placeholder="时间">
                        <span ng-if="purchaseForm.isEdit===false">{{purchaseForm.editForm.createDate}}</span>
                        <label class="iconfont icon-llreservecalendar col0096ff" ng-if="purchaseForm.isEdit!==false"></label>
                    </td>
                </tr>
                <tr>
                    <td class="text-center">项目概要情况</td>
                    <td colspan="3" style="height:200px">
                        <textarea cols="30" class="overflow_box_sm" rows="30" required name="message" ng-model="purchaseForm.editForm.message" ng-disabled="purchaseForm.isEdit===false" placeholder="1000个汉字以内，必填" maxlength="1000"></textarea>
                    </td>
                </tr>
                <tr>
                    <td class="text-center">项目集体讨论意见</td>
                    <td colspan="3" style="height:400px">
                        <textarea class="area_auto overflow_box_sm" style="height:200px;top:0px;" cols="30" rows="10" ng-disabled="purchaseForm.isEdit===false" required name="opinion" ng-model="purchaseForm.editForm.opinions" maxlength="1000" placeholder="1000个汉字以内，必填"></textarea>
                        <div style="position:relative;height:200px;">
                            <button class="btn_bd fr" style="position:absolute;top:0;" ng-click="purchaseForm.selectCompany()" ng-if="purchaseForm.isEdit!==false">配置</button>
                            <input type="text" class="none" ng-model="purchaseForm.editForm.companyNames[0]" required name="companyNames"/>
                            <span class="color_error" style="position: absolute;top: 30px;" ng-if="addConfigForm.companyNames.change&&addConfigForm.companyNames.$invalid">此项不能为空</span>
                            <div style="height:30px;width:100%;"></div>
                            <p ng-repeat="company in purchaseForm.editForm.companyNames">{{$index+1}}、{{company}}</p>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="text-center">成员签字</td>
                    <td colspan="3">
                        <button class="btn_bd" ng-click="purchaseForm.selectNextAuditAuditor()" ng-if="purchaseForm.isEdit!==false">配置成员</button>
                        <p>
                            <input type="text" class="none" ng-model="purchaseForm.editForm.memberNames" required name="memberNames"/>
                            <span class="color_error" ng-if="addConfigForm.memberNames.change&&addConfigForm.memberNames.$invalid">此项不能为空</span>
                            {{purchaseForm.editForm.memberNames}}
                            <span class="tab_bottom_little"> 年 月 日 </span>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td class="text-center">主管领导审核意见</td>
                    <td colspan="3">
                        <label for="approval">审核人：</label>
                        <select-options class="select_class select_w235" ng-if="purchaseForm.isEdit!==false" ng-model="purchaseForm.editForm[purchaseForm.nextTwoAuditInfo.assigneeVar]" required name="nextOperator"
                         repeat-items="data in purchaseForm.nextTwoAuditInfo.nextAuditorQoList track by $index" item-key="accountId">
                            {{data.displayName}}<span>（{{data.gardenName}}）</span> 
                        </select-options>
                        <span ng-if="purchaseForm.isEdit===false">{{purchaseForm.editForm.nextTwoAuditor}}</span>
                        <span class="tab_bottom_little"> 年 月 日 </span>
                    </td>
                </tr>
            </table>
            <div ng-if="purchaseForm.isEdit!==false">
                <div class="table_dashed"></div>
                <div class="reDraft_content2">
                    <div class="reDraft_list">
                        <span class="width200 word_center">完成时间状态：</span>
                        <p class="word_center" ng-switch="purchaseForm.nextAuditInfo.statusName">
                            <span class="green_color" ng-switch-when="正常">正常</span>
                            <span class="yellow_color" ng-switch-when="临期">临期</span>
                            <span class="red_color" ng-switch-default="">{{purchaseForm.nextAuditInfo.statusName}}</span>
                        </p>
                    </div>
                    <div class="reDraft_list">
                        <span class="width200 word_center">最晚完成任务日期截点：</span>
                        <span class="word_center">{{purchaseForm.nextAuditInfo.dueDate|date:'yyyy/MM/dd'}}</span>
                    </div>
                    <div class="reDraft_list">
                        <span class="width200 word_center">下一步操作节点名称：</span>
                        <span class="word_center">{{purchaseForm.nextAuditInfo.taskInfoList[0].taskName}}</span>
                    </div>
                </div>
                <div class="reDraft_btn" style="padding:0">
                    <span class="btn_bd" ng-click="auditCancel(purchaseForm.isEdit)">取消</span>
                    <button class="btn_bg" ng-disabled="nextAuditInfo.taskInfoList[0].nextAuditorQoList.length<=0||purchaseForm.auditing" form-submit-valid="purchaseForm.auditThisTask(purchaseForm.editForm)">确定</button>
                </div>
            </div>
            <div class="reDraft_btn" ng-if="purchaseForm.isEdit===false" style="padding:0">
                <span class="btn_bd" ng-click="closeThisDialog()">返回</span>
            </div>
            </form>
        </div>`
    }
}
purchaseSupplier.$inject = ['$filter','ProjectInterface','SelectItemService','$scope','lwGardenService','$sessionStorage','purchaseInterface','$stateParams','purchaseService','ProjectService','dialogsManager'];
