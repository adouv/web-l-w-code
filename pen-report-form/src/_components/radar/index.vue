<template>
  <div class="radar">
    <p class="radar-top-title">
      <span>策略雷达：</span>
      <span>得分率和认知度趋势若出现高度不符的试题或是知识点，说明该试题或知识点涉及的试题题目本身的设计可能有缺陷。</span>
    </p>
    <div class="right-select select-component">
      <el-select v-model="demotion" placeholder="试题维度">
        <el-option v-for="item in exams" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div id="radar" style="width: 100%; height: 640px;minHeight: 500px; minWidth: 1220px"></div>
    <p class="knowledge-tip" v-if="knowledgeDemotion.type == 0">{{knowledgeDemotion.description}}</p>
    <p class="radar-bottom-title">
      <span v-show="demotion == 0">这套题各题的全班平均得分和认知掌握程度结构分布和对比</span>
      <span v-show="demotion == 1">这套题知识点的全班平均得分和认知掌握程度结构分布和对比</span>
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
  name: "radarComponent",
  data() {
    return {
      data: {},
      rChart: "",
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
    this.rChart = this.$echarts.init(document.getElementById("radar"));
    // this.data = {
    //   // nameDic: [
    //   //   { name: "图形", max: 6500 },
    //   //   { name: "技巧", max: 16000 },
    //   //   { name: "逻辑", max: 30000 },
    //   //   { name: "推理", max: 38000 },
    //   //   { name: "计算", max: 52000 },
    //   //   { name: "分析", max: 25000 }
    //   // ],
    //   name: ["图形", "技巧", "逻辑", "推理", "计算", "分析"],
    //   totalScore: [6500, 16000, 30000, 38000, 52000, 25000],
    //   awareness: [5000, 14000, 28000, 31000, 42000, 21000],
    //   scoringAverage: [4300, 10000, 28000, 35000, 50000, 19000]
    // };
    lw.getRadarOrigins(this.demotion).then(res => {
      this.data = res;
      if (this.data.name.length >= 3) {
        this.getRadarChart(this.data);
      }
    });
  },
  watch: {
    demotion(newName, oldName) {
      this.rChart.clear();
      if (this.demotion == 0) {
        // 试题纬度
        lw.getRadarOrigins(this.demotion).then(res => {
          this.data = res;
          this.knowledgeDemotion = {
            type: "",
            description: ""
          };
          if (this.data.name.length >= 3) {
            this.getRadarChart(this.data);
          }
        });
      } else if (this.demotion == 1) {
        // 知识点纬度
        lw.getRadarOrigins(this.demotion).then(res => {
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
              if (this.data.name.length >= 3) {
                this.getRadarChart(this.data);
              }
            });
          }
          if (!this.data.knowledgesInfo) {
            if (this.data.name.length >= 3) {
              this.getRadarChart(this.data);
            }
          }
        });
      }
    }
  },
  methods: {
    getRadarChart(data) {
      const indicator = this.arrangeIndicator(data);
      let option = {
        color: ["#80c269", "#f8b551"],
        legend: {
          top: "0",
          icon: "circle",
          itemWidth: 23,
          itemHeight: 23,
          itemGap: 40,
          data: ["得分率", "认知度"],
          textStyle: {
            color: "#ffffff",
            fontSize: 16
          }
        },
        tooltip: {},
        grid: {
          y2: 95
        },
        radar: [
          {
            // shape: 'circle',
            name: {
              textStyle: {
                color: "#226cfb",
                fontSize: 16
              }
            },
            indicator: indicator,
            center: ["50%", "50%"],
            radius: 235,
            splitLine: {
              //分隔线
              show: true,
              lineStyle: {
                color: "#ffffff",
                width: 2
              }
            },
            splitArea: {
              //分割区域
              show: false
            },
            axisLine: {
              //雷达线
              show: true,
              lineStyle: {
                color: "#ffffff",
                width: 2
              }
            }
          }
        ],

        series: [
          {
            name: "策略雷达",
            type: "radar",
            symbol: "circle", // 拐点的样式，还可以取值'rect','angle'等
            symbolSize: 10, // 拐点的大小
            areaStyle: { normal: {} },
            data: [
              {
                value: data.scoringAverage,
                name: "得分率"
              },
              {
                value: data.awareness,
                name: "认知度"
              }
            ]
          }
        ]
      };
      this.rChart.setOption(option);
    },
    arrangeIndicator(series) {
      const title = series.name;
      const fullScore = series.totalScore;
      let sers = [];
      sers = title.map((ele, index) => {
        return {
          name: ele,
          max: fullScore[index]
        };
      });
      console.log(sers);
      return sers;
    }
  }
};
</script>

<style lang="scss" scoped>
.radar {
  width: 100%;
  height: 100%;
  position: relative;
  .radar-top-title {
    margin: 0;
    padding: 20px 20px 10px;
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
  .right-select {
    position: absolute;
    top: 50px;
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
  .radar-bottom-title {
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
