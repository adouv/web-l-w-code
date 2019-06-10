/**
 * @Author hejialin
 * @Description 描述
 */
import img_nopass from './image/not_pass.png';
import img_pass from './image/done.png';
import default_img_nopass from './image/not_pass1.png';
import default_img_pass from './image/done1.png';
import refreence from './image/refer.png';
import img_edit from './image/edit.png';
import img_delete from './image/delete.png';
import img_initialPoint from './image/initial_point.png';
import img_endPoint from './image/end_point.png';

export default class flowChartService {
    constructor(canvasPluginsService,activityService) {
        this.canvasService = canvasPluginsService;
        this.activityService = activityService;
        this.direction = activityService.direction;
        this.color = {   // 颜色值
            GREEN: '#00bb8b',
            PURPLE: '#786cec',
            WHITE: '#fff',
            GRAY: '#999999',
            LIGHT_GRAY: '#bbbbbb',
            BLACK: '#333333'
        };
        this.shape = { // 流程节点数据类型所对应流程图形状
            RECT1: 'userTask',
            RECT2: 'serviceTask',
            DIAMOND: 'exclusiveGateway',
            ROUND1: 'startEvent',
            ROUND0: 'endEvent'
        };
        this.img = {
            GRAY_PASS:default_img_pass,
            GRAY_NOPASS:default_img_nopass,
            GREEN_PASS:img_pass,
            GREEN_NOPASS:img_nopass,
            STAGE_EDIT:img_edit,
            STAGE_DELETE:img_delete,
            INITIAL_POINT:img_initialPoint,
            END_POINT:img_endPoint
        };
    }

    getColorByString(colorName){
        switch (colorName){
            case 'green':
                return this.color.GREEN;
            case 'purple':
                return this.color.PURPLE;
            case 'white':
                return this.color.WHITE;
            case 'gray':
                return this.color.GRAY;
        }
    }

//绘制流程图
    drawFlowChart(flowCvsDom, data,shiftX,shiftY,shiftWidth,shiftHeight,color,hoverColor) {
        this.flowChartData = angular.copy(data);
        this.relativeLine = this.flowChartData.relativeLine;
        this.shiftX = shiftX||0;
        this.shiftWidth = shiftWidth||0;
        this.shiftY = shiftY||0;
        this.shiftHeight = shiftHeight||0;
        flowCvsDom.width = this.flowChartData.maxWidth+(shiftWidth||0);
        flowCvsDom.height = this.flowChartData.maxHeight+(shiftHeight||0);
        // canvas width
        this.canvasWidth = this.flowChartData.maxWidth+(shiftWidth||0);
        //流程图画板
        let flowPalette = flowCvsDom.getContext("2d");
        this.palette = flowPalette;
        // 清空画板
        this.canvasService.eraser(flowPalette);
        color = color?this.getColorByString(color):this.color.GRAY;
        if(hoverColor!=='false'){
            this.hoverPointer(flowCvsDom,this.flowChartData,hoverColor?this.getColorByString(hoverColor):hoverColor);
        }
        // 画参考线
        this.drawLineDash(flowPalette, this.flowChartData.relativeLine);
        // 画流程节点
        this.drawFlowNodes(flowPalette, this.flowChartData.activities,this.flowChartData.relativeLine, color,shiftX,shiftY);
        // 画流程线
        this.drawFlowLines(flowPalette, this.flowChartData.sequenceFlows, color,shiftX,shiftY);
        // 画区域阶段图
        this.drawStageLine(flowPalette, this.flowChartData.processStage);
        // hoverStageShowIcon 鼠标移到阶段位置,显示阶段背景
        console.log("this.flowChartData.processStageRangeCanva----s",this.flowChartData.processStageRangeCanvas);
        if(this.flowChartData.processStageRangeCanvas && this.flowChartData.processStageRangeCanvas.length!=0){

            this.hoverStageShowIcon(flowCvsDom,this.flowChartData.processStageRangeCanvas);            
        }
    }

