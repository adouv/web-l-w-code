<template>
  <div class="all-result" @click="cancelStudentTableInfo()">
    <div class="all-result-header">
      <div class="title">
      <a name="top"></a>
        <p
          class="main-title"
        >{{`"${titleData.examName}"&nbsp;${titleData.gradeClassName}`}}练习卷整体结果统览</p>
        <p
          class="sub-title"
        >{{`${titleData.yearMonthDay}&nbsp;${titleData.week}&nbsp;${titleData.startTime}&nbsp;~&nbsp;${titleData.endTime}&nbsp;${titleData.launcher}`}}</p>
      </div>
    </div>
    <div id="content-box" class="content-box">
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
        <div class="chart-right-gap">
          <div class="two-chart">
            <div class="all-result-gauge">
              
              <lw-gauge ref="gauge" :titlePosition="'right'" :radio="radio" :reportType="0"></lw-gauge>
            </div>
            <div class="all-result-funnel">
              <lw-funnel ref="funnel" @funnelRank="recieveFunnel" :status="1" :radio="radio" :reportType="0"></lw-funnel>
            </div>
          </div>
          <div class="all-result-chart">
            <div v-show="!studentsInfo">
              <lw-pop ref="pop" :radio="radio" :reportType="0"></lw-pop>
            </div>
            <div v-show="studentsInfo">
              <lw-studentInfoTable  @cancelStudentInfo="recieveStudentTable" :reportType="0"></lw-studentInfoTable>
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
        </div>
        <div class="back-top-wrap">
          <a class="back-top" href="#top">
            <img src="../../assets/images/back-top.png" alt="回到顶部">
          </a>
        </div>
      </div>
    </div>
    <!-- <div class="foot">
      <div class="bottom-btn">
        <el-button class="btn1" type="text" @click="$router.push({path:'/allReport'})"></el-button>
        <el-button class="btn2" type="text" @click="$router.push({path:'/allResult'})"></el-button>
      </div>
      <div class="close cursor" @click="close()"></div>
    </div>-->
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
          <!-- <el-button @click="explanationDialogVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="explanationDialogVisible = false">知道了</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import instruction from "./model.js";
import lwmain from "../../_services/c.service.js";
export default {
  data() {
    return {
      explanationDialogVisible: false,
      radio: 1,
      studentsInfo: "",
      instruction: {},
       titleData: {
        subjectName: '',
        examName: '',
        gradeClassName: '',
        yearMonthDay: '',
        week: '',
        startTime: '',
        endTime: '',
        launcher: '',
      },
    };
  },
  created() {
    this.instruction = instruction;
  },
   mounted() {
    lwmain.getReportTitle().then(res => {
    let data
      data = res;
    this.titleData.examName = data.paper_name;
    this.titleData.gradeClassName = `${data.grade_name}${data.class_name}`;
    this.titleData.yearMonthDay = data.start_time.split(" ")[0].replace(/-/g,"/");
    this.titleData.week = '周' + data.week_name;
    this.titleData.startTime = data.start_time.split(" ")[1].slice(0,5);
    this.titleData.endTime = data.end_time.split(" ")[1].slice(0,5);
    this.titleData.launcher = data.teacher_name + '老师发起'
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
.all-result {
  width: 100%;
  // height: 100%;
  color: #226cfb;
  background: #001a4c;
 .all-result-header {
    width: 100%;
    height: 105px !important;
    padding: 0 !important;
    color: #226cfb;
    .title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-bottom: 25px;
      height: 75px;
      .main-title {
        margin-top: 40px;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
      }
      .sub-title {
        margin-top: 5px;
        height: 16px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
      }
      p {
        margin: 0;
      }
    }
  }
  .content-box {
    // position: absolute;
    // top: 100px;
    // bottom: 68px;
    // top: 115px;
    // bottom: 85px;
    // left: 0;
    // right: 0;
    // padding-left: 40px;
    // margin-top: 115px;
    background: #001a4c;
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
  // .foot {
  //   width: 100%;
  //   // height: 110px;
  //   height: 68px;
  //   position: absolute;
  //   bottom: 0;
  //   background: #001a4c;
  //   .bottom-btn {
  //     background: url("../../assets/images/menu04.png") no-repeat;
  //     width: 750px;
  //     height: 68px;
  //     margin: 0 auto;
  //     .btn1,
  //     .btn2 {
  //       // width: 401px;
  //       // height: 68px;
  //       position: absolute;
  //       margin: 0;
  //       padding: 0;
  //     }
  //     .btn1::before {
  //       border-color: transparent transparent rgba(225, 225, 225, 0);
  //       border-style: none solid solid;
  //       border-width: 0 70px 70px;
  //       content: "";
  //       display: block;
  //       height: 0;
  //       left: -10px;
  //       width: 287px;
  //       margin-left: -28px;
  //       margin-top: -5px;
  //     }
  //     .btn2 {
  //       margin-left: 401px;
  //       margin-left: 382px;
  //       width: 401px;
  //       height: 68px;
  //       transform: skewX(45deg);
  //     }
  //   }
  //   .close {
  //     background: url("../../assets/images/close.png") no-repeat;
  //     width: 60px;
  //     height: 60px;
  //     position: absolute;
  //     right: 1%;
  //     bottom: 20%;
  //   }
  // }
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
}
</style>
