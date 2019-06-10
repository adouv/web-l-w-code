export default class canvasPluginsService {
    constructor() {
    }
    /**
     * 绘制矩形
     * @param x,y 起点坐标
     * @param w,h 宽高
     * @param r 圆角半径
     * @param color 描边的颜色
     */
    drewroundRect(_this, x, y, w, h, r, color, bgcolor) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        _this.beginPath();
        _this.strokeStyle = color;
        _this.fillStyle = bgcolor;
        _this.moveTo(x + r, y);
        _this.arcTo(x + w, y, x + w, y + h, r);
        _this.arcTo(x + w, y + h, x, y + h, r);
        _this.arcTo(x, y + h, x, y, r);
        _this.arcTo(x, y, x + w, y, r);
        _this.closePath();
        return _this;
    }
    /**
     * 绘制圆角折线
     * @param coor 折线坐标数组对象{x:[x1,x2,x3...],y:[y1,y2,y3...]}
     * @param r 圆角半径
     * @param color 描边的颜色
     */
    drewPolyLineRect(_this, coor, r, color) {
        _this.beginPath();
        _this.strokeStyle = color;
        let [coordinates = {
            x: [],
            y: []
        }] = [coor]
        _this.moveTo(coordinates.x[0], coordinates.y[0])
        for (let i = 0, len = coordinates.x.length; i < len; i++) {
            let [x, y] = [coordinates.x[i], coordinates.y[i]];
            if (i < len - 2) {
                let [SX, SY, EX, EY] = [0, 0, 0, 0];
                //下一个点
                let [x1, y1] = [coordinates.x[i + 1], coordinates.y[i + 1]];
                let [x2, y2] = [coordinates.x[i + 2], coordinates.y[i + 2]];
                if (x1 === x2) {
                    x !== x1 ? x < x1 ? SX = x1 - r : SX = x1 + r : SX = x1;
                    y1 !== y2 ? y1 > y2 ? EY = y1 - r : EY = y1 + r : EY = y2;
                    _this.lineTo(SX, y1);
                    _this.arcTo(x1, y1, x1, EY, r);
                }
                if (y1 === y2) {
                    y !== y1 ? y < y1 ? SY = y1 - r : SY = y1 + r : SY = y1;
                    x1 !== x2 ? x1 > x2 ? EX = x1 - r : EX = x1 + r : EX = x2;
                    _this.lineTo(x1, SY);
                    _this.arcTo(x1, y1, EX, y1, r);
                }
            } else if (i === len - 2) {
                _this.stroke()
                let [x1, y1] = [coordinates.x[i + 1], coordinates.y[i + 1]];
                x !== x1 ? x < x1 ? x += r : x -= r : x = x;
                y !== y1 ? y < y1 ? y += r : y -= r : y = y;
                this.drawDirectionLine(_this, x, y, x1, y1, color).stroke()
                break;
            }
        }
    }

    /**
     * 绘制圆形
     * @param x,y 圆心坐标
     * @param r 圆半径
     * @param startAngle 开始弧度
     * @param endAngle 结束弧度
     * @param color 描边的颜色
     */
    drewCircle(_this, x, y, r, startAngle, endAngle, color) {
        _this.beginPath();
        _this.strokeStyle = color;
        _this.arc(x, y, r, startAngle, endAngle, false);
        return _this;
    }

    /**
     * 绘制圆角矩形
     * @param x,y 圆心坐标
     * @param r 圆半径
     * @param startAngle 开始弧度
     * @param endAngle 结束弧度
     * @param color 描边的颜色
     */
    drawRoundRect(_this, x, y, r, color) {
        x += r/2;
        _this.beginPath();
        _this.strokeStyle = color;
        _this.arc(x, y+r, r, .5 * Math.PI, -.5 * Math.PI, false);
        _this.arcTo(x, y, x+r , y,r);
        _this.arc(x+r, y+r, r, -.5 * Math.PI, .5 * Math.PI, false);
        _this.arcTo(x, y + 2*r, x, y + 2*r,r);
        _this.closePath();
        return _this;
    }
    
    /**
     * 橡皮擦功能
     * 这里第一个参数传入画板，而不是画笔
     * 参数在使用时要注意的是，如果参数只有画笔，会直接清空画布，传入坐标没有宽高也会清空，只有传入的参数不少的时候才会擦除指定区域
     * @param x,y 橡皮擦起始坐标
     * @param w,h 橡皮擦宽度高度
     */
    eraser(_this, x, y, w, h) {
        _this.clearRect(x ? w ? x : 0 : 0, y ? h ? y : 0 : 0, w || _this.canvas.width, h || _this.canvas.height);
    }

    /**
     * 绘制菱形
     * @param x,y 起点坐标（菱形上面那个角）
     * @param w,h 宽高
     * @param color 描边的颜色
     */
    drewLozenge(_this, x, y, w, h, color, bgcolor) {
        _this.beginPath();
        _this.lineWidth = 2;
        _this.strokeStyle = color;
        _this.fillStyle = bgcolor;
        _this.moveTo(x, y);
        _this.lineTo(x + w / 2, y + h / 2);
        _this.lineTo(x, y + h);
        _this.lineTo(x - w / 2, y + h / 2);
        _this.closePath();
        return _this;
    }

    /**
     * 绘制文本
     * @param text 输入的文本
     * @param x,y 坐标
     * @param color 描边的颜色
     * @param Baseline 基线位置 （可不填）默认居中
     * @param textAlign 水平对齐方式 （可不填） 默认居中
     */
    drewText(_this, text, x, y, color, Baseline, textAlign,size) {
        _this.font = (size||14)+"px PingFangSC-Light,'helvetica neue','hiragino sans gb',arial,'microsoft yahei ui','microsoft yahei',simsun,sans-serif";
        _this.fillStyle = color;
        _this.textBaseline = Baseline || 'middle';
        _this.textAlign = textAlign || 'center';
        _this.fillText(text, x, y);
        return _this;
    }

    /**
     * 绘制图片
     * @param url 图片地址
     * @param x,y 坐标
     * @param newWidth 要描绘的新图片的大小
     */
    drewImages(_this, url, x, y, newWidth, baseurl) {
        var img = new Image();
        img.src = url || baseurl;
        img.onload = () => {
            if(newWidth){
                _this.drawImage(img, x, y, newWidth, img.height);
            }else{
                _this.drawImage(img, x, y);
            }
        }
         return _this;
    }

    /**
     * 绘制直线
     * @param x,y 坐标
     * @param endX,endY 坐标
     * @param color 描边的颜色
     */
    drewLine(_this, x, y, endX, endY, color) {
        _this.beginPath();
        _this.strokeStyle = color;
        _this.moveTo(x, y);
        _this.lineTo(endX, endY);
        _this.closePath();
        return _this;
    }
    /**
     * 绘制虚线
     * @param x,y 开始坐标
     * @param endX,endY 坐标
     * @param color 描边的颜色
     */
    drawDashLine(ctx, x1, y1, x2, y2, color){
        ctx.beginPath();
        var dashLen =  10,
            xpos = x2 - x1,
            ypos = y2 - y1,
            numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLen);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for(var i=0; i<numDashes; i++){
            if(i % 2 === 0){
                ctx.moveTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
            }else{
                ctx.lineTo(x1 + (xpos/numDashes) * i, y1 + (ypos/numDashes) * i);
            }
        }
        ctx.closePath();
        return ctx;
    }


    /**
     * 绘制带箭头虚线
     * @param x,y 开始坐标
     * @param endX,endY 坐标
     * @param color 描边的颜色
     * @param paramArr 传入数组
     */
    drewDirectionDashLine(_this, x1, y1, x2, y2, color, paramArr) {
        var angle = Math.abs(Math.atan((x2 - x1) / (y2 - y1))); //倾斜角余角
        var length = 10; //箭头斜线长度
        var degree = Math.PI / 6; //箭头倾斜角
        var theta = 0;
        var altha = 0;
        var a1 = 0;
        var b1 = 0;
        var a2 = 0;
        var b2 = 0;
        if (angle >= degree && angle <= Math.PI / 2 - degree) {
            theta = angle - degree;
            altha = Math.PI / 2 - 2 * degree - theta;
            if (x2 >= x1) {
                a1 = x2 - length * Math.sin(theta);
                a2 = x2 - length * Math.cos(altha);
            } else {
                a1 = x2 + length * Math.sin(theta);
                a2 = x2 + length * Math.cos(altha);
            }
            if (y2 >= y1) {
                b1 = y2 - length * Math.cos(theta);
                b2 = y2 - length * Math.sin(altha);
            } else {
                b1 = y2 + length * Math.cos(theta);
                b2 = y2 + length * Math.sin(altha);
            }
        } else {
            theta = angle - degree;
            altha = theta + 2 * degree - Math.PI / 2;
            if (x2 >= x1 && y2 >= y1) {
                a1 = x2 - length * Math.sin(theta);
                b1 = y2 - length * Math.cos(theta);
                a2 = x2 - length * Math.cos(altha);
                b2 = y2 + length * Math.sin(altha);
            } else if (x2 >= x1 && y2 < y1) {
                a1 = x2 - length * Math.sin(theta);
                b1 = y2 + length * Math.cos(theta);
                a2 = x2 - length * Math.cos(altha);
                b2 = y2 - length * Math.sin(altha);
            } else if (x2 < x1 && y2 < y1) {
                a1 = x2 + length * Math.sin(theta);
                b1 = y2 + length * Math.cos(theta);
                a2 = x2 + length * Math.cos(altha);
                b2 = y2 - length * Math.sin(altha);
            } else {
                a1 = x2 + length * Math.sin(theta);
                b1 = y2 - length * Math.cos(theta);
                a2 = x2 + length * Math.cos(altha);
                b2 = y2 + length * Math.sin(altha);
            }
        }

        if (!Array.isArray(paramArr)) paramArr = [];
        _this.beginPath();
        _this.strokeStyle = color;
        _this.setLineDash([]);
        _this.moveTo(a1, b1);
        _this.lineTo(x2, y2);
        _this.lineTo(a2, b2);
        _this.stroke();
        this.drawDashLine(_this, x1, y1, x2, y2, color);
        return _this;
    };


    
    
    /**
     * 绘制圆虚线
     * @param x,y 开始坐标
     * @param endX,endY 坐标
     * @param color 描边的颜色
     */
    drewDottLine(_this, x, y, endX, endY, interval,color) {
        _this.beginPath();
        if (!interval) {
            interval = 5
        }
        _this.strokeStyle = color;
        let isHoriZontal = true;
        if (x == endX) {
            isHoriZontal = false;
        }
        let len = isHoriZontal ? endX - x : endY - y;
        _this.moveTo(x, y);
        let progress = 0;
        while (len > progress) {
            progress += interval;
            if (progress > len) {
                progress = len
            }
            if (isHoriZontal) {
                _this.moveTo(x + progress, y);
                _this.arc(x + progress, y, 0.5, 0, Math.PI * 2, true);
                _this.fill();
            } else {
                _this.moveTo(x, y + progress);
                _this.arc(x, y + progress, 0.5, 0, Math.PI * 2, true);
                _this.fill();
            }
        }
         _this.closePath();
        return _this;
    }


    /**
     * 绘制箭头
     * @param x1,y1 坐标
     * @param x2,y2 坐标
     * @param color 描边的颜色
     */
    drawDirectionLine(_this, x1, y1, x2, y2, color) {
        var angle = Math.abs(Math.atan((x2 - x1) / (y2 - y1)))||0; //倾斜角余角
        var length = 10; //箭头斜线长度
        var degree = Math.PI / 6; //箭头倾斜角
        var theta = 0;
        var altha = 0;
        var a1 = 0;
        var b1 = 0;
        var a2 = 0;
        var b2 = 0;
        if (angle >= degree && angle <= Math.PI / 2 - degree) {
            theta = angle - degree;
            altha = Math.PI / 2 - 2 * degree - theta;
            if (x2 >= x1) {
                a1 = x2 - length * Math.sin(theta);
                a2 = x2 - length * Math.cos(altha);
            } else {
                a1 = x2 + length * Math.sin(theta);
                a2 = x2 + length * Math.cos(altha);
            }
            if (y2 >= y1) {
                y2 = y2-2;
                b1 = y2 - length * Math.cos(theta);
                b2 = y2 - length * Math.sin(altha);
            } else {
                y2 = y2+2;
                b1 = y2 + length * Math.cos(theta);
                b2 = y2 + length * Math.sin(altha);
            }
        } else {
            theta = angle - degree;
            altha = theta + 2 * degree - Math.PI / 2;
            if (x2 >= x1 && y2 >= y1) {
                y2 = y2-2;
                if(y2-y1<2)x2 = x2-2;
                a1 = x2 - length * Math.sin(theta);
                b1 = y2 - length * Math.cos(theta);
                a2 = x2 - length * Math.cos(altha);
                b2 = y2 + length * Math.sin(altha);
            } else if (x2 >= x1 && y2 < y1) {
                y2 = y2+2;
                if(y1-y2<2)x2 = x2-2;
                a1 = x2 - length * Math.sin(theta);
                b1 = y2 + length * Math.cos(theta);
                a2 = x2 - length * Math.cos(altha);
                b2 = y2 - length * Math.sin(altha);
            } else if (x2 < x1 && y2 < y1) {
                y2 = y2+2;
                if(y1-y2<2)x2 = x2+2;
                a1 = x2 + length * Math.sin(theta);
                b1 = y2 + length * Math.cos(theta);
                a2 = x2 + length * Math.cos(altha);
                b2 = y2 - length * Math.sin(altha);
            } else {
                y2 = y2-2;
                if(y2-y1<2)x2 = x2+2;
                a1 = x2 + length * Math.sin(theta);
                b1 = y2 - length * Math.cos(theta);
                a2 = x2 + length * Math.cos(altha);
                b2 = y2 + length * Math.sin(altha);
            }
        }
        if(y1==y2)x2 = x2-2;
        _this.beginPath();
        _this.strokeStyle = color;
        _this.moveTo(x1, y1);
        _this.lineTo(x2, y2);
        _this.stroke();
        _this.lineTo(a1, b1);
        _this.moveTo(x2, y2);
        _this.lineTo(a2, b2);
        _this.closePath();

        return _this;
    }

   /* /!**
     * 绘制箭头
     * @param x1,y1 坐标
     * @param x2,y2 坐标
     * @param color 描边的颜色
     *!/
    drawDirectionLine(_this, x1, y1, x2, y2, color) {
        var angle = Math.abs(Math.atan((x2 - x1) / (y2 - y1))); //倾斜角余角
        var length = 10; //箭头斜线长度
        var degree = Math.PI / 6; //箭头倾斜角
        var theta = 0;
        var altha = 0;
        var a1 = 0;
        var b1 = 0;
        var a2 = 0;
        var b2 = 0;
        let rx = 2 * Math.cos(angle);
        if (angle >= degree && angle <= Math.PI / 2 - degree) {
            theta = angle - degree;
            altha = Math.PI / 2 - 2 * degree - theta;
            if (x2 >= x1) {
                a1 = x2 - length * Math.sin(theta);
                a2 = x2 - length * Math.cos(altha);
            } else {
                a1 = x2 + length * Math.sin(theta);
                a2 = x2 + length * Math.cos(altha);
            }
            if (y2 >= y1) {
                b1 = y2 - length * Math.cos(theta);
                b2 = y2 - length * Math.sin(altha);
            } else {
                b1 = y2 + length * Math.cos(theta);
                b2 = y2 + length * Math.sin(altha);
            }
        } else {
            theta = angle - degree;
            altha = theta + 2 * degree - Math.PI / 2;
            if (x2 >= x1 && y2 >= y1) {
                a1 = x2 - length * Math.sin(theta);
                b1 = y2 - length * Math.cos(theta);
                a2 = x2 - length * Math.cos(altha);
                b2 = y2 + length * Math.sin(altha);
            } else if (x2 >= x1 && y2 < y1) {
                a1 = x2 - length * Math.sin(theta);
                b1 = y2 + length * Math.cos(theta);
                a2 = x2 - length * Math.cos(altha);
                b2 = y2 - length * Math.sin(altha);
            } else if (x2 < x1 && y2 < y1) {
                a1 = x2 + length * Math.sin(theta);
                b1 = y2 + length * Math.cos(theta);
                a2 = x2 + length * Math.cos(altha);
                b2 = y2 - length * Math.sin(altha);
            } else {
                a1 = x2 + length * Math.sin(theta);
                b1 = y2 - length * Math.cos(theta);
                a2 = x2 + length * Math.cos(altha);
                b2 = y2 + length * Math.sin(altha);
            }
        }

        _this.beginPath();
        _this.strokeStyle = color;
        _this.moveTo(x1, y1);
        _this.lineTo(x2, y2);
        _this.lineTo(a1, b1);
        _this.stroke();
        _this.moveTo(x2, y2);
        _this.lineTo(a2, b2);
        _this.closePath();

        return _this;
    }*/
}