    /**
     * 画流程节点
     * @param palette 画板
     * @param nodes 流程节点列表
     * @param bgcolor 颜色
     */
    drawFlowNodes(palette, nodes,relativeLine, bgcolor,shiftX,shiftY) {
        nodes.forEach(node => {
            node.x += shiftX||0;
            node.y += shiftY||0;
            let lineColor = node.color||bgcolor;
            let textColor = node.textColor||node.color||bgcolor;
            switch (node.type) {
                case this.shape.ROUND1:
                    this.drawCircle(palette, node, lineColor, textColor, node.isFill);
                    break;
                case this.shape.RECT1:
                    this.drawRectangle(palette, node, relativeLine, lineColor, textColor, node.isFill);
                    break;
                case this.shape.RECT2:
                    this.drawRectangle(palette, node, relativeLine, lineColor, textColor, node.isFill);
                    break;
                case this.shape.DIAMOND:
                    this.drawDiamond(palette, node, lineColor, textColor, node.isFill);
                    break;
                case this.shape.ROUND0:
                    this.drawCircle(palette, node, lineColor, textColor, node.isFill);
                    break;
            }
        });
    }

    /**
     * 画流程线
     * @param palette 画板
     * @param lines 线数组
     * @param color 颜色
     */
    drawFlowLines(palette, lines, color,shiftX,shiftY) {
        shiftX = shiftX||0;
        shiftY = shiftY||0;
        for (let lineKey in lines) {
            let line = lines[lineKey];
            if (line.xPointList.length > 2) {
                this.drawBrokenLine(palette, line, line.color||color,shiftX,shiftY);
            } else if (line.xPointList.length == 2) {
                let startX = line.xPointList[0]+shiftX,
                    startY = line.yPointList[0]+shiftY,
                    endX = line.xPointList[1]+shiftX,
                    endY = line.yPointList[1]+shiftY;
                this.drawSingleFlowLine(palette, startX, startY, endX, endY, line.color||color, true)
            }
        }
    }

    /**
     * 鼠标在可点击节点上变小手
     */
    hoverPointer(flowCvsDom,data,hoverColor){
        if(hoverColor){
            flowCvsDom.addEventListener('mousemove',event=>{
                let node = this.getClickFlowNode(event,data.activities,false);
                if(!node){
                    node = this.getClickReferArea(event,data.activities,false)
                }
                if(node&&node.type=='userTask'&&
                    node.index>-1&&(node.color==hoverColor||node.isClick)){
                    flowCvsDom.style.cursor = 'pointer';
                }else{
                    flowCvsDom.style.cursor = 'default';
                }
            });
        }else if(hoverColor===undefined){
            flowCvsDom.addEventListener('mousemove',event=>{
                let node = this.getClickFlowNode(event,data.activities,false);
                if(!node){
                    node = this.getClickReferArea(event,data.activities,false)
                }
                if(node&&node.type=='userTask'&&
                    node.index>-1){
                    flowCvsDom.style.cursor = 'pointer';
                }else{
                    flowCvsDom.style.cursor = 'default';
                }
            });
        }else{
            flowCvsDom.addEventListener('mousemove',event=>{
                let node = this.getClickFlowNode(event,data.activities,false);
                if(!node){
                    node = this.getClickReferArea(event,data.activities,false)
                }
                if(node&&node.type=='userTask'&&
                    node.index>-1&&(!node.color||node.isClick)){
                    flowCvsDom.style.cursor = 'pointer';
                }else{
                    flowCvsDom.style.cursor = 'default';
                }
            });
        }
    }


    /**
     * 画折线
     * @param palette 画板
     * @param line 线条
     * @param color 颜色
     * @param isDash 虚/实
     */
    drawBrokenLine(palette, line, color,shiftX,shiftY) {
        for (let len = line.xPointList.length, i = 0; i < len - 1; i++) {
            let startX = line.xPointList[i]+shiftX,
                startY = line.yPointList[i]+shiftY,
                endX = line.xPointList[i + 1]+shiftX,
                endY = line.yPointList[i + 1]+shiftY;
            this.drawSingleFlowLine(palette, startX, startY, endX, endY, color, (i==0||i == len - 2));
        }
    }

    /**
     * 画单条线
     * @param palette 画板
     * @param startX 开始X坐标
     * @param startY 开始Y坐标
     * @param endX 结束X坐标
     * @param endY 结束Y坐标
     * @param color 颜色
     * @param hasArrow 是否有箭头
     * @param isDash 虚/实
     */
    drawSingleFlowLine(palette, startX, startY, endX, endY, color, hasArrow) {
       if (!hasArrow) {
            this.canvasService.drewLine(palette, startX, startY, endX, endY, color).stroke();
        } else if (hasArrow) {
            this.canvasService.drawDirectionLine(palette, startX, startY, endX, endY, color).stroke();
        }
    }

