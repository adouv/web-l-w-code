<template>
  <div class="jude-content">
    <div class="con">
      <div>
        <div class="left">教室名称：</div>
        <div class="right">{{params.name}}</div>
      </div>
      <div>
        <div class="left">教室所属班级：</div>
        <div class="right">{{params.cName}}</div>
      </div>
      <div>教室马良笔可接入网络AP信息：</div>
      <div>
        <div class="left">网络SSID：</div>
        <div class="right"><el-input v-model="params.apSsid" placeholder="30个字符以内，必填" maxlength="30"></el-input></div>
      </div>
      <div>
        <div class="left">网络访问密码：</div>
        <div class="right"><el-input v-model="params.apPw" placeholder="30个字符以内，必填"  maxlength="30"></el-input></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "openTypeModal",
  props: ["params"],
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.jude-content {
  .con {
    div{
      line-height: 50px;
      .left{
        width: 20%;
        text-align: right;
        float: left;
      }
      .right{
        width: 80%;
        text-align: left;
        float: right;
      }
    }
    margin-bottom: 10px;
  }
}
</style>