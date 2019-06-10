<template>
  <div class="results-overview">
    <el-container>
      <el-main>
        <div class="inner-box" flex="dir:left">
          <em class="upper-left"></em>
          <em class="upper-right"></em>
          <em class="bottom-left"></em>
          <em class="bottom-right"></em>
          <div class="pie-left" id="mychars1">
            <template v-if="!pattern">
              <lw-pie-chart :resultData="resultData" v-if="isShow" @changeData="getChangeData"></lw-pie-chart>
            </template>
            <template v-else>
              <lw-line-chart
                :box="box"
                :resultData="resultData"
                v-if="isShow"
                @changeData="getChangeData"
              ></lw-line-chart>
            </template>
          </div>
          <div class="pie-right" id="table">
            <lw-result-table
              v-if="isShow"
              :tableHeight="tableHeight"
              :tableData="tableData"
              :chartData="resultData.echart"
              :pattern="resultData.record.pattern"
              :clickAnswer="clickAnswer"
            ></lw-result-table>
          </div>
        </div>
      </el-main>
      <!-- <el-footer>
        <div class="bottom-btn" flex>
          <el-button type="text" @click="$router.push({path:'/report'})"></el-button>
          <el-button type="text" @click="$router.push({path:'/resultsOverview'})"></el-button>
        </div>
        <div class="close cursor" @click="close()"></div>
      </el-footer>-->
    </el-container>
  </div>
