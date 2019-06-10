/**
 * @Author hejialin
 * @Description 流程配置弹窗中流程图
 */

import relativeTypeHtml from './relativeTypeDialog/relativeTypeDialog.html';

import relativeTypeCtrl from './relativeTypeDialog/relativeTypeDialog.js';

export default class flowConfigCtrl {
    constructor($scope, flowChartService, activityService, dialogsManager, WorkflowConfigInterface, ProcessConfigService,ngDialog, BasicConfigInterface,WorkflowInterface,ProjectInterface,$config,SelectPerson,$filter) {
        this.$scope = $scope;
        this.$filter = $filter;
        this.SelectPerson = SelectPerson;
        this.dialogsManager = dialogsManager;
        this.activityService = activityService;
        this.color = flowChartService.color;
        this.WorkflowConfigInterface = WorkflowConfigInterface;
        this.ProcessConfigService = ProcessConfigService;
        this.basicConfigInterface = BasicConfigInterface;
        this.ngDialog = ngDialog;
        this.WorkflowInterface =WorkflowInterface;
        this.ProjectInterface = ProjectInterface;
        this.$config = $config;
        this.init();
    }

    init(){
        this.$scope.$on('childDialog', (event,data)=> {
            this.initCurrentTask(angular.copy(data.flowChartData), angular.copy(data.currentTask));
        });
        this.initGardenType();
        this.initProjectType();
        this.accountIds=[];
    }

    initCurrentTask(flowChartData, configData){

        delete flowChartData.relativeLine;
        this.flowChartData = flowChartData;
        if(configData.dueDay && configData.dueDay == -1){
            configData.dueDay = undefined;
            this.noDueday = true;
        }
        this.configData = configData;
        this.setDictionaryValue();
        this.flowChartNodeKeys = this.activityService.getFlowNodeKeys(this.flowChartData.activities);
        this.configuredAccountIds = this.extractUserId(this.configData);
        if(this.configData.accountRelationType && this.configData.accountRelationType == this.ProcessConfigService.userRelationType.RELATIVE){
            this.setRelativeLine(this.configData.taskKey, this.configData.referentTaskKey);
        }
        let currentFlowNode = this.getFlowChartNode(this.configData.taskKey);
        currentFlowNode.color = this.color.PURPLE;
        currentFlowNode.textColor = this.color.BLACK;
    }

    // 获取园区类型，在第一个绝对用户类型就会获取到数据
    initGardenType(){
        this.WorkflowInterface.getGardenTypeList().then(res =>{
            // 园区类型
            this.gardenList = res.data;
            // console.log(this.gardenList)
        });
    }
    // 获取到项目类型，从不同的模块进入，需要判断他的字典符的值
    initProjectType(){
        let moduleProjectType = '';
        this.module = this.$scope.$parent.addApprovalProcess.module;
        if(this.module == 'asset'){
            moduleProjectType= 'DISPOSE_TYPE';
        }else if(this.module == 'repair'){
            moduleProjectType= 'REPAIR_PROJECT_CATEGORY';
        }else if(this.module == 'purchase'){
            moduleProjectType= 'PURCHASE_CATEGORY';
        }
        this.ProjectInterface.getProjectType(moduleProjectType).then(res =>{
            // 項目類型的数据
            this.projectList = res.data;
        })
    }
    // 弹框进行园区相对类型的选择；
    selectPersonDialog() {
        this.SelectPerson.dialog({
            ids: this.accountIds
        }, ($person) => {
            // this.accountIds = $person.ids;
            // this.notice.noticeAccountIdList = this.accountIds;
            // this.selectedPersons = $person.personList;
            // 对应的选项人员的添加
            this.personSelectAll = $person;
        });
    }
    //对所匹配的名字进行搜索
    personSearch(event){
        // input点击会车事件
        if(!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13){
            // 调用过滤器方法数据的过滤
            // this.personKeywords input框的value值
            this.selChecknames = this.personKeywords;
        }else {
            this.selChecknames = "";
        }
    }
    // 通过删除对input框的值进行清空
    seaTextEmapty(){
        this.personKeywords="";
    }
    // 对当前项进行删除
    deleteIindividua(index){
        this.personSelectAll.personList.splice(index,1);
    }
    // 清除左侧配置
    allClear(){
        //将input框的值成空
        this.personKeywords="";
        // 将内容成空
        this.personSelectAll.personList=[];
        /**
         *进行左侧配置清空
         *进行左侧配置的生成
         *左侧园区类型的属性未绑定
         * */
    }

    /**
     * 设置参考线
     */
    setRelativeLine(currentTaskKey, referentTaskKey){
        let currentFlowNode = this.getFlowChartNode(currentTaskKey);
        let referFlowNode = this.getFlowChartNode(referentTaskKey);
        currentFlowNode.color = this.color.PURPLE;
        let relativeTypeText = this.getRelativeTypeText(this.configData.accountRelativeType);
        this.flowChartData.relativeLine = {
            color:this.color.PURPLE,
            textColor:this.color.BLACK,
            name:relativeTypeText,
            nodes:[currentFlowNode,referFlowNode]
        };
    }

