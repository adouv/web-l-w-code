<template>
  <div class="small-all-result" @click="cancelStudentTableInfo()">
    <div class="close cursor" @click="close()"></div>
    <div class="write"></div>
    <div class="small-all-result-header">
      <div class="small-all-result-title">
        <a name="top"></a>
        <p class="small-all-result-main-title">{{`"${titleData.examName}"`}}</p>
        <p class="small-all-result-sub-title">
            <span>{{titleData.yearMonthDay}}</span>
            <span style="margin-left: 5px; margin-right: 5px">{{titleData.week}}</span>
            <span style="margin-right: 10px">{{titleData.period}}</span>
            <span style="margin-right: 15px">{{`${titleData.startTime}&nbsp;~&nbsp;${titleData.endTime}`}}</span>
            <span>{{titleData.launcher}}</span>
        </p>
      </div>
    </div>
    <div id="content-box" class="small-all-report-content-box">
      <div class="chart">
        <div style="margin-bottom: 30px">
          <span style="position: relative">
            学生对整套题的认知掌握程度阶段的认定标准设定：
            <em
              class="iconfont icon-pc-prompt"
              @click="explanationDialogVisible = true"
            ></em>
          </span>
          <el-radio-group v-model="radio">
            <el-radio :label="1">取平均分原则</el-radio>
            <el-radio :label="0">就低原则</el-radio>
          </el-radio-group>
        </div>
        <!-- <div class="chart-right-gap">
          <div class="two-chart">
            <div class="all-result-gauge">
              
              <lw-gauge ref="gauge" :titlePosition="'right'" :radio="radio" :reportType="0"></lw-gauge>
            </div>
            <div class="all-result-funnel">
              <lw-funnel ref="funnel" @funnelRank="recieveFunnel" :radio="radio" :reportType="0"></lw-funnel>
            </div>
          </div>
          <div class="all-result-chart">
            <div v-show="!studentsInfo">
              <lw-pop ref="pop" :radio="radio" :reportType="0"></lw-pop>
            </div>
            <div v-show="studentsInfo">
              <lw-studentInfoTable></lw-studentInfoTable>
            </div>
          </div>
          <div class="all-result-chart">
            <lw-bar ref="bar" :radio="radio"></lw-bar>
          </div>
          <div class="all-result-chart">
            <lw-multidimensional ref="multidimensional" :radio="radio"></lw-multidimensional>
          </div>
          <div class="all-result-chart">
            <lw-line ref="line"></lw-line>
          </div>
          <div class="all-result-chart">
            <lw-powerScatter ref="powerScatter"></lw-powerScatter>
          </div>
          <div class="all-result-chart">
            <lw-radar ref="radar"></lw-radar>
          </div>
          <div class="all-result-chart">
            <lw-PNBar ref="PNBar"></lw-PNBar>
          </div>
        </div>-->
        <!-- <div class="back-top-wrap">
          <a class="back-top" href="#top">
            <img src="../../assets/images/back-top.png" alt="回到顶部">
          </a>
        </div>-->
      </div>
    </div>
    <div class="explanationDialogVisible">
      <el-dialog title="学生对某套题的认知掌握程度取值标准设置说明" :visible.sync="explanationDialogVisible" center>
        <div class="diolog-box dialog-scroll">
          <div>
            <p
              class="instruction-title"
            >{{instruction.propNounObj ? instruction.propNounObj.title : ''}}</p>
            <div
              style="margin-top: 20px; padding-right: 20px"
              v-for="(item,index) in instruction.propNounObj.propNounList"
              :key="index"
            >
              <span class="instruction-subtitle">{{index + 1 + '、'}}</span>
              <span class="instruction-subtitle">{{item.name}}</span>
              <span>{{item.explanation}}</span>
            </div>
            <p
              style="margin-top: 40px; margin-bottom: 20px"
            >{{instruction.judgmentPrincipleObj ? instruction.judgmentPrincipleObj.title : ''}}</p>
            <div>
              <div
                style="margin-bottom: 20px;margin-right: 20px"
                class="instruction-flex"
                v-for="(item,index) in instruction.judgmentPrincipleObj.judgmentPrincipleList"
                :key="index"
              >
                <span class="instruction-title instruction-fiex-item">{{item.name}}</span>
                <span>{{item.explanation}}</span>
              </div>
            </div>

            <div
              class="instruction-subtitle"
              style="margin-top: 20px;padding-right: 20px"
            >{{instruction.systemExplanation}}</div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="explanationDialogVisible = false">知道了</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import instruction from "../allReport/model.js";
