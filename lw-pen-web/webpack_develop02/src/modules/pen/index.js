/**
 * 电子笔绘制
 */
export default {
  name: "MenusComponent",
  data() {
    return {
      params: {
        penid: ['1234'],
        flag: false,
        interval: null,
        catchList: []
      },
      canvas: {
        penCanvas: null,
        context: null,
        lastLineWidth: -1,
        lastTimestamp: 0,
        strokeColor: '#000000',
        fillColor: '#ffffff',
        canvasWidth: 798,
        canvasHeight: 557,
        distanceWidth: 30,
        scale: 1,
        radius: 2,
        lastLoc: {
          batch: this.udp$.getBatchNumber(), //记录批次
          tag: 0, //0x55 - unsigned char - 1个字节
          len: 0, //长度 - unsigned char - 1个字节
          packet_type: 1, //0x01坐标，0x02心跳 - unsigned char - 1个字节
          penid: 1234, //学号 - unsigned long - 4个字节
          pressure: 1, //压力值 - unsigned short - 2个字节
          x: -1, //x轴 - int - 4个字节
          y: -1, //y轴 - int - 4个字节
          penbox_vol: 1, //笔盒电池电压 - unsigned char - 1个字节
          pen_vol: 1, //笔电池电压 - unsigned char - 1个字节
          chk: 1, //累加和校验 - unsigned char - 1个字节
          status: 0, //
          type: 0 //0为开始答题 1为开始自判 2为抢答
        }
      }
    };
  },
  mounted() {
    let myThis = this;
    //myThis.canvas.scale = myThis.canvas.canvasWidth / myThis.canvas.canvasHeight;
    myThis.canvas.penCanvas = document.getElementById('canvas');
    myThis.canvas.context = myThis.canvas.penCanvas.getContext('2d');

    myThis.canvas.context.fillStyle = myThis.canvas.fillColor;
    myThis.canvas.context.clearRect(0, 0, myThis.canvas.canvasWidth, myThis.canvas.canvasHeight);
    myThis.canvas.context.fillRect(0, 0, myThis.canvas.canvasWidth, myThis.canvas.canvasHeight);

    let marginTop = 10;
    let marginLeft = 50;
    let minX = 999999;
    let minY = 999999;


    // myThis.udp$.udpService(8486, (args) => {

    //   // if (args.packet_type === 1) {
    //   //   if (args.pressure !== 0) {
    //   //     //let box = this.canvas.penCanvas.getBoundingClientRect();
    //   //     //console.log(`x:${args.x};y:${args.y};left:${box.left};top:${box.top};2`);

    //   //     if (minX > args.x) {
    //   //       minX = args.x;
    //   //     }

    //   //     if (minY > args.y) {
    //   //       minY = args.y;
    //   //     }


    //   //     args.x = args.x - minX + marginLeft;
    //   //     args.y = args.y - minY + marginTop;

    //   //     myThis.penStroke(args);
    //   //   } else {
    //   //     args.x = -1;
    //   //     args.y = -1;
    //   //     myThis.penStroke(args);
    //   //   }
    //   // }

    // });
  },
  methods: {
    begin() {
      this.udp$.udpService(8486, args => {
        console.log(args);
      });
    },
    penStroke(curLoc) {
      //let curLoc = this.windowToCanvas(point);
      //let curLoc = point;
      let curTimestamp = new Date().getTime();
      //开始绘制
      this.canvas.context.beginPath();

      let distance = this.calcDistance(this.canvas.lastLoc, curLoc);

      // let x = curLoc.x;
      // let y = curLoc.y;


      if (distance > this.canvas.distanceWidth) {
        this.canvas.context.moveTo(curLoc.x, curLoc.y);
      } else {
        this.canvas.context.moveTo(this.canvas.lastLoc.x, this.canvas.lastLoc.y);
        this.canvas.context.lineTo(curLoc.x, curLoc.y);
      }

      //let scale = this.canvas.scale;

      // curLoc.x = curLoc.x - box.left;
      // curLoc.y = curLoc.y - box.top;





      // let newCanvas = document.createElement('canvas');
      // let newContext = newCanvas.getContext('2d');


      // this.canvas.context.moveTo(this.canvas.lastLoc.x, this.canvas.lastLoc.y);
      // this.canvas.context.lineTo(curLoc.x, curLoc.y);


      //计算速度
      // let s = this.calcDistance(curLoc, this.lastLoc);
      // let t = curTimestamp - this.canvas.lastTimestamp;
      // let lineWidth = this.calcLineWidth(t, s);
      let lineWidth = 1;
      //设置样式
      this.canvas.context.strokeStyle = this.canvas.strokeColor;
      this.canvas.context.lineWidth = lineWidth;
      //设置或返回线条末端线帽的样式
      //this.canvas.context.lineCap = 'round';
      //设置或返回所创建边角的类型，当两条线交汇时
      //this.canvas.context.lineJoin = 'round';
      this.canvas.context.stroke();
      //记录上次值
      this.canvas.lastLoc = curLoc;
      this.canvas.lastTimestamp = curTimestamp;
      this.canvas.lastLineWidth = lineWidth;
      //console.log('end');
    },
    /**
     * 获取矩形对象的left、top
     * @param {*} x
     * @param {*} y
     * @returns
     */
    windowToCanvas(point) {
      let box = this.canvas.penCanvas.getBoundingClientRect();
      point.x = Math.round(point.x - box.left);
      point.y = Math.round(point.y - box.top);
      return point;
    },
    /**
     * 计算笔的宽度
     * @param {*} t
     * @param {*} s
     * @returns
     */
    calcLineWidth(t, s) {
      let v = s / t;
      let resultLineWidth = 0;
      if (v <= 0.1) {
        resultLineWidth = 10;
      } else if (v >= 10) {
        resultLineWidth = 1;
      } else {
        resultLineWidth = 10 - (v - 0.1) / (10 - 0.1) * (10 - 1);
      }
      if (this.canvas.lastLineWidth === -1) {
        return resultLineWidth;
      } else {
        return this.canvas.lastLineWidth * 2 / 3 + resultLineWidth * 1 / 3;
      }
    },
    /**
     * 计算间距
     * @param {*} loc1
     * @param {*} loc2
     * @returns
     */
    calcDistance(loc1, loc2) {
      return Math.sqrt(Math.pow(loc1.x - loc2.x, 2) + Math.pow(loc1.y - loc2.y, 2));
    },
    distance(x, y, x1, y1) {
      return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
    },
    lineDrawRect(ctx, x, y, x1, y1) {
      ctx.beginPath();
      if (this.distance(x, y, x1, y1) > 30) {
        ctx.moveTo(x1, y1);
      } else {
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
      }
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    }
  }
};
