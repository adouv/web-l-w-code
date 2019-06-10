<template>
  <div class="lw-e-chart-bubble" :style="{'width':`${width}px`,'height':`${height}px`}">
    <div id="myBubble" :style="{'width':`${width}px`,'height':`${height}px`}"></div>
  </div>
</template>

<script>
import UtilsService from "../../../_service/utils.service";
export default {
  name: "LweChartBubbleComponent",
  props: ["title", "width", "height"],
  data() {
    return {};
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      let myChart = this.echarts$.init(document.getElementById("myBubble"));

      myChart.showLoading();

      UtilsService.GetBubble().then(data => {
        myChart.hideLoading();

        let option = {
          baseOption: {},
          options: []
        };

        let itemStyle = {
          normal: {
            opacity: 0.8,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        };

        let sizeFunction = function(x) {
          let y = Math.sqrt(x / 5e8) + 0.1;
          return y * 80;
        };

        let schema = [
          { name: "Income", index: 0, text: "较重", unit: "次" },
          { name: "LifeExpectancy", index: 1, text: "严重", unit: "次" },
          { name: "Population", index: 2, text: "一般", unit: "次" },
          { name: "Country", index: 3, text: "类型", unit: "" }
        ];

        option.baseOption.title = [
          // {
          //   text: data.timeline[0],
          //   textAlign: "center",
          //   left: "63%",
          //   top: "55%",
          //   textStyle: {
          //     fontSize: 48,
          //     color: "rgba(0, 0, 0, 0.8)"
          //   }
          // },
          {
            text: this.title,
            left: "center",
            top: 10,
            textStyle: {
              //color: "#aaa",
              fontWeight: "normal",
              fontSize: 20
            }
          }
        ];

        option.baseOption.tooltip = {
          padding: 5,
          backgroundColor: "#222",
          borderColor: "#777",
          borderWidth: 1,
          formatter: function(obj) {
            var value = obj.value;
            return (
              schema[3].text +
              "：" +
              value[3] +
              "<br>" +
              schema[1].text +
              "：" +
              value[1] +
              schema[1].unit +
              "<br>" +
              schema[0].text +
              "：" +
              value[0] +
              schema[0].unit +
              "<br>" +
              schema[2].text +
              "：" +
              value[2] +
              "<br>"
            );
          }
        };

        option.baseOption.grid = {
          top: 100,
          containLabel: true,
          left: 45,
          right: 110,
          height: 300
        };

        option.baseOption.xAxis = {
          type: "log",
          max: 180,
          min: 1,
          //nameGap: 45,
          nameLocation: "middle",
          nameTextStyle: {
            fontSize: 18
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              //color: "#ccc"
            }
          },
          axisLabel: {
            formatter: "{value}"
          }
        };

        option.baseOption.yAxis = {
          type: "value",
          name: "未处理反馈总量(单位:条）",
          max: 100,
          min:0,
          nameTextStyle: {
            //color: "#ccc",
            //fontSize: 18
          },
          axisLine: {
            lineStyle: {
              //color: "#ccc"
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: "{value} "
          }
        };

        option.baseOption.timeline = {
          axisType: "category",
          orient: "vertical",
          autoPlay: false,
          inverse: true,
          playInterval: 1000,
          left: null,
          right: 0,
          top: 20,
          bottom: 20,
          width: 90,
          height: null,
          label: {
            normal: {
              textStyle: {
                //color: "#999"
              }
            },
            emphasis: {
              textStyle: {
                //color: "#fff"
              }
            }
          },
          symbol: "none",
          lineStyle: {
            color: "#555"
          },
          checkpointStyle: {
            //color: "#bbb",
            //borderColor: "#777",
            borderWidth: 2
          },
          controlStyle: {
            showNextBtn: false,
            showPrevBtn: false,
            normal: {
              //color: "#666",
              //borderColor: "#666"
            },
            emphasis: {
              //color: "#aaa",
              //borderColor: "#aaa"
            }
          },
          data: data.timeline
        };

        option.baseOption.visualMap = [
          {
            show: false,
            dimension: 3,
            categories: data.counties,
            calculable: true,
            precision: 0.1,
            textGap: 30,
            textStyle: {
              color: "#ccc"
            },
            inRange: {
              color: (function() {
                var colors = [
                  "#bcd3bb",
                  "#e88f70",
                  "#edc1a5",
                  "#9dc5c8",
                  "#e1e8c8",
                  "#7b7c68",
                  "#e5b5b5",
                  "#f0b489",
                  "#928ea8",
                  "#bda29a"
                ];
                return colors.concat(colors);
              })()
            }
          }
        ];

        option.baseOption.series = [
          {
            type: "scatter",
            itemStyle: itemStyle,
            data: data.series[0],
            symbolSize: function(val) {
              return sizeFunction(val[2]);
            }
          }
        ];

        option.baseOption.animationDurationUpdate = 1000;

        option.baseOption.animationEasingUpdate = "quinticInOut";

        let n = 0;
        data.timeline.forEach(element => {
          let args = {};
          args.title = {
            show: true,
            text: element.toString()
          };
          args.series = {
            name: element,
            type: "scatter",
            itemStyle: itemStyle,
            data: data.series[n],
            symbolSize: function(val) {
              return 40;
            }
          };
          option.options.push(args);
          n++;
        });

        myChart.setOption(option);
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-e-chart-bubble {
  outline: computer(1px) solid #ddd;
}
</style>
