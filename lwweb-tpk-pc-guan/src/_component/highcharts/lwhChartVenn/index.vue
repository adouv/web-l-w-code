<template>
  <div
    class="lw-h-chart-venn"
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
  name: "LwhChartVennComponent",
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
        text: this.title
      };

      this.chartOptions.credits = {
        enabled: false
      };

      this.chartOptions.exporting = {
        enabled: false
      };

      this.chartOptions.series = [
        {
          type: "venn",
          name: "在岗状态智能监测",
          data: [
            {
              sets: ["迟到"],
              value: 2
            },
            {
              sets: ["不讲课"],
              value: 2
            },
            {
              sets: ["早到"],
              value: 2
            },
            {
              sets: ["未早到"],
              value: 2
            },
            {
              sets: ["缺课"],
              value: 2
            },
            {
              sets: ["早退"],
              value: 2
            },
            {
              sets: ["换课"],
              value: 2
            },
            {
              sets: ["代课"],
              value: 2
            },
            
            {
              sets: ["不在校"],
              value: 2
            },
            {
              sets: ["在校"],
              value: 2
            },
            {
              sets: ["迟到", "早退"],
              value: 1,
              name: "晚来早走"
            },
            {
              sets: ["迟到", "不讲课"],
              value: 1,
              name: "晚来且不讲课"
            },
            {
              sets: ["在校", "缺课"],
              value: 1,
              name: "在校缺课"
            },
            {
              sets: ["不在校", "代课"],
              value: 1,
              name: "不在校代课"
            }
          ]
        }
      ];

      this.chartLoader = true;
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-h-chart-venn {
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