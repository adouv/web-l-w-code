<template>
  <div class="all">
    <el-container>
      <el-header></el-header>
      <el-main>
        <div v-if="noResult">
          <report v-if="type === 'report'"></report>
          <results-overview v-if="type === 'resultsOverview'"></results-overview>
        </div>
        <div v-if="!noResult" class="single-mask-wrap">
          <div class="single-mask"></div>
          <p>没有生成数据</p>
        </div>
      </el-main>
      <el-footer>
        <div
          class="btn"
          :class="{allReportBg: type=== 'report', allResultBg: type === 'resultsOverview'}"
        >
          <span @click="changeChart(1)">该题答题结果统计</span>
          <span @click="changeChart(2)"></span>
          <em @click="changeChart(2)">该题认知结果统计</em>
        </div>
        <div class="close cursor" @click="close()"></div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import report from "../report/report.vue";
import resultsOverview from "../resultsOverview/index.vue";
import lwmain from "../../_services/c.service.js";
export default {
  name: "all",
  data() {
    return {
      type: "resultsOverview",
      noResult: true
    };
  },
  mounted() {
    // lwmain.getSingleDefaultPage().then(res => {
    //   this.noResult = res;
    // });
  },
  methods: {
    changeChart(type) {
      if (type == 1) {
        this.type = "resultsOverview";
      } else {
        this.type = "report";
      }
    },
    close() {
      lw.closeWindow();
    }
  },
  components: {
    report: report,
    resultsOverview: resultsOverview
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/index.scss";
.all {
  height: 100%;
  background: #001a4c;
  .el-header,
  .el-main,
  .el-footer {
    box-sizing: border-box;
  }
  .el-header {
    width: 100%;
    height: 30px !important;
    padding: 0 !important;
    color: #226cfb;
  }
  .el-footer {
    width: 100%;
    height: 70px !important;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    z-index: 100;
    background: #001a4c;
    .btn {
      width: 745px;
      height: 70px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      position: relative;
      span:nth-child(1) {
        border-color: transparent transparent rgba(225, 225, 225, 0);
        border-style: none solid solid;
        border-width: 0 70px 70px;
        display: block;
        height: 0;
        left: -10px;
        width: 285px;
        margin-top: -3px;
        font-family: MicrosoftYaHei;
        font-size: 20px;
        line-height: 70px;
        text-align: center;
        letter-spacing: 0px;
        color: #226cfb;
        font-style: normal;
        cursor: pointer;
      }
      span:nth-child(2) {
        width: 401px;
        height: 68px;
        transform: skewX(45deg);
        font-family: MicrosoftYaHei;
        cursor: pointer;
      }
      em {
        width: 342px;
        height: 68px;
        position: absolute;
        font-style: normal;
        left: 51%;
        font-size: 20px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        line-height: 70px;
        cursor: pointer;
        text-align: center;
        color: #226cfb;
      }
    }
    .allResultBg {
      background: url("../../assets/images/left-selected.png") no-repeat center
        center;
      span:nth-child(1) {
        color: #ffffff;
      }
    }
    .allReportBg {
      background: url("../../assets/images/right-selected.png") no-repeat center
        center;
      em {
        color: #ffffff;
      }
    }
  }
  .el-main {
    width: 100%;
    height: calc(100vh - 100px);
    padding: 0px 20px !important;
  }
  .close {
    background: url("../../assets/images/close.png") no-repeat;
    width: 60px;
    height: 60px;
    position: absolute;
    right: 25px;
    bottom: 25px;
  }
  .single-loading {
    margin: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow-y: hidden;
    background: url("../../assets/images/loading.jpg") no-repeat center center;
  }
  .single-mask-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .single-mask {
      width: 300px;
      height: 238px;
      background: url("../../assets/images/no-result.png") center center
        no-repeat;
    }
    p {
      color: #226cfb;
      font-size: 28px;
      margin: 10px;
    }
  }
}
</style>
