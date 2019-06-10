/**
 * @Author hejialin
 * @Description 详情页流程配置弹窗中的流程图
 */
export default class flowConfigCtrl{
    constructor($scope, flowChartService, activityService, WorkflowConfigInterface){
        this.$scope = $scope;
        this.color = flowChartService.color;
        this.activityService = activityService;
        this.WorkflowConfigInterface = WorkflowConfigInterface;
        $scope.$on('to-child', (event,data)=> {
            this.flowChartData = data.flowChartData;
            this.init(data.currentTaskKey);
        });
    }

    init(taskKey){
        this.currentConfigured = this.getConfiguredData(taskKey);
        if(this.currentConfigured){
            this.setConfiguredAccountId();
            this.setDictionaryValue();
            if(this.currentConfigured.accountRelationType==2){
                this.setRelativeLine();
            }
        }
    }

    getConfiguredData(taskKey) {
        let configuredList = this.flowChartData.configuredNodes;
        for (let config of configuredList) {
            if (config.taskKey == taskKey) {
                return config;
            }
        }
    }

    /**
     * 设置选中账户
     */
    setConfiguredAccountId(){
        this.configuredAccountIds = [];
        if(this.currentConfigured.accountInfoList){
            this.currentConfigured.accountInfoList.forEach(account => {
                if(account){
                    this.configuredAccountIds.push(account.accountId);
                }
            })
        }
    }

    /**
     * 设置参考线
     */
    setRelativeLine(){
        let nodeKeys = this.activityService.getFlowNodeKeys(this.flowChartData.activities);
        let currentFlowNode = this.flowChartData.activities[nodeKeys.indexOf(this.currentConfigured.taskKey)];
        let referFlowNode = this.flowChartData.activities[nodeKeys.indexOf(this.currentConfigured.referentTaskKey)];
        this.flowChartData.relativeLine = {
            color:this.color.PURPLE,
            textColor:this.color.BLACK,
            name:'人员组参考',
            nodes:[currentFlowNode,referFlowNode]
        };
    }

    /**
     * 初始化设置字典项的名称
     */
    setDictionaryValue() {
        this.WorkflowConfigInterface.getUserRelationshipType().then(res => {
            for (let relation of res.data) {
                if (relation.itemValue == this.currentConfigured.accountRelationType) {
                    this.currentConfigured.relationTypeName = relation.itemName;
                }
            }
        });
        this.WorkflowConfigInterface.getRelativeType().then(res => {
            for (let relative of res.data) {
                if (relative.itemValue == this.currentConfigured.accountRelativeType) {
                    this.currentConfigured.relativeTypeName = relative.itemName;
                }
            }
        });
    }
}
flowConfigCtrl.$inject = ['$scope', 'flowChartService', 'activityService', 'WorkflowConfigInterface'];