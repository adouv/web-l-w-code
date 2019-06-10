<template src="./noteDraw.html"></template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "NoteDrawComponent",
  props: ["penId", "questionId", "exerciseRecordId", "type"],
  data() {
    return {
      width: 0,
      height: 0,
      lastPointParams: {
        questionId: 0, //题编号
        classId: 0, //班级编号
        className: "", //班级名称
        bagId: 0, //习题包编号
        analysis: "",
        answer: "",
        selectType: 0, //题类型
        exerciseRecordId: 0,
        content: "",
        contentHtml: "",
        type: 0,
        autoGrade: false,
        id: 0,
        batch: "", //批次号
        createTime: "", //创建时间
        tag: 0, //0x55
        len: 0, //长度
        packet_type: 0, //0x01坐标 0x02心跳
        penid: 0, //笔编号
        pressure: 0, //压力值
        x: -1, //x轴
        y: -1, //y轴
        penbox_vol: 0, //笔盒电池电压
        pen_vol: 0, //笔电池电压
        chk: 0 //累加和校验
      },
      canvasParams: {
        canvas: null, //画布
        context: null, //画布对象（提供方法及属性）
        strokeColor: "#333", //笔颜色
        fillColor: "#fff", //画布背景色
        width: 0, //画布宽度
        height: 0, //画布高度
        a4Width: 2480, //A4纸宽度
        a4Height: 3508, //A4纸高度
        left: 0,
        distanceWidth: 30, //笔迹距离
        scale: 1000 / 2479, //缩放1000/画布高度
        radius: 2,
        marginTop: 50, //开始绘制距离画布顶部的起点
        marginLeft: 50, //开始绘制距离画布左侧的起点
        minX: 999999, //记录最小x轴
        minY: 999999, //记录最小y轴
        tkb: 0.0
      },
      isData: false
    };
  },
  mounted() {
    this.init();
    this.getNoteList();
    this.win$.receive("penData", (event, args) => {
      let { data, len, lwUdp } = args;
      if (len < 20 && data.penid === parseInt(this.penId)) {
        if (data.pressure !== 0) {
          if (this.canvasParams.minX > data.x) {
            this.canvasParams.minX = data.x;
          }

          if (this.canvasParams.minY > data.y) {
            this.canvasParams.minY = data.y;
          }

          data.x =
            data.x - this.canvasParams.minX + this.canvasParams.marginLeft;

          data.y =
            data.y - this.canvasParams.minY + this.canvasParams.marginTop;
        } else {
          data.x = -1;
          data.y = -1;
        }

        // console.log("receive-minX:", this.canvasParams.minX);
        // console.log("receive-minY:", this.canvasParams.minY);
        this.noteDraw(data);
      }
    });
  },
  methods: {
    init() {
      //console.log(this.type);
      //console.log("init-lastPointParams:", this.lastPointParams);
      this.height = document.getElementById("list").offsetHeight - 92;
      this.width = document.getElementById(
        `inner-box-b${this.penId}`
      ).offsetWidth;
      console.log(this.height, this.width);
      let autoSize = this.AutoSizeTwo(
        this.canvasParams.a4Width,
        this.canvasParams.a4Height,
        this.width,
        this.height
      );
      this.canvasParams.width = autoSize.width;
      this.canvasParams.height = autoSize.height;
      this.canvasParams.left = (this.width - autoSize.width) / 2;
      this.canvasParams.scale = 1000 / this.canvasParams.a4Height;

      this.canvasParams.canvas = document.getElementById(`canvas${this.penId}`);

      if (this.canvasParams.canvas === null) {
        return;
      }

      this.canvasParams.context = this.canvasParams.canvas.getContext("2d");

      this.canvasParams.context.fillStyle = this.canvasParams.fillColor;

      let cw = this.canvasParams.width;
      let ch = this.canvasParams.height;
      this.canvasParams.context.clearRect(0, 0, cw, ch);

      this.canvasParams.context.fillRect(0, 0, cw, ch);
    },
    /**
     * 放大
     */
    max(val) {
      this.canvasParams.width = cw * 1.05;
      this.canvasParams.height = ch * 1.05;
      this.canvasParams.left = 2;
      //this.canvasParams.scale = 1000 / window.height;
      //console.log(this.canvasParams.scale);
      this.getNoteList();
    },
    /**
     * 缩小
     */
    min(val) {
      this.canvasParams.width = this.canvasParams.width * 0.95;
      this.canvasParams.height = this.canvasParams.height * 0.95;
      this.canvasParams.left = 2;
      //this.canvasParams.scale =
      //1000 / (this.canvasParams.a4Height - this.canvasParams.height);
      //console.log(this.canvasParams.scale);
      this.getNoteList();
    },
    /**
     * 获取笔记数据
     */
    getNoteList() {
      let where = {
        penid: parseInt(this.penId),
        questionId: parseInt(this.questionId),
        exerciseRecordId: parseInt(this.exerciseRecordId),
        packet_type: 1
      };
      this.msql$.select("lw_pen_notes", where).then(response => {
        if (response.Data.length > 0) {
          this.isData = true;
          response.Data.forEach(element => {
            if (element.pressure !== 0) {
              if (this.canvasParams.minX > element.x) {
                this.canvasParams.minX = element.x;
              }

              if (this.canvasParams.minY > element.y) {
                this.canvasParams.minY = element.y;
              }

              element.x =
                element.x -
                this.canvasParams.minX +
                this.canvasParams.marginLeft;

              element.y =
                element.y -
                this.canvasParams.minY +
                this.canvasParams.marginTop;
            } else {
              element.x = -1;
              element.y = -1;
            }

            // console.log("msql-minX:", this.canvasParams.minX);
            // console.log("msql-minY:", this.canvasParams.minY);

            this.noteDraw(element);
          });
        } else {
          this.isData = false;
        }
      });
    },
    /**
     * 绘制笔记
     */
    noteDraw(curPointParams) {
      this.canvasParams.context.beginPath();

      let scale = this.canvasParams.scale;

      let curX = curPointParams.x * scale;
      let curY = curPointParams.y * scale;
      let lastX = this.lastPointParams.x * scale;
      let lastY = this.lastPointParams.y * scale;

      let distance = this.calcDistance(this.lastPointParams, curPointParams);
      let lineWidth = 1;

      if (distance > this.canvasParams.distanceWidth) {
        this.canvasParams.context.moveTo(curX, curY);
        //lineWidth = this.calcPenStroke(curPointParams.pressure);
      } else {
        this.canvasParams.context.moveTo(lastX, lastY);
        this.canvasParams.context.lineTo(curX, curY);
        //lineWidth = this.calcPenStroke(this.lastPointParams.pressure);
      }

      this.canvasParams.context.strokeStyle = this.canvasParams.strokeColor;

      this.canvasParams.context.lineWidth = lineWidth;

      this.canvasParams.context.closePath();
      this.canvasParams.context.stroke();
      //记录上次坐标值
      this.lastPointParams = curPointParams;
      //console.log("init-lastPointParams:", this.lastPointParams);
    },
    /**
     * 计算间距
     * @param {*} loc1
     * @param {*} loc2
     * @returns
     */
    calcDistance(loc1, loc2) {
      return Math.sqrt(
        Math.pow(loc1.x - loc2.x, 2) + Math.pow(loc1.y - loc2.y, 2)
      );
    },
    /**
     * 计算笔锋
     * @param {*} pressure 压力值
     * @returns
     */
    calcPenStroke(pressure) {
      let tkb = pressure;
      let tk = 3;
      if (tkb > 200) {
        tkb = 200;
      }
      tkb = tkb / 200;
      tk = tk * tkb;
      return tk;
    },
    /**
     * 等比缩放
     * @param {*} sourceWidth 源宽度
     * @param {*} sourceHeight 源高度
     * @param {*} maxWidth 最大宽度
     * @param {*} maxHeight 最大高度
     */
    AutoSizeTwo(sourceWidth, sourceHeight, maxWidth, maxHeight) {
      let temp = {
        width: 0,
        height: 0
      };
      if (sourceWidth > 0 && sourceHeight > 0) {
        if (sourceHeight / sourceWidth >= maxHeight / maxWidth) {
          //通过正弦值判断图片缩放后是否偏高
          if (sourceHeight > maxHeight) {
            //如果图片比设定的要高
            temp.height = maxHeight;
            temp.width = (sourceWidth * maxHeight) / sourceHeight;
          } else {
            //假如图片width<70%(设定)&&heitht<70%(设定)
            if (sourceHeight < maxHeight) {
              temp.height = maxHeight;
              temp.width = (sourceWidth * maxHeight) / sourceHeight;
            } else {
              temp.width = sourceWidth;
              temp.height = sourceHeight;
            }
          }
        } else {
          //如果图片比例 小于 设定的比例
          if (sourceWidth > maxWidth) {
            temp.width = maxWidth;
            temp.height = (sourceHeight * maxWidth) / sourceWidth;
          } else {
            //假如图片width<70%(设定)&&heitht<70%(设定)
            if (sourceWidth <= maxWidth) {
              temp.width = maxWidth;
              temp.height = (sourceHeight * maxWidth) / sourceWidth;
            } else {
              temp.width = sourceWidth;
              temp.height = sourceHeight;
            }
          }
        }
      }
      return temp;
    }
  },
  computed: {
    ...mapGetters(["udpList"])
  }
};
</script>
