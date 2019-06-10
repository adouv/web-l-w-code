<template>
  <div class="lw-page-wisdom">
    <lw-title title="智慧管理" border="1"></lw-title>
    <div class="wisdom-list">
      <lw-card
        icon="chidao"
        title="在岗情况智能检测"
        :item="123"
        :color="0"
        :type="0"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="beike"
        title="备课状态智能监测"
        :item="123"
        :color="0"
        :type="0"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="queke"
        title="课堂状态智能监控"
        :item="123"
        :color="0"
        :type="0"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="tiaoke"
        title="视频巡查和广播"
        :item="123"
        :color="0"
        :type="0"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="tiaoke"
        title="视频巡查和广播"
        :item="123"
        :color="0"
        :type="0"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="tiaoke"
        title="视频巡查和广播"
        :item="123"
        :color="0"
        :type="0"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="tiaoke"
        title="视频巡查和广播"
        :item="123"
        :color="0"
        :type="0"
        @clickEvent="btnDetail"
      ></lw-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "LwPageWisdomComponent",
  data() {
    return {};
  },
  methods: {
    btnDetail(event) {
      console.log(event);
      this.$router.push({name:'lwPageIntelligentMonitoring'});
    }
  }
};
</script>

<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
@import "../../../assets/scss/_ddd/mixin.style.scss";
.lw-page-wisdom {
  width: computer(1326px);
  margin: 0 auto;
  .wisdom-list {
    @include base-list();
  }
}
</style>


