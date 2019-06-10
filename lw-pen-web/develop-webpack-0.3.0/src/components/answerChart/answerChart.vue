<template>
  <div class="answer-chart-page">
    <div class="left-head" style="border:none">
      <h4>正确答案</h4>
    </div>
    <template v-if="!isAnswerData">
      <div class="question-area auto-scroll" flex="main:center cross:center">
        <div class="noImage">
          <img src="../../assets/images/no-write-answer.png">
          <p>系统未匹配答案，请认真听老师分析哦</p>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="question-area auto-scroll">
        <div class="nodrag-area">
          <div class="question-title">[ 正确答案 ]</div>
          <div class="dynamic-html" v-html="questionInfo.answer"></div>
          <div class="question-title margin-top">[ 答案解析 ]</div>
          <div class="dynamic-html" v-html="questionInfo.analysis"></div>
        </div>
      </div>
    </template>

    <div class="echars-foot mar-top">
      <div class="foot-item">正答率：</div>
      <div class="foot-item">班级难度系数：</div>
      <div class="foot-item">正答平均用时：</div>
      <div class="foot-item">全班平均用时：<template v-if="chartData.classAvgTime">{{chartData.classAvgTime|formatSeconds}}</template></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnswerChartComponent",
  props: ["chartData", "questionInfo"],
  data() {
    return {
      isAnswerData: false
    };
  },
  mounted() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../../assets/scss/index.scss";
.answer-chart-page {
  height: 100%;
  .noImage {
    text-align: center;
    p {
      color: #ff7d55;
      opacity: 0.5;
      font-size: 14px;
    }
  }
}
</style>
