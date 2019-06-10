import auditHtml from './auditingFlow.html';

import ceshi from './image/image.jpg'
import './tag.css'

export default function auditFlow(canvasPluginsService,$config, audioFlowService, WorkflowInterface,$stateParams) {
    return {
        restrict: 'AE',
        replace: true,
        template: auditHtml,
        scope: {
            orderid: '='
        },
        link: function ($scope, elem, attr) {
            let scope = elem.scope();
            $scope.IconList = [];
            let colorPiker = audioFlowService.colorPiker,
                flowPaint = document.querySelector('#palette'),
                flowTag = document.querySelector('#Flowtag'),
                axisLineX = 0,
                axisLineY = 0,
                shiftWidth = 500,
                shiftHeight = 1000;

            /**
             * 锚点数据
             * @param data
             * @return {Array}
             */
            let getStagePosition = function (data) {
                let stagePosition = [];
                for (let name in data.stagePosition) {
                    let position = data.stagePosition[name];
                    stagePosition.push({name: name, position: position});
                }
                return stagePosition;
            };

            //获取流程图信息
            let getWorkflowTasks = () => {
                let flowChartData = {};
                WorkflowInterface.getWorkflowChart($scope.orderid).then(res => {
                    scope.stagePosition = res.data.stagePosition;
                    scope.currentStage = res.data.stage;
                    flowChartData = res.data;
                }).then((data) => {
                    WorkflowInterface.getWorkflowInfo($scope.orderid).then(res => {
                        initFlowChart(flowChartData, res.data);
                    })
                })
            };

            /**
             * 阶段锚点跳转
             * @param y
             * @param className
             */
            let goPosition = (y, className,dravclass) => {
                let height = document.querySelector('.' + dravclass).offsetHeight;
                document.querySelector('.'+(className||'contentWrapper')).scrollTop = y + height + 600;
            };

            /**
             * 获取审核阶段信息
             */
            let getAuditStage = () => {
                audioFlowService.getAuditStage($scope.orderid).then(res => {
                    scope.stage = res.data;
                });
            };

            /**
             * 流程图数据处理
             */
            let initData = () => {
                // 获取审核阶段状态信息
                // getAuditStage();
                // 获取工作流信息
                getWorkflowTasks();
                // 提供锚点跳转方法
                scope.goPosition = goPosition;
            };

            //初始画板画笔数据
            let initFlowChart = (flowChartData, flowedData) => {
                scope.flowedData = flowedData;
                axisLineX = flowChartData.maxWidth + 100;
                axisLineY = flowChartData.maxHeight;
                //获取画笔
                let palette = document.querySelector('#palette');
                if(palette){
                    palette.height = flowChartData.maxHeight + 200;
                    palette.width = flowChartData.maxWidth + 1000;
                    palette = document.querySelector('#palette').getContext("2d");
                    //把整个画布重置为白色
                    palette.beginPath();
                    palette.fillStyle = colorPiker.white;
                    /*设置填充颜色*/
                    /*绘制一个矩形，前两个参数决定开始位置，后两个分别是矩形的宽和高*/
                    palette.fillRect(0, 0, flowChartData.maxWidth + shiftWidth, flowChartData.maxHeight + shiftHeight);
                    palette.closePath();
                    palette.lineWidth = 2; //画笔粗细
                    drawFlowChart(palette, flowChartData, flowedData)
                }
            };

            //画出流程图
            let drawFlowChart = (palette, flowChartData, flowedData) => {
                let flowedKeys = getObjectKeys(flowedData.flowed, 'id');
                let flowNodesKeys = getObjectKeys(flowChartData.activities, 'taskKey');

                // 画流程节点
                drawFlowNodes(palette, flowChartData, flowedData, flowedKeys);

                // 画流程线
                drawFlowLines(palette, flowChartData, flowedData, flowedKeys);

                drawAuditorAxis(palette, axisLineX, axisLineY);

                drawStatusIcon(palette,flowChartData,flowedData,flowNodesKeys,flowedKeys);
                // 画用户头像
                drawAuditors(palette, flowChartData, flowedData, flowNodesKeys);
            };

            /**
             * 画所有的流程节点
             * @param palette
             * @param flowChartData
             * @param flowedData
             * @param flowedKeys
             */
            let drawFlowNodes = (palette, flowChartData, flowedData, flowedKeys) => {
                // 画任务节点
                for (let graph of flowChartData.activities) {
                    let flowedIndex = flowedKeys.indexOf(graph.taskKey);
                    graph.color = colorPiker.gray;
                    if (flowedIndex > -1) {
                        graph.color = colorPiker[flowedData.flowed[flowedIndex].color];
                    }
                    switch (graph.type) {
                        case 'exclusiveGateway':
                            audioFlowService.drawDiamond(palette, graph);
                            break;
                        case 'userTask':
                        case 'serviceTask':
                            audioFlowService.drawRect(palette, graph);
                            break;
                        case 'subProcess':break;
                        case 'inclusiveGateway':
                            audioFlowService.drawDiamond(palette, graph);
                            break;
                        case 'startEvent':
                            graph.color = '#666';
                            audioFlowService.drawCircles(palette, graph);
                            break;
                        case 'endEvent':
                            graph.color = '#666';
                            audioFlowService.drawCircles(palette, graph);
                            break;
                        default:
                            audioFlowService.drawCircles(palette, graph);
                            break;
                    }
                }
            };

            /**
             * 画所有的流程线
             * @param palette
             * @param flowChartData
             * @param flowedData
             * @param flowedKeys
             */
            let drawFlowLines = (palette, flowChartData, flowedData, flowedKeys) => {
                // 先画灰色
                let flowedLines = [];
                for (let key in flowChartData.sequenceFlows) {
                    let flowedIndex = flowedKeys.indexOf(key);
                    let line = flowChartData.sequenceFlows[key];
                    if (flowedIndex > -1) {
                        line.color = colorPiker[flowedData.flowed[flowedIndex].color];
                        flowedLines.push(line);
                    } else {
                        line.color = colorPiker.gray;
                        audioFlowService.drawLine(palette, line)
                    }
                }
                // 再画其他颜色  防止被灰色覆盖
                for (let line of flowedLines) {
                    audioFlowService.drawLine(palette, line)
                }
            };


            /**
             * 获取列表对象多对应的keys
             * @param objectList
             * @param keyName
             * @return {*}
             */
            let getObjectKeys = (objectList, keyName) => {
                let objects = angular.copy(objectList),
                    keys = [];
                objects.forEach(obj => {
                    keys.push(obj[keyName]);
                });
                return keys;
            };

            /**
             * 画用户头像所在轴线
             * @param palette
             */
            let drawAuditorAxis = (palette, axisLineX, axisLineY) => {
                let line = {};
                line.x1 = axisLineX;
                line.y1 = 0;
                line.x2 = axisLineX;
                line.y2 = axisLineY;
                audioFlowService.drawAxisLine(palette, line);
            };

            /**
             * 画所有的头像
             * @param palette
             * @param flowChartData
             * @param flowedData
             */
            let drawAuditors = (palette, flowChartData, flowedData, flowNodesKeys) => {
                let flowNodes = flowChartData.activities;
                let flowedNodes = flowedData.flowInfo;
                let infoKeys = getObjectKeys(flowedData.flowInfo,'taskKey');
                let drawFlowed = [], drawFlowedCountX = [];
                flowedNodes.forEach((node,i)=> {
                    let index = flowNodesKeys.indexOf(node.taskKey);
                    let noded = flowNodes[index];
                    let flowedIndex = drawFlowed.indexOf(noded.taskKey);
                    if(infoKeys.lastIndexOf(node.taskKey)!=i){
                        node.statusDescription = '';
                    }
                    
                    if (flowedIndex < 0) {
                        drawFlowed.push(noded.taskKey);
                        let psIndex = drawFlowed.length-1;
                        noded.autiorX = 0;
                        audioFlowService.drawLineForAuditor(palette, noded, axisLineX);
                        audioFlowService.drawAuditor(palette, noded, node, axisLineX);
                        // audioFlowService.drawAuditor(palette, noded, flowedNodes[i+1], axisLineX);
                    } else {
                        audioFlowService.drawAuditor(palette, noded, node, axisLineX);
                    }
                });
                palette.restore();
            };

            /**
             * 画状态图标
             * @param palette
             * @param flowChartData
             * @param flowedData
             * @param flowNodesKeys
             */
            let drawStatusIcon = (palette,flowChartData,flowedData,flowNodesKeys)=>{
                let infoKeys = getObjectKeys(flowedData.flowInfo,'taskKey');
                flowedData.flowed.forEach(flow=>{
                    if(flow.id!='exclusiveGateway'&&flow.id!='flow'){
                        let index = infoKeys.lastIndexOf(flow.id);
                        if(index>-1){
                            let commentNode = flowedData.flowInfo[index];
                            commentNode.color = colorPiker[flow.color];
                            let iconLine = getIconLineByRect(flowChartData,commentNode);
                            iconLine&&audioFlowService.drawStatusIcon(palette,commentNode,iconLine,$scope.IconList);
                        }
                    }
                });
                addHoverEventListener();
            };

            /**
             * 添加事件
             */
            let addHoverEventListener = ()=>{
                flowPaint.addEventListener('mousemove', event => {
                    for (let data of $scope.IconList) {
                        if (data.x2 > event.offsetX && data.x1 < event.offsetX && data.y1 < event.offsetY && data.y2 > event.offsetY) {
                            $scope.comment = data.comment;
                            $scope.isPassed = data.isPassed;
                            $scope.showTag = true;
                            flowTag.style.left = data.x2 + "px";
                            flowTag.style.top = data.y2 + "px";
                            $scope.$apply();
                            break;
                        }else{
                            $scope.showTag = false;
                            $scope.$apply();
                        }
                    }  
                })
            };
            
            /**
             * 根据审核节点获取状态图标所在线
             * @param flowChartData
             * @param nodeKey
             * @param flowNodesKeys
             * @return {*}
             */
            let getIconLineByRect = (flowChartData,commentNode)=>{
                let flowNodes = flowChartData.activities;
                let flowLines = flowChartData.sequenceFlows;
                let flowNL = flowChartData.taskLinkFlowMember;
                let lineKey = flowNL[commentNode.taskKey][0];
                let targetLines = flowNL[flowLines[lineKey].target];
                for(let key of targetLines){
                    let line = flowLines[key];
                    let condition = line.condition;
                    condition = condition?condition.replace(/\s+/g,""):'';
                    if((commentNode.isPassed===null||commentNode.isPassed)&&(condition.indexOf("approved=='true'")>-1||
                        condition.indexOf("result=='true'")>-1)){
                        return line;
                    }else if(!commentNode.isPassed&&(condition.indexOf("approved=='false'")>-1||
                        condition.indexOf("result=='false'")>-1)){
                        return line;
                    }
                }
            };

            initData();
        }
    }
}
auditFlow.$inject = ['canvasPluginsService', '$config', 'audioFlowService', 'WorkflowInterface','$stateParams'];