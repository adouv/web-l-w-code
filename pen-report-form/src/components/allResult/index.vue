<template>
  <div class="all-results-overview">
    <el-container>
      <el-main class="auto-scroll">
        <div class="all-result-overview-header">
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
        <a name="result"></a>
        <div class="inner-box-1">
          <lw-common-top
            :selectType="csSelectType"
            title="关键参数伴随图"
            :options="options1"
            @selectVal="getChangeData"
          ></lw-common-top>
          <div ref="lineCharts"><div id="myLineChars" :style="{width:'100%',height:'690px'}"></div></div>
            <div class="knowledge-tip" ref="knowTip" style="display:none">本套试卷没有关联任何知识点！</div>
          <div class="echart-title">这套卷{{chartTip}}的对人数和人均耗时对比走势规律</div>
        </div>
        <div class="inner-box-2">
          <lw-common-top
            :selectType="reSelectType"
            :title="title"
            :options="options2"
            @selectVal="getChangeData"
          ></lw-common-top>
          <div class="table">
            <el-table
              :data="resultData"
              border
              max-height="1334"
              style="width: 100%:background-color:none;text-align:center"
              empty-text="本套试卷没有关联任何知识点！"
            >
              <el-table-column prop="index" label="题号" v-if="isShowOptionSet"></el-table-column>
              <el-table-column prop="knowledge_name" label="知识点名称" v-if="!isShowOptionSet"></el-table-column>
              <el-table-column prop="score" label="满分"></el-table-column>
              <el-table-column prop="student_avg_score" label="平均分"></el-table-column>
              <el-table-column label="平均耗时">
                <template slot-scope="scope">
                  <span v-if="scope.row.avg_time">{{scope.row.avg_time|formatSeconds}}</span>
                  <span v-else>0</span>
                </template>
              </el-table-column>
              <el-table-column label="难度">
                <template
                  slot-scope="scope"
                >{{scope.row.degree_of_difficulty}} {{scope.row.difficultyName}}</template>
              </el-table-column>
              <el-table-column prop="a1" label="区分度">
                <template
                  slot-scope="scope"
                >{{scope.row.discrimination}} {{scope.row.discriminationName}}</template>
              </el-table-column>
              <el-table-column prop="right_count" label="答对人数"></el-table-column>
              <el-table-column prop="error_count" label="答错人数"></el-table-column>
              <el-table-column prop="max_item" label="答题结果最多项" v-if="isShowOptionSet"></el-table-column>
              <el-table-column fixed="right" label="笔迹统览" width="168" v-if="isShowOptionSet">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row,1)" type="text" size="small">点击查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="inner-box-3" style="display:block">
          <lw-common-top selectType="false" title="知识点详细得分统计表" :options="options1"></lw-common-top>
          <div class="table">
            <el-table
              :data="knowResultData"
              border
              style="width: 100%:background-color:none;text-align:center"
            >
              <el-table-column
                prop="name"
                label="知识点名称（满分）"
                fixed
                width="236"
                style="background-color:#001a4c;"
              ></el-table-column>
              <el-table-column
                prop="score"
                label="平均得分"
                fixed
                width="130"
                style="background-color:#001a4c;"
              ></el-table-column>
              <template v-for="(col,index) in cols">
                <el-table-column :prop="col.prop" :label="col.label" width="130" :key="index"></el-table-column>
              </template>
            </el-table>
          </div>
        </div>
        <div class="inner-box-2">
          <lw-common-top selectType="false" title="学生答题结果统计" :options="options1"></lw-common-top>
          <div class="table">
            <el-table
              :data="studentData"
              border
              style="width: 100%:background-color:none;text-align:center"
            >
              <el-table-column prop="studentNumber" label="学号"></el-table-column>
              <el-table-column prop="studentName" label="姓名"></el-table-column>
              <el-table-column prop="rightCount" label="答对题数"></el-table-column>
              <el-table-column prop="errorCount" label="答错题数"></el-table-column>
              <el-table-column prop="totalScore" label="总分"></el-table-column>
              <el-table-column prop="avgScore" label="平均分"></el-table-column>
              <el-table-column label="单道题平均耗时">
                <template slot-scope="scope">
                  <span v-if="scope.row.avgTime">{{scope.row.avgTime|formatSeconds}}</span>
                  <span v-else>0</span>
                </template>
              </el-table-column>
              <el-table-column label="总耗时">
                <template slot-scope="scope">
                  <span v-if="scope.row.totalTime">{{scope.row.totalTime|formatSeconds}}</span>
                  <span v-else>0</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="笔迹统览" width="168">
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.row,2)" type="text" size="small">点击查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="back-top-wrap">
          <a class="back-top" href="#top">
            <img src="../../assets/images/back-top.png" alt="回到顶部">
          </a>
        </div>
      </el-main>
      <el-footer>
        <!-- <div class="bottom-btn" flex>
          <el-button type="text" @click="$router.push({path:'/allReport'})"></el-button>
          <el-button type="text" @click="$router.push({path:'/allResult'})"></el-button>
        </div>
        <div class="close cursor" @click="close()"></div>
        <div class="onTop cursor" @click="backTop"></div>-->
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import lw from "@/_services/c.service.js";
export default {
  data() {
    return {
      selectType: 1,
      options1: [
        {
          value: "0-1",
          label: "试题维度"
        },
        {
          value: "1-1",
          label: "知识点维度"
        }
      ],
      options2: [
        {
          value: "0-2",
          label: "试题维度"
        },
        {
          value: "1-2",
          label: "知识点维度"
        }
      ],
      resultData: [],
      cols: [],
      knowResultData: [],
      studentData: [],
      chartData: [],
      isShowOptionSet: true, // 是否显示选项集
      title: "试题基本答题汇总结果统计",
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
      knowledgeDemotion: {
        type: "",
        description: ""
      },
      csSelectType: "0-1",
      reSelectType: "0-2",
      chartNoData: true,
      chartTip: '各题'
    };
  },
  mounted() {
    console.log(this.charsType);
    lw.getReportTitle().then(res => {
      let data;
      data = res;
      this.titleData.examName = data.paper_name;
      this.titleData.gradeClassName = `${data.grade_name}${data.class_name}`;
      this.titleData.yearMonthDay = data.start_time
        .split(" ")[0]
        .replace(/-/g, "/");
      this.titleData.week = "周" + data.week_name;
      this.titleData.startTime = data.start_time.split(" ")[1].slice(0, 5);
      this.titleData.endTime = data.end_time.split(" ")[1].slice(0, 5);
      this.titleData.launcher = data.teacher_name + "老师发起";
    });

    //试题维度 柱状图
    lw.getPracticeStatistics().then(res => {
      this.chartNoData = true;
      this.lineCharts(res);
    });
    //试题维度 基本答题结果汇总统计
    lw.getPracticeBaseInfo().then(res => {
      this.resultData = res;
    });
    // 学生答题结果统计
    lw.getStudentOriginalStatistics().then(res => {
      this.studentData = res;
    });
    // 试题基本答题汇总结果
    lw.getOnePracticeKnowledgeScoreStatistics().then(res => {
      for (var key in res.name) {
        this.cols.push({ label: res.name[key], prop: key, type: "normal" });
      }
      this.knowResultData = res.score;
    });
  },
  methods: {
    handleClick(row, type) {
      if (type == 1) {
        lw.loadHistoryHandwritingForQuestion(
          row.exercise_record_id,
          row.question_id
        );
      } else {
        lw.loadHistoryHandwritingForStudent(
          row.exercise_record_id,
          row.studentId
        );
      }
    },
    getChangeData(val) {
      this.title =
        val == "0-2"
          ? "试题基本答题汇总结果统计"
          : "知识点基本答题汇总结果统计";
      this.chartTip = val == '0-1' ? '各题' : '知识点';
      let selectArr = val.split("-");
      let dimension = selectArr[0];
      let moduleTemp = selectArr[1];
      if (moduleTemp == 1) {
        // 柱状图
        let data = {};
        if (dimension == "0") {
          //试题维度 柱状图
          lw.getPracticeStatistics().then(res => {
            this.chartNoData = true;
            this.$refs.lineCharts.style.display = 'block';
            this.$refs.knowTip.style.display = 'none';
            this.lineCharts(res);
          });
        } else {
          //知识点维度 柱状图
          lw.getPracticeKnowledgeStatistics().then(res => {
            this.getKnowledgesInfo(res, 1);
          });
        }
      } else {
        //表格

        let data = {};
        if (dimension == "0") {
          this.isShowOptionSet = true;
          //试题维度 基本答题结果汇总统计
          lw.getPracticeBaseInfo().then(res => {
            this.resultData = res;
          });
        } else {
          //知识点维度
          lw.getPracticeKnowledgeBaseInfo().then(res => {
            this.getKnowledgesInfo(res, 2);
          });
        }
      }
    },
    getKnowledgesInfo(res, type) {
      this.knowledgeDemotion.type = res.knowledgesInfo;
      
      if (!this.knowledgeDemotion.type) {
        if (type == 1) {     
          if(this.knowledgeDemotion.type === 0){
            this.$refs.lineCharts.style.display = 'none';
            this.$refs.knowTip.style.display = 'block';
            
          }else{
            this.lineCharts(res);
          }
          this.csSelectType = "0-1";
        } else {
          this.isShowOptionSet = false;
          this.reSelectType = "0-2";
          this.resultData = res.result;
        }
      }
      switch (this.knowledgeDemotion.type) {
        case 0:
          this.knowledgeDemotion.description = "本套试卷没有关联任何知识点！";
          break;
        case 1:
          this.knowledgeDemotion.description =
            "本套试卷中不是每道题都关联了知识点，所以统计分析数据只能覆盖所有关联了知识点的试题";
          break;
      }
      if (this.knowledgeDemotion.type == 1) {
        this.$confirm(this.knowledgeDemotion.description, {
          confirmButtonText: "知道了",
          type: "info",
          center: true
        }).then(() => {
          if (type == 1) {
            this.$refs.lineCharts.style.display = 'block';
            this.$refs.knowTip.style.display = 'none';
            this.lineCharts(res);
            this.csSelectType = "0-1";
          } else {
            this.isShowOptionSet = false;
            this.resultData = res.result;
            this.reSelectType = "0-2";
          }
        });
      }
    },
    lineCharts(data) {
      let myChart = this.$echarts.init(document.getElementById("myLineChars"));
      // 基于准备好的dom，初始化echarts实例

      let legendArr = ["答对学生人数", "平均单个学生答题耗时"];
      let xScoreArr = data.index;
      let yStudentNumArr = data.rightCount;
      let yAverTimeArr = data.avgTime;
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: "axis",
          formatter: "{a0}: {c0}<br/>{a1}: {c1}″",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#226cfb"
            }
          }
        },
        legend: {
          data: legendArr,
          textStyle: {
            color: "#ffffff",
            fontSize: 18
          }
        },
        grid: {
          top: "12%", //距上边距
          left: "5%", //距离左边距
          right: "7%", //距离右边距
          bottom: "10%" //距离下边距
        },
        xAxis: [
          //x样式
          {
            type: "category",
            data: xScoreArr,
            axisLine: {
              // 线条样式
              lineStyle: {
                color: "#226cfb",
                width: 1,
                fontSize: 13
              }
            },
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "答对学生人数",
            axisTick: { show: false },
            // splitLine:{show:false},
            axisLabel: {
              //坐标轴上的文字
              formatter: "{value}"
            },
            nameTextStyle: {
              fontSize: 18,
              color: "#ffffff"
            },
            axisLine: {
              lineStyle: {
                color: "#226cfb",
                width: 1
              }
            },
            splitLine: {
              lineStyle: {
                color: "#226cfb",
                opacity: "0.3"
              }
            }
          },
          {
            type: "value",
            name: "平均单个学生答题耗时",
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
              //坐标轴上的文字
              formatter: "{value} ″"
            },
            nameTextStyle: {
              fontSize: 18,
              color: "#ffffff"
            },
            axisLine: {
              lineStyle: {
                color: "#226cfb",
                width: 1
              }
            }
          }
        ],
        series: [
          {
            name: "答对学生人数",
            type: "bar",
            lineStyle: {
              color: "#ff7d55"
            },
            itemStyle: {
              color: "#ff7d55"
            },
            data: yStudentNumArr,
            barWidth: 25,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#febb5c" },
                  { offset: 1, color: "#ff7e55" }
                ])
              }
            }
          },
          {
            name: "平均单个学生答题耗时",
            type: "line",
            yAxisIndex: 1,
            data: yAverTimeArr,
            lineStyle: {
              color: "#226cfb"
            },
            itemStyle: {
              color: "#226cfb"
            }
          }
        ]
      });
    },
    /**
     * 回到顶部
     */
    backTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    close() {
      lw.closeWindow();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/scss/index.scss";
.all-results-overview {
  width: 100%;
  // height: calc(100% - #{computer(105px)});
  height: 100%;
  position: absolute;
  left: 0;
  z-index: 9;
  right: 0;
  bottom: 0;
  overflow: hidden;
  .el-container {
    background-color: #001a4c;
    height: 100%;
    font-size: computer(20px);

    .el-main {
      padding: computer(31px) computer(39px);
      height: calc(100% - #{computer(165px)});
      .inner-box-1,
      .inner-box-2,
      .inner-box-3 {
        overflow: hidden;
        position: relative;
        margin-bottom: computer(30px);
        box-shadow: #226cfb 0px 0px 20px inset;
      }

      .inner-box-1 {
        height: computer(775px);
        #myLineChars {
          padding-top: computer(21px);
        }
        .echart-title {
          position: absolute;
          bottom: computer(20px);
          color: #fff;
          text-align: center;
          width: 100%;
          font-size: computer(18px);
        }
        .knowledge-tip {
          font-size: 28px;
          color: rgb(34, 108, 251);
          text-align: center;
          line-height: 600px;
        }
      }
      .inner-box-2,
      .inner-box-3 {
        .table {
          margin: computer(58px) computer(40px) computer(40px);
          //border-left: 1px solid #226cfb;
          text-align: center;

          .gutter {
            border-top: none !important;
            border-bottom: none !important;
          }
        }
      }
      .inner-box-3 {
      }
      .el-table {
        font-size: computer(20px);
        .hover-row {
          background-color: transparent;
        }
        .gutter {
          border: none !important;
        }
        .el-button {
          font-size: computer(20px);
        }
      }
      .back-top-wrap {
        z-index: 9999;
        position: relative;
        .back-top {
          position: absolute;
          top: -90px;
          right: -25px;
        }
      }
    }
    .el-footer {
      height: computer(80px) !important;
      position: relative;
    }
    .bottom-btn {
      background: url("../../assets/images/menu03.png") no-repeat;
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
    .onTop {
      background: url("../../assets/images/top.png") no-repeat;
      width: computer(98px);
      height: computer(98px);
      position: absolute;
      right: 20px;
      bottom: 121px;
      z-index: 9999;
    }
  }
  .all-result-overview-header {
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
}
</style>
