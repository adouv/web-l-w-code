<template>
  <div class="pn-bar">
    <p class="pn-top-title">
      <span>认知指数：</span>
      <span>值越大表示掌握程度越确定，值越小表示认知掌握越不确定。对于数值极大或是极小的试题或知识点应该引起关注。</span>
    </p>
    <div class="select">
      <lw-all-report-select @changeType="showBottomTitle"></lw-all-report-select>
    </div>
    <div id="PN" :style="{width: '100%', minWidth: '1220px'}" ref="pnBar"></div>
    <p class="knowledge-tip" v-if="knowledgeDemotion.type == 0">{{knowledgeDemotion.description}}</p>
    <p class="pn-bottom-title">
      <span v-show="type == 0">这套题各题的全班学生的平均认知指数值和对比规律</span>
      <span v-show="type == 1">这套题知识点的全班学生的平均认知指数值和对比规律</span>
    </p>
    <em class="upper upper-left"></em>
    <em class="upper upper-right"></em>
    <em class="upper bottom-left"></em>
    <em class="upper bottom-right"></em>
  </div>
</template>
<script>
import lw from "../../_services/c.service.js";
export default {
  name: "positiveAndNegativeBarComponent",
  data() {
    return {
      data: "",
      pnChart: "",
      type: 0,
      knowledgeDemotion: {
        type: "",
        description: ""
      }
    };
  },
  mounted() {
    this.pnChart = this.$echarts.init(document.getElementById("PN"));
    // this.data = {
    //   cognitiveIndex: [-7, 9, -2, 5, -3, -4, 6, 8, -5, 8],
    //   nameList: [
    //     "第十题",
    //     "第九题",
    //     "八题",
    //     "第七题",
    //     "第六题",
    //     "第五题",
    //     "第四题",
    //     "第三题",
    //     "第二题",
    //     "第一题"
    //   ]
    // };
    lw.getPnBarOrigins(this.type).then(res => {
      this.data = res;
      this.autoChartHeight();
      this.getPNBar(this.data);
    });
  },
  methods: {
    getPNBar(data) {
      const sers = this.arrangeSerses(data);
      const x = data.nameList;
      var labelRight = {
        normal: {
          position: "right"
        }
      };
      var labelleft = {
        normal: {
          position: "left"
        }
      };
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "none" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          x: 40,
          y: 90,
          x2: 40,
          y2: 50
        },
        xAxis: {
          type: "value",
          position: "top",
          offset: 20,
          max: 10,
          min: -10,
          splitNumber: 20,
          boundaryGap: true,
          splitLine: { show: false },
          axisTick: { show: false },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#226cfb"
            }
          },
          axisLabel: {
            show: true,
            formatter: function(val) {
              var str = "";
              if (val == -10) {
                str = val;
              } else if (val == -6) {
                str = val;
              } else if (val == -3) {
                str = val;
              } else if (val == 0) {
                str = val;
              } else if (val == 3) {
                str = val;
              } else if (val == 5) {
                str = val;
              } else if (val == 8) {
                str = val;
              } else if (val == 10) {
                str = val;
              }
              return str;
            },
            textStyle: {
              color: "#226cfb",
              fontSize: 16
            }
          }
        },
        yAxis: {
          type: "category",
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          data: x
        },
        series: [
          {
            name: "认知指数",
            type: "bar",
            barCategoryGap: "5",
            barMaxWidth: "45",
            stack: "总量",
            label: {
              normal: {
                show: true,
                formatter: "{b}",
                color: "#226cfb",
                fontSize: 20
              }
            },
            itemStyle: {
              color: "#226cfb",
              barBorderRadius: 6
            },
            data: sers
          }
        ]
      };
      this.pnChart.setOption(option);
    },
    showBottomTitle(val) {
      this.type = Number(val);
      this.pnChart.clear();
      if (val == 0) {
        // 试题纬度
        lw.getPnBarOrigins(this.type).then(res => {
          this.data = res;
          this.autoChartHeight();
          this.knowledgeDemotion = {
            type: "",
            description: ""
          };
          this.getPNBar(this.data);
        });
      } else if (val == 1) {
        // 知识点纬度
        lw.getPnBarOrigins(this.type).then(res => {
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
              this.getPNBar(this.data);
            });
          } 
          if(!this.data.knowledgesInfo){
            this.autoChartHeight();
            this.getPNBar(this.data);
          }
        });
      }
    },
    autoChartHeight() {
      // getDom() 获取 ECharts 实例容器的 dom 节点
      // let chartName = this.$echarts.init(document.getElementById("myChart1"));
      this.autoHeight = this.data.nameList.length * 50 + 140; // counst.length为柱状图的条数，即数据长度。35为我给每个柱状图的高度，50为柱状图x轴内容的高度(大概的)。
      if (this.$refs.pnBar) {
        this.$refs.pnBar.style.height = this.autoHeight + "px";
        this.$refs.pnBar.childNodes[0].style.height = this.autoHeight + "px";
        this.pnChart.resize();
      }
    },
    arrangeSerses(data) {
      var labelRight = {
        normal: {
          position: "right"
        }
      };
      var labelleft = {
        normal: {
          position: "left"
        }
      };
      let sers = [];
      sers = data.cognitiveIndex.map(ele => {
        return {
          value: ele,
          label: ele >= 0 ? labelleft : labelRight
        };
      });
      return sers;
    }
  }
};
</script>

<style lang="scss" scoped>
.pn-bar {
  width: 100%;
  height: 100%;
  position: relative;
  .pn-top-title {
    margin: 0;
    padding: 20px;
    span {
      color: #226cfb;
    }
    span:nth-child(1) {
      font-size: 20px;
    }
    span:nth-child(2) {
      font-size: 18px;
    }
  }
  .select {
    width: 100%;
    position: absolute;
    top: 50px;
    z-index: 1000;
  }
  .knowledge-tip {
    font-size: 28px;
    color: rgb(34, 108, 251);
    position: absolute;
    top: 50%;
    left: calc(50% - 192px);
  }
  .pn-bottom-title {
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
