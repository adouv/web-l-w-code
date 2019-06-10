<template>
  <div class="colorful-keys">
    <div class="select">
      <lw-all-report-select @changeType="showBottomTitle"></lw-all-report-select>
    </div>
    <div id="barChart" :style="{width: '100%', height: '720px', minWidth: '1220px'}"></div>
    <p class="knowledge-tip" v-if="knowledgeDemotion.type == 0">{{knowledgeDemotion.description}}</p>
    <p class="title-bottom">
      <span v-show="type == 0">这套题各题的认知掌握程度具体值和分布规律</span>
      <span v-show="type == 1">这套题知识点的认知掌握程度具体值和分布规律</span>
    </p>
    <em class="upper upper-left"></em>
    <em class="upper upper-right"></em>
    <em class="upper bottom-left"></em>
    <em class="upper bottom-right"></em>
  </div>
</template>
<script>
import bar from "./model.js";
import lw from "../../_services/c.service.js";
export default {
  name: "colorfulKeysChart",
  props: [],
  data() {
    return {
      data: "",
      bChart: "",
      type: 0,
      knowledgeDemotion: {
        type: "",
        description: ""
      }
    };
  },
  mounted() {
    this.bChart = this.$echarts.init(document.getElementById("barChart"));
    // this.data = {
    //   prefectList: [1, 1, "-", "-", "-", "-", "-", "-", "-", "-", 1, 1],
    //   greatList: ["-", "-", 1, 1, "-", "-", "-", "-", "-", "-", "-", "-"],
    //   goodList: ["-", "-", "-", "-", 1, 1, "-", "-", "-", "-", "-", "-"],
    //   badList: ["-", "-", "-", "-", "-", "-", 1, 1, "-", "-", "-", "-"],
    //   worseList: ["-", "-", "-", "-", "-", "-", "-", "-", 1, 1, "-", "-"],
    //   nameList: [
    //     "这是识",
    //     "这是识111111111111111",
    //     "这是识1111111111111111",
    //     "这是111111111111111",
    //     "这是111111111111111",
    //     "这是11111111111111111",
    //     "这是1111111111111111",
    //     "这是1111111111111111",
    //     "这是111111111111111",
    //     "这是111111111111",
    //     "这是分11111111111111111",
    //     "这是1111111111111"
    //   ]
    // };

    // this.data = {
    //   prefectList: ["-"],
    //   greatList: ["-"],
    //   goodList: ["-"],
    //   badList: ["-"],
    //   worseList: ["-"],
    //   nameList: ["-"]
    // };
    // this.getBarChart(this.data);
    lw.getBarOrigins(this.type).then(res => {
      this.data = res;
      this.getBarChart(this.data);
    });
  },
  methods: {
    getBarChart(data) {
      let x = data.nameList;
      var self = this;
      var xWordsLimit = this.showXWords(x);
      var xFormatter = true;
      if (xWordsLimit == 0) {
        xFormatter = false;
      }
      var showScroll = x.length > 12 ? true : false;
      let sers = this.arrangeSeries(this.data);
      let options = {
        title: {
          top: 20,
          left: 20,
          text: "五彩琴键图",
          textStyle: {
            color: "#226cfb",
            fontSize: 20,
            fontWeight: "normal"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "none" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(v) {
            var str = "";
            v.forEach(ele => {
              if (ele.value != "-") {
                str =
                  "第" +
                  ele.name +
                  "题<br/>" +
                  ele.seriesName +
                  ":" +
                  ele.value;
              }
            });
            return str;
          }
        },
        grid: {
          y: 179,
          x: 120,
          x2: 45,
          y2: showScroll ? 130 : 80
        },
        color: bar.barLegendColor,
        legend: {
          top: "110",
          icon: "roundRect",
          itemWidth: 22,
          itemHeight: 22,
          itemGap: 30,
          data: bar.barLegendChineseName,
          textStyle: {
            color: "#ffffff",
            fontSize: 16
          }
        },
        xAxis: {
          type: "category",
          splitLine: { show: false },
          data: x,
          axisLine: {
            lineStyle: {
              color: "#226cfb"
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: function(params) {
              if (xFormatter) {
                //标签输出形式 ---请开始你的表演
                if (params.length >= xWordsLimit) {
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
            show: false,
            alignWithLabel: true
          }
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 1,
          splitNumber: 2,
          name: "全班平均认知度",
          nameTextStyle: {
            color: "#ffffff",
            fontSize: 18,
            align: "right"
          },
          axisLine: {
            lineStyle: {
              color: "#226cfb"
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#226cfb",
              fontSize: 16
            }
          },
          axisTick: {
            show: true,
            alignWithLabel: true
          }
        },
        dataZoom: [
          {
            type: "slider",
            show: showScroll, //flase直接隐藏图形
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

      this.bChart.setOption(options);
    },
    showBottomTitle(val) {
      this.type = Number(val);
      this.bChart.clear();
      if (val == 0) {
        // 试题纬度
        lw.getBarOrigins(this.type).then(res => {
          this.data = res;
          this.knowledgeDemotion = {
            type: "",
            description: ""
          };
          this.getBarChart(this.data);
        });
      } else if (val == 1) {
        // 知识点纬度
        lw.getBarOrigins(this.type).then(res => {
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
              this.getBarChart(this.data);
            });
          };
          if(!this.data.knowledgesInfo){
             this.getBarChart(this.data);
          }
        });
      }
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
    arrangeSeries(data) {
      let sers = [];
      sers = bar.barLegendChineseName.map((ele, index) => {
        return {
          name: ele,
          type: "bar",
          stack: "总量",
          barWidth: 70,
          label: {
            normal: {
              show: true,
              position: "top",
              fontSize: 14,
              formatter: function(params) {
                return params.seriesName + "\n" + params.value;
              }
            }
          },
          data: (function() {
            for (var key in data) {
              if (key == bar.barLegendEnglishName[index]) {
                return data[key];
              }
            }
          })(),
          itemStyle: {
            barBorderRadius: 6
          }
        };
      });
      return sers;
    }
  }
};
</script>
<style lang="scss" scoped>
.colorful-keys {
  width: 100%;
  height: 100%;
  position: relative;
  .select {
    width: 100%;
    position: absolute;
    top: 60px;
    z-index: 1000;
  }
}
.knowledge-tip {
  font-size: 28px;
  color: rgb(34, 108, 251);
  position: absolute;
  top: 50%;
  left: calc(50% - 192px);
}
.title-bottom {
  position: absolute;
  bottom: 20px;
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
  margin: 0;
}
</style>
