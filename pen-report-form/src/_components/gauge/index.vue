<template>
  <div class="gauage-chart" style="width: 100%; height: 100%; position: relative" ref="chartWrap">
    <div
      class="top-title"
      :class="{'left19' : titlePosition === 'left' , 'right19': titlePosition === 'right'}"
    >
      <p class="top-title2">
        <span v-if="titlePosition === 'left'">班级难度系数</span>
        <span v-if="titlePosition === 'right'">整套题难度系数</span>
        &nbsp;:&nbsp;{{degreeOfDifficulty}}&nbsp;&nbsp;{{degreeOfDifficultyName}}
      </p>
      <p class="top-title3">
        <span v-if="titlePosition === 'left'">区分度</span>
        <span v-if="titlePosition === 'right'">整套题区分度</span>
        &nbsp;:&nbsp;{{discrimination}}&nbsp;&nbsp;{{discriminationName}}
      </p>
    </div>
    <!-- <p ref="know" style="position: absolute; zIndex: 10; color: #fff">全会</p>
    <p ref="dontKnow" style="position: absolute; zIndex: 10; color: #fff">不全会</p> -->
    <div id="gaugeChart"></div>
    <div class="pan-area">
      <div class="pan">
        <em
          style=" margin-top:22px"
          ref="numberGrow"
          :data-time="time"
          class="number-grow"
          :data-value="value"
        >0.00%</em>
      </div>
    </div>
    <p class="bottom-title" v-if="titlePosition === 'left'">这道题全班有多少人会与不会</p>
    <p class="bottom-title" v-if="titlePosition === 'right'">这套题全班有多少人全会与不全会</p>
    <em class="upper upper-left"></em>
    <em class="upper upper-right"></em>
    <em class="upper bottom-left"></em>
    <em class="upper bottom-right"></em>
  </div>
</template>

