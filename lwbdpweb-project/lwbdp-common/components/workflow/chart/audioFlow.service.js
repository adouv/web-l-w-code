/**
 * @Author hejialin
 * @Description 审核流程
 */
import nopass from './image/not_pass.png';
import ceshi from './image/image.jpg'
import noTxtpass from './image/not_pass_opinion.png';
import passImg from './image/done.png';
import yellowPassImg from './image/done_stay.png';
import yellowPassTxtImg from './image/done_opinion_stay.png';
import passTxtImg from './image/done_opinion.png';

export default class audioFlowService{
    constructor(canvasPluginsService,$filter,$config){
        this.$filter = $filter;
        this.$config = $config;
        this.colorPiker = this.initColor();
        this.canvasPluginsService = canvasPluginsService;
    }

    /**
     * 初始化颜色值
     * @return {{green: string, white: string, blue: string, yellow: string, gray: string}}
     */
    initColor(){
        return {
            green : '#00bb8b',
            white : '#ffffff',
            blue : '#0096ff',
            yellow : '#ffc324',
            gray : '#999999',
            grey : '#dbe3ee',
            black : '#000',
            red:'#fc4e5a',
        }
    }

    //画出头像的遮罩
    drawAuditorShadow(palette, axixX, y,h, taskInfo){
        palette.save();
        palette.lineWidth = 2;
        //画外层边框
        this.canvasPluginsService.drewroundRect(palette, axixX - 19.5, y + h / 2 - 19.5, 39, 39, 0, this.colorPiker.white).stroke()
        palette.save();
        palette.lineWidth = 6;
        //画四个角遮罩
        this.canvasPluginsService.drewCircle(palette, axixX, y + h / 2, 23, - Math.PI * 1 / 3, Math.PI * 1 / 3, this.colorPiker.white).stroke()
        this.canvasPluginsService.drewCircle(palette, axixX, y + h / 2, 23, Math.PI * 2 / 3, Math.PI * 5 / 6, this.colorPiker.white).stroke()
        this.canvasPluginsService.drewCircle(palette, axixX, y + h / 2, 23, Math.PI * 7 / 6, Math.PI * 4 / 3, this.colorPiker.white).stroke()
        palette.restore();
        //画内层圆遮罩
        this.canvasPluginsService.drewCircle(palette, axixX, y + h / 2, 20, 0, Math.PI * 2, this.colorPiker.grey).stroke()
        this.drawTaskInfo(palette, axixX, y,h, taskInfo)
    };

    /**
     * 画出连接节点和用户头像的虚线
     * @param palette
     * @param goway
     */
    drawLineForAuditor (palette, goway,axisLineX){
        this.canvasPluginsService.drewDottLine(palette, goway.x + goway.width, goway.y + goway.height / 2, axisLineX, goway.y + goway.height / 2, 5, this.colorPiker.grey).stroke()
    };

    /**
     * 写出旁边的描边字
     * @param palette
     * @param axixX
     * @param y
     * @param h
     * @param taskInfo
     */
    drawTaskInfo(palette, axixX, y,h, taskInfo){
        this.canvasPluginsService.drewText(palette, taskInfo.accountName || '', axixX + 30, y + h / 2, this.colorPiker.black, 'bottom', 'left').stroke();
        let account = taskInfo.statusDescription&&taskInfo.statusDescription.indexOf('延期')>-1?'  （'+taskInfo.statusDescription+'）':'';
        if(account){
            this.canvasPluginsService.drewText(palette, account, axixX + 30+taskInfo.accountName.length*10, y + h / 2, this.colorPiker.red, 'bottom', 'left',12).stroke();
        }
        if(taskInfo.isCompleted){
            this.canvasPluginsService.drewText(palette, this.$filter('date')(taskInfo.completeTime,'yyyy/MM/dd'), axixX + 30, y + h / 2 + 20, this.colorPiker.gray, 'bottom', 'left').stroke()
            this.canvasPluginsService.drewText(palette, this.$filter('date')(taskInfo.completeTime,'HH:mm'), axixX + 30, y + h / 2 + 40, this.colorPiker.gray, 'bottom', 'left').stroke()
        }else{
            this.canvasPluginsService.drewText(palette,  '待'+taskInfo.accountName+'审核', axixX + 30, y + h / 2 + 20, this.colorPiker.gray, 'bottom', 'left').stroke()
        }
        palette.restore();
    }