</template>
<script>
import lw from "@/_services/c.service.js";
export default {
  data() {
    return {
      box: {
        width: 0,
        height: 0
      },
      isShow: false,
      tableHeight: 0,
      winWidth: window.innerWidth,
      resultData: [],
      pattern: true,
      tableData: [],
      clickAnswer: "",
      clickParams: []
    };
  },
  mounted() {
    let _this = this;
    let innerBox = document.getElementById("mychars1");
    this.box.width = innerBox.offsetWidth - 26;
    this.box.height = window.innerHeight - 400;
    let tableHeight = document.getElementById("table");
    this.tableHeight = tableHeight.offsetHeight - 48;
    //this.resultData = JSON.parse(lwmain.oneQuestionClassStatistics());
    lw.getOneQuestionClassStatistics().then(res => {
      this.isShow = true;
      this.resultData = res;
      this.pattern = res.record.pattern != undefined ? true : false;
      //alert(JSON.stringify(res.echart))
    });
    lw.getOneQuestionOriginalRecordList(null, null, null).then(res => {
      this.tableData = res;
    });
    let sresultData = {
      record: {
        id: "11553223599",
        exercise_record_id: "1",
        question_id: "2",
        right_answer: "A",
        score: 10.0,
        content: "测试1",
        knowledge_id: 2,
        knowledge_name: "知识点二",
        use_time: 1650,
        total_count: 60,
        right_count: 15,
        error_count: 45,
        degree_of_difficulty: 0.63,
        student_avg_score: 6.33,
        avg_time: 27,
        right_avg_time: 23,
        error_avg_time: 28,
        first_right_time: 1,
        first_error_time: 1,
        right_proportion: 0.25,
        mastery_proportion: 0.57,
        worse_proportion: 0.28,
        bad_proportion: 0.15,
        good_proportion: 0.0,
        great_proportion: 0.23,
        perfect_proportion: 0.33,
        discrimination: 0.13,
        awareness: 0.56,
        cognitive_index: 0.42,
        acceptance: 0.89,
        scoring_average: 0.63,
        status: 0,
        max_item: "A",
        max_item_count: 38,
        synchronous_status: 1,
        create_time: "2019-03-22 10:59:59",
        update_time: "2019-03-29 16:20:06"
      },
      echart: [
        {
          name: "A",
          value: "38",
          avgTime: 22,
          percent: 0.63
        },
        {
          name: "B",
          value: "22",
          avgTime: 36,
          percent: 0.37
        },
        {
          value: "0",
          name: "未作答",
          percent: 0.0,
          avgTime: "0"
        }
      ]
    };
    let resultData = {
      record: {
        id: "11553223599",
        exercise_record_id: "1",
        question_id: "2",
        right_answer: "A",
        score: 10.0,
        content: "测试1",
        knowledge_id: 2,
        knowledge_name: "知识点二",
        use_time: 1650,
        total_count: 60,
        right_count: 15,
        error_count: 45,
        degree_of_difficulty: 0.63,
        student_avg_score: 6.33,
        avg_time: 27,
        right_avg_time: 23,
        error_avg_time: 28,
        first_right_time: 1,
        first_error_time: 1,
        right_proportion: 0.25,
        mastery_proportion: 0.57,
        worse_proportion: 0.28,
        bad_proportion: 0.15,
        good_proportion: 0.0,
        great_proportion: 0.23,
        perfect_proportion: 0.33,
        discrimination: 0.13,
        awareness: 0.56,
        cognitive_index: 0.42,
        acceptance: 0.89,
        scoring_average: 0.63,
        pattern: 0,
        status: 0,
        max_item: "A",
        max_item_count: 38,
        synchronous_status: 1,
        create_time: "2019-03-22 10:59:59",
        update_time: "2019-03-29 16:20:06"
      },
      echart: {
        scoreList: ["10", "0"],
        countList: [38, 22],
        avgTimeList: [21, 35],
        groupAvgTimeList: [
          {
            name: "10",
            avgTime: 21
          },
          {
            name: "0",
            avgTime: 35
          }
        ]
      }
    };
    let ddresultData = {
      record: {
        id: "11553223599",
        exercise_record_id: "1",
        question_id: "2",
        right_answer: "A",
        score: 10.0,
        content: "测试1",
        knowledge_id: 2,
        knowledge_name: "知识点二",
        use_time: 1650,
        total_count: 60,
        right_count: 15,
        error_count: 45,
        degree_of_difficulty: 0.63,
        student_avg_score: 6.33,
        avg_time: 27,
        right_avg_time: 23,
        error_avg_time: 28,
        first_right_time: 1,
        first_error_time: 1,
        right_proportion: 0.25,
        mastery_proportion: 0.57,
        worse_proportion: 0.28,
        bad_proportion: 0.15,
        good_proportion: 0.0,
        great_proportion: 0.23,
        perfect_proportion: 0.33,
        discrimination: 0.13,
        awareness: 0.56,
        cognitive_index: 0.42,
        acceptance: 0.89,
        scoring_average: 0.63,
        pattern: 1,
        status: 0,
        max_item: "A",
        max_item_count: 38,
        synchronous_status: 1,
        create_time: "2019-03-22 10:59:59",
        update_time: "2019-03-29 16:20:06"
      },
      echart: {
        scoreList: ["True", "False"],
        countList: [38, 22],
        avgTimeList: [21.5, 35.5]
      }
    };
    let tableData = [
      {
        student_id: 40,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 24
      },
      {
        student_id: 41,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 25
      },
      {
        student_id: 42,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 26
      },
      {
        student_id: 43,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 27
      },
      {
        student_id: 44,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 28
      },
      {
        student_id: 45,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 14
      },
      {
        student_id: 46,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 19
      },
      {
        student_id: 47,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 20
      },
      {
        student_id: 48,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 21
      },
      {
        student_id: 49,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 22
      },
      {
        student_id: 50,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 23
      },
      {
        student_id: 51,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 24
      },
      {
        student_id: 52,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 25
      },
      {
        student_id: 53,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 26
      },
      {
        student_id: 54,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 27
      },
      {
        student_id: 55,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 28
      },
      {
        student_id: 56,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 15
      },
      {
        student_id: 57,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 19
      },
      {
        student_id: 58,
        student_number: "1.23456001",
        "studen t_name": "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 16
      },
      {
        student_id: 59,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 17
      },
      {
        student_id: 60,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 18
      },
      {
        student_id: 1,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 10
      },
      {
        student_id: 2,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 19
      },
      {
        student_id: 3,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 20
      },
      {
        student_id: 4,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 21
      },
      {
        student_id: 5,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 22
      },
      {
        student_id: 6,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 23
      },
      {
        student_id: 7,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 24
      },
      {
        student_id: 8,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 25
      },
      {
        student_id: 9,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 26
      },
      {
        student_id: 10,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 27
      },
      {
        student_id: 11,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 28
      },
      {
        student_id: 12,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 11
      },
      {
        student_id: 13,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 29
      },
      {
        student_id: 14,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 30
      },
      {
        student_id: 15,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 31
      },
      {
        student_id: 16,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 32
      },
      {
        student_id: 17,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 33
      },
      {
        student_id: 18,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 34
      },
      {
        student_id: 19,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 35
      },
      {
        student_id: 20,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 36
      },
      {
        student_id: 21,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 37
      },
      {
        student_id: 22,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 38
      },
      {
        student_id: 23,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 12
      },
      {
        student_id: 24,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 39
      },
      {
        student_id: 25,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 40
      },
      {
        student_id: 26,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 41
      },
      {
        student_id: 27,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 42
      },
      {
        student_id: 28,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 43
      },
      {
        student_id: 29,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 44
      },
      {
        student_id: 30,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 45
      },
      {
        student_id: 31,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 46
      },
      {
        student_id: 32,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 47
      },
      {
        student_id: 33,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 48
      },
      {
        student_id: 34,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 13
      },
      {
        student_id: 35,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "B",
        student_score: 0.0,
        is_right: false,
        use_time: 49
      },
      {
        student_id: 36,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 20
      },
      {
        student_id: 37,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 21
      },
      {
        student_id: 38,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 22
      },
      {
        student_id: 39,
        student_number: "1.23456001",
        student_name: "赵四",
        answer: "A",
        student_score: 10.0,
        is_right: true,
        use_time: 23
      }
    ];
         // this.pattern = this.resultData.record.pattern != undefined ? true : false;

  },
  methods: {
    close() {
      lw.closeWindow();
    },
    getChangeData(item) {
      console.log(item);
      this.clickParams = item;
      this.clickAnswer = item.clickAnswer;
      let studentAnswer = null;
      if (this.clickParams.score == "" && this.clickParams.isRight == "") {
        studentAnswer = this.clickParams.clickAnswer;
      }
      let studentScore = this.clickParams.score ? this.clickParams.score : null;
      let studentIsRight = null;
      if (this.clickParams.score == "" && this.clickParams.isRight) {
        studentIsRight = this.clickParams.isRight == "对" ? "true" : "false";
      }
      lw.getOneQuestionOriginalRecordList(
        studentAnswer,
        studentScore,
        studentIsRight
      ).then(res => {
        this.tableData = res;
      });
    }
  },
  watch: {
    winWidth(val) {
      // console.log(val);
      // this.box.width = val/2 - 26;
      // this.box.height = window.innerHeight - 400;
      // let tableHeight = document.getElementById("table");
      // this.tableHeight = tableHeight.offsetHeight - 48;
      // console.log(this.box)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/scss/index.scss";
.results-overview {
  position: absolute;
  left: 0;
  z-index: 9;
  right: 0;
  bottom: 0;
  overflow: hidden;
  height: 100%;
  .el-container {
    background: #001a4c;
    height: calc(100% - #{computer(50px)});
    font-size: computer(20px);
    .el-main {
      box-shadow: #226cfb 0px 0px 20px inset;
      position: relative;
      margin: computer(31px) computer(39px) computer(69px);
      //height: calc(100% - #{computer(85px)});
      padding: 0;
    }
    .inner-box {
      color: #fff;
      padding: computer(40px);
      height: calc(100% - #{computer(100px)});
      overflow: hidden;
      .pie-left {
        width: 50%;
        box-shadow: 0px 1px 0px 0px #226cfb;
        margin-right: computer(26px);
        position: relative;
        .left-chart {
          width: 100%;
          height: calc(100% - 40px);
        }
      }
      .pie-right {
        width: 50%;
        margin-left: computer(26px);
      }
      em {
        position: absolute;
      }
      .upper-left {
        width: 22px;
        height: 22px;
        top: 0;
        left: 0;
        background: url("../../assets/images/upper-left-corner.png") no-repeat
          center center;
      }
      .upper-right {
        width: 22px;
        height: 22px;
        top: 0;
        right: 0;
        background: url("../../assets/images/upper-right-corner.png") no-repeat
          center center;
      }
      .bottom-left {
        width: 22px;
        height: 22px;
        bottom: 0;
        left: 0;
        background: url("../../assets/images/bottom-left-corner.png") no-repeat
          center center;
      }
      .bottom-right {
        width: 22px;
        height: 22px;
        bottom: 0;
        right: 0;
        background: url("../../assets/images/bottom-right-corner.png") no-repeat
          center center;
      }
    }

    .el-footer {
      position: relative;
    }
    .bottom-btn {
      background: url("../../assets/images/menu01.png") no-repeat;
      width: computer(756px);
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
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }
}
</style>
