<template>
  <div class="all">
    <el-container>
      <el-main class="auto-scroll">
        <div v-if="noResult">
          <all-report v-if="type === 'allReport'"></all-report>
          <all-result v-if="type === 'allResult'"></all-result>
        </div>
        <div v-if="!noResult" class="all-mask-wrap">
          <div class="all-mask"></div>
          <p>没有生成数据</p>
        </div>
      </el-main>
      <el-footer>
        <div
          class="btn"
          :class="{allReportBg: type=== 'allReport', allResultBg: type === 'allResult'}"
        >
          <span @click="changeChart(1)">答题结果统计</span>
          <span @click="changeChart(2)"></span>
          <em @click="changeChart(2)">认知结果统计</em>
        </div>
        <div class="close cursor" @click="close()"></div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import allReport from "../allReport/index.vue";
import allResult from "../allResult/index.vue";
import lwmain from "../../_services/c.service.js";
export default {
  name: "all",
  data() {
    return {
      titleData: {
        subjectName: "",
        examName: "",
        gradeClassName: "",
        yearMonthDay: "",
        week: "",
        startTime: "",
        endTime: "",
        launcher: ""
      },
      type: "allResult",
      noResult: false,
    };
  },
  mounted() {
    lwmain.getAllDefaultPage().then(res => this.noResult = res)
  },
  methods: {
    changeChart(type) {
      if (type == 1) {
        this.type = "allResult";
      } else {
        this.type = "allReport";
      }
    },
    close() {
      lw.closeWindow();
    }
  },
  components: {
    allReport: allReport,
    allResult: allResult
  }
};
</script>

<style lang="scss" scoped>
.all {
  background: #001a4c;
  height: 100vh;
  .el-main,
  .el-footer {
    box-sizing: border-box;
  }
  .el-footer {
    width: 100%;
    height: 70px !important;
    background: #001a4c;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    z-index: 100;

    .btn {
      width: 745px;
      height: 70px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      position: relative;
      font-family: 'MicrosoftYaHei'!important;
      span:nth-child(1) {
        border-color: transparent transparent rgba(225, 225, 225, 0);
        border-style: none solid solid;
        border-width: 0 70px 70px;
        display: block;
        height: 0;
        left: -10px;
        width: 285px;
        margin-top: -3px;
        font-family: 'MicrosoftYaHei'!important;
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
        font-family: 'MicrosoftYaHei'!important;
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
    height: calc(100vh - 70px);
    padding: 20px 0 0 40px;
  }
  .close {
    background: url("../../assets/images/close.png") no-repeat;
    width: 60px;
    height: 60px;
    position: absolute;
    right: 25px;
    bottom: 25px;
  }
  .all-mask-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .all-mask {
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