    /**
     * 画出状态图标
     * @param palette
     * @param successNode
     * @param iconLine
     */
    drawStatusIcon (palette, successNode, iconLine,IconList){
        let x = 0, y = 0,colorImg = null,img_path=null;
        if(iconLine.color==this.colorPiker.gray)return;
        if(successNode.isPassed===true||successNode.isPassed===null){
            colorImg = successNode.color == this.colorPiker.green?[passTxtImg,passImg]:[yellowPassTxtImg,yellowPassImg];
            img_path = successNode.comment?colorImg[0]:colorImg[1];
        }else{
            img_path = successNode.comment?noTxtpass:nopass;
        }
        if (iconLine.xPointList[0] - iconLine.xPointList[1] > 30) { // left
            successNode.x1 = iconLine.xPointList[0]-17;
            successNode.x2 = iconLine.xPointList[0]+3;
            successNode.y1 = iconLine.yPointList[0]-7;
            successNode.y2 = iconLine.yPointList[0]+13;
            this.setHoverIconList(iconLine,successNode,IconList);
            if(successNode.isPassed){
                if(successNode.comment){
                    this.dramImg(palette, img_path, successNode.x1-33, successNode.y1-3);
                }else{
                    this.dramImg(palette, img_path, successNode.x1-31, successNode.y1-3);
                }
            }else{
                if(successNode.comment){
                    this.dramImg(palette, img_path, successNode.x1-54, successNode.y1-3);
                }else{
                    this.dramImg(palette, img_path, successNode.x1-42, successNode.y1-3);
                }
            }
        } else if (iconLine.xPointList[0] - iconLine.xPointList[1] < -30) { // right
            successNode.x1 = iconLine.xPointList[0]-2;
            successNode.x2 = iconLine.xPointList[0]+18;
            successNode.y1 = iconLine.yPointList[0]-7;
            successNode.y2 = iconLine.yPointList[0]+13;
            this.setHoverIconList(iconLine,successNode,IconList);
            if(successNode.isPassed){
                if(successNode.comment){
                    this.dramImg(palette, img_path, successNode.x1+3, successNode.y1-3);
                }else{
                    this.dramImg(palette, img_path, successNode.x1+1, successNode.y1-3);
                }
            }else{
                if(successNode.comment){
                    this.dramImg(palette, img_path, successNode.x1+3, successNode.y1-3);
                }else{
                    this.dramImg(palette, img_path, successNode.x1+3, successNode.y1-3);
                }
            }
        } else if (iconLine.yPointList[0] - iconLine.yPointList[1] > 30) { // top
            let shiftX = 0;
            if(successNode.isPassed&&successNode.comment)shiftX+=2;
            successNode.x1 = iconLine.xPointList[0]-10+shiftX;
            successNode.x2 = iconLine.xPointList[0]+10+shiftX;
            successNode.y1 = iconLine.yPointList[0]-20;
            successNode.y2 = iconLine.yPointList[0];
            this.setHoverIconList(iconLine,successNode,IconList);
            if(successNode.isPassed){
                if(successNode.comment){
                    this.dramImg(palette, img_path, successNode.x1+5, successNode.y1);
                }else{
                    this.dramImg(palette, img_path, successNode.x1+3, successNode.y1);
                }
            }else{
                if(successNode.comment){
                    this.dramImg(palette, img_path, successNode.x1+4, successNode.y1);
                }else{
                    this.dramImg(palette, img_path, successNode.x1+2, successNode.y1);
                }
            }
            this.setHoverIconList(iconLine,successNode);
        } else if (iconLine.yPointList[0] - iconLine.yPointList[1] < -30) { // bottom
            let shiftX = 0;
            if(successNode.isPassed&&successNode.comment)shiftX+=2;
            successNode.x1 = iconLine.xPointList[0]-10+shiftX;
            successNode.x2 = iconLine.xPointList[0]+10+shiftX;
            successNode.y1 = iconLine.yPointList[0];
            successNode.y2 = iconLine.yPointList[0]+20;
            this.setHoverIconList(iconLine,successNode,IconList);
            if(successNode.isPassed){
                if(successNode.comment){
                    this.dramImg(palette, img_path, successNode.x1-20, successNode.y1);
                }else{
                    this.dramImg(palette, img_path, successNode.x1-12, successNode.y1);
                }
            }else{
                if(successNode.comment){
                    this.dramImg(palette, img_path, successNode.x1-14, successNode.y1);
                }else{
                    this.dramImg(palette, img_path, successNode.x1-14, successNode.y1);
                }
            }
        }
        
    };
    
    setHoverIconList(iconLine,successNode,IconList){
        if(successNode.comment){
            IconList.push(successNode)
        }
    }

