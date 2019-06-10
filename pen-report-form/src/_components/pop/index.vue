<template>
  <div style="width: 100%; height: 100%; position: relative">
    <div class="photoImg">
      <el-checkbox v-model="photoImg" @change="showPhoto">显示头像</el-checkbox>
      <el-checkbox v-model="nameShow" @change="showName">显示姓名</el-checkbox>
    </div>
    <div
      id="popChart"
      :style="{width: '100%', height: '480px',minHeight: '380px', minWidth: '1220px'}"
    ></div>
    <p class="commondRange" style="top: 20%; color: #13b5b1">精通掌握</p>
    <p class="commondRange" style="top: 33%; color: #80c269">熟练掌握</p>
    <p class="commondRange" style="top: 44%; color: #f6eb53">基本理解</p>
    <p class="commondRange" style="top: 58%; color: #f8b551">一知半解</p>
    <p class="commondRange" style="top: 76%; color: #eb6877">完全不会</p>
    <p class="pop-bottom-title">
      <span v-if="!radio && radio != 0">这道题全班的认知程度掌握详情呈现和分布规律</span>
      <span v-if="radio == 0 || radio == 1">这套题全班的总认知掌握度和总做答耗时详情呈现和分布规律</span>
    </p>
    <em class="upper upper-left"></em>
    <em class="upper upper-right"></em>
    <em class="upper bottom-left"></em>
    <em class="upper bottom-right"></em>
  </div>
