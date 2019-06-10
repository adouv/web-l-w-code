<template>
  <div>
    <div class="report" @click="cancelStudentTableInfo()">
      <div class="report-wrap auto-scroll">
        <div class="report-header">
          <div class="report-gauage">
            <lw-gauge ref="gauge" :titlePosition="'left'" :reportType="1"></lw-gauge>
          </div>
          <div class="report-funnel">
            <lw-funnel @funnelRank="recieveFunnel" :reportType="1" :status="0"></lw-funnel>
          </div>
        </div>
        <div class="report-pop" :class="{'opacityBg': !studentsInfo , 'staticBg': studentsInfo}">
          <p v-show="!studentsInfo">
            <lw-pop ref="pop" :reportType="1"></lw-pop>
          </p>
          <p v-show="studentsInfo">
            <lw-studentInfoTable @cancelStudentInfo="recieveStudentTable" :reportType="1"></lw-studentInfoTable>
          </p>
        </div>
      </div>
      <!-- <el-footer>
        <div class="bottom-btn" flex>
          <el-button type="text" @click="$router.push({path:'/report'})"></el-button>
          <el-button type="text" @click="$router.push({path:'/resultsOverview'})"></el-button>
        </div>
        <div class="close cursor" @click="close()"></div>
      </el-footer> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "report",
  data() {
    return {
      studentsInfo: "",
      loading: false
    };
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
    },
  
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scope>
@import "../../assets/scss/index.scss";
.report {
  font-family: "MicrosoftYaHei" !important;
  width: 100%;
  height: 100%;
  background: #001a4c;
  background-size: cover;
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;
}
.report-wrap {
  margin: 0 auto ;
  height: calc(100vh - 110px);
  width: calc(100% - 80px);
  overflow-y: auto;
}
.report-header {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.report-gauage {
  // width: 810px;
  // height: 422px;
  width: 45%;
  min-width: 580px;
  // height: 21%;
  margin-right: 15px;
  background: rgba(0, 36, 106, 0.3);
  box-shadow: #226cfb 0px 0px 20px inset;
}
.report-funnel {
  width: 55%;
  // height: 422px;
  //  width: 55%;
  // height: 21%;
  margin-left: 15px;
  background: rgba(0, 36, 106, 0.3);
  box-shadow: #226cfb 0px 0px 20px inset;
}

.report-pop {
  // width: 1840px;
  // height: 480px;
  width: 100%;
  min-height: 400px;
  min-width: 1220px;
  margin-top: 30px;
  box-shadow: #226cfb 0px 0px 20px inset;
}
.opacityBg {
  background: rgba(0, 36, 106, 0.3);
}
.staticBg {
  background: rgb(0, 36, 106);
}

.el-footer {
  // height: computer(80px) !important;
  // position: relative;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.bottom-btn {
  background: url("../../assets/images/menu02.png") no-repeat;
  width: computer(750px);
  height: computer(69px);
  margin: 0 auto;
  .el-button--text {
    width: computer(401px);
    height: computer(69px);
  }
}
.close {
  background: url("../../assets/images/close.png") no-repeat;
  width: computer(60px);
  height: computer(60px);
  // position: absolute;
  // right: 20px;
  // bottom: 20px;
  position: absolute;
  right: 1%;
  bottom: 20%;
}
.report-loading {
  margin: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: hidden;
  background: url("../../assets/images/loading.jpg") no-repeat center center;
}
</style>
