<template>
  <div
    class="lw-h-chart-splint"
    :class="{'isBorder':border}"
    :style="{'width':`${width}px`,'height':`${height}px`}"
  >
    <highcharts
      :options="chartOptions"
      v-if="chartLoader"
      :style="{'width':`${width}px`,'height':`${height}px`}"
    ></highcharts>
  </div>
</template>

<script>
import UtilsService from "../../../_service/utils.service";
export default {
  name: "LwhChartSplintComponent",
  props: ["list", "title", "width", "height", "border"],
  data() {
    return {
      chartOptions: {},
      chartLoader: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let self = this;
      UtilsService.GetHighchartsLang().then(response => {
        this.chartOptions.title = {
          text: this.title
        };

        this.chartOptions.lang = response;

        this.chartOptions.chart = {
          type: "spline",
          marginRight: 10,
          events: {
            load: function() {
              let series = this.series[0],
                chart = this;
              self.activeLastPointToolip(chart);
              setInterval(function() {
                let x = new Date().getTime(), // 当前时间
                  y = Math.random(); // 随机值
                series.addPoint([x, y], true, true);
                self.activeLastPointToolip(chart);
              }, 1000);
            }
          }
        };

        this.chartOptions.xAxis = {
          type: "datetime",
          tickPixelInterval: 150
        };

        this.chartOptions.yAxis = {
          title: {
            text: null
          }
        };

        this.chartOptions.credits = {
          enabled: false
        };

        this.chartOptions.subtitle = {
          text: ""
        };

        this.chartOptions.plotOptions = {
          pie: {
            innerSize: 100,
            depth: 45
          }
        };

        this.chartOptions.tooltip = {
          formatter: function() {
            return (
              "<b>" +
              this.series.name +
              "</b><br/>" +
              //self.Highcharts.dateFormat("%Y-%m-%d %H:%M:%S", this.x) +
              "<br/>" +
              self.Highcharts.numberFormat(this.y, 2)
            );
          }
        };

        this.chartOptions.legend = {
          enabled: false
        };

        this.chartOptions.series = [
          {
            name: "最新发生",
            color: "#F45B5B",
            data: (function() {
              // 生成随机值
              var data = [],
                time = new Date().getTime(),
                i;
              for (i = -19; i <= 0; i += 1) {
                data.push({
                  x: time + i * 1000,
                  y: Math.random()
                });
              }
              return data;
            })()
          }
        ];
        this.chartLoader = true;
      });
    },
    activeLastPointToolip(chart) {
      let points = chart.series[0].points;
      chart.tooltip.refresh(points[points.length - 1]);
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-h-chart-splint {
  overflow: hidden;
  &.isBorder {
    outline: computer(1px) solid #ddd;
  }
  .highcharts-container {
    width: calc(100% - #{computer(2px)}) !important;
    height: calc(100% - #{computer(2px)}) !important;
  }
}
</style>