<template>
  <div class="lw-page-analysis-report">
    <div class="main">
      <div class="answer">
        <div class="answer-top">
          <div class="left">
            <span class="cos cos-top-left"></span>
            <span class="cos cos-top-right"></span>
            <span class="cos cos-bottom-left"></span>
            <span class="cos cos-bottom-right"></span>
          </div>
          <div class="right">
            <span class="cos cos-top-left"></span>
            <span class="cos cos-top-right"></span>
            <span class="cos cos-bottom-left"></span>
            <span class="cos cos-bottom-right"></span>
          </div>
        </div>
        <div class="answer-bottom">2</div>
      </div>
    </div>
    <div class="footer">
      <div class="tab-button" :class="type">
        <span @click="btnTabHandler()">该题答题结果统计</span>
        <span @click="btnTabHandler()"></span>
        <em @click="btnTabHandler()">该题认知结果统计</em>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LwPageSignQuestionResultComponent",
  data() {
    return {
      type: "answer" //cognitive
    };
  },
  methods: {
    btnTabHandler() {
      if (this.type === "answer") {
        this.type = "cognitive";
      } else {
        this.type = "answer";
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/index.scss";
.lw-page-analysis-report {
  position: relative;
  width: computer(1024px);
  height: computer(768px);
  margin: 0 auto;
  font-family: "微软雅黑";
  background: $color_main;

  .main {
    width: calc(100% - #{computer(80px)});
    height: computer(698px);
    margin: 0 auto;
    .answer {
      padding-top: computer(30px);
      .answer-top {
        width: 100%;
        display: flex;
        .left,
        .right {
          height: computer(300px);
          position: relative;
          box-shadow: #226cfb 0px 0px computer(20px) inset;
        }
        .left {
          width: computer(450px);
        }
        .right {
          width: computer(464px);
          margin-left: computer(30px);
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: computer(70px);
    line-height: computer(70px);
    position: absolute;
    bottom: 0px;
    z-index: 100;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    .tab-button {
      width: computer(751px);
      height: computer(70px);
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      position: relative;
      span:nth-child(1) {
        border-color: transparent transparent rgba(225, 225, 225, 0);
        border-style: none solid solid;
        border-width: 0 computer(70px) computer(70px);
        display: block;
        height: 0;
        left: computer(-10px);
        width: computer(375.5px);
        margin-top: computer(-3px);
        font-family: MicrosoftYaHei;
        font-size: computer(20px);
        line-height: computer(70px);
        text-align: center;
        letter-spacing: 0px;
        color: $color_bottom_btn_active;
        font-style: normal;
        cursor: pointer;
      }
      span:nth-child(2) {
        width: computer(401px);
        height: computer(68px);
        transform: skewX(45deg);
        font-family: MicrosoftYaHei;
        cursor: pointer;
      }
      em {
        width: computer(342px);
        height: computer(68px);
        position: absolute;
        font-style: normal;
        left: 51%;
        font-size: computer(20px);
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: computer(0px);
        line-height: computer(70px);
        cursor: pointer;
        text-align: center;
        color: $color_bottom_btn_active;
      }
      &.answer {
        background: url("../../assets/images/left-selected.png") no-repeat
          center center;
        span:nth-child(1) {
          color: #ffffff;
        }
      }
      &.cognitive {
        background: url("../../assets/images/right-selected.png") no-repeat
          center center;
        em {
          color: #ffffff;
        }
      }
    }
  }
}
</style>


