<template>
  <div class="lw-e-chart-inside" :style="{'width':`${width}px`,'height':`${height}px`}">
    <div id="myInside" :style="{'width':`${width}px`,'height':`${height}px`}"></div>
  </div>
</template>

<script>
import UtilsService from "../../../_service/utils.service";
export default {
  name: "LweChartInsideComponent",
  props: ["title", "width", "height"],
  data() {
    return {};
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      let myChart = this.echarts$.init(document.getElementById("myInside"));
      UtilsService.GetInside().then(data => {
        let options = {};

        options.title = {
          text: this.title,
          top: 10,
          left: "center",
          textStyle: {
            fontWeight: "normal"
          }
        };

        options.grid = {
          left: 55,
          bottom: 60,
          height: 300
        };

        options.tooltip = {
          trigger: "axis"
        };

        options.xAxis = {
          data: data.map(function(item) {
            return item[0];
          })
        };

        options.yAxis = {
          name: "异常总量(单位:次)",
          splitLine: {
            show: true
          }
        };

        options.toolbox = {
          show: false
        };

        options.dataZoom = [
          {
            startValue: "2014-06-01",
            bottom: 1,
            height: 23
          },
          {
            type: "inside"
          }
        ];

        options.visualMap = {
          showLabel: true,
          itemWidth: 16,
          itemHeight: 13,
          top: 50,
          right: 60,
          orient: "horizontal",
          padding: 0,
          align: "right",
          textGap: 3,
          itemGap: 5,
          pieces: [
            {
              gt: 0,
              lte: 50,
              color: "#096"
            },
            {
              gt: 50,
              lte: 100,
              color: "#ffde33"
            },
            {
              gt: 100,
              lte: 150,
              color: "#ff9933"
            },
            {
              gt: 150,
              lte: 200,
              color: "#cc0033"
            },
            {
              gt: 200,
              lte: 300,
              color: "#660099"
            },
            {
              gt: 300,
              color: "#7e0023"
            }
          ],
          textStyle: {
            color: "#333",
            height: 13,
            lineHeight: 13
          },
          outOfRange: {
            color: "#999"
          }
        };

        options.series = {
          name: "异常总量",
          type: "line",
          data: data.map(function(item) {
            return item[1];
          }),
          markLine: {
            silent: true
          }
        };

        myChart.setOption(options);
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-e-chart-inside {
  outline: computer(1px) solid #ddd;
}
</style>
