<template>
  <div class="jude-content">
    <div class="list" flex="dir:top;main:center;cross:center">
      <label>模式选择：</label>
      <a-radio-group v-model="params.pattern">
        <a-radio :value="0">赋分模式</a-radio>
        <a-radio :value="1">对错模式</a-radio>
      </a-radio-group>
    </div>
    <div class="list" flex="dir:top;main:center;cross:center;" v-if="params.pattern == 0">
      <label>满分设置：</label>
      <a-input-number :min="1" :max="50"  v-model="params.maxScore"  @change="checkNo(params.maxScore)"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "JudgeModalComponent",
  props: {
    params: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.params.maxScore = this.params.maxScore ? this.params.maxScore : 10;
  },
  methods: {
    checkNo(e) {
      let reg = /^[^0-9.]$/;
      console.log(new RegExp(reg).test(e));
      if (e) {
        if (new RegExp(reg).test(e) != false) {
          this.params.maxScore = '';
        }
      }
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/scss/index.scss";
.jude-content {
  color: #333333;
  .margin-right-20px {
    margin-right: computer(20px);
  }
  p {
    font-size: computer(20px);
  }
  .list {
    margin-bottom: 10px;
    color: #333333;
    line-height: 30px;
    input {
      width: computer(99px);
      height: computer(30px);
    }
  }
  .ant-radio-checked .ant-radio-inner {
    border-color: #ff7d55;
  }
  .ant-radio-inner:after {
    background-color: #ff7d55;
  }
  .ant-radio-wrapper-checked {
    span {
      color: #ff7d55;
    }
  }

  .ant-radio-button-wrapper:hover,
  .ant-radio-button-wrapper-focused {
    color: #ff7d55;
  }
}
</style>