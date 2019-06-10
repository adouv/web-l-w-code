import flowConfigCtrl from './flowConfig';
import flowConfig from './flowConfig.html';
import flowPhaseConfig from './flowPhaseConfig.html';
import flowPhaseConfigCtrl from './flowPhaseConfig';

export default class addApprovalProcessCtrl {
    constructor($stateParams, $scope, ngDialog, WorkflowConfigInterface, dialogsManager, flowChartService, activityService,$location,ProcessConfigService,lwGardenService, sidebarService) {
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.$location = $location;
        this.$stateParams = $stateParams;
        this.WorkflowConfigInterface = WorkflowConfigInterface;
        this.dialogsManager = dialogsManager;
        this.activityService = activityService;
        this.color = flowChartService.color;
        this.ProcessConfigService = ProcessConfigService;
        this.lwGardenService = lwGardenService;
        this.sidebarService = sidebarService;
        this.init();
        this.messageMode = [];   // 通知方式
    }

    init() {
        this.module = this.$stateParams.module;
        this.isAdd = this.$stateParams.id === undefined;
        this.selectedprocessDefinitionId = '';
        this.showDetials = false;
        this.processStageNum = 0;
        this.stageConfigFlag = false;
        if (this.isAdd) {
            this.initAdd();
        } else {
            this.initEdit();
        }
        this.getSystemWorkflow();
        this.sidebarService.getCrumbList(moduleAlias.ASSET,this.$stateParams.sidebarId, data => {
            this.crumbList = data;
        });
        this.$scope.$on('nodeConfigData', (event,data)=> {
            this.configSure(data);
        });

        /*监听更新流程图*/
       this.$scope.$on('updateFlow', (event,data) => {
            this.flowChartColorData = data;
        });

        this.$scope.$on('stageConfigData', (event,data) => {
            this.stageConfig(data);
        });

        /*删除流程阶段*/
        this.$scope.$on('clearStage', (event,info) => {
            // 删除流程图数据
            let temporaryData = angular.copy(this.flowChartColorData);
            temporaryData.processStage.forEach((data,$index) => {
                    if(info.msg.range.deleX == data.range.deleX && info.msg.range.deleY == data.range.deleY){
                        temporaryData.processStage.splice($index,1);
                    }
                })
            this.flowChartColorData = temporaryData;

            // 删除flowConfigData中对应的值
            this.$scope.addApprovalProcess.flowConfigData.stageVoList.forEach((data,$index) => {
                if(data.taskKeyList.toString() == info.msg.taskkey.toString()){
                    this.$scope.addApprovalProcess.flowConfigData.stageVoList.splice($index,1);
                }
            })

        });

            /*消息通知*/
            this.notification = [
                {
                    name:'短信',
                    msg:'sms',
                    flag:false
                },{
                    name:'微信',
                    msg: 'wechat',
                    flag:false
                },{
                    name:'邮件',
                    msg:'email',
                    flag:false
                }
            ]


        }
  

    /**
     * 初始化添加功能
     */
    initAdd(){
        this.flowConfigData = {};
        this.flowConfigData.stageVoList = [];
        this.flowConfigData.taskVoList = [];
        this.flowConfigData.status = true;
        this.selectedGarden = [];
        this.gardens = [];        
    } 

    /**
     * 初始化编辑
     */
    initEdit() {
        this.flowConfigData = {};
        this.WorkflowConfigInterface.getConfigDetails(this.$stateParams.id).then(res => {
            this.flowConfigData = res.data;
            this.ProcessConfigService.getRelatedGarden(res.data.taskVoList, gardens => {
                this.selectedGarden = gardens;
                this.gardens = gardens;
            });
            this.getFlowChartData(this.flowConfigData.processDefinitionId);
        });
    }

    // 消息通知方式
    messageNotificationMode(notice) {
        notice.flag = !notice.flag;
        if(notice.flag){
             this.messageMode.push(notice.msg)
         }else{
             this.messageMode.forEach((data,$index) => {
                if(data == notice.msg){
                    this.messageMode.splice($index,1);
                }
              })
         }
        this.flowConfigData.noticeMethod = this.messageMode.join();
    }

    //获取系统工作流
    getSystemWorkflow() {
        this.WorkflowConfigInterface.getWorkflowList(this.module, this.isAdd).then(res => {
            this.systemWorkflow = res.data;
        })
    }

