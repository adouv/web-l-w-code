<template>
  <div
    class="lw-h-chart-treemap"
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
  name: "LwhChartTreemapComponent",
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
      this.chartOptions.chart = {
        height: this.height + 5
      };
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

      this.chartOptions.series = [
        {
          type: "treemap",
          layoutAlgorithm: "stripes",
          alternateStartingDirection: true,
          levels: [
            {
              level: 1,
              layoutAlgorithm: "sliceAndDice",
              dataLabels: {
                enabled: true,
                align: "left",
                verticalAlign: "top",
                style: {
                  fontSize: "15px",
                  fontWeight: "bold"
                }
              }
            }
          ],
          data: [
            {
              id: "A",
              name: "缺课",
              color: "#EC2500"
            },
            {
              id: "B",
              name: "迟到",
              color: "#ECE100"
            },
            {
              id: "C",
              name: "早退",
              color: "#EC9800"
            },
            {
              id: "D",
              name: "早到",
              color: "#e88f70"
            },
            {
              id: "E",
              name: "在校",
              color: "#928ea8"
            },
            {
              id: "F",
              name: "代课",
              color: "#edc1a5"
            },
            {
              name: "欧阳尚昭",
              parent: "A",
              value: 5
            },
            {
              name: "李龙",
              parent: "A",
              value: 3
            },
            {
              name: "杜丽娟",
              parent: "A",
              value: 4
            },
            {
              name: "孙道平",
              parent: "B",
              value: 4
            },
            {
              name: "唐海迪",
              parent: "B",
              value: 10
            },
            {
              name: "刘巍",
              parent: "B",
              value: 1
            },
            {
              name: "许梦秋",
              parent: "C",
              value: 1
            },
            {
              name: "汪海龙",
              parent: "C",
              value: 3
            },
            {
              name: "马青青",
              parent: "C",
              value: 3
            },
            {
              name: "刘莹",
              parent: "D",
              value: 2
            },
            {
              name: "刘一潇",
              parent: "D",
              value: 2
            },
            {
              name: "杜梦",
              parent: "D",
              value: 2
            },
            {
              name: "欧阳尚昭",
              parent: "E",
              value: 5
            },
            {
              name: "李龙",
              parent: "E",
              value: 3
            },
            {
              name: "杜丽娟",
              parent: "E",
              value: 4
            },
            {
              name: "李阳",
              parent: "F",
              value: 5
            },
            {
              name: "张子竹",
              parent: "F",
              value: 3
            },
            {
              name: "吴雨晴",
              parent: "F",
              value: 4
            },
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
.lw-h-chart-treemap {
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