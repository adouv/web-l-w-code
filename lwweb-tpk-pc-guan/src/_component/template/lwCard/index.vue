<template>
  <div
    class="lw-card"
    :style="{'background':colorList[color],'border':`1px solid ${colorList[color]}`}"
  >
    <div v-if="type===0" class="lw-card-item-0" @click="eventHandle(item);">
      <i class="icon iconfont" :class="icon"></i>
      <p>{{title}}</p>
    </div>
    <div v-if="type===1" class="lw-card-item-1" @click="eventHandle(item);">
      <h3>{{title}}</h3>
      <p>
        <i class="icon iconfont" :class="icon"></i>
        <span>{{content}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LwCardComponent",
  props: ["icon", "title", "content", "type", "item", "color"],
  data() {
    return {
      colorList: ["#226cfb", "#80c269", "#13b5b1", "#febd60", "#fe9460"]
    };
  },
  methods: {
    eventHandle(item) {
      this.$emit("clickEvent", item);
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";

.lw-card {
  border-radius: computer(6px);
  width: computer(161px);
  height: computer(100px);
  color: $color_font;
  cursor: pointer;
  //卡片1的樣式
  .lw-card-item-0 {
    text-align: center;
    i {
      margin-top: computer(19px);
      display: block;
      width: 100%;
      height: computer(34px);
      line-height: computer(34px);
      font-size: computer(30px);
    }
    p {
      margin-top: computer(9px);
      font-size: computer(14px);
    }
  }
  //卡片2的樣式
  .lw-card-item-1 {
    text-align: center;
    h3 {
      margin-top: 15px;
      color: $color_font;
      font-size: computer(18px);
      height: computer(19px);
      line-height: computer(19px);
    }
    p {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: computer(14px);
      height: computer(30px);
      line-height: computer(30px);
      i {
        display: block;
        height: computer(30px);
        font-size: computer(30px);
        margin-right: computer(10px);
      }
    }
  }
}
</style>


