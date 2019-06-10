<template>
  <div class="pie-chart-page">
    <div class="left-head">
      <p>选择最多的选项：{{resultData.record.max_item ? resultData.record.max_item : ''}} 选择该选项的总人数：{{resultData.record.max_item_count ? resultData.record.max_item_count : 0}}人</p>
      <p>已提交答案人数：{{resultData.record.right_count + resultData.record.error_count}}人，未提交人数：{{resultData.record.total_count - (resultData.record.right_count + resultData.record.error_count)}}人</p>
    </div>
    <div class="left-echarts">
      <div class="pie-show">
        <div id="mychars" :style="{width:'600px',height:'450px',margin:'0 auto'}"></div>
      </div>
      <div class="echars-foot" flex="box:mean">
        <div>
          <p>正答率：{{resultData.record.right_proportion|toPrecision}}</p>
          <p>正答平均用时：{{resultData.record.right_avg_time|formatSeconds}}</p>
        </div>
        <div>
          
          <p>班级难度系数：{{resultData.record.degree_of_difficulty ? resultData.record.degree_of_difficulty : ''}} {{resultData.degreeOfDifficulty}}</p>
          <p>全班平均用时：{{resultData.record.avg_time|formatSeconds}}</p>
        </div>
        <div>
          <p>区分度：{{resultData.record.discrimination ? resultData.record.discrimination : ''}} {{resultData.discrimination}}</p>
        </div>
      </div>
      <div class="left-bottom" flex="main:justify">
        <div>
          <span class="right-answer" v-if="isRightAnswer">正确选项：{{resultData.record.right_answer ? resultData.record.right_answer : '未配置'}}</span>
        </div>
        <el-button @click="showAnswer">{{isRightAnswer ? '不显示正确答案' : '显示正确答案'}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "pieChartComponent",
  props: ['resultData'],
  data(){
    return {
      record: [],
      echart: [],
      isRightAnswer: true
    }
  },
  mounted() {
    this.echart = this.resultData.echart;
    this.drawGauge(this.resultData.echart);
  },
  methods: {
    showAnswer(){
      this.isRightAnswer = this.isRightAnswer ? false : true;
    },
    drawGauge(data) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("mychars"));
      let answerStatisArr = [];
      let answerTitle = data;
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
      data.forEach((element, i) => {
        let colorVlue = "";
        if (element.name == this.resultData.record.right_answer) {
          colorVlue = "#80c269";
        } else if (element.name == '未作答') {
          colorVlue = "#97aca3";
        } else {
          colorVlue = color[i];
        }
        // if (!element.answer) {
        //   element.answerText = "未答题";
        // } else {
        //   element.answerText = element.answer;
        // }
        
        answerStatisArr.push({
          name: element.value,
          value: element.value,
          checkedName: element.name,
          avgTime: element.avgTime,
          percent: element.percent,
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
            radius: ["40%", "80%"],
            labelLine: {
              normal: {
                show: false
              }
            },
            label:{
              normal:{
                textStyle:{
                  color: '#ffffff',
                  fontSize: 20
                }
              }
            },
            data: answerTitle
          },
          {
            type: "pie",
            radius: ["40%", "80%"],
            label: {
              normal: {
                position: "inner",
                textStyle:{
                  fontSize: 20
                }
              }
            },
            data: answerStatisArr
          }
        ]
      });
      let myThis = this;
      myChart.on("click", function(params) {
        console.log(params);
        // let item = params.data;
        let clickAnswer = params.data.checkedName;
        // if (clickAnswer == "" || clickAnswer == null) {
        //   clickAnswer = -1;
        // }
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
            .checkedName +
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
<style lang="scss">
@import "../../assets/scss/index.scss";
.pie-chart-page {
  .left-head {
    p{
      line-height: 0;
      padding-bottom: computer(25px);
    }
  }
  .echars-foot {
    padding-left: computer(43px);
    margin-top: computer(50px);
  }
  .pie-show{
    margin-top: computer(50px);
  }
  .left-bottom {
    color: #226cfb;
    position: absolute;
    bottom: computer(17px);
    width: 100%;
    .right-answer{
      //padding-top: computer(18px);
    }
    .el-button {
      border-radius: 6px;
      border: solid 1px #226cfb;
      background: none;
      color: #226cfb;
      height: computer(35px);
      line-height: computer(10px);
    }
  }
}
</style>

