<template>
  <div class="exercise-wrap">
    <div class="exercise-wrap-title">
      <span>练习卷</span>
      <span>×</span>
    </div>
    <div class="exercise-wrap-body">
      <el-tabs v-model="currentTab" type="card" @tab-click="handleClick">
        <el-tab-pane label="已有练习卷" name="first">已有练习卷</el-tab-pane>
        <el-tab-pane label="Word导入" name="second">Word导入</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "exercise",
  data() {
    return {
      currentTab: "first"
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/coverEle.scss";
.exercise-wrap {
  width: 1000px;
  height: 600px;
  box-sizing: border-box;
  border: 1px solid red;
  position: relative;
  &-title {
    width: 100%;
    height: 36px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: rgba(0, 0, 0, 0.65);

    span:nth-child(2) {
      cursor: pointer;
      font-size: 28px;
      position: absolute;
      top: -4px;
      right: 20px;
      color: rgba(0, 0, 0, 0.45);
      &:hover {
        color: rgba(0, 0, 0, 0.8);
      }
    }
  }
  &-body {
    box-sizing: border-box;
    height: 514px;
    padding-left: 20px;
    border: 1px solid red;
  }
}
</style>