<script>
import lw from "../../_services/c.service.js";
export default {
  name: "gaugaChart",
  props: ["titlePosition", "radio", "reportType"],
  data() {
    return {
      data: "",
      gChart: "",
      degreeOfDifficulty: "",
      degreeOfDifficultyName: "",
      discrimination: "",
      discriminationName: "",
      masteryProportion: "",
      masteryProportionLabel: "",
      unableMasteryProportion: "",
      unableMasteryProportionLabel: "",
      label: [],
      timer: null,
      time: {
        type: Number,
        default: 1
      },
      value: {
        type: Number,
        default: 0
      }
    };
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.gChart = this.$echarts.init(document.getElementById("gaugeChart"));
    if (this.titlePosition === "left") {
      this.label = ["会", "不会"];
    } else {
      this.label = ["全会", "不全会"];
    }

    // this.data = {
    //   degreeOfDifficulty: 0.8,
    //   degreeOfDifficultyName: "简单",
    //   discrimination: "0.46",
    //   discriminationName: "很好",
    //   masteryProportion: 0.03,
    //   masteryProportionLabel: "50",
    //   unableMasteryProportion: 0.97,
    //   unableMasteryProportionLabel: "100"
    // };
    // this.drawGauge(this.data);
    // this.value.default =
    //   this.data.masteryProportion * 100 ? this.data.masteryProportion * 100 : 0;
    // this.numberGrow(this.$refs.numberGrow);
    this.gChart.clear();
    this.init();
  },
  watch: {
    radio(newName, oldName) {
      this.$refs.numberGrow.innerHTML = "0.00%";
      this.gChart.clear();
      this.init();
    }
  },
  methods: {
    init() {
      lw.getGaugeOrigins(this.reportType, this.radio).then(res => {
        this.data = res;
        this.drawGauge(this.data);
        this.value.default =
          this.data.masteryProportion * 100
            ? this.data.masteryProportion * 100
            : 0;
        this.numberGrow(this.$refs.numberGrow);
      });
      //    this.data = {
      //   degreeOfDifficulty: 0.8,
      //   degreeOfDifficultyName: "简单",
      //   discrimination: "0.46",
      //   discriminationName: "很好",
      //   masteryProportion: 0.5,
      //   masteryProportionLabel: "30",
      //   unableMasteryProportion: 0.5,
      //   unableMasteryProportionLabel: "70"
      // };
    },
    drawGauge(data) {
      let self = this;
      this.degreeOfDifficulty = data.degreeOfDifficulty;
      this.degreeOfDifficultyName = data.degreeOfDifficultyName;
      this.discrimination = data.discrimination;
      this.discriminationName = data.discriminationName;
      this.masteryProportion = data.masteryProportion;
      // this.calculatePosition(data.masteryProportion, 285, this.$refs.know);
      // this.calculatePosition(
      //   data.unableMasteryProportion,
      //   285,
      //   this.$refs.dontKnow
      // );
      this.gChart.clear();
      // 配置图表配参数;
      let option = {
        title: {
          top: 20,
          left: 20,
          text: '"会" 指针',
          textStyle: {
            color: "#226cfb",
            fontSize: 20,
            fontWeight: "normal"
          }
        },
        tooltip: {
          formatter: "{a}:{c}%"
        },
        series: [
          {
            name: "业务指标",
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            center: ["50%", "83%"], // 默认全局居中
            radius: "285",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 160,
                color: [[data.masteryProportion, "#80c269"], [1, "#eb6877"]]
              }
            },
            axisTick: {
              // 坐标轴小标记
              splitNumber: 10, // 每份split细分多少段
              length: 0
            },
            splitLine: {
              show: false // 隐藏刻度线
            },
            axisLabel: {
              // 坐标轴文本标签，详见axis.axisLabel
              formatter: function(v) {
                var v = v + "";
                if (v == data.masteryProportionLabel) {
                  if (
                    data.masteryProportionLabel == 0 ||
                    data.masteryProportionLabel == 10
                  ) {
                    return "";
                  }
                  return self.label[0];
                } else if (v == data.unableMasteryProportionLabel) {
                  if (data.unableMasteryProportionLabel == 90 || data.unableMasteryProportionLabel == 100) {
                    return "";
                  }
                  return self.label[1];
                }
                return "";
              },
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: "#fff",
                fontSize: 25,
                fontWeight: "bolder"
              }
            },
            pointer: {
              // 控制指正形状
              width: 33,
              length: "95%",
              offsetCenter: [0, 100]
            },
            itemStyle: {
              normal: {
                // 控制指针颜色
                color: "rgba(255, 255, 255, 0.5)",
                offsetCenter: [0, -20]
              }
            },
            title: {
              show: true,
              offsetCenter: [0, "-60%"], // x, y，单位px
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: "#fff",
                fontSize: 30
              }
            },
            detail: {
              show: false,
              color: "#80c269",
              backgroundColor: "rgba(255, 255, 255, 0)",
              borderWidth: 0,
              borderColor: "white",
              width: 100,
              height: 50,
              offsetCenter: [0, -40], // x, y，单位px
              formatter: "{value}%",
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize: 50
              }
            },
            data: [{ value: data.masteryProportion * 100, name: "" }]
          }
        ],
        animationEasing: "linear"
      };
      // 绘制图表
      this.gChart.setOption(option);
      // 出现0到中间线的效果
      this.timer = setTimeout(_ => {
        option.series[0].data[0].value = data.masteryProportion * 100 + 0.0;
        // option.series[0].axisLine.lineStyle.color.unshift([data.masteryProportion, "#80c269"])
        this.gChart.setOption(option, true);
      }, 1000);
    },
    numberGrow(ele) {
      var _this = this;
      var step = _this.time.default;
      var current = 0;
      var start = 0;
      let t = setInterval(function() {
        start += step;
        if (start > _this.value.default) {
          clearInterval(t);
          start = _this.value.default;
          t = null;
        }
        if (current == start) {
          return;
        }
        current = start;
        ele.innerHTML = current.toFixed(2) + "%";
      }, 19);
    },
    // 计算会与不会的位置
    // calculatePosition(ang, r, ref) {
    //   const x = 115;
    //   const y = 350;
    //   var w1 = parseInt(Math.cos(ang * 180 * (Math.PI / 180)) * r)
    //   var h1 = parseInt(Math.sin(ang * 180 * (Math.PI / 180)) * r)
    //   console.log(w1,h1)
    //   ref.style.left = 115 + r - w1 + 20 + "px";
    //   ref.style.top = 330 - h1 + "px";
    // }
  }
};
</script>

<style lang="scss" scope>
@import "../../assets/scss/index.scss";
// @import '../../assets/scss/chartUpper.scss';
.gauage-chart {
  .top-title {
    position: absolute !important;
    top: 51px;
    height: 53px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    z-index: 100;
    .top-title2,
    .top-title3 {
      // width: 210px;
      font-family: MicrosoftYaHei;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      color: #ffffff;
      margin: 0;
    }
  }
  .left19 {
    left: 19px;
    top: 75px;
  }
  .right19 {
    right: 19px;
  }
  #gaugeChart {
    width: 100%;
    height: 422px;
    min-height: 345px;
  }
  .pan-area {
    width: 100%;
    position: absolute;
    bottom: 17%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .pan {
      width: 260px;
      height: 130px;
      font-weight: 500;
      background: white;
      border-radius: 130px 130px 0 0;
      // position: absolute;
      // bottom: 17%;
      // left: 275px;
      text-align: center;
      line-height: 130px;
      font-size: 40px;
      color: #80c269 !important;
      font-family: MicrosoftYaHei;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      em {
        font-style: normal;
        color: #80c269;
      }
    }
  }

  .bottom-title {
    width: calc(100% - 40px);
    margin: 0 20px;
    // height: 65px;
    height: 72px;
    // line-height: 108px;
    line-height: 80px;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
    position: absolute;
    bottom: 0px;
    background: url("../../assets/images/bg-title.jpg") no-repeat center center;
  }
}
</style>