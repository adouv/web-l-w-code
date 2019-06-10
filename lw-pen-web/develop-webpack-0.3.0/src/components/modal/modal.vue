<template src="./modal.html"></template>

<script>
export default {
  name: "ModalComponent",
  props: {},
  data() {
    return {
      show: false,
      modalOptions: {
        title: "默认标题",
        showTitle: true,
        saveText: "保存",
        cleanText: "取消",
        showSave: true,
        position: "modal-top",
        componentName: null,
        showFooter: true,
        width: 500,
        height: 500,
        params: {},
        className: "",
        idName: "",
        zpButton: false, //自判模式的按钮
        save: (params, close) => {},
        closes: params => {}
      }
    };
  },
  methods: {
    btnClose() {
      this.modalOptions.closes(this.modalOptions.params);
      this.show = !this.show;
    },
    btnSave() {
      this.modalOptions.save(this.modalOptions.params, this.btnClose);
    }
  },
  computed: {},
  created() {},
  beforeDestroy() {},
  watch: {}
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/index.scss";
.ant-modal-wrap {
  .zpButton {
    text-align: center;
    button {
      margin-bottom: computer(20px);
    }
  }
  .ant-modal-content{
    box-shadow: 0px 8px 12px 0px 
    rgba(7, 0, 2, 0.3);
    border-radius: 6px;
  }
  .ant-modal-body {
    padding: computer(20px);
    border-radius: 0 0 6px 6px;
  }
  .ant-modal-header {
    padding: 7px 24px;
    border-radius: 6px 6px 0 0;
  }
  .ant-modal-close-x {
    height: 36px;
    line-height: 36px;
    &:focus,
    &:hover {
      color: #999999;
      text-decoration: none;
    }
  }

  .bgColor {
    .ant-modal-close{
      color: #fff;
    }
    .ant-modal-body{
      background-color: #3b5253;
    }
    .ant-modal-header {
      border-bottom: 1px solid #34494a;
      background: #3b5253;
      .ant-modal-title {
        color: #fff;
      }
    }
  }
}
</style>