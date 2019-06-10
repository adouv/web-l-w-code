import flowCtrl from './flowConfig';

export default class lookApprovalProcessCtrl {
    constructor(WorkflowConfigInterface, $stateParams, ngDialog, $scope, flowChartService, activityService,$location,ProcessConfigService, sidebarService) {
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.$location = $location;
        this.color = flowChartService.color;
        this.$stateParams = $stateParams;
        this.activityService = activityService;
        this.WorkflowConfigInterface = WorkflowConfigInterface;
        this.ProcessConfigService = ProcessConfigService;
        this.sidebarService = sidebarService;
        this.init();
    }

    init() {
        this.module = this.$stateParams.module;
        this.WorkflowConfigInterface.getConfigDetails(this.$stateParams.id).then(res => {
            this.workflowConfig = res.data;
            this.ProcessConfigService.getRelatedGarden(this.workflowConfig.taskVoList, gardens =>{
                this.showGardens = gardens;
                this.gardens = gardens;
            });
            let configuredTasks = res.data.taskVoList;
            this.WorkflowConfigInterface.getFlowChartData(this.workflowConfig.processDefinitionId).then(res => {
                this.flowChartColorData = this.ProcessConfigService.getLookFlowChartData(res.data, configuredTasks);
                console.log(this.flowChartColorData);
            })
        });
        this.sidebarService.getCrumbList(moduleAlias.ASSET,this.$stateParams.sidebarId, data => {
            this.crumbList = data;
        });
    }

    //园区搜索
    filterGarden() {
        this.showGardens = this.ProcessConfigService.filterGarden(this.gardens,this.keyWord);
    }

    goJump(url){
        url&&this.$location.path(url);
    }

    clickHandle() {
        history.back();
    }

    /**
     * 回显已配置节点的信息
     * @param flowNode
     */
    clickFlowNode($flowNode) {
        if (this.activityService.isConfigurable($flowNode) === false) {
            return;
        }
        if ($flowNode.click == 'node') {
            this.ngDialog.open({
                closeByDocument: false,
                className: 'lw-select-person flowTaskConfig',
                template: require('./flowConfig.html'),
                scope: this.$scope,
                controller: flowCtrl,
                controllerAs: 'flowConfig',
                plain: true,
                onOpenCallback: ()=>{
                    let nodeDialogData = {flowChartData: this.flowChartColorData, currentTaskKey: $flowNode.taskKey}
                    this.$scope.$broadcast('to-child', nodeDialogData);
                }
            });
        } else {
            let flowData = angular.copy(this.flowChartColorData);
            let nodeKeys = this.activityService.getFlowNodeKeys(flowData.activities);
            let currentConfiguredNode = this.getConfiguredData($flowNode.taskKey);
            flowData.relativeLine = {
                color: this.color.PURPLE,
                textColor:this.color.BLACK,
                name: '人员组参考',
                nodes: [$flowNode, flowData.activities[nodeKeys.indexOf(currentConfiguredNode.referentTaskKey)]]
            };
            this.flowChartColorData = flowData
        }
    }

    getConfiguredData(taskKey) {
        let configuredList = this.flowChartColorData.configuredNodes;
        for (let config of configuredList) {
            if (config.taskKey == taskKey) {
                return config;
            }
        }
    }
}
lookApprovalProcessCtrl.$inject = ['WorkflowConfigInterface', '$stateParams', 'ngDialog', '$scope', 'flowChartService', 'activityService','$location','ProcessConfigService', 'sidebarService'];