    /**
     * 点击选择人员参考线
     * @param $flowNode
     */
    clickFlowNode($flowNode) {
        let flowData = angular.copy(this.flowChartData);
        let followNodeKeys = this.activityService.getFollowNodeKeys(flowData, this.configData.taskKey);
        if ($flowNode.taskKey !== this.configData.taskKey &&
            this.activityService.isRefer($flowNode) && $flowNode.color && followNodeKeys.indexOf($flowNode.taskKey) < 0) {
            this.configData.referentTaskKey = $flowNode.taskKey;
            let relativeTypeText = this.getRelativeTypeText(this.configData.accountRelativeType);
            flowData.relativeLine = {
                color: this.color.PURPLE,
                textColor:this.color.BLACK,
                name: relativeTypeText,
                nodes: [this.getFlowChartNode(this.configData.taskKey), $flowNode]
            };
            this.flowChartData = flowData;
        }
        // 打开弹窗
        this.ngDialog.open({
            closeByDocument: false,
            className: 'bdp layer_fixed_small',
            template: relativeTypeHtml,
            scope: this.$scope,
            controller: relativeType,
            controllerAs: 'relativeType',
            plain: true
        })
    }

    /**
     * 设置全局作用时间
     */
    settingGlobalTime() {
        if (this.configData.dueDay||this.noDueday) {
            this.configData.globalDueDay = this.noDueday?-1:this.configData.dueDay;
            this.dialogsManager.showMessage('操作成功！', {className: 'success'});
        } else {
            this.dialogsManager.showMessage('请输入应用时间！', {className: 'warning'});
        }
    }

    /**
     * 切换相对类型
     */
    changeRelativeType() {
        if(this.configData.referentTaskKey) {
            let flowData = angular.copy(this.flowChartData);
            let relText = this.getRelativeTypeText(this.configData.accountRelativeType);
            flowData.relativeLine.name = relText;
            this.flowChartData = flowData;
        }
    }

    getFlowChartNode(taskKey){
        return this.flowChartData.activities[this.flowChartNodeKeys.indexOf(taskKey)]
    }

    getRelativeTypeText(relativeType){
        if(relativeType){
            return relativeType == this.ProcessConfigService.userRelativeType.AUTHOR ? '作者操作人参考' : '人员组参考';
        }else{
            return '';
        }
    }

    extractUserId(currentNode){
        let accountIds = [];
        if(currentNode.accountInfoList){
            currentNode.accountInfoList.forEach(account => {
                if(account){
                    accountIds.push(account.accountId);
                }
            })
        }
        return accountIds;
    }

    getAccountInfo(person){
        let accounts = [];
        for(let accountId of person.ids){
            let account = {};
            account.accountId = accountId;
            account.gardenId = '';
            accounts.push(account);
        }
        return accounts;
    }



    /**
     * 确认按钮
     */
    configSure(person) {
        let userType = this.configData.accountRelationType;
        if (this.configData.dueDay || this.noDueday) {
            this.configData.dueDay = this.noDueday?-1:this.configData.dueDay;
            if (userType == this.ProcessConfigService.userRelationType.ABSOLUTE) {
                if (!person || !person.ids[0]) {
                    this.dialogsManager.showMessage('请选择人---员！', {className: 'warning'});
                } else {
                    delete this.configData.accountRelativeType;
                    this.configData.accountInfoList = this.getAccountInfo(person);
                    this.$scope.$emit('nodeConfigData', this.configData);
                    this.$scope.closeThisDialog();
                }
            } else if (userType == this.ProcessConfigService.userRelationType.RELATIVE) {
                if (!this.configData.referentTaskKey) {
                    this.dialogsManager.showMessage('请选择参考节点！', {className: 'warning'});
                } else {
                    this.$scope.$emit('nodeConfigData', this.configData);
                    this.$scope.closeThisDialog();
                }
            }
        } else {
            this.configData.dueDay = '';
        }
    }

    /**
     * 取消按钮
     */
    configCancel(){
        this.$scope.closeThisDialog();
    }

    /**
     * 获取字典值
     */
    setDictionaryValue() {
        this.WorkflowConfigInterface.getUserRelationshipType().then(res => {
            this.relations = res.data;
            if(this.configData.accountRelationType === undefined){
                this.configData.accountRelationType = this.relations[0].itemValue;
            }else{
                this.configData.accountRelationType = this.configData.accountRelationType.toString();
            }
        });
        this.WorkflowConfigInterface.getRelativeType().then(res => {
            this.relatives = res.data;
            if(this.configData.accountRelativeType === undefined || this.configData.accountRelativeType === null){
                this.configData.accountRelativeType = this.relatives[0].itemValue;
            }else{
                this.configData.accountRelativeType = this.configData.accountRelativeType.toString();
            }
        });
    }
}
flowConfigCtrl.$inject = ['$scope', 'flowChartService', 'activityService', 'dialogsManager', 'WorkflowConfigInterface', 'ProcessConfigService','ngDialog',
    'BasicConfigInterface','WorkflowInterface','ProjectInterface','$config','SelectPerson','$filter'];