    /**
     *面包线的点击响应
     */
    goJump(url){
        url&&this.$location.path(url);
    }
    
    //改变系统工作流确认弹窗
    showConfirm() {
        if (this.flowConfigData.processDefinitionId && this.selectedprocessDefinitionId == '') {
            //第一次选择工作流
            this.changeWorkflow(true);
        } else {
            //切换工作流
            this.confirm = true;
        }
    }

    //更换工作流
    changeWorkflow(isChange) {
        if (isChange && this.flowConfigData.processDefinitionId != '') {
            this.selectedprocessDefinitionId = this.flowConfigData.processDefinitionId;
            this.getFlowChartData(this.flowConfigData.processDefinitionId);
        } else {
            this.flowConfigData.processDefinitionId = this.selectedprocessDefinitionId + '';
        }
        this.confirm = false;
    }


    getFlowChartData(processDefinitionId){
        this.WorkflowConfigInterface.getFlowChartData(processDefinitionId).then(res => {
            this.flowChartData = res.data;
            this.flowChartColorData = this.ProcessConfigService.getFlowChartColorData(this.flowChartData, this.flowConfigData.taskVoList);
        })
    }
    /**
     * 确认保存
     * @return {boolean}
     */
    saveData() {
        let configurableTaskKeys = this.activityService.getConfigurableNodeKeys(this.flowChartColorData.activities);
        if (this.flowConfigData.status && configurableTaskKeys.length > this.flowConfigData.taskVoList.length) {
            this.dialogsManager.showMessage('还有节点用户未配置,请配置完成后才能提交有效的流程配置!', {className: 'warning'});
            return false;
        }
        /*排序流程阶段*/
        this.flowConfigData.stageVoList.sort(function(a,b){ return a.site-b.site });
        this.flowConfigData.stageVoList.forEach((data,$index) => { data.stageOrder = $index });
        this.ProcessConfigService.submitData(this.module, this.isAdd, this.flowConfigData);
    }

    /**
     * 点击流程图操作
     */
    clickFlowChart(flowNode) {
        // 两件事：一、点击矩形出弹窗；二、点击参考按钮加号出参考线（节点对象refer字段代表已配置了参考对象,click是点击的对象）
        if (this.activityService.isConfigurable(flowNode)) {
            let configuredTasks = this.flowConfigData.taskVoList||[];
            let config = this.getCurrentConfiguredNode(flowNode.taskKey, configuredTasks);
            if (flowNode.click == 'node') {
                let data = {flowChartData: this.flowChartColorData, currentTask:config};
                this.ProcessConfigService.openDialog(this.$scope, flowConfigCtrl, flowConfig, data);
            } else {
                let flowData = angular.copy(this.flowChartColorData);
                flowData.relativeLine = this.ProcessConfigService.getRelativeLine(config, flowData.activities);
                this.flowChartColorData = flowData;
            }
        }
    }

    configSure(data){
        if(data.accountRelationType  == this.ProcessConfigService.userRelationType.ABSOLUTE){
            this.resetSelectedGarden(this.getAccountIds(data.accountInfoList));
        }
        if(data.index!==undefined){
            this.flowConfigData.taskVoList[data.index] = data;
        }else{
            this.flowConfigData.taskVoList.push(data);
        }
        this.flowChartColorData = this.ProcessConfigService.getFlowChartColorData( this.flowChartColorData,  this.flowConfigData.taskVoList);
        if(data.globalDueDay){
            this.globalDueDay = data.globalDueDay;
            this.resetConfiguredDueDay(data.globalDueDay);
        }
    }

    /**
     *重置已经配置节点的过期时间
     */
    resetConfiguredDueDay(dueDay){
        for(let task of this.flowConfigData.taskVoList){
            task.dueDay = dueDay;
        }
    }

    getAccountIds(accountList){
        let accountIds = [];
        if(accountList){
            for(let account of accountList){
                accountIds.push(account.accountId);
            }
        }
        return accountIds;
    }

    /**
     * 获取回显园区（使用对象）
     * @param ids
     */
    resetSelectedGarden(accountIds){
        this.lwGardenService.getGardenListByAccount(accountIds,res=>{
            let gardenList = this.selectedGarden||[];
            let gardenIds = this.getGardenIds(gardenList);
            res.data.forEach(garden=>{
                if(gardenIds.indexOf(garden.gardenId)<0){
                    gardenIds.push(garden.gardenId);
                    gardenList.push(garden);
                }
            });
            this.selectedGarden = gardenList;
        })
    }