    /**
     * 画圆形
     * @param palette
     * @param circle
     */
    drawCircles(palette, circle){
        let r = circle.height / 2;
        this.canvasPluginsService.drewCircle(palette, circle.x + r, circle.y + r, r, 0, 2 * Math.PI, circle.color).stroke();
        this.canvasPluginsService.drewText(palette, circle.name||'', circle.x + r, circle.y + r, circle.color).stroke();
    }

    /**
     * 画菱形
     * @param palette
     * @param diamond
     */
    drawDiamond(palette, diamond){
        diamond.name = diamond.name||'';
        this.canvasPluginsService.drewLozenge(palette, diamond.x+diamond.width / 2, diamond.y, diamond.width, diamond.height, diamond.color).stroke();
        if (diamond.name.length > 10) {
            let text1 = diamond.name.substring(0, 10);
            this.canvasPluginsService.drewText(palette, text1, diamond.x + diamond.width / 2, diamond.y + diamond.height / 2 - 9, diamond.color).stroke();
            let text2 = diamond.name.substring(10);
            this.canvasPluginsService.drewText(palette, text2, diamond.x + diamond.width / 2, diamond.y + diamond.height / 2 + 9, diamond.color).stroke();
        } else {
            this.canvasPluginsService.drewText(palette, diamond.name||'', diamond.x + diamond.width / 2, diamond.y + diamond.height / 2, diamond.color).stroke();
        }
    }

    /**
     * 画出头像
     * @param palette
     * @param node
     * @param info
     * @param axisLineX
     * @param drawFlowedCountX
     * @param index
     */
    drawAuditor (palette,node,info,axisLineX){
        let img = new Image(),autiorX = node.autiorX;
        img.src = info.accountImg?this.$config.file.SHOWIMG+info.accountImg : ceshi;
        img.onload = () => {
            let width = img.width,
                height = img.height;
            let newHeight = 40 * height / width;
            palette.drawImage(img, axisLineX - 20 + autiorX, node.y + node.height / 2 - 20, 40, newHeight);
            this.drawAuditorShadow(palette, axisLineX+autiorX, node.y,node.height, info);
        };
        let accountLength = (info.accountName).length*18;
        let timeLength = (info.statusDescription&&info.statusDescription.indexOf('延期')>-1?'（'+info.statusDescription+'）':'').length*14;
        node.autiorX += (accountLength+timeLength>90?accountLength+timeLength:90)+60;
    };
    
    /**
     * 画流程审核节点
     * @param palette
     * @param rect
     */
    drawRect(palette, rect){
        this.canvasPluginsService.drewroundRect(palette, rect.x, rect.y, rect.width, rect.height, 3, rect.color).stroke();
        let textLen = rect.name.length;
        if (textLen <= 10) {
            this.canvasPluginsService.drewText(palette, rect.name||'', rect.x + rect.width / 2, rect.y + rect.height / 2, rect.color).stroke();
        } else {
            let text1 = rect.name.substring(0, textLen / 2);
            let text2 = rect.name.substring(textLen / 2);
            this.canvasPluginsService.drewText(palette, text1, rect.x + rect.width / 2, rect.y + rect.height / 2 - 9, rect.color).stroke();
            this.canvasPluginsService.drewText(palette, text2, rect.x + rect.width / 2, rect.y + rect.height / 2 + 9, rect.color).stroke();
        }
    }

    /**
     * 画用户头像所在轴线
     * @param palette
     * @param line
     */
    drawAxisLine(palette,line){
        this.canvasPluginsService.drewLine(palette, line.x1, line.y1, line.x2, line.y2, this.colorPiker.grey).stroke();
    }
    
    /**
     * 画流程线
     * @param palette
     * @param line
     */
    drawLine(palette,line){
        let len = line.xPointList.length;
        line.xPointList.forEach((x, idx) => {
            let y = line.yPointList[idx];
            if (idx < len - 2) {
                this.canvasPluginsService.drewLine(palette, x, y, line.xPointList[idx + 1], line.yPointList[idx + 1], line.color).stroke()
            } else {
                this.canvasPluginsService.drawDirectionLine(palette, x, y, line.xPointList[idx + 1], line.yPointList[idx + 1], line.color).stroke()
            }
        })
    }
    
    /**
     * 画图片
     * @param palette
     * @param url
     * @param x
     * @param y
     * @param newWidth
     */
    dramImg(palette, url, x, y){
        this.canvasPluginsService.drewImages(palette, url, x, y).stroke();
    }
}
audioFlowService.$inject = ['canvasPluginsService','$filter','$config'];