import lwmain from "../../_services/c.service.js";
export default {
  data() {
    return {
      explanationDialogVisible: false,
      radio: 1,
      studentsInfo: "",
      instruction: {},
      titleData: {
        subjectName: "",
        examName: "",
        gradeClassName: "",
        yearMonthDay: "",
        week: "",
        period: "",
        startTime: "",
        endTime: "",
        launcher: ""
      }
    };
  },
  created() {
    this.instruction = instruction;
  },
  mounted() {
    lwmain.getReportTitle().then(res => {
      let data;
      data = res;
    //   document.getElementsByClassName("write")[0].innerHTML = JSON.stringify(
    //     res
    //   );
      this.titleData.examName = data.paper_name;
      this.titleData.gradeClassName = `${data.grade_name}${data.class_name}`;
      this.titleData.yearMonthDay = data.start_time
        .split(" ")[0]
        .replace(/-/g, "/");
      this.titleData.week = "周" + data.week_name;
      this.titleData.period = "第" + data.period + "节";
      this.titleData.startTime = data.start_time.split(" ")[1].slice(0, 5);
      this.titleData.endTime = data.end_time.split(" ")[1].slice(0, 5);
      this.titleData.launcher = data.teacher_name + "老师发起";
    });
  },
  methods: {
    cancelStudentTableInfo() {
      this.studentsInfo = "";
    },
    recieveFunnel(msg) {
      this.studentsInfo = msg;
    },
    recieveStudentTable(msg) {
      if (msg) {
        this.studentsInfo = "";
      }
    },
    close() {
      lw.closeWindow();
    }
  }
};
</script>

<style lang="scss" scoped>
.small-all-result {
  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;
  color: #226cfb;
  background: #fff;
  border: 1px solid red;
  .small-all-result-header {
    width: 100%;
    padding: 0 !important;
    margin-top: 30px;
    .small-all-result-title {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      color: #333333;
      .small-all-result-main-title {
        font-family: "PingFangSC-Regular";
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
      }
      .small-all-result-sub-title {
        margin-left: 15px;
        height: 16px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
      }
      p {
        margin: 0;
      }
    }
  }
  .small-all-report-content-box {
    background: #fff;
    .iconfont {
      cursor: pointer;
      font-size: 20px;
      position: absolute;
    }
    .el-radio-group {
      margin-left: 65px;
      .el-radio {
        margin-right: 15px;
      }
    }
    .chart {
      margin-top: 10px;
      // height: calc(100% - 30px);
      // overflow-y: auto;
      .chart-right-gap {
        margin-right: 40px;
        .two-chart {
          display: flex;
          flex-direction: row;
          width: 100%;
          .all-result-gauge {
            width: 810px;
            margin-right: 15px;
            background: rgba(0, 36, 106, 0.3);
            box-shadow: #226cfb 0px 0px 20px inset;
          }
          .all-result-funnel {
            width: 1000px;
            margin-left: 15px;
            background: rgba(0, 36, 106, 0.3);
            box-shadow: #226cfb 0px 0px 20px inset;
          }
        }
        .all-result-chart {
          width: 100%;
          min-width: 1220px;
          margin-top: 30px;
          box-shadow: #226cfb 0px 0px 20px inset;
        }
      }
      .back-top-wrap {
        position: relative;
        .back-top {
          position: absolute;
          top: -90px;
          right: 12px;
        }
      }
    }
  }
  .diolog-box {
    height: 100%;
    overflow-y: auto;
    .el-dialog {
      width: 800px;
      height: 600px;
    }
  }
  .instruction-title {
    color: #333333;
    font-size: 14px;
    font-weight: 600;
  }
  .instruction-subtitle {
    color: #226cfb;
    font-size: 14px;
  }
  .instruction-flex {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    .instruction-fiex-item {
      flex: none;
      margin-right: 15px;
    }
  }
  .close {
    background: url("../../assets/images/close.png") no-repeat;
    width: 60px;
    height: 60px;
    position: absolute;
    right: 1%;
    bottom: 20%;
  }
}
</style>