    /**
     * 画圆
     * @param palette 画板
     * @param rect 矩形对象
     * @param bdcolor 颜色
     * @param isFill 是否填充
     */
    drawCircle(palette, rect, bdcolor, textColor, isFill) {
        let r = rect.height / 2;
        let bgcolor = isFill ? this.color.WHITE : textColor;
        this.canvasService.drewCircle(palette, rect.x + r, rect.y + r, r, 0, 2 * Math.PI, bdcolor)[isFill ? 'fill' : 'stroke']();
        this.canvasService.drewText(palette, rect.name||'', rect.x + r, rect.y + r, bgcolor).stroke();
    }

    //画参考线
    drawLineDash(palette, relativeLine) {
        if(relativeLine){
            let sourceNode = relativeLine.nodes[0], targetNode=relativeLine.nodes[1];
            let shiftWidth = 150,xs = [],ys = [];
            xs[0] = sourceNode.x + this.shiftX + sourceNode.width;
            ys[0] = sourceNode.y + this.shiftY + sourceNode.height/2;
            xs[1] = targetNode.x + this.shiftX + targetNode.width;
            ys[1] = targetNode.y + this.shiftY + targetNode.height/2;
            let x = xs[0]>xs[1]?xs[0]:xs[1];
            this.canvasService.drawDashLine(palette, xs[0], ys[0], x+shiftWidth, ys[0], relativeLine.color).stroke();
            this.canvasService.drawDashLine(palette, x+shiftWidth, ys[0], x+shiftWidth, ys[1], relativeLine.color).stroke();
            this.canvasService.drewDirectionDashLine(palette, x+shiftWidth, ys[1], xs[1], ys[1], relativeLine.color, [9, 9]).stroke();
            if(relativeLine.name){
                let textX = ys[0]>ys[1]?(x+shiftWidth-xs[1])/2+xs[1]:(x+shiftWidth-xs[0])/2+xs[0];
                let textY = ys[0]>ys[1]?ys[1]-10:ys[0]-10;
                this.canvasService.drewText(palette, relativeLine.name, textX, textY, relativeLine.textColor||relativeLine.color).stroke();
            }
            palette.setLineDash([]);
        }
    }


    /**
     * 画区域阶段线
     * @param palette 画板
     * @param processStage 阶段数据
     */
    drawStageLine(palette, processStageData) {
        if(processStageData){
            processStageData.forEach((processStage) => {
            let gateway = this.activityService.isSystemGateway(this.flowChartData,processStage.nodes[1].taskKey);
            let startLine = processStage.nodes[0],endLine = processStage.nodes[1];
            this.canvasService.drawDashLine(palette,0,startLine.y,this.canvasWidth,startLine.y,processStage.color,[5]).stroke();
            let topMiddlePoint;
            if(gateway){
                this.canvasService.drawDashLine(palette,0,endLine.y+endLine.height+60+100,this.canvasWidth,endLine.y+endLine.height+60+100,processStage.color,[5]).stroke();
                topMiddlePoint = (endLine.y+endLine.height+60+100-startLine.y)/2;
            }else{
               this.canvasService.drawDashLine(palette,0,endLine.y+endLine.height+60,this.canvasWidth,endLine.y+endLine.height+60,processStage.color,[5]).stroke();
                topMiddlePoint = (endLine.y+endLine.height+60-startLine.y)/2;
            }
            this.canvasService.drewLine(palette,this.canvasWidth-122,startLine.y,this.canvasWidth-122,startLine.y+topMiddlePoint-60,processStage.color).stroke();
            this.canvasService.drewLine(palette,this.canvasWidth-122,startLine.y+topMiddlePoint+60,this.canvasWidth-122,endLine.y+endLine.height+60+100,processStage.color).stroke();
            this.canvasService.drewText(palette, processStage.name,this.canvasWidth-122,startLine.y+topMiddlePoint,'black').stroke();
/*            this.canvasService.drewImages(palette,this.img.STAGE_EDIT,this.canvasWidth-150,startLine.y+topMiddlePoint+16,20).stroke();
            this.canvasService.drewImages(palette,this.img.STAGE_DELETE,this.canvasWidth-110,startLine.y+topMiddlePoint+16,20).stroke();*/
            this.canvasService.drewImages(palette,this.img.INITIAL_POINT,startLine.x+startLine.width-24,startLine.y,48).stroke();
            this.canvasService.drewImages(palette,this.img.END_POINT,endLine.x+endLine.width-24,endLine.y,48).stroke();
            })
        }
    }

