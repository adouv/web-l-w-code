<template>
  <div class="line-chart-page">
    <div class="line-show nodrag-area" id="line-show">
      <div id="mychars" :style="{width:box.width+'px',height:box.height+'px'}"></div>
    </div>
    <div class="echars-foot" flex="box:mean">
      <div>
        <div class="mar-bot-20px">正答率：{{resultData.record.right_proportion|toPrecision}}</div>
        <div>正答平均用时：{{resultData.record.right_avg_time|formatSeconds}}</div>
      </div>
      <div>
        <div class="mar-bot-20px" >班级难度系数：{{resultData.record.degree_of_difficulty ? resultData.record.degree_of_difficulty : ''}} {{resultData.degreeOfDifficulty}}</div>
        <div>全班平均用时：{{resultData.record.avg_time|formatSeconds}}</div>
      </div>
      <div>
        <div>区分度：{{resultData.record.discrimination ? resultData.record.discrimination : ''}} {{resultData.discrimination}}</div>
      </div>
    </div>
    <div class="left-bottom" flex="main:justify" v-if="resultData.record.pattern===0">
      <span>满分：{{resultData.record.score}}分，得分人数最多的分值：{{resultData.record.max_item}}分，人数{{resultData.record.max_item_count}}人。</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "lineChartComponent",
  props: ["box", "resultData"],
  data() {
    return {};
  },
  mounted() {
    this.drawGauge(this.resultData.echart);
    // this.$nextTick(()=>{
    //   let innerBox = document.getElementById("mychars");
    //   this.box.width = innerBox.offsetWidth - 100;
    //   this.box.height = window.innerHeight - 450;
    //   innerBox.style.width = innerBox.offsetWidth - 100 + 'px';
    //   innerBox.style.height = window.innerHeight - 450 + 'px';

    //   this.$echarts.init(innerBox);
    // })

    // window.addEventListener("resize",function(){
    //   this.$echarts.init(document.getElementById("mychars")).resize();
    //   let lineChart = document.getElementById("line-show");
    //   lineChart.style.width = window.innerWidth / 2 - 20 + 'px';
    //   lineChart.style.height = window.innerHeight + 'px';
    //   this.$echarts.init(lineChart).resize();
    // });
  },
  methods: {
    drawGauge(data) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("mychars"));

      let legendArr = ["得分学生人数", "得分组平均答题用时"];
      let xScoreArr = data.scoreList;
      let yStudentNumArr = data.countList;
      let yAverTimeArr = data.avgTimeList;
      let xRightArr = [];
      xScoreArr.forEach(element => {
        xRightArr.push(element + "分");
      });
      if (this.resultData.record.pattern == 1) {
        xRightArr = [];
        xScoreArr.forEach(element => {
          let item = element == true ? "对" : "错";
          xRightArr.push(item);
        });
      }
      xScoreArr = xRightArr;

      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter:"{a0}: {c0}<br/>{a1}: {c1}″",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#226cfb"
            }
          }
        },
        legend: {
          data: legendArr,
          textStyle: {
            color: "#ffffff",
            fontSize: 19
          }
        },
        grid: {
          top: "20%", //距上边距
          left: "5%", //距离左边距
          right: "5%", //距离右边距
          bottom: "6%" //距离下边距
        },
        xAxis: [
          //x样式
          {
            type: "category",
            data: xScoreArr,
            axisLine: {
              // 线条样式
              lineStyle: {
                color: "#226cfb",
                width: 1,
                fontSize: 13
              }
            },
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "学生人数",
            axisTick: { show: false },
            // splitLine:{show:false},
            axisLabel: {
              //坐标轴上的文字
              formatter: "{value}"
            },
            nameTextStyle: {
              fontSize: 19,
              color: "#ffffff"
            },
            axisLine: {
              lineStyle: {
                color: "#226cfb",
                width: 1
              }
            },
            splitLine: {
              lineStyle: {
                color: "#226cfb",
                opacity: "0.3"
              }
            }
          },
          {
            type: "value",
            name: "平均用时",
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
              //坐标轴上的文字
              formatter: "{value} ″"
            },
            nameTextStyle: {
              fontSize: 19,
              color: "#ffffff"
            },
            axisLine: {
              lineStyle: {
                color: "#226cfb",
                width: 1
              }
            }
          }
        ],
        series: [
          {
            name: "得分学生人数",
            type: "bar",
            lineStyle: {
              color: "#ff7d55"
            },
            itemStyle: {
              color: "#ff7d55"
            },
            data: yStudentNumArr,
            barWidth: 25,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#febb5c" },
                  { offset: 1, color: "#ff7e55" }
                ])
              }
            }
          },
          {
            name: "得分组平均答题用时",
            type: "line",
            yAxisIndex: 1,
            data: yAverTimeArr,
            lineStyle: {
              color: "#226cfb"
            },
            itemStyle: {
              color: "#226cfb"
            }
          }
        ]
      });
      let myThis = this;
      myChart.on("click", function(params) {
        console.log(params);
        let clickAnswer = params.name;
        let score = params.name.substring(0, params.name.length - 1);
        myThis.$emit("changeData", {
          clickAnswer: clickAnswer,
          score: score,
          isRight: params.name
        });
        //myThis.getListTable(score);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/scss/index.scss";
.line-chart-page {
  width: 100%;
  .left-head {
    h4 {
      font-size: computer(20px);
    }
  }
  .mar-bot-20px {
    margin-bottom: 20px;
  }
  .echars-foot {
    padding-left: computer(43px);
  }
  .line-show {
    width: 100%;
    height: calc(100% - 30px);
    #mychars {
      height: 100%;
    }
  }
  .left-bottom {
    color: #ffffff;
    position: absolute;
    bottom: computer(22px);
    font-size: computer(24px);
    width: 100%;
    .el-button {
      border-radius: 6px;
      border: solid 1px #226cfb;
      background: none;
      color: #226cfb;
    }
  }
}
</style>

