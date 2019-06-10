<template>
  <div class="jude-content">
    <div class="con">
      <!-- <p>请选择批量开户的操作类型：</p> -->
      <template v-if="isShow">
        <lw-progress @progress="getProgress" v-model="params.widthVal" :params="params"></lw-progress>
      </template>
      <template v-if="!isShow">
        <div class="info">
          <p>
            已成功完成
            <span class="green">{{params.info.successCount}}</span>个设备的开户！您选择中的设备中有
            <span class="red">{{params.info.failCount+params.info.noApCount}}</span>个因为设备离线等原因未完成设备开户。
          </p>
        </div>
        <el-button
          type="primary"
          @click="btnSave"
        >确 定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "BackInfoModalComponent",
  props: ["params"],
  data() {
    return {
      progress: "",
      isShow: true
    };
  },
  mounted() {
    this.isShow = true;
  },
  methods: {
    getProgress(val) {
      this.params.widthVal = val.widthVal;
      this.isShow = false;
    },
    btnSave(){
        console.log("点击确定");
        this.$emit('ok',{url:'accountOpen'})
        this.local$.setItem('accountTip',true);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.jude-content {
  .con {
    text-align: center;
    height: 80px;
    .info {
      text-align: left;
      text-indent: 2rem;
      line-height: 30px;
    }
  }
}
</style>