<template>
  <div class="result-table-page">
    <div class="left-head">
      {{!clickAnswer?'全班组':clickAnswer+'的选项组'}},共计{{tableData.length}}人。
      <span
        class="cursor"
        @click="allTables"
        v-if="clickAnswer"
      >查看全部</span>
    </div>
    <div class="table" id="table">
      <el-table :data="tableData" border :max-height="tableHeight">
        <el-table-column prop="student_number" label="学号" width="180"></el-table-column>
        <el-table-column prop="student_name" label="学生姓名" width="180"></el-table-column>
        <el-table-column :label="optionText">
          <template slot-scope="scope">
            <!-- {{scope.row.answer_val}} -->
            <span v-if="pattern === 0">{{ scope.row.student_score }}</span>
            <span v-else-if="pattern === 1">{{ scope.row.is_right == true ? '对' : '错' }}</span>
            <span v-else>{{ scope.row.answer }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="use_time_str" label="答题耗时"></el-table-column>
        <el-table-column prop="avgTime" label="组平均用时"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "resultTableComponent",
  props: ["tableHeight", "tableData", "chartData", "pattern", "clickAnswer"],
  data() {
    return {
      tableHeight: 0,
      optionText: "选项"
    };
  },
  mounted() {
    console.log(this.pattern);
    if (this.pattern === 1 ) {
      this.optionText = "对错";
    } else if (this.pattern === 0) {
      this.optionText = "得分";
    } else {
      this.optionText = "选项";
    }
    this.resetData();
  },
  methods: {
    allTables() {
      this.clickAnswer = "";
      this.tableData = JSON.parse(
        lwmain.oneQuestionOriginalRecordList(null, null, null)
      );
    },
    resetData() {
      this.tableData.filter((v, i, a) => {
        let item = [];
        if (this.chartData.groupAvgTimeList) {
          if (this.pattern == 0) {
            item = this.chartData.groupAvgTimeList.find(
              i => i.name == v.student_score
            );
          } else {
            item = this.chartData.groupAvgTimeList.find(
              i => i.name == v.is_right
            );
          }
        } else {
          item = this.chartData.find(i => i.name == v.answer);
        }
        v.avgTime = this.utils$.fromatDate(item.avgTime);
        v.use_time_str = this.utils$.fromatDate(v.use_time);
        return a;
      });
    }
  },
  watch:{
    tableData(val){
      this.resetData();
    }
  }
};
</script>
<style lang="scss" >
@import "../../assets/scss/index.scss";
.result-table-page {
  padding-right: computer(26px);
  
  width: 100%;
  .left-head {
    margin-bottom: computer(21px);
    border: none;
    span {
      color: #226cfb;
    }
  }
  .el-table {
    height: calc(100% - #{computer(20px)});
    .hover-row {
      background-color: transparent;
    }
    .gutter {
      border-top: none !important;
      border-bottom: none !important;
    }
  }
  .el-table_1_column_2 {
    .cell {
      @include line-ell(80%);
    }
  }

  .table {
    //border-right: 1px solid #226cfb;
    font-weight: normal;
    font-stretch: normal;
    text-align: center;
    table {
      height: calc(100% - 10px);
      
      font-size: computer(20px);
      color: #fff;
      tr {
        height: computer(62px);
      }
      td {
        border-bottom: 1px solid #1146ab;
        border-right: 1px solid #1146ab;
        text-align: center;
      }
    }
  }
  
  
}
</style>