    /*
    * 画阶段范围背景和阶段图标 
    */
    drawStageRangeAndIcon(palette,RangeCanvas){
            this.canvasService.drewroundRect(palette,RangeCanvas.x,RangeCanvas.y-RangeCanvas.h/2,RangeCanvas.w,RangeCanvas.h,2,'#DBE3EE',"#DBE3EE").fill();
            this.canvasService.drewImages(palette,this.img.STAGE_EDIT,this.canvasWidth-150,RangeCanvas.middeleY+16,20).stroke();
            this.canvasService.drewImages(palette,this.img.STAGE_DELETE,this.canvasWidth-110,RangeCanvas.middeleY+16,20).stroke();
            this.canvasService.drewText(palette, RangeCanvas.name,this.canvasWidth-122,RangeCanvas.middeleY,'black').stroke();
    }

    /*
    * 画字体
    */
   drawStageText(palette,RangeCanvas){
        this.canvasService.drewText(palette, RangeCanvas.name||'',this.canvasWidth-122,RangeCanvas.middeleY,'black').stroke();
   }

    /**
     * 画菱形
     * @param palette 画板
     * @param diamond 菱形对象
     * @param bdcolor 颜色
     * @param isFill 是否填充
     */
    drawDiamond(palette, diamond, bdcolor, textColor, isFill) {
        let bgcolor = isFill ? this.color.WHITE : textColor;
        this.canvasService.drewLozenge(palette, diamond.x+diamond.width/2, diamond.y, diamond.width, diamond.height, bdcolor, bdcolor)[isFill ? 'fill' : 'stroke']();
        this.canvasService.drewText(palette, diamond.name||'', diamond.x+diamond.width/2, diamond.y + diamond.height / 2, bgcolor).stroke();
        this.getIconPosition(palette,diamond,0);
        this.getIconPosition(palette,diamond,1);
    }

    /**
     * 获取菱形条件所对应的图标信息
     * @param diamond 菱形对象
     * @param bdcolor 颜色
     * @return {[*,*]}
     */
    getIconPosition(palette,diamond,index){
        let lineKey = this.flowChartData.taskLinkFlowMember[diamond.taskKey][index];
        let lineObj = lineKey&&this.activityService.getDirectionByLine(this.flowChartData.sequenceFlows[lineKey]);
        if(lineObj){
            var img = new Image();
            img.src = lineObj.isPass?this.img.GREEN_PASS:this.img.GREEN_NOPASS;
            img.onload = () => {
                let x, y =0;
                switch (lineObj.direction){
                    case this.direction.LEFT:
                        x = diamond.x  - img.width;
                        y = diamond.y + diamond.height/2 - img.height/2;
                        break;
                    case this.direction.RIGHT:
                        x = diamond.x + diamond.width;
                        y = diamond.y + diamond.height/2 - img.height/2;
                        break;
                    case this.direction.UP:
                        x = diamond.x + diamond.width/2 - img.width/2;
                        y = diamond.y - img.height;
                        break;
                    case this.direction.DOWN:
                        x = diamond.x + diamond.width/2 - img.width/2;
                        y = diamond.y + diamond.height;
                        break;
                }
                palette.drawImage(img, x, y, img.width, img.height);
                palette.stroke();
            }
        }
    }

    /**
     * 画矩形
     * @param palette 画板
     * @param rect 矩形对象
     * @param lineColor 颜色
     * @param isFill 是否填充
     */
    drawRectangle(palette, rect,relativeLine, lineColor, textColor, isFill) {
        let bgcolor = isFill ? this.color.WHITE : textColor;
        this.canvasService.drewroundRect(palette, rect.x, rect.y, rect.width, rect.height, 3, lineColor, lineColor)[isFill ? 'fill' : 'stroke']();
        let textLen = rect.name.length;
        if (textLen <= 13) {
            this.canvasService.drewText(palette, rect.name||'', rect.x + rect.width / 2, rect.y + rect.height / 2, bgcolor).stroke();
        } else {
            let text1 = rect.name.substring(0, textLen / 2);
            let text2 = rect.name.substring(textLen / 2, textLen);
            this.canvasService.drewText(palette, text1, rect.x + rect.width / 2, rect.y + rect.height / 2 - 9, bgcolor).stroke();
            this.canvasService.drewText(palette, text2, rect.x + rect.width / 2, rect.y + rect.height / 2 + 9, bgcolor).stroke();
        }
        if(rect.refer&&(!relativeLine||relativeLine&&relativeLine.nodes[0].taskKey!=rect.taskKey)){
            let referX = rect.x+rect.width+10;
            let referY = rect.y+rect.height/2-11;
            this.dramImage(palette,refreence,referX,referY,20);
        }
    }

