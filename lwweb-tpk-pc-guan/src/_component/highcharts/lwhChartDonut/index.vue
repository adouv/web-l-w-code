<template>
  <div
    class="lw-h-chart-donut"
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
  name: "LwhChartDonutComponent",
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
      UtilsService.GetHighchartsLang().then(response => {
        this.chartOptions.title = {
          text: this.title
        };

        this.chartOptions.lang = response;

        this.chartOptions.chart = {
          type: "pie",
          options3d: {
            enabled: true,
            alpha: 45
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
            size: "70%",
            innerSize: 100,
            depth: 45
          }
        };

        this.chartOptions.series = [
          {
            name: "Delivered amount",
            data: [
              ["早到", 8],
              ["迟到", 3],
              ["早退", 1],
              ["缺课", 3],
              ["代课", 2],
              ["换课", 4],
              ["不讲课", 4],
              ["不在校", 1],
              ["在校", 8],
              ["早来晚走", 3],
              ["晚来早走", 1],
              ["晚来且不讲课", 3],
              ["在校缺课", 3],
              ["在校代课", 2],
              ["不在校缺课", 3],
              ["不在校代课", 2]
            ]
          }
        ];
        this.chartLoader = true;
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-h-chart-donut {
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