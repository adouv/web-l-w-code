<template>
  <div class="multidimensional-bar">
    <div class="select">
      <lw-all-report-select @changeType="showBottomTitle"></lw-all-report-select>
    </div>
    <div id="multidimensionalBar" :style="{width: '100%', minWidth: '1220px'}" ref="multBar"></div>
    <p class="knowledge-tip" v-if="knowledgeDemotion.type == 0">{{knowledgeDemotion.description}}</p>
    <p class="multidimensional-bottom-title">
      <span v-show="type == 0">这套题各题的各认知阶段占比和横纵向分布对比</span>
      <span v-show="type == 1">这套题知识点的各认知阶段占比和横纵向分布对比</span>
    </p>
    <em class="upper upper-left"></em>
    <em class="upper upper-right"></em>
    <em class="upper bottom-left"></em>
    <em class="upper bottom-right"></em>
  </div>
</template>

<script>
import multiBar from "./model.js";
import lw from "../../_services/c.service.js";
export default {
  name: "MultidimensionalBarComponent",
  props: [],
  data() {
    return {
      data: "",
      mChart: "",
      type: 0,
      knowledgeDemotion: {
        type: "",
        description: ""
      }
    };
  },
  mounted() {
    this.mChart = this.$echarts.init(
      document.getElementById("multidimensionalBar")
    );
    // this.data = {
    //   prefectList: [
    //     0.2,
    //     0.27,
    //     0.33,
    //     0.2,
    //     0.08,
    //     0.5,
    //     0.2,
    //     0.27,
    //     0.33,
    //     0.2,
    //     0.08,
    //     0.5
    //   ],
    //   greatList: [
    //     0.43,
    //     0.35,
    //     0.23,
    //     0.28,
    //     0.55,
    //     0.13,
    //     0.43,
    //     0.35,
    //     0.23,
    //     0.28,
    //     0.55,
    //     0.13
    //   ],
    //   goodList: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   badList: [
    //     0.18,
    //     0.15,
    //     0.15,
    //     0.18,
    //     0.18,
    //     0.12,
    //     0.18,
    //     0.15,
    //     0.15,
    //     0.18,
    //     0.18,
    //     0.12
    //   ],
    //   worseList: [
    //     0.18,
    //     0.23,
    //     0.28,
    //     0.33,
    //     0.18,
    //     0.25,
    //     0.18,
    //     0.23,
    //     0.28,
    //     0.33,
    //     0.18,
    //     0.25
    //   ],
    //   nameList: [
    //     "第1题",
    //     "第2题",
    //     "第3题",
    //     "第4题",
    //     "第5题",
    //     "第6题",
    //     "第1题",
    //     "第2题",
    //     "第3题",
    //     "第4题",
    //     "第5题",
    //     "第6题"
    //   ],
    //   unablePrefectList: [
    //     0.8,
    //     0.73,
    //     0.67,
    //     0.8,
    //     0.92,
    //     0.5,
    //     0.8,
    //     0.73,
    //     0.67,
    //     0.8,
    //     0.92,
    //     0.5
    //   ],
    //   unableGreatList: [
    //     0.57,
    //     0.65,
    //     0.77,
    //     0.72,
    //     0.45,
    //     0.87,
    //     0.57,
    //     0.65,
    //     0.77,
    //     0.72,
    //     0.45,
    //     0.87
    //   ],
    //   unableGoodList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    //   unableBadList: [
    //     0.82,
    //     0.85,
    //     0.85,
    //     0.82,
    //     0.82,
    //     0.88,
    //     0.82,
    //     0.85,
    //     0.85,
    //     0.82,
    //     0.82,
    //     0.88
    //   ],
    //   unableWorseList: [
    //     0.82,
    //     0.77,
    //     0.72,
    //     0.67,
    //     0.82,
    //     0.75,
    //     0.82,
    //     0.77,
    //     0.72,
    //     0.67,
    //     0.82,
    //     0.75
    //   ]
    // };
    lw.getMultiBarOrigin(this.type).then(res => {
      this.data = res;
      this.autoChartHeight();
      this.getMultidimensionalBar(this.data);
    });

    // this.data = this.multidimensional;
  },
  methods: {
    getMultidimensionalBar(data) {
      const sers = this.arrangeSeries(data);
      let options = {
        title: {
          top: 20,
          left: 20,
          text: "复合柱形图",
          textStyle: {
            color: "#226cfb",
            fontWeight: "normal",
            fontSize: 20
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            var str =
              params[0].name +
              "<br/>" +
              params[0].seriesName +
              ":" +
              (params[0].value * 100).toFixed(2) +
              "%<br/>" +
              params[2].seriesName +
              ":" +
              (params[2].value * 100).toFixed(2) +
              "%<br/>" +
              params[4].seriesName +
              ":" +
              (params[4].value * 100).toFixed(2) +
              "%<br/>" +
              params[6].seriesName +
              ":" +
              (params[6].value * 100).toFixed(2) +
              "%<br/>" +
              params[8].seriesName +
              ":" +
              (params[8].value * 100).toFixed(2) +
              "%<br/>";
            return str;
          }
        },
        color: multiBar.multiBarColor,
        legend: {
          y: 140,
          // itemGap : document.getElementById('main').offsetWidth / 8,
          itemWidth: 22,
          itemHeight: 22,
          itemGap: 30,
          data: multiBar.multiBarChineseNames,
          textStyle: {
            color: "#ffffff",
            fontSize: 16
          }
        },
        grid: {
          y: 179,
          x: 120,
          x2: 45,
          y2: 55
        },
        xAxis: [
          {
            type: "value",
            position: "top",
            splitLine: { show: false },
            axisLabel: { show: false },
            axisLine: {
              lineStyle: {
                color: "#226cfb"
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "category",
            inverse: true,
            boundaryGap: true,
            splitLine: { show: false },
            data: data.nameList,
            axisLine: {
              lineStyle: {
                color: "#226cfb"
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: function(value, index) {
                let str = "";
                if (value.length > 4) {
                  str = value.substring(0, 3) + "...";
                } else {
                  str = value;
                }
                return str;
              },
              textStyle: {
                color: "#226cfb",
                fontSize: 20
              }
            },
            axisTick: {
              show: true
              // alignWithLabel: true
            }
          }
        ],
        series: sers
      };
      this.mChart.setOption(options);
    },
    showBottomTitle(val) {
      this.type = Number(val);
      this.mChart.clear();
      if (val == 0) {
        // 试题纬度
        lw.getMultiBarOrigin(this.type).then(res => {
          this.data = res;
          this.autoChartHeight();
          this.knowledgeDemotion = {
            type: "",
            description: ""
          };
          this.getMultidimensionalBar(this.data);
        });
      } else if (val == 1) {
        // 知识点纬度
        lw.getMultiBarOrigin(this.type).then(res => {
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
              this.autoChartHeight();
              this.getMultidimensionalBar(this.data);
            });
          } 
           if(!this.data.knowledgesInfo){
              this.autoChartHeight();
            this.getMultidimensionalBar(this.data);
          }
        });
      }
    },
    autoChartHeight() {
      // getDom() 获取 ECharts 实例容器的 dom 节点
      // let chartName = this.$echarts.init(document.getElementById("myChart1"));
      this.autoHeight = this.data.nameList.length * 90 + 235; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
      if (this.$refs.multBar) {
        this.$refs.multBar.style.height = this.autoHeight + "px";
        this.$refs.multBar.childNodes[0].style.height = this.autoHeight + "px";
        this.mChart.resize();
      }
    },
    arrangeSeries(series) {
      let sers = [];
      var placeHoledStyle = {
        normal: {
          barBorderRadius: 6,
          barBorderColor: "rgba(0,0,0,0)",
          color: "rgba(0,0,0,0)"
        },
        emphasis: {
          barBorderColor: "rgba(0,0,0,0)",
          color: "rgba(0,0,0,0)"
        }
      };
      var dataStyle = {
        normal: {
          barBorderRadius: 6,
          label: {
            show: true,
            position: "insideLeft",
            formatter: function(val) {
              return parseInt(val.value * 100) + "%";
            },
            fontSize: 20
          }
        }
      };
      sers = multiBar.multiBarDoubbleChineseNames.map((ele, index) => {
        return {
          name: ele,
          type: "bar",
          barWidth: 70,
          barMaxWidth: 70,
          barCategoryGap: 10,
          stack: "总量",
          itemStyle: (index + 1) % 2 != 0 ? dataStyle : placeHoledStyle,
          data: series[multiBar.multiBarDoubbleEnglishNames[index]]
        };
      });
      return sers;
    }
  }
};
</script>

<style lang="scss" scoped>
.multidimensional-bar {
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
    top: 50%;
    left: calc(50% - 192px);
  }
  .multidimensional-bottom-title {
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
}
</style>