    /**
     * 重绘矩形
     * @param palette 画板
     * @param rect 矩形对象
     * @param bdcolor 颜色
     * @param isFill 是否填充
     */
    redrawRectangle(palette, rect, bdcolor, isFill){
        let rec = angular.copy(rect);
        palette = palette||this.palette;
        rec.x += this.shiftX;
        rec.y += this.shiftY;
        this.canvasService.eraser(palette,rec.x,rec.y,rec.width,rec.height);
        this.drawRectangle(palette, rec, bdcolor, isFill);
    }

    /**
     * 绘制图片
     * @param palette 画板
     * @param url 路径
     * @param x 顶点X坐标
     * @param y 顶点Y坐标
     * @param newWidth 图片大小
     */
    dramImage(palette, url, x, y, newWidth) {
        this.canvasService.drewImages(palette, url, x, y, newWidth).stroke();
    }

    /**
     * 获取所点击位置的流程节点
     * @param e
     * @param flowNodes
     * @return {number}
     */
    getClickFlowNode(e, flowNodes,hasShift) {
        e = e || window.event;
        let offsetY = e.offsetY-(hasShift?this.shiftY:0);
        let offsetX = e.offsetX-(hasShift?this.shiftX:0);
        for (let i = 0, len = flowNodes.length; i < len; i++) {
            let distanceX = offsetX - flowNodes[i].x;
            let distanceY = offsetY - flowNodes[i].y;
            if (distanceX > 0 && distanceX < flowNodes[i].width &&
                distanceY > 0 && distanceY < flowNodes[i].height) {
                flowNodes[i].index = i;
                return flowNodes[i];
            }
        }
    }

    /**
     * 获取参考按钮所对应的节点
     * @param e
     * @param flowNodes
     * @return {number}
     */
    getClickReferArea(e, flowNodes,hasShift) {
        e = e || window.event;
        let offsetY = e.offsetY-(hasShift?this.shiftY:0);
        let offsetX = e.offsetX-(hasShift?this.shiftX:0);
        for (let i = 0, len = flowNodes.length; i < len; i++) {
            if(flowNodes[i].refer&&(!this.relativeLine||
                this.relativeLine.nodes[0].taskKey!=flowNodes[i].taskKey)){
                let distanceX = offsetX - flowNodes[i].x - flowNodes[i].width - 10;
                let distanceY = offsetY - flowNodes[i].y - flowNodes[i].height/2 + 10;
                if (distanceX > 0 && distanceX < 20 &&
                    distanceY > 0 && distanceY < 20) {
                    flowNodes[i].index = i;
                    return flowNodes[i];
                }
            }
        }
    }

    /**
     * 获取修改图标所对应的节点
     * @param e
     * @param flowNodes
     * @return {number}
     */
     getClickStageArea(e,satge){
         e = e || window.event;
        let offsetY = e.offsetY;
        let offsetX = e.offsetX;
        let info = {};
        satge.processStage.forEach((data) => {
            if(offsetX >= data.range.editX-5 && offsetX <= data.range.editX+20 && offsetY >= data.range.editY-5 && offsetY <= data.range.editY+20){
                info.type = 'edit';
                info.msg = data;
            }
            if(offsetX >= data.range.deleX-5 && offsetX <= data.range.deleX+20 && offsetY >= data.range.deleY-5 && offsetY <= data.range.deleY+20){
                info.type = 'dele';
                info.msg = data;
            }
        })
        return info;
     }   


     /*
     * 鼠标移到阶段位置显示阶段图标
     *  
     */
     hoverStageShowIcon(flowCvsDom,data){
        console.log('data-------区域阶段',data);
        flowCvsDom.addEventListener('mousemove',event=>{
            let offsetX = event.offsetX;
            let offsetY = event.offsetY;
/*            console.log('x位置,',offsetX);
            console.log('Y位置',offsetY);*/
            data.forEach((val) => {
                if(offsetX >= val.x && offsetX <= (val.x+val.w) && offsetY >= val.y-60 && offsetY <= (val.y+val.h)){
                    console.log('val.x',val.x);
                    console.log('val.y',val.y);
                    this.drawStageRangeAndIcon(this.palette,val);          // 画出当前位置的背景和图标
                    flowCvsDom.style.cursor = 'pointer';
                }else{
                    this.canvasService.eraser(this.palette,val.x-10,val.y-val.h/2-10,val.w+20,val.h+20);
                     flowCvsDom.style.cursor = 'default';
                    this.drawStageText(this.palette,val);
                }
            })
        });
     }


}
flowChartService.$inject = ['canvasPluginsService','activityService'];