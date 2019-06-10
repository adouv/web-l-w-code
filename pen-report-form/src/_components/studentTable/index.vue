<template>
  <div @click="noCancel($event)">
    <div class="table-title-wrap">
      <p class="table-title">学生统计信息展示表</p>
      <span class="table-title-cancel iconfont icon-pc-off" @click="cancelTable()"></span>
    </div>
    <div class="table-table-wrap scroll">
      <table width="1760" border="1px solid #226cfb" cellspacing="0" v-if="reportType == 1">
        <tr class="table-header">
          <th>学号</th>
          <th>学生姓名</th>
          <th>直接确定性指数</th>
          <th>间接确定性指数</th>
          <th>答题耗时</th>
          <th>该认知组平均答题耗时</th>
          <th>该题选项/ 得分</th>
        </tr>
        <tr v-for="(student,index) in tableList" :key="index">
          <td>{{student.studentNumber}}</td>
          <td>{{student.studentName}}</td>
          <td>{{student.direct}}</td>
          <td>{{student.indect}}</td>
          <td>{{student.useTime | minite }}</td>
          <td>{{student.avgTime | minite }}</td>
          <td>{{student.result}}</td>
        </tr>
      </table>
      <table width="1760" border="1px solid #226cfb" cellspacing="0" v-if="reportType == 0">
        <tr class="table-header">
          <th>学号</th>
          <th>学生姓名</th>
          <th>学生整套题总分</th>
          <th>学生整套题平均分</th>
          <th>学生整体耗时</th>
          <th>学生整套题平均耗时</th>
          <th>答对题数</th>
          <th>答错题数</th>
          <th>得分率</th>
        </tr>
        <tr v-for="(student,index) in tableList" :key="index">
          <td>{{student.studentNumber}}</td>
          <td>{{student.studentName}}</td>
          <td>{{student.totalScore }}</td>
          <td>{{student.avgScore }}</td>
          <td>{{student.totalTime | minite }}</td>
          <td>{{student.avgTime | minite }}</td>
          <td>{{student.rightCount}}</td>
          <td>{{student.errorCount}}</td>
          <td>{{student.scoringAverage }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import lw from "../../_services/c.service.js";
import Bus from "../../_services/funnelTableBus.service.js";
export default {
  props: ['reportType'],
  name: "stundenInfoTableComponent",
  data() {
    return {
      // type: "", // 0 多道题   1 单道题
      tableList: []
    };
  },
  created() {
    Bus.$on("type", e => {
      lw.getTable(Number(e.status), Number(e.type), Number(e.change)).then(
        res => {
          this.tableList = res
          }
      );
    });
  },
  methods: {
    noCancel(e) {
      e.cancelBubble ? (e.cancelBubble = true) : e.stopPropagation();
      this.$emit("cancelStudentInfo", false);
    },
    cancelTable() {
      this.$emit("cancelStudentInfo", true);
    }
  }
};
</script>

<style>
.table-title-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 15px 0;
}
.table-title {
  width: 185px;
  font-family: MicrosoftYaHei;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #226cfb;
  margin: 0;
}
.table-title-cancel {
  width: 20px;
  height: 20px;
  color: #226cfb;
  font-style: normal;
  font-size: 20px;
  cursor: pointer;
}
.table-table-wrap {
  margin: 10px 0 60px 40px;
  height: 430px;
  overflow-y: auto;
}
.table-table-wrap table {
  border-color: #226cfb !important;
}
.table-table-wrap table tr th,
table tr td {
  height: 60px;
  width: 251px;
  text-align: center;
  color: white;
}
.table-header {
  color: white;
  text-align: center;
  line-height: 60px;
}

.scroll::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.scroll::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 36, 106, 0.3);
  background: #226cfb;
}
.scroll::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 36, 106, 0.3);
  border-radius: 10px;
  background: rgba(225, 225, 225, 0);
}
</style>