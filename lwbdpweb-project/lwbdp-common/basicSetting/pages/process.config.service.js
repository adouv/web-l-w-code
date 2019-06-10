/**
 * Created by wuhao on 2017/7/6.
 */

export default class ProcessConfigService {
    constructor(WorkflowConfigInterface, dialogsManager, activityService, ngDialog, flowChartService) {
        this.userRelationType = {
            //绝对用户
            ABSOLUTE: 1,
            //相对用户
            RELATIVE: 2,
            //按项目条件自动分派
            AUTO_ASSIGN: 3
        };
        this.userRelativeType = {
            //相对节点已有人员组
            APPROVER: 1,
            //相对节点作者操作人
            AUTHOR: 2,
            //相对节点字段对应的园区负责人
            CONTACTS: 3
        };
        this.WorkflowConfigInterface = WorkflowConfigInterface;
        this.dialogsManager = dialogsManager;
        this.activityService = activityService;
        this.ngDialog = ngDialog;
        this.color = flowChartService.color;
    }

    //获取已配置的任务
    getConfiguredTaskKeys(taskVoList) {
        let configuredTaskKeys = [];
        for (let item of taskVoList) {
            configuredTaskKeys.push(item.taskKey);
        }
        return configuredTaskKeys;
    }

    getRelatedGarden(taskVoList, callback){
        let gardenIds = [];
        for(let item of taskVoList){
            let accounts = item.accountInfoList;
            for(let account of accounts){
                gardenIds.push(account.gardenId);
            }
        }
        return this.WorkflowConfigInterface.getGardens(gardenIds.toString()).then(res => {
            callback && callback(res.data);
        });
    }

    filterGarden(gardens, keyWord) {
        if (keyWord || keyWord == '') {
            return gardens ? gardens : null;
        }
        let results = [];
        for (var item of gardens) {
            if (item.gardenName.indexOf(keyWord) > -1) {
                results.push(item);
            }
        }
        return results;
    }

    getFlowChartColorData(flowChartData, configuredTasks) {
        let flowchart = angular.copy(flowChartData);
        let flowNodes = flowchart.activities;
        flowchart.configuredNodes = configuredTasks || [];
        let configuredNodeKeys = this.getConfiguredTaskKeys(configuredTasks);
        flowNodes.forEach(node => {
            if(node.type === 'startEvent' || node.type === 'endEvent'){
                node.color = this.color.BLACK;
            }else{
                if(this.activityService.isConfigurable(node) === false){
                    let preNodeMap = this.getPreNode(flowNodes, flowChartData.sequenceFlows);
                    if(node.type === 'exclusiveGateway' && this.isPreNodeGreen(node, preNodeMap, configuredNodeKeys)){
                        node.color = this.color.GREEN;
                    }else{
                        node.color = this.color.LIGHT_GRAY;
                    }
                }else{
                    if(configuredNodeKeys.indexOf(node.taskKey) > -1){
                        node.color = this.color.GREEN;
                        node.textColor = this.color.GREEN;
                    }else{
                        node.color = this.color.GRAY;
                        node.textColor = this.color.BLACK;
                    }
                }
            }
            let configuredNodeIndex = configuredNodeKeys.indexOf(node.taskKey);
            if (configuredNodeIndex > -1) {
                node.refer = (configuredTasks[configuredNodeIndex] && configuredTasks[configuredNodeIndex].accountRelationType == 2);
            }
        });
        return flowchart;
    }

    getLookFlowChartData(flowChartData, configuredTasks){
        let flowchart = angular.copy(flowChartData);
        let flowNodes = flowchart.activities;
        let configuredNodeKeys = this.getConfiguredTaskKeys(configuredTasks);
        flowNodes.forEach(node => {
            node.color = this.color.GRAY;
            if(this.activityService.isConfigurable(node) || node.type === 'startEvent'|| node.type === 'endEvent'){
                node.textColor = this.color.BLACK;
            }else{
                node.textColor = this.color.GRAY;
            }
            let configuredNodeIndex = configuredNodeKeys.indexOf(node.taskKey);
            if (configuredNodeIndex > -1) {
                node.refer = (configuredTasks[configuredNodeIndex] && configuredTasks[configuredNodeIndex].accountRelationType == 2);
            }
        });
        flowchart.configuredNodes = configuredTasks;
        return flowchart;
    }

