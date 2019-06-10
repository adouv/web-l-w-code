<template>
  <div class="lw-small-title">
    <h2>{{title}}</h2>
  </div>
</template>

<script>
export default {
  name: "LwSmallTitleComponent",
  props: ["title"]
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
.lw-small-title {
  width: computer(1326px);
  height: computer(17px);
  line-height: computer(17px);
  margin: 0 auto;
  h2 {
    font-size: computer(16px);
    color: $color_font-deep;
    font-family: MicrosoftYaHei;
    font-weight: bold;
    font-stretch: normal;
    letter-spacing: 0px;
  }
}
</style>
