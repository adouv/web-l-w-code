<template>
  <div class="lw-modal">
    <el-dialog
      :title="options.title"
      :visible.sync="options.centerDialogVisible"
      center
      :width="options.width"
      :close-on-click-modal="false"
      :show-close="options.showClose"
    >
      <component v-bind:is="options.componentName" :params="options.params" @ok="getSure"></component>
      <span slot="footer" class="dialog-footer">
        <el-button @click="options.centerDialogVisible = false" v-if="options.cancel">取 消</el-button>
        <el-button type="primary" @click="btnSave(options.params)" v-if="options.sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "LwModalComponent",
  props: ["options"],
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    btnClose() {
      this.options.centerDialogVisible = false;
    },
    btnSave() {
      this.options.save(this.options.params,this.btnClose);
    },
    getSure(val){
      this.options.centerDialogVisible = false;
      this.$router.push({name:val.url,query:val.query});
    }
  }
};
</script>

<style lang="scss">
.lw-modal {
  .content {
    p {
      text-indent: 2em;
      line-height: 20px;
    }
  }
  .el-dialog__header{
    //border-bottom: 1px solid #ccc;
  }
  .el-button{
    margin-top: 10px;
  }
}
</style>

