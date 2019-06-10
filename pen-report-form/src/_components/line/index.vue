<template>
  <div class="line">
    <div class="select">
      <lw-all-report-select @changeType="showBottomTitle"></lw-all-report-select>
    </div>
    <div id="line" :style="{width: '100%', height: '740px',minHeight: '380px', minWidth: '1220px'}"></div>
    <p class="knowledge-tip" v-if="knowledgeDemotion.type == 0">{{knowledgeDemotion.description}}</p>
    <div class="line-table" ref="table">
      <table class="left_table" border="1" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <th>区分度</th>
            <th>{{data.discriminationTotal ? data.discriminationTotal.toFixed(2) : 0}}</th>
          </tr>
          <tr>
            <th>题难度</th>
            <th>{{data.degreeOfDifficultyTotal ? data.degreeOfDifficultyTotal.toFixed(2) : 0}}</th>
          </tr>
          <tr>
            <th>得分率</th>
            <th>{{data.scoringAverageTotal ? data.scoringAverageTotal.toFixed(2) : 0}}</th>
          </tr>
          <tr>
            <th>认知度</th>
            <th>{{data.awarenessTotal ? data.awarenessTotal.toFixed(2) : 0}}</th>
          </tr>
          <tr>
            <th>接纳度</th>
            <th>{{data.acceptanceTotal ? data.acceptanceTotal.toFixed(2) : 0}}</th>
          </tr>
          <tr>
            <th>题号</th>
            <th>总分</th>
          </tr>
        </tbody>
      </table>
      <div class="dynamic_table line-scroll">
        <table class="right_table" border="1" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <th v-for="(ele1,index) in data.discrimination" :key="index">{{ele1}}</th>
            </tr>
            <tr>
              <th v-for="(ele2,index) in data.degreeOfDifficulty" :key="index">{{ele2}}</th>
            </tr>
            <tr>
              <th v-for="(ele3,index) in data.scoringAverage" :key="index">{{ele3}}</th>
            </tr>
            <tr>
              <th v-for="(ele4,index) in data.awareness" :key="index">{{ele4}}</th>
            </tr>
            <tr>
              <th v-for="(ele5,index) in data.acceptance" :key="index">{{ele5}}</th>
            </tr>
            <tr>
              <th v-for="(ele6,index) in data.nameList" :key="index" :title="ele6">{{ele6}}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <p class="line-bottom-title">
      <span v-show="type == 0">这套题各题的各关键指标联合对比走势</span>
      <span v-show="type == 1">这套题知识点的各关键指标联合对比走势</span>
    </p>
    <em class="upper upper-left"></em>
    <em class="upper upper-right"></em>
    <em class="upper bottom-left"></em>
    <em class="upper bottom-right"></em>
  </div>
</template>

