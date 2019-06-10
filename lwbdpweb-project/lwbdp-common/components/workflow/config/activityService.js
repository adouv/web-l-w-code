/**
 * @Author hejialin
 * @Description 工作流接口服务
 */

export default class activityService {
    constructor($window) {
        this.$window = $window;
        this.direction = {
            LEFT:'left',
            RIGHT:'right',
            UP:'up',
            DOWN:'down'
        };
    }

    /**
     * 是否可参考
     * @param node
     */
    isRefer(node){
        let documentation = JSON.stringify(node.documentation).replace(/"/g,'');
        return documentation&&documentation.indexOf('refer:true')>-1;
    }

    /**
     * 是否可配置
     * @param node
     */
    isConfigurable(node){
        let documentation = JSON.stringify(node.documentation).replace(/"/g,'');
        console.log('documentation----------',documentation);
        return documentation&&documentation.indexOf('configurable:true')>-1;
    }

    /**
     * 获取可配置节点的Key
     * @param node
     */
    getConfigurableNodeSize(flowData) {
        let taskKeys = [];
        flowData.forEach(flowNode => {
            if (this.isConfigurable(flowNode)) {
                taskKeys.push(flowNode.taskKey)
            }
        });
        return taskKeys.length;
    }

    /**
     * 获取所有流程节点的taskKey
     * @return {Array}
     */
    getFlowNodeKeys(flowNodes) {
        let ids = [];
        flowNodes.forEach(node => {
            ids.push(node.taskKey);
        });
        return ids;
    }

    /**
     * 设置所有流程线的方向
     * @param flowLines 流程线
     * @return {*}
     */
    setFlowLinesDirection(flowLines) {
        for (let lineKey in flowLines) {
            let line = flowLines[lineKey];
            line.directions = [];
            let xs = line.xPointList, ys = line.yPointList;
            for(let i=0,len=xs.length-1;i<len;i++){
                if(xs[i]>xs[i+1] && xs[i]-xs[i+1]>5){
                    line.directions.push(this.direction.LEFT);
                }else if(xs[i]<xs[i+1] && xs[i+1]-xs[i]>5){
                    line.directions.push(this.direction.RIGHT);
                }else if(ys[i]>ys[i+1] && ys[i]-ys[i+1]>5){
                    line.directions.push(this.direction.UP);
                }else if(ys[i]<ys[i+1] && ys[i+1]-ys[i]>5){
                    line.directions.push(this.direction.DOWN);
                }
            }
        }
    }
    
    /**
     * 获取线的方向和出入
     * @return {string}
     */
    getDirectionByLine(line){
        if(line.condition&&(line.condition.indexOf('approved')>-1||
            line.condition.indexOf('systemAudit')>-1)){
            if(line.condition&&line.condition.indexOf('true')>-1){
                return {
                    direction:line.directions&&line.directions[0],
                    isPass:true
                };                
            }else if(line.condition){
                return {
                    direction:line.directions&&line.directions[0],
                    isPass:false
                };
            }else{
                console.error(line);
            }
        }
        return null;
    }

    getFollowNodeKeys(flowChartData, taskKey){
        let followKeys = [];
        let lineList = flowChartData.sequenceFlows;
        let flowRelations = flowChartData.taskLinkFlowMember;
        let lineKeys = flowRelations[taskKey];
        if(lineKeys !== undefined){
            lineKeys.forEach(lineKey => {
                let line = this.getDirectionByLine(lineList[lineKey]);
                if(lineKeys.length<2||(line&&line.isPass)){
                    let taskKey = lineList[lineKey].target;
                    followKeys.push(taskKey);
                    followKeys.push(...this.getFollowNodeKeys(flowChartData, taskKey));
                }
            });
        }
        return followKeys;
    }

    /*
    * 判断当前的下一个节点是否系统网关
    * @params currentTask 当前流程节点的taskkey
    */
    isSystemGateway(flowChartData,currentTask) {
        let bool;
        console.log("flowChartData.taskLinkFlowMember[currentTask]",flowChartData.taskLinkFlowMember[currentTask]);
        let currentLine = flowChartData.taskLinkFlowMember[currentTask][0];
        let targetNode = flowChartData.sequenceFlows[currentLine].target;
        flowChartData.activities.forEach((data) => {    
            if(data.taskKey == targetNode){
              bool = (data.type == 'exclusiveGateway')? true : false;
            }
        })
        return bool;
    }

    /*
    * 获取阶段范围内的taskkey
    * @params start,end 开始节点,结束节点
    */
   getStageTask(flowChartData,start,end){
    let transFormat = (data) => {
        let zoom = data.replace(/\{/g,'').replace(/\}/g,'').split(","),
            num;
        zoom.forEach((data) => {
            if(data.indexOf('order') > -1){
                let index = data.indexOf(':');
                num = data.substr(index+1,data.length)
            }
        })
        return Number(num);
    };
    let startOrder = transFormat(start.documentation),
        endOrder = transFormat(end.documentation),
        taskArr = [];

       flowChartData.activities.forEach((data) => {  
            if(this.isConfigurable(data)){
                if(data.documentation){
                    if( transFormat(data.documentation) >= startOrder && transFormat(data.documentation) <= endOrder){
                        taskArr.push(data.taskKey);
                    }
                }
             } 
        })
        return taskArr;
   }

   /*
   * 获取阶段范围内的图标位置
   */ 
   getStageRange(flowChartData,startNode,endNode,canvasWidth){
        let isGateway = this.isSystemGateway(flowChartData,endNode.taskKey);
        let range = {},topMiddlePoint;
        if(isGateway){
            topMiddlePoint = (endNode.y+endNode.height+60+100-startNode.y)/2;
        }else{
            topMiddlePoint = (endNode.y+endNode.height+60-startNode.y)/2;
        }
        range.editX = canvasWidth-150;
        range.editY = startNode.y+topMiddlePoint+16;
        range.deleX = canvasWidth-110;
        range.deleY = startNode.y+topMiddlePoint+16;
        return range;
   }

   /*
    * 获取阶段范围区域 
    */
   getStageRangeCanvas(flowChartData,startNode,endNode,canvasWidth){
        let isGateway = this.isSystemGateway(flowChartData,endNode.taskKey);
        let range = {},topMiddlePoint;
        if(isGateway){
            topMiddlePoint = (endNode.y+endNode.height+60+100-startNode.y)/2;
        }else{
            topMiddlePoint = (endNode.y+endNode.height+60-startNode.y)/2;
        };
       range.x = canvasWidth-200;
       range.y = startNode.y+topMiddlePoint;
       range.w = 170;
       range.h = 90;
       range.middle = topMiddlePoint;
       range.middeleY = startNode.y+topMiddlePoint;
       return range;
   }

}
activityService.$inject = ['$window'];