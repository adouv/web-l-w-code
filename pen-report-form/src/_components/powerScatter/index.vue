<template>
  <div class="power-scatter">
    <div class="right-select select-component">
      <el-select v-model="demotion" placeholder="试题维度">
        <el-option v-for="item in exams" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div
      id="powerScatter"
      :style="{width: '100%', height: '713px' ,minHeight: '380px', minWidth: '1220px'}"
    ></div>
    <p class="knowledge-tip" v-if="knowledgeDemotion.type == 0">{{knowledgeDemotion.description}}</p>
    <p class="power-scatter-bottom-title">
      <span v-show="demotion == 0">这套题各题的自身难度水平和全班的平均认知答题水平的联合分布规律</span>
      <span v-show="demotion == 1">这套题知识点的自身难度水平和全班的平均认知答题水平的联合分布规律</span>
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
  name: "powerScatterComponent",
  data() {
    return {
      data: {},
      psChart: "",
      exams: [
        {
          value: 0,
          label: "试题维度"
        },
        {
          value: 1,
          label: "知识点维度"
        }
      ],
      demotion: 0,
      knowledgeDemotion: {
        type: "",
        description: ""
      }
    };
  },
  mounted() {
    this.psChart = this.$echarts.init(document.getElementById("powerScatter"));
    // this.data = {
    //   sure: [
    //     [0, 1, 1],
    //     // [1, 0.8, 0.8],
    //     [2, 10 , 10],
    //     // [4, 0.5, 0.5],
    //     [5, 10, 10],
    //     // [6, 0.8, 0.8],
    //     [7, 1, 1],
    //     // [8, 0.7, 0.7],
    //     [9, 9, 9]
    //   ],
    //   notSure: [
    //     [1, 2, 2],
    //     // [2, 0.1, 0.1],
    //     [3, 4, 4],
    //     [4, 4, 4],
    //     // [5, 0.3, 0.3],
    //     [6, 2, 2],
    //     // [7, 0.1, 0.1],
    //     [8, 3, 3]
    //     // [9, 0.3, 0.3]
    //   ],
    //   nameList: [
    //     1111111111,
    //     22222222222,
    //     3333333333,
    //     444444444,
    //     555555555,
    //     666666666,
    //     77777777,
    //     88888888,
    //     99999999,
    //   ]
    // };
    lw.getPScatterOrigins(this.demotion).then(res => {
      this.data = res;
      this.getPowerScatterChart(this.data);
    });
  },
  watch: {
    demotion(newName, oldName) {
      this.psChart.clear();
      if (newName == 0) {
        // 试题纬度
        lw.getPScatterOrigins(this.demotion).then(res => {
          this.data = res;
          this.knowledgeDemotion = {
            type: "",
            description: ""
          };
          this.getPowerScatterChart(this.data);
        });
      } else if (newName == 1) {
        // 知识点纬度
        lw.getPScatterOrigins(this.demotion).then(res => {
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
              this.getPowerScatterChart(this.data);
            });
          }
             if(!this.data.knowledgesInfo){
           this.getPowerScatterChart(this.data);
          }
        });
      }
    }
  },
  methods: {
    getPowerScatterChart(data) {
      const x = data.nameList;
      var xWordsLimit = this.showXWords(x);
      var xFormatter = true;
      if (xWordsLimit == 0) {
        xFormatter = false;
      }
      var showDataZoom = x.length > 12 ? true : false;
      const sers = this.arrangeSerise(this.data);
      console.log(sers);
      let option = {
        title: {
          top: 20,
          left: 20,
          text: "实力散点图",
          textStyle: {
            color: "#226cfb",
            fontWeight: "normal",
            fontSize: 20
          }
        },
        tooltip: {
          formatter: function(params) {
            return (
              params.seriesName +
              "（" +
              params.name +
              "）<br/>" +
              "难度系数:" +
              params.data[1] / 10 +
              "<br/>" +
              "认知掌握程度：" +
              params.data[2] / 10
            );
          }
        },
        grid: {
          y: 169,
          x: 120,
          x2: 45,
          y2: showDataZoom ? 125 : 90
        },
        dataZoom: {
          show: showDataZoom,
          start: 0,
          end: 100,
          bottom: 60,
          borderColor: "#226cfb",
          fillerColor: "rgba(0, 36, 106, 0.5)",
          borderColor: "#226cfb",
          textStyle: {
            color: "#226cfb"
          }
        },
        color: ["#80c269", "#eb6877"],
        legend: {
          y: 55,
          data: ["会", "不会"],
          itemWidth: 23,
          itemHeight: 23,
          itemGap: 40,
          textStyle: {
            color: "#ffffff",
            fontSize: 16
          }
        },
        dataRange: {
          max: 10,
          min: 0,
          orient: "horizontal",
          inverse: true,
          y: 100,
          x: "center",
          //text:['高','低'],           // 文本，默认为数值文本
          splitNumber: 5,
          itemWidth: 22,
          itemHeight: 22,
          itemGap: 25,
          color: ["#eb6877", "#f8b551", "#f6eb53", "#80c269", "#13b5b1"],
          splitList: [
            // {start: 10},
            {
              start: 8,
              end: 10,
              label: "精通掌握",
              color: "#13b5b1",
              symbolSize: 80
            },
            {
              start: 6,
              end: 8,
              label: "熟练掌握",
              color: "#80c269",
              symbolSize: 70
            },
            {
              start: 5,
              end: 6,
              label: "基本理解",
              color: "#f6eb53",
              symbolSize: 60
            },
            {
              start: 2,
              end: 5,
              label: "一知半解",
              color: "#f8b551",
              symbolSize: 50
            },
            {
              start: 0,
              end: 2,
              label: "完全不会",
              color: "#eb6877",
              symbolSize: 40
            }
            // {end: 0}
          ],
          textStyle: {
            color: "#ffffff",
            fontSize: 16
          }
        },

        xAxis: [
          {
            type: "category",
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
          }
        ],
        yAxis: [
          {
            type: "value",
            min: 0,
            max: 10,
            splitNumber: 10,
            name: "难度系数",
            nameTextStyle: {
              color: "#ffffff",
              fontSize: 18
            },
            axisLabel: {
              show: true,
              formatter: function(value, index) {
                var str = "";
                switch (value) {
                  case 0:
                    str = 0;
                    break;
                  case 5:
                    str = 0.5;
                    break;
                  case 10:
                    str = 1;
                    break;
                }
                return str;
              },
              textStyle: {
                color: "#226cfb",
                fontSize: "16"
              }
            },

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
            axisTick: {
              show: false
            }
          }
        ],
        animation: false,
        series: sers
      };
      this.psChart.setOption(option);
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
    arrangeSerise(series) {
      const name = ["会", "不会"];
      const enName = ["sure", "notSure"];
      let sers = [];
      sers = name.map((ele, index) => {
        return {
          name: ele,
          type: "scatter",
          tooltip: {
            trigger: "item"
          },

          symbolSize: index == 0 ? 35 : 20,

          data: series[enName[index]]
        };
      });
      return sers;
    }
  }
};
</script>

<style lang="scss" scoped>
.power-scatter {
  width: 100%;
  height: 100%;
  position: relative;
  .right-select {
    position: absolute;
    top: 60px;
    right: 40px;
    z-index: 1000;
    .el-select {
      width: 200px;
      height: 40px;
    }
  }
  .knowledge-tip {
    font-size: 28px;
    color: rgb(34, 108, 251);
    position: absolute;
    top: 50%;
    left: calc(50% - 192px);
  }
  .power-scatter-bottom-title {
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
