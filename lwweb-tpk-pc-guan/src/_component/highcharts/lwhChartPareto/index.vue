<template>
  <div
    class="lw-h-chart-pareto"
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
export default {
  name: "LwhChartParetoComponent",
  props: ["data", "title", "width", "height", "border"],
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
      this.chartOptions.title = {
        text: this.title,
        style: {
          fontSize: "14px"
        }
      };

      this.chartOptions.credits = {
        enabled: false
      };

      this.chartOptions.exporting = {
        enabled: false
      };

      this.chartOptions.chart = {
        renderTo: "container",
        type: "column",
        height: this.height + 23
      };

      this.chartOptions.xAxis = {
        categories: ["早到", "迟到", "早退", "缺课", "代课", "换课", "不讲课", "在校", "不在校", "早来晚走", "晚来早走", "晚来且不讲课", "在校缺课", "在校代课", "不在校缺课", "不在校代课"],
        labels: {
          align: "center",
          rotation: 0
        }
      };

      this.chartOptions.yAxis = [
        {
          title: {
            text: ""
          }
        },
        {
          title: {
            text: ""
          },
          minPadding: 0,
          maxPadding: 0,
          max: 100,
          min: 0,
          opposite: true,
          labels: {
            format: "{value}%"
          }
        }
      ];

      this.chartOptions.series = [
        {
          type: "pareto",
          name: "累计比率",
          yAxis: 1,
          zIndex: 10,
          baseSeries: 1,
          tooltip: {
            pointFormat: "{series.name} {point.y:.2f} %"
          }
        },
        {
          name: "处理次数",
          type: "column",
          zIndex: 2,
          data: [352, 222, 151, 86, 72, 122, 36, 10,66, 22, 151, 86, 72, 51, 36, 10]
        }
      ];

      this.chartLoader = true;
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-h-chart-pareto {
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