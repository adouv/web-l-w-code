<template>
  <div class="questionInfo-content">
    <template v-if="params.type">
      <div class="content auto-scroll nodrag-area">
        <div class="question-title">[ 正确答案 ]</div>
        <div class="dynamic-html" v-html="params.answer"></div>
        <div class="question-title margin-top">[ 答案解析 ]</div>
        <div class="dynamic-html" v-html="params.analysis"></div>
      </div>
    </template>
    <template v-else>
      <div class="content auto-scroll" v-html="params.html"></div>
    </template>
  </div>
</template>

<script>
export default {
  name: "QuestionInfoModalComponent",
  props: {
    params: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
@import "../../assets/scss/index.scss";
.questionInfo-content {
  .content {
    height: computer(500px);
    background: #3b5253;
    color: #fff;
    font-size: 30px;
    span {
      color: #fff !important;
      font-size: 30px !important;
      font-family: "HiraginoSansGB-W3", "Microsoft YaHei", serif !important;
    }
    p {
      color: #fff !important;
      text-indent: initial !important;
      word-break: break-all;
      line-height: normal !important;
    }
    .dynamic-html p {
      color: #fff !important;
      text-indent: initial !important;
      word-break: break-all;
      line-height: normal !important;
      span,
      u > span {
        word-break: break-word;
      }

      span {
        color: #fff !important;
        font-size: 30px !important;
        font-family: "HiraginoSansGB-W3", "Microsoft YaHei", serif !important;
      }
    }
  }
  .auto-scroll {
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: #3b5253;
    }

    &::-webkit-scrollbar {
      width: 1px;
      height: 10px;
      background-color: #3b5253;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #3b5253;
    }
  }
}
</style>