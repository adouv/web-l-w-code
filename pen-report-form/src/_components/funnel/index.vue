<template>
  <div class="funnel">
    <div class="funnel-top-title">认知漏斗</div>
    <div id="container" style="width: 600px;position:relative;margin-top:5px" ref="chart"></div>
    <p class="funnel-line"></p>
    <p class="funnel-bottom-title ong-bg" v-if="!radio && radio != 0">这道题全班的认知分段筛选</p>
    <p class="funnel-bottom-title" v-if="radio == 0 || radio == 1">这套题全班的认知分段筛选</p>
    <em class="upper upper-left"></em>
    <em class="upper upper-right"></em>
    <em class="upper bottom-left"></em>
    <em class="upper bottom-right"></em>
  </div>
</template>

<script>
import lw from "../../_services/c.service.js";
import Bus from "../../_services/funnelTableBus.service.js";
import Highcharts from "highcharts/highcharts";
import exporting from "highcharts/modules/exporting";
import funnel from "highcharts/modules/funnel";
exporting(Highcharts);
funnel(Highcharts);
export default {
  name: "funnel",
  props: ["funnelFigure", "radio", "reportType"],
  data() {
    return {
      data: "",
      options: {},
      id: "chart"
    };
  },

  mounted() {
    // this.data = {
    //   perfectProportion: 0.5,
    //   greatProportion: 0.1,
    //   goodProportion: 0.26,
    //   badProportion: 0,
    //   worseProportion: 0.14
    // };

    lw.getFunnelOrigins(this.reportType, this.radio).then(res => {
      this.data = res;
      this.getChart(this.data);
    });
  },
  watch: {
    radio(newName, oldName) {
      lw.getFunnelOrigins(this.reportType, newName).then(res => {
        this.data = res;
        this.getChart(this.data);
      });
    }
  },
  methods: {
    getChart(data) {
      var self = this;
      var seriesData = [
        ["完全不会", 10 + data.worseProportion * 100],
        ["一知半解", 10 + data.badProportion * 100],
        ["基本理解", 10 + data.goodProportion * 100],
        ["熟练掌握", 10 + data.greatProportion * 100],
        ["精通掌握", 10 + data.perfectProportion * 100]
      ];
      var option = {
        chart: {
          type: "pyramid",
          marginRight: 100,
          // marginTop: 40,
          backgroundColor: "rgba(0, 0, 0, 0)",
          width: 700,
          height: 290
        },
        title: {
          text: "",
          x: -50
        },
        colors: ["#eb6877", "#f8b551", "#f6eb53", "#80c269", "#13b5b1"],
        tooltip: {
          formatter: function() {
            var s = "<b>" + this.key + "</b>" + `${this.y - 10}` + "%";
            return s;
          },
          shared: true
        },
        plotOptions: {
          series: {
            reversed: false,
            cursor: "pointer",
            events: {
              click: function(e, $evt) {
                e.cancelBubble ? (e.cancelBubble = true) : e.stopPropagation();
                // if (self.reportType == 1) {   // 1 单道题   0 多道题
                  self.$emit("funnelRank", e.point);
                  Bus.$emit("type", 
                  {
                    status: self.reportType,
                    type: e.point.colorIndex.toString(),
                    change: self.radio || 3,
                  });
                // }
              }
            },
            dataLabels: {
              enabled: true,
              format: "<b style='color: {point.color};'>{point.name}</b>",
              softConnector: true,
              connectorColor: "rgba(0,0,0,0)",
              distance: 0,
              style: {
                fontWeight: "normal",
                fontSize: "14px",
                textStrokeColor: "none",
                textStrokeWidth: "0"
              }
            }
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false //用来设置是否显示‘打印’,'导出'等
        },
        series: [
          {
            name: "学生",
            data: seriesData
          }
        ]
      };
      let chart = Highcharts.chart("container", option);
      // 取消字体的画布上的stoker
      const fontStroke = document.getElementsByClassName(
        "highcharts-text-outline"
      );
      for (let i = 0; i < fontStroke.length; i++) {
        fontStroke[i].style.fill = "none";
        fontStroke[i].style.stroke = "none";
      }
    }
  }
};
</script>
<style scoped>
.funnel {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* height: 422px;
  width: 1000px; */
  width: 100%;
  height: 100%;
  min-width: 610px;
}
.funnel-top-title {
  position: absolute;
  top: 15px;
  left: 15px;
  width: 82px;
  height: 20px;
  font-family: MicrosoftYaHei;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 40px;
  letter-spacing: 0px;
  color: #226cfb;
}
.funnel-line {
  width: 18px;
  height: 18px;
  background: #001a4c;
  position: absolute;
  z-index: 10;
  bottom: 52px;
  left: calc(50% - 4px);
}
.funnel-line::after {
  content: "";
  width: 15px;
  height: 3px;
  margin-left: 2px;
  background: #13b5b1;
  margin-top: 8px;
  float: left;
}
.funnel-bottom-title {
  width: calc(100% - 20%);
  height: 19px;
  margin: 0 20px;
  height: 65px;
  line-height: 108px;
  text-align: center;
  font-family: MicrosoftYaHei;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #ffffff;
  position: absolute;
  bottom: 20px;
}
.one-bg {
  background: url("../../assets/images/bg-title.png") no-repeat center center;
}
</style>