</template>
<script>
import lw from "../../_services/c.service.js";
import imgUrlConfig from "../../../static/url.js"
import popModel from "./model.js";
export default {
  name: "popComponent",
  props: ["bubbleDiagram", "radio", "reportType"],
  data() {
    return {
      data: "",
      pChart: "",
      photoImg: false,
      nameShow: false
    };
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.pChart = this.$echarts.init(document.getElementById("popChart"));
    // this.data = [
    //   // {
    //   //   useTime: 110,
    //   //   masteryLevel: 0.6,
    //   //   studentName: "程哲",
    //   //   score: 0.01,
    //   //   masteryLevelName: "perfect",
    //   //   // imgUrl:
    //   //   //   "file/goods/dbp/signature/2019/03/31/20190331184414430345675611009573.jpg"
    //   // },
    //   // {
    //   //   useTime: 80,
    //   //   masteryLevel: 0,
    //   //   studentName: "李四",
    //   //   score: 0.2,
    //   //   masteryLevelName: "bad"
    //   //   // imgUrl:
    //   //   //   "image://http://src.onlinedown.net/Public/images/bigsoftimg/androidimg/simg/540000/537366.png"
    //   // },
    //   // {
    //   //   useTime: 100,
    //   //   masteryLevel: 0.6,
    //   //   studentName: "王五",
    //   //   score: 0.48,
    //   //   masteryLevelName: "good"
    //   //   // imgUrl:
    //   //   //   "image://http://src.onlinedown.net/Public/images/bigsoftimg/androidimg/simg/540000/537366.png"
    //   // },
    //   // {
    //   //   useTime: 100,
    //   //   masteryLevel: 1,
    //   //   studentName: "赵柳",
    //   //   score: 0.9,
    //   //   masteryLevelName: "perfect"
    //   //   // imgUrl:
    //   //   //   "image://http://src.onlinedown.net/Public/images/bigsoftimg/androidimg/simg/540000/537366.png"
    //   // },
    //   {
    //     useTime: 0,
    //     masteryLevel: 0.5,
    //     studentName: "周飒",
    //     score: 0,
    //     masteryLevelName: "great"
    //     // imgUrl:
    //     //   "image://http://src.onlinedown.net/Public/images/bigsoftimg/androidimg/simg/540000/537366.png"
    //   },
    //   // {
    //   //   useTime: 0.2,
    //   //   masteryLevel: 1,
    //   //   studentName: "喊吧",
    //   //   score: 90,
    //   //   masteryLevelName: "great"
    //   //   // imgUrl:
    //   //   //   "image://http://src.onlinedown.net/Public/images/bigsoftimg/androidimg/simg/540000/537366.png"
    //   // }
    // ];
    // this.drawPop(this.data);
    lw.getPopOrigins(this.reportType, this.radio).then(res => {
      this.data = res;
      this.drawPop(this.data);
    });
  },
  watch: {
    radio(newName, oldName) {
      this.pChart.clear();
      lw.getPopOrigins(this.reportType, this.radio).then(res => {
        this.data = res;
        this.drawPop(this.data);
      });
    }
  },
  methods: {
    drawPop(data) {
      let series = this.arrangeSeries(data);
      var xName = "";
      var yName = "";
      if (this.radio == 0 || this.radio == 1) {
        xName = "总做答耗时";
        yName = "总认知掌握程度";
      } else {
        xName = "做答耗时";
        yName = "认知掌握程度";
      }
      // 配置图表配参数
      let option = {
        title: {
          top: 20,
          left: 20,
          text: "认知气泡",
          textStyle: {
            color: "#226cfb",
            fontWeight: "normal",
            fontSize: 20
          }
        },
        color: popModel.popChartLegendColor,
        legend: {
          top: "35",
          icon: "roundRect",
          itemWidth: 23,
          itemHeight: 23,
          itemGap: 30,
          data: popModel.popChartLegendZhNames,
          textStyle: {
            color: "#ffffff",
            fontSize: 16
          }
        },
        grid: {
          x: 128,
          y: 73,
          x2: 130,
          y2: 73
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return (
              params.seriesName +
              "<br>学生：" +
              params.value[2] +
              // "<br>分数：" +
              // params.data[3] +
              "<br>学生掌握程度:" +
              params.value[3]
            );
          }
          // triggerOn: "click"
        },
        dataRange: {
          left: "40",
          min: 0,
          max: 1,
          splitNumber: 3,
          y: "center",
          text: ["很会", "不会"], // 文本，默认为数值文本
          color: popModel.popChartLegendColor,
          calculable: true,
          textStyle: {
            color: "#ffffff",
            fontSize: 18
          }
        },
        xAxis: [
          {
            type: "value",
            scale: true,
            inverse: true,
            name: xName,
            nameTextStyle: {
              color: "#ffffff",
              fontSize: 18
            },
            axisLine: {
              lineStyle: {
                color: "#226cfb",
                fontSize: 16
              }
            },
            splitLine: {
              lineStyle: {
                color: "#226cfb",
                opacity: "0.3"
              }
            },
            axisLabel: {
              formatter: function(value, index) {
                let secondTime = parseInt(value); // 秒
                let minuteTime = 0; // 分
                let hourTime = 0; // 小时
                if (secondTime > 60) {
                  //如果秒数大于60，将秒数转换成整数
                  //获取分钟，除以60取整数，得到整数分钟
                  minuteTime = parseInt(secondTime / 60);
                  //获取秒数，秒数取佘，得到整数秒数
                  secondTime = parseInt(secondTime % 60);
                  //如果分钟大于60，将分钟转换成小时
                  if (minuteTime > 60) {
                    //获取小时，获取分钟除以60，得到整数小时
                    hourTime = parseInt(minuteTime / 60);
                    //获取小时后取佘的分，获取分钟除以60取佘的分
                    minuteTime = parseInt(minuteTime % 60);
                  }
                }
                let result = "" + parseInt(secondTime) + "″";

                if (minuteTime > 0) {
                  result = "" + parseInt(minuteTime) + "′" + result;
                }
                if (hourTime > 0) {
                  result = "" + parseInt(hourTime) + ":" + result;
                }
                return result;
              },
              textStyle: {
                color: "#226cfb",
                fontSize: 16
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            position: "right",
            scale: true,
            max: 1,
            min: 0,
            splitNumber: 10,
            // boundaryGap: [0.1,0.1],
            name: yName,
            nameTextStyle: {
              color: "#ffffff",
              fontSize: 18
            },
            axisLine: {
              lineStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#13b5b1" // 0% 处的颜色
                    },
                    {
                      offset: 0.3,
                      color: "#80c269" // 0% 处的颜色
                    },
                    {
                      offset: 0.5,
                      color: "#f6eb53" // 0% 处的颜色
                    },
                    {
                      offset: 0.7,
                      color: "#f8b551"
                    },
                    {
                      offset: 1,
                      color: "#eb6877" // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false,
                },
                width: 9
              }
            },

            splitLine: {
              lineStyle: {
                color: "#226cfb",
                opacity: "0.3"
              }
            },
            axisLabel: {
              formatter: function(value, index) {
                if (value == 0) {
                  return value;
                } else if (value == 0.2) {
                  return value;
                } else if (value == 0.5) {
                  return value;
                } else if (value == 0.6) {
                  return value;
                } else if (value == 0.8) {
                  return value;
                } else if (value == 1) {
                  return value;
                }
                return "";
              },
              textStyle: {
                color: "#226cfb",
                fontSize: 16
              }
            },
            axisTick: {
              show: false
            }
          }
        ],

        animation: false,
        series: series
      };

      // 绘制图表
      this.pChart.setOption(option);
    },

    arrangeSeries(series) {
      let newSers = [];
      var useTime = [];
      series.forEach(ele => useTime.push(ele.useTime));
      useTime.sort(function(a, b) {
        return a - b;
      });
      // alert(useTime)
      const _self = this;
      newSers = popModel.popChartLegendZhNames.map((ele, index) => {

        return {
          name: ele,
          type: "scatter",
          symbolSize: 68,
          splitLine: { show: false },
          data: (function() {
            var d = [];
            var temp = [];
            var value;
            temp = series.filter(
              ele2 =>
                ele2.masteryLevelName === popModel.popChartLegendEnNames[index]
            );
            temp.forEach(ele3 => {
              var obj, offset;
              obj = {
                name: ele3.studentName,
                value: [
                  ele3.useTime,
                  ele3.masteryLevel,
                  ele3.studentName,
                  ele3.masteryLevel
                ],
                symbol: _self.photoImg
                  ? ele3.imgUrl
                    ? imgUrlConfig.imgUrlPrefix + ele3.imgUrl
                    : "circle"
                  : "circle",
                symbolOffset: (function(ele3) {
                  console.log(ele3)
                  if (
                    ele3.useTime > useTime[useTime.length - 1] - 0.5 &&
                    ele3.useTime <= useTime[useTime.length - 1] &&
                    ele3.masteryLevel > 0.9 && ele3.masteryLevel <= 1
                  ) {
                    // 左上
                    return ["60%", "60%"];
                  } else if (
                    ele3.useTime > useTime[useTime.length - 1] - 0.5 &&
                    ele3.useTime <= useTime[useTime.length - 1] && ele3.masteryLevel <= 0.1
                  ) {
                    // 左下
                    return ["60%", "-80%"];
                  } else if (
                    ele3.useTime >= useTime[0]  &&
                    ele3.useTime < useTime[0] + 0.5&&
                    ele3.masteryLevel > 0.9 && ele3.masteryLevel <= 1
                  ) {
                    // 右上
                    return ["-60%", "60%"];
                  } else if (
                    ele3.useTime >= useTime[0] &&
                    ele3.useTime < useTime[0] + 0.5 && ele3.masteryLevel <= 0.1
                  ) {
                    // 右下
                    return ["-60%", "-80%"];
                  } else if (
                    ele3.masteryLevel > 0.9 &&
                    ele3.masteryLevel <= 1
                  ) {
                    // 上
                    return [0, "60%"];
                  } else if (ele3.masteryLevel <= 0.1) {
                    // 下
                    return [0, "-80%"];
                  } else if (
                    ele3.useTime > useTime[0] - 0.5 &&
                    ele3.useTime <= useTime[0]
                  ) {
                  // 右
                    return ["-60%", 0];
                  }else if (
                    ele3.useTime > useTime[useTime.length - 1] - 0.5 &&
                    ele3.useTime <= useTime[useTime.length - 1]
                  ) {
                    // 左
                    return ["60%", 0];
                  } 
                  return [0, 0];
                })(ele3),
                itemStyle: {
                  itemWidth: 68,
                  itemHeight: 68,
                  borderRadius: "50%"
                }
              };
              d.push(obj);
            });
            return d;
          })(),
          label: {
            show: _self.nameShow,
            color: "#fff",
            position: "bottom",
            fontSize: 14,
            formatter: function(params) {
              return params.name;
            }
          }
        };
      });
      return newSers;
    },
    showPhoto() {
      this.pChart.clear();
      this.drawPop(this.data);
    },
    showName() {
      this.pChart.clear();
      this.drawPop(this.data);
    }
  }
};
</script>

<style scope>
.photoImg {
  position: absolute;
  right: 254px;
  top: 35px;
}
.pop-bottom-title {
  position: absolute;
  bottom: 20px;
  width: 100%;
  font-family: MicrosoftYaHei;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0;
}
.commondRange {
  position: absolute;
  margin: 0;
  right: 35px;
}
</style>