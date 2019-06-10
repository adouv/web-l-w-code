<template src="./noteDraw.html"></template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "NoteDrawComponent",
  props: ["penId", "questionId", "exerciseRecordId"],
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
  },
  methods: {
    init() {
      this.height = document.getElementById("list").offsetHeight - 92;
      console.log(this.height);
      this.width = document.getElementById(
        `inner-box-b${this.penId}`
      ).offsetWidth;

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

      this.canvasParams.context.clearRect(
        0,
        0,
        this.canvasParams.width,
        this.canvasParams.height
      );

      this.canvasParams.context.fillRect(
        0,
        0,
        this.canvasParams.width,
        this.canvasParams.height
      );
    },
    max(val) {
      this.canvasParams.width = this.canvasParams.width * 1.05;
      this.canvasParams.height = this.canvasParams.height * 1.05;
      this.canvasParams.left = 2;
      //this.canvasParams.scale = 1000 / window.height;
      //console.log(this.canvasParams.scale);
      this.getNoteList();
    },
    min(val) {
      this.canvasParams.width = this.canvasParams.width * 0.95;
      this.canvasParams.height = this.canvasParams.height * 0.95;
      this.canvasParams.left = 2;
      //this.canvasParams.scale =
      //1000 / (this.canvasParams.a4Height - this.canvasParams.height);
      //console.log(this.canvasParams.scale);
      this.getNoteList();
    },
    getNoteList() {
      let where = `
        penid=${parseInt(this.penId)}
        and questionId=${parseInt(this.questionId)}
        and exerciseRecordId=${parseInt(this.exerciseRecordId)}
        and packet_type=1
       `;
      this.sql$.select("lw_pen_notes", where).then(response => {
        if (response.Data.length > 0) {
          this.isData = true;
          //笔记显示逻辑
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
            this.noteDraw(element);
          });
        } else {
          this.isData = false;
        }
      });
    },
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
     */
    AutoSize(sourceWidth, sourceHeight, maxWidth, maxHeight) {
      let temp = {
        width: 0,
        height: 0
      };
      if (sourceWidth < maxWidth && sourceHeight < maxHeight) {
        temp.width = sourceWidth;
        temp.height = sourceHeight;
      } else {
        if (maxWidth / maxHeight <= sourceWidth / sourceHeight) {
          temp.width = maxWidth;
          temp.height = maxWidth * (sourceHeight / sourceWidth);
        } else {
          temp.width = maxHeight * (sourceWidth / sourceHeight);
          temp.height = maxHeight;
        }
      }
      return temp;
    },
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
