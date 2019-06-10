<template>
  <div class="common-top">
    <em class="upper-left"></em>
    <em class="upper-right"></em>
    <em class="bottom-left"></em>
    <em class="bottom-right"></em>
    <div class="title">{{title}}</div>
    <div class="select-type" v-if="selectType !='false'">
      <el-select v-model="selected"  placeholder="请选择" @change="change">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  name: "commonTopComponent",
  props: ["selectType","options","title"],
  data(){
    return {
      selected: '0-1'
    }
  },
  mounted() {
    this.selected = this.selectType;
  },
  methods: {
    change(val){
      this.selected = val;
      this.$emit("selectVal",val);
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/scss/index.scss";
.common-top {
  .title {
        color: #226cfb;
        margin-top: computer(18px);
        margin-left: computer(20px);
      }
      em {
        position: absolute;
      }
      .upper-left {
        width: 22px;
        height: 22px;
        top: 0;
        left: 0;
        background: url("../../assets/images/upper-left-corner.png") no-repeat
          center center;
      }
      .upper-right {
        width: 22px;
        height: 22px;
        top: 0;
        right: 0;
        background: url("../../assets/images/upper-right-corner.png") no-repeat
          center center;
      }
      .bottom-left {
        width: 22px;
        height: 22px;
        bottom: 0;
        left: 0;
        background: url("../../assets/images/bottom-left-corner.png") no-repeat
          center center;
      }
      .bottom-right {
        width: 22px;
        height: 22px;
        bottom: 0;
        right: 0;
        background: url("../../assets/images/bottom-right-corner.png") no-repeat
          center center;
      }
      .select-type {
        position: absolute;
        right: computer(41px);
        top: computer(41px);
        .el-select {
          z-index: 99999;
          width: computer(200px);
          .el-select-dropdown__item {
            padding: 0 20px !important;
          }
          .el-input__inner{
            background-color:transparent;
            border: 1px solid #ffffff;
            color: #ffffff;
          }
        }
      }
}
</style>