    getGardenIds(gardenList){
        let gardenIds = [];
        if(gardenList){
            for(let garden of gardenList){
                gardenIds.push(garden.gardenId);
            }
        }
        return gardenIds;
    }

    getCurrentConfiguredNode(taskKey, configuredTasks) {
        for(let i=0,len=configuredTasks.length;i<len;i++){
            if (configuredTasks[i].taskKey == taskKey) {
                configuredTasks[i].index = i;
                return configuredTasks[i];
            }
        }
        return this.getDefaultNodeConfig(taskKey);
    }

    getDefaultNodeConfig(taskKey){
        let nodeConfig = {};
        nodeConfig.dueDay = this.globalDueDay||undefined;
        nodeConfig.taskKey = taskKey;
        nodeConfig.accountInfoList = [];
        if(this.globalDueDay){
            nodeConfig.dueDay = this.globalDueDay;
        }
        return nodeConfig;
    }

    filterGarden() {
        this.selectedGarden = this.ProcessConfigService.filterGarden(this.gardens,this.keyWord);
    }

    /*
     * 配置流程阶段
     */
    clickProcessStage() {
        if (this.stageConfigFlag === false) return;
        if(this.flowChartData === undefined){
             this.dialogsManager.showMessage('请先选择系统工作流!', {className: 'warning'})
        }else{
            this.flowChartStageData = this.ProcessConfigService.getStageConfigFlowChartData(this.flowChartData);
            this.stageConfiguredNodes = this.getStageConfiguredNodes(this.flowConfigData);
        }
    }

    getStageConfiguredNodes(flowChartData){
        let stageConfiguredNodes = [];
        for(let stageVo of flowChartData.stageVoList){
            stageConfiguredNodes.push(stageVo.taskKeyList);
        }
        return stageConfiguredNodes;
    }


    /*关闭遮罩*/
    closeStageConfig(){
        this.flowChartStageData = undefined;
        this.stageConfiguredNodes = undefined;
    }

    /*
     * 流程阶段遮罩操作
     */
    clickStageConfig(flowNode) {
        if (flowNode.click === 'node') {
            if(this.stageStartNode === undefined ){
                if(this.isCanConfigStageStart()){
                    this.stageStartNode = flowNode;
                    this.dialogsManager.showMessage('阶段起始节点设置成功，请继续点击某个节点设置流程阶段的结束节点。', {
                        className: 'success'
                    });
                    this.stageConfiguredNodes.push(flowNode.taskKey);
                }else{
                    this.dialogsManager.showMessage('该节点不能配置为流程阶段的开始节点。', {
                        className: 'success'
                    });
                }
            }else{
                if(this.stageEndNode  === undefined){
                    if(flowNode.y < this.stageStartNode.y){
                        this.dialogsManager.showMessage('结束节点不能在开始节点之前', {
                            className: 'warning'
                        });
                        return;
                    }
                    this.stageEndNode = flowNode;
                    this.dialogsManager.showMessage('阶段结束节点设置成功，请输入流程阶段名称', {className: 'success'});
                    this.openDialogWithStage(this.$scope);
                }else{
                    this.dialogsManager.showMessage('已经设置'+this.stageEndNode.name + '为阶段结束节点，请取消配置框后再设置', {className: 'success'});
                }
            }
        }
    }

    stageConfig(data){
        if(data.status === 'save'){
            console.log(data);
        }else if(data.status === 'cancel'){
            console.log(data);
        }
    }

    openDialogWithStage(scope){
        this.ngDialog.open({
            closeByDocument: false,
            className: 'lw-select-person flowPhaseConfig',
            template: flowPhaseConfig,
            scope: scope,
            controller: flowPhaseConfigCtrl,
            controllerAs: 'flowPhaseConfig',
            plain: true
        });
    }

    isCanConfigStageStart(taskKey){
        return this.stageConfiguredNodes.indexOf(taskKey) === -1 && taskKey !== 'endEvent';
    }
}

addApprovalProcessCtrl.$inject = ['$stateParams', '$scope', 'ngDialog', 'WorkflowConfigInterface', 'dialogsManager', 'flowChartService', 'activityService','$location','ProcessConfigService','lwGardenService', 'sidebarService'];
