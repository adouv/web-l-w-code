<template>
  <div class="pie-chart-page">
    <div class="left-head">
      <h4>正确选项：{{chartData.answer}}</h4>
    </div>
    <div class="left-echarts">
      <h4 class="echart-title">
        <span>选择人数最多的选项：{{chartData.maxItem}}</span>
        <span class="margin-left">人数：{{chartData.maxItemTotal}}人</span>
      </h4>
      <div class="pie-show nodrag-area">
        <div id="mychars" :style="{width:'500px',height:'300px'}"></div>
        <!-- <div echarts [options]="option" (chartInit)="test($event);" class="demo-sheet"></div> -->
      </div>
      <div class="echars-foot">
        <div class="foot-item">正答率：{{chartData.rightPercent|toPrecision}}</div>
        <div
          class="foot-item"
        >班级难度系数：{{chartData.degreeOfDifficulty?changeData.degreeOfDifficulty:''}}</div>
        <div class="foot-item">正答平均用时：{{chartData.rightAvgTime|formatSeconds}}</div>
        <div class="foot-item">全班平均用时：{{chartData.classAvgTime|formatSeconds}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PieChartComponent",
  props: ["chartData"],
  data() {
    return {};
  },
  mounted() {
    if (this.chartData.chartResultDtoList) {
      this.getPieChart(this.chartData.chartResultDtoList);
    }
  },
  methods: {
    getPieChart(dataList) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("mychars"));
      let answerStatisArr = [];
      let answerTitle = [];
      let color = [
        "#37a2da",
        "#32c5e9",
        "#67e0e3",
        "#9fe6b8",
        "#ffdb5c",
        "#ff9f7f",
        "#e062ae",
        "#e690d1",
        "#e7bcf3",
        "#9d96f5",
        "#8378ea",
        "#96bfff"
      ];
      dataList.forEach((element, i) => {
        let colorVlue = "";
        if (element.answer == this.chartData.answer) {
          colorVlue = "#00c670";
        } else if (!element.answer) {
          colorVlue = "#97aca3";
        } else {
          colorVlue = color[i];
        }
        if (!element.answer) {
          element.answerText = "未答题";
        } else {
          element.answerText = element.answer;
        }
        answerStatisArr.push({
          name: element.count,
          value: element.count,
          checkedName: element.answer,
          avgTime: element.avgTime,
          answerText: element.answerText,
          itemStyle: {
            color: colorVlue
          }
        });
        answerTitle.push({
          name: element.answerText,
          value: element.count,
          itemStyle: {
            color: colorVlue
          }
        });
      });
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: params => {
            return formatter(params);
          }
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "80%"],
            labelLine: {
              normal: {
                show: false
              }
            },
            data: answerTitle
          },
          {
            type: "pie",
            radius: ["50%", "80%"],
            label: {
              normal: {
                position: "inner"
              }
            },
            data: answerStatisArr
          }
        ]
      });
      let myThis = this;
      myChart.on("click", function(params) {
        let item = params.data;
        let clickAnswer = item.checkedName;
        if (clickAnswer == "" || clickAnswer == null) {
          clickAnswer = -1;
        }
        myThis.$emit("changeData", {
          clickAnswer: clickAnswer,
          score: "",
          isRight: ""
        });
      });
      function formatter(params) {
        let html = "";

        html =
          answerStatisArr.find(i => i.checkedName === params.data.checkedName)
            .answerText +
          "<br/>" +
          params.percent +
          "%<br/>" +
          "选择人数：" +
          answerStatisArr.find(i => i.name === params.name).value +
          "<br/>平均耗时：" +
          myThis.utils$.fromatDate(
            answerStatisArr.find(i => i.checkedName === params.data.checkedName)
              .avgTime
          );
        return html;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../assets/scss/index.scss";
.pie-chart-page {
  .left-head {
    h4 {
      color: #00c670;
      font-size: computer(20px);
    }
  }
}
</style>
