<template>
  <div class="lw-title" :class="{'border':border}">
    <h1>{{title}}</h1>
    <div class="lw-title-left">
      <slot name="left"></slot>
    </div>
    <div class="lw-title-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "LwTitleComponent",
  props: ["title", "border"]
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-title {
  width: computer(1326px);
  height: computer(50px);
  line-height: computer(50px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  &.border {
    border-bottom: 1px solid $color_border;
  }
  h1 {
    display: inline-block;
    border-left: computer(3px) solid $color_main;
    height: computer(20px);
    line-height: computer(20px);
    padding: 0 0 0 computer(10px) !important;
    margin: 0 !important;
    font-size: computer(16px);
    font-weight: bold;
    font-stretch: normal;
    letter-spacing: 0px;
    color: $color_font-deep;
  }
  div {
    &.lw-title-right {
      flex: 1;
      text-align: right;
    }
  }
}
</style>


