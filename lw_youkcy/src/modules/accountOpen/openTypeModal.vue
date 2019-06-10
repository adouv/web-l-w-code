<template>
  <div class="jude-content">
    <div class="con">
      <!-- <p>请选择批量开户的操作类型：</p> -->

      <p>
        <el-button type="primary" @click="studentAccountOpen">学生开户</el-button>
        <el-button>教师开户</el-button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "openTypeModal",
  props: ['params'],
  data() {
    return {};
  },
  mounted() {
    console.log(this.params)
  },
  methods: {
    studentAccountOpen(){
      this.$router.push({name:'studentOpen',query:{gardenId: this.params.gardenId,isBatch:this.params.isBatch}});
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.jude-content {
  .con {
    text-align: center;
  }
}
</style>