<template>
  <div class="windown-tools">
    <button aria-label="Close" class="close ng-star-inserted nodrag-area" @click="close()">
      <span class="icon iconfont icon-pc-label-close close-x"></span>
    </button>
    <div class="title">{{title}}</div>
  </div>
</template>

<script>
export default {
  name: "ToolsComponent",
  props: {
    title: {
      type: String,
      default: {}
    }
  },
  methods: {
    /**
     * 关闭当前窗口
     */
    close() {
      this.win$.closeCurrentWindow();
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/scss/index.scss";
.windown-tools {
  .close {
    -webkit-app-region: no-drag;
    cursor: pointer;
    border: 0;
    background: transparent;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    font-weight: 700;
    line-height: 1;
    text-decoration: none;
    transition: color 0.3s ease;
    color: rgba(0, 0, 0, 0.43);
    outline: 0;
    .close-x {
      display: block;
      font-style: normal;
      vertical-align: baseline;
      text-align: center;
      text-transform: none;
      text-rendering: auto;
      width: 38px;
      height: 38px;
      line-height: 38px;
      font-size: 17px;
    }
  }
  .title {
    text-align: center;
    height: computer(36px);
    border-bottom: 1px solid #dddddd;
    font-size: computer(16px);
    line-height: computer(36px);
    color: #333333;
  }
}
</style>