    getStageConfigFlowChartData(flowChartData){
        let flowchart = angular.copy(flowChartData);
        let flowNodes = flowchart.activities;
        flowNodes.forEach(node => {
            node.color = this.color.GRAY;
            if(node.type === 'startEvent'|| node.type === 'endEvent'){
                node.textColor = this.color.BLACK;
            }else if(node.type === 'exclusiveGateway'){
                node.textColor = this.color.GRAY;
            }else{
                node.textColor = this.color.BLACK;
            }
        });
        return flowchart;
    }

    isPreNodeNotReferable(currentNode, preNodeMap){
        let preNodes = preNodeMap.get(currentNode.taskKey);
        for(let preNodeIndex in preNodes){
            let preNode = preNodes[preNodeIndex];
            if(preNode.documentation && !this.activityService.isRefer(preNode)){
                return true;
            }
        }
        return false;
    }

    isPreNodeGreen(currentNode, preNodeMap, configuredTaskKeys){
        let preNodes = preNodeMap.get(currentNode.taskKey);
        for(let preNode in preNodes){
            if(configuredTaskKeys.indexOf(preNodes[preNode].taskKey) > -1){
                return true;
            }
        }
        return false;
    }

    getPreNode(nodes, sequenceFlows){
        let result = new Map();
        let nodeKeys = this.activityService.getFlowNodeKeys(nodes);
        for(let lineKey in sequenceFlows){
            let line = sequenceFlows[lineKey];
            let sourceNode = nodes[nodeKeys.indexOf(line.source)];
            let targetNode = nodes[nodeKeys.indexOf(line.target)];
            if(result.has(targetNode.taskKey)){
                result.get(targetNode.taskKey).push(sourceNode);
            }else{
                result.set(targetNode.taskKey, [sourceNode]);
            }
        }
        return result;
    }

    openDialog(scope, flowConfigCtrl, flowConfigTemp, data){
        this.ngDialog.open({
            closeByDocument: false,
            className: 'lw-select-person flowTaskConfig',
            template: flowConfigTemp,
            scope: scope,
            controller: flowConfigCtrl,
            controllerAs: 'flowConfig',
            plain: true,
            onOpenCallback:()=>{
                scope.$broadcast('childDialog', data);
            }
        });
    }

    getRelativeLine(currentConfiguredNode, activities){
        let relText = currentConfiguredNode.accountRelativeType == 2?'作者操作人参考':'人员组参考';
        let nodeKeys = this.activityService.getFlowNodeKeys(activities);
        return {
            color: this.color.PURPLE,
            textColor:this.color.BLACK,
            name: relText,
            nodes: [activities[nodeKeys.indexOf(currentConfiguredNode.taskKey)], activities[nodeKeys.indexOf(currentConfiguredNode.referentTaskKey)]]
        };
    }

    submitData(module, isAdd, dataObj) {
        console.log('dataObj',dataObj);
        if (isAdd == false) {
            this.WorkflowConfigInterface.updateWorkflowConfig(module, dataObj).then(res => {
                this.dialogsManager.showMessage('修改成功', {
                    className: 'success',
                    callback: () => {
                        history.go(-1);
                    }
                });
            });
        } else {
            this.WorkflowConfigInterface.saveWorkflowConfig(module, dataObj).then(res => {
                this.dialogsManager.showMessage('添加成功', {
                    className: 'success',
                    callback: () => {
                        history.go(-1);
                    }
                });
            })
        }
    }
}

ProcessConfigService.$inject = ['WorkflowConfigInterface', 'dialogsManager', 'activityService', 'ngDialog', 'flowChartService'];

