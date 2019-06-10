<template>
  <div class="winClose">
    <button aria-label="Close" class="close ng-star-inserted nodrag-area" @click="close()">
      <span class="icon iconfont icon-pc-label-close close-x"></span>
    </button>
  </div>
</template>

<script>
export default {
  name: "WinCloseComponent",
  // props: {
  //   params: {
  //     type: Object,
  //     default: {}
  //   }
  // },
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

<style lang="sass">

</style>

