<template>
  <div class="line-chart-page">
    <div class="left-head" flex="main:justify">
      <template v-if="selfJudgmentModel == 0">
        <h4>满分:{{chartData.maxScore?chartData.maxScore:0}}分,得分人数最多的分值:{{chartData.maxItem}}分,人数:{{chartData.maxItemTotal}}人</h4>
      </template>
      <template v-else>
        <h4>答对人数{{chartData.rightCount}}人,答错人数:{{chartData.totalCount-chartData.rightCount}}人</h4>
      </template>
    </div>
    <div class="left-echarts">
      <div class="pie-show nodrag-area" id="pie-show">
        <div id="mychars" :style="{width:box.width+'px',height:box.height+'px'}"></div>
        <!-- <div echarts [options]="option" (chartInit)="test($event);" class="demo-sheet"></div> -->
      </div>
      <div class="echars-foot">
        <div class="foot-item">正答率：<template v-if="chartData.rightPercent  != ''">{{chartData.rightPercent|toPrecision}}</template></div>
        <div class="foot-item">班级难度系数：{{chartData.degreeOfDifficulty?changeData.degreeOfDifficulty:''}}</div>
        <div class="foot-item">正答平均用时：<template v-if="chartData.rightAvgTime">{{chartData.rightAvgTime|formatSeconds}}</template></div>
        <div class="foot-item">全班平均用时：
          <template v-if="chartData.classAvgTime">{{chartData.classAvgTime|formatSeconds}}</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LineChartComponent",
  props: ["chartData", "selfJudgmentModel"],
  data() {
    return {
      chartResultDtoList: [],
      box: {
        width: 0,
        height: 0
      }
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.chartResultDtoList = this.chartData.chartResultDtoList;
      if (this.chartResultDtoList) {
        this.getLineChart(this.chartResultDtoList);
      }
    });
    let innerBox = document.getElementById("pie-show");
    this.box.width = innerBox.offsetWidth;
    this.box.height = window.innerHeight - 290;
  },
  methods: {
    rightAnswer() {
      this.$emit("right", true);
    },
    /**
     * 柱状图
     * @param {*} dataList
     */
    getLineChart(dataList) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("mychars"));
      let legendArr = ["得分学生人数", "得分组平均答题用时"];
      let xScoreArr = [];
      let yStudentNumArr = [];
      let yAverTimeArr = [];
      dataList.forEach(item => {
        let _data = "";
        if (this.selfJudgmentModel == 1) {
          _data = item.isRight ? "对" : "错";
        } else {
          _data = item.score + "分";
        }
        xScoreArr.push(_data);
        yAverTimeArr.push(item.avgTime);
        yStudentNumArr.push(item.count);
      });
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },
        legend: {
          data: legendArr,
          textStyle: {
            color: "#9FA0A0",
            fontSize: 13
          }
        },
        xAxis: [
          //x样式
          {
            type: "category",
            data: xScoreArr,
            axisLine: {
              // 线条样式
              lineStyle: {
                color: "#888",
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
              fontSize: 15
            },
            axisLine: {
              lineStyle: {
                color: "#9FA0A0",
                width: 1
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
              fontSize: 15
            },
            axisLine: {
              lineStyle: {
                color: "#9FA0A0",
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
            yAxisIndex: 1,
            lineStyle: {
              color: "#1caaec"
            },
            itemStyle: {
              color: "#1caaec"
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
          clickAnswer: params.name,
          score: score,
          isRight: params.name
        });
        //myThis.getListTable(score);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../assets/scss/index.scss";
.line-chart-page {
  .left-head{
    h4 {
      font-size: computer(20px);
    }
  }
}
</style>
