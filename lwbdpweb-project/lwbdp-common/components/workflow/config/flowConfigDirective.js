/**
 * @Author hejialin
 * @Description 流程图配置指令
 */

class flowChartCtrl{
    constructor($scope,flowChartService,ProcessConfigService,dialogsManager){
        this.$scope = $scope;
        this.parentScope = $scope.$parent;
        this.flowChartService = flowChartService;
        $scope.$parent.$flowChart = {};
        this.ProcessConfigService = ProcessConfigService;
        this.dialogsManager = dialogsManager;
    }

    /**
     * 点击流程节点触发的操作
     * @param event 事件
     * @param activities
     */
    clickFlowNode(event,activities){
        let currentFlowNode = this.flowChartService.getClickFlowNode(event, activities,true);
        if(!currentFlowNode){
            currentFlowNode = this.flowChartService.getClickReferArea(event, activities,true);
            currentFlowNode&&(currentFlowNode.click = 'refer');
        }else{
            currentFlowNode.click = 'node';
        }
        if (currentFlowNode) {
            this.parentScope.$flowNode = currentFlowNode;
            this.$scope.flowChartClick();
        }

        /*点击阶段图标*/
        if(this.$scope.flowChartData.processStage){
            let stage = this.flowChartService.getClickStageArea(event,this.$scope.flowChartData);
            if(stage && stage.type == 'edit'){
                this.$scope.$emit('currentStageIcon',stage);
                this.ProcessConfigService.openDialogWithStage(this.parentScope);
            }else if(stage && stage.type == 'dele'){
                    this.dialogsManager.confirm({
                        content:`确定删除阶段配置吗`,
                        callback:()=>{
                            this.$scope.$emit('clearStage',stage);
                        }
                    })
            }
        }

    }
    
}
flowChartCtrl.$inject = ['$scope','flowChartService','ProcessConfigService','dialogsManager'];

export default function drawFlowchart(flowChartService, dialogsManager, activityService) {
    return {
        restrict: 'AE',
        replace: true,
        template: `
            <div class="flow_box" id="#flow-container" ng-click="flow.clickFlowNode($event,flowChartData.activities)">
                <canvas id="#flow-palette" width="520px">
                    您的浏览器不支持Canvas标签，请升级或更换浏览器
                </canvas>
            </div>
        `,
        scope: {
            flowChartData: "=",
            flowChartClick: '&'
        },
        controller: flowChartCtrl,
        controllerAs: 'flow',
        link: function ($scope, elem, attr) {
            let flowCvsDom = elem[0].firstElementChild;
            let initData = ()=>{
                //监听流程图数据变化
                $scope.$watch('flowChartData', function (data) {
                    activityService.setFlowLinesDirection(data.sequenceFlows);
                    $scope.flowNodes = data.activities;
                    $scope.flowLines = data.sequenceFlows;
                    $scope.flow.hoverColor = flowChartService.getColorByString(attr.flowChartHover);
                    flowChartService.drawFlowChart(flowCvsDom, data, 0, 30, 200, 50,attr.flowChartColor,attr.flowChartHover);
                });
            };
            initData();
        }
    }
}
drawFlowchart.$inject = ['flowChartService', 'dialogsManager', 'activityService'];