<script>
import lineModel from "./model.js";
import lw from "../../_services/c.service.js";
export default {
  name: "lineComponent",
  data() {
    return {
      data: {},
      lChart: "",
      type: 0,
      knowledgeDemotion: {
        type: "",
        description: ""
      }
    };
  },
  mounted() {
    this.lChart = this.$echarts.init(document.getElementById("line"));
    // this.data = {
    //   discrimination: [0.9, 0.8, 0.8, 0.9, 0.8, 0.9, 0.8],
    //   degreeOfDifficulty: [0.7, 0.6, 0.6, 0.7, 0.7, 0.6, 0.7],
    //   scoringAverage: [0.5, 0.5, 0.4, 0.4, 0.5, 0.5, 0.4],
    //   awareness: [0.3, 0.3, 0.2, 0.3, 0.2, 0.2, 0.2],
    //   acceptance: [0.1, 0, 0.1, 0, 0, 0.1, 0.1],
    //   nameList: [11111111111111111, 222222222, 333333333333, 4444444444444444, 5555555555555555555, 666666666666666666, 7777777777]
    // };
    lw.getLineOirgins(this.type).then(res => {
      this.data = res;
      this.getLineChart(this.data);
    });
  },
  methods: {
    getLineChart(data) {
      var sers = this.arrangeSeries(data);
      var x = data.nameList;
      var xWordsLimit = this.showXWords(x);
      var xFormatter = true;
      if (xWordsLimit == 0) {
        xFormatter = false;
      }
      var showDataZoom = x.length > 12 ? true : false;
      if (!showDataZoom) {
        this.$refs.table.style.marginTop = -40 + "px";
      }
      let option = {
        title: {
          top: 20,
          left: 20,
          text: "线数走势图",
          textStyle: {
            color: "#226cfb",
            fontWeight: "normal",
            fontSize: 20
          }
        },
        tooltip: {
          trigger: "axis"
        },
        color: lineModel.lineColors,
        legend: {
          y: 140,
          icon: "roundRect",
          itemGap: 100,
          data: lineModel.lineChinensNames,
          itemWidth: 15,
          itemHeight: 15,
          textStyle: {
            color: "#ffffff",
            fontSize: 16
          }
        },
        grid: {
          y: 179,
          x: 120,
          x2: 45,
          y2: 120
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: x,
          axisLine: {
            lineStyle: {
              color: "#226cfb",
              fontSize: 16
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#226cfb",
              opacity: "0.3"
            }
          },
          axisLabel: {
            formatter: function(params) {
              if (xFormatter) {
                //标签输出形式 ---请开始你的表演
                if (params.length > xWordsLimit) {
                  return params.substring(0, xWordsLimit) + "...";
                } else {
                  return params;
                }
              } else {
                // 当有一个或两个知识点
                return params;
              }
            },
            textStyle: {
              color: "#226cfb",
              fontSize: 16
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#226cfb"
            }
          },

          splitLine: {
            show: true,
            lineStyle: {
              color: "#226cfb",
              opacity: "0.3"
            }
          },
          axisLabel: {
            textStyle: {
              color: "#226cfb",
              fontSize: 16
            }
          },
          axisTick: {
            show: false
          }
        },
        dataZoom: [
          {
            type: "slider",
            show: showDataZoom, //flase直接隐藏图形
            xAxisIndex: [0],
            bottom: "8%",
            start: 0, //滚动条的起始位置
            end: 100, //滚动条的截止位置（按比例分割你的柱状图x轴长度）
            borderColor: "#226cfb",
            fillerColor: "rgba(0, 36, 106, 0.5)",
            textStyle: {
              color: "#226cfb"
            }
          }
        ],
        series: sers
      };
      this.lChart.setOption(option);
    },
    showXWords(points) {
      var str;
      var l = points.length;
      if (l <= 2) {
        str = 0;
      } else if (l > 2 && l <= 5) {
        str = 15;
      } else if (l > 5 && l <= 10) {
        str = 7;
      } else if (l > 10) {
        str = 5;
      }
      return str;
    },
    arrangeSeries(series) {
      let sers = lineModel.lineChinensNames.map((ele, index) => {
        return {
          name: ele,
          type: "line",
          symbolSize: 16,
          symbol: "circle",
          data: series[lineModel.lineEnglishNames[index]],
          itemStyle: {
            normal: {
              backgroundColor: lineModel.lineColors[index]
            }
          }
        };
      });
      return sers;
    },
    showBottomTitle(val) {
      this.type = Number(val);
      this.lChart.clear();
      if (val == 0) {
        // 试题纬度
        lw.getLineOirgins(this.type).then(res => {
          this.data = res;
          this.knowledgeDemotion = {
            type: "",
            description: ""
          };
          this.getLineChart(this.data);
        });
      } else if (val == 1) {
        // 知识点纬度
        lw.getLineOirgins(this.type).then(res => {
          this.data = res;
          this.knowledgeDemotion.type = this.data.knowledgesInfo;
          switch (this.data.knowledgesInfo) {
            case 0:
              this.knowledgeDemotion.description =
                "本套试卷没有关联任何知识点！";
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
              this.getLineChart(this.data);
            });
          }
           if(!this.data.knowledgesInfo){
             this.getLineChart(this.data);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 100%;
  position: relative;
  .select {
    width: 100%;
    position: absolute;
    top: 60px;
    z-index: 1000;
  }
  .knowledge-tip {
    font-size: 28px;
    color: rgb(34, 108, 251);
    position: absolute;
    top: 30%;
    left: calc(50% - 192px);
  }
  .line-table {
    margin: 40px 45px 0 120px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    table tr {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
    }
    .left_table {
      width: 338px;
      & {
        border: 1px solid #226cfb !important;
      }
      & tr {
        border-bottom: 1px solid rgba(0, 36, 106, 0.3);
      }
      & tr th {
        width: 169px;
        height: 60px;
        line-height: 60px;
        color: #ffffff;
        border-right: 1px solid rgba(0, 36, 106, 0.3);
      }
    }
    .dynamic_table {
      width: calc(100% - 338px);
      overflow-x: auto;
      padding-bottom: 5px;
    }
    .right_table {
      & {
        border: 1px solid #226cfb !important;
        border-left: none !important;
      }
      & tr {
        border-bottom: 1px solid rgba(0, 36, 106, 0.3);
      }
      & tr th {
        width: 169px;
        height: 60px;
        line-height: 60px;
        color: #ffffff;
        border-right: 1px solid rgba(0, 36, 106, 0.3);
        border-left: 1px solid #226cfb;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      & tr th:nth-child(1) {
        border-left: none;
      }
    }
  }
  .line-bottom-title {
    width: 100%;
    font-family: MicrosoftYaHei;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 18px 0;
  }
}
</style>
