<template>
  <div class="lw-page-my-excellent">
    <lw-stitle title="我的优常" style="margin-top:18px;"></lw-stitle>
    <div class="lw-my-excellent-list">
      <lw-card
        icon="jiangzhang"
        title="早到"
        content="36个优常"
        :item="123"
        :color="1"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="yichang"
        title="未早到"
        content="7个优常"
        :item="123"
        :color="2"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="yichang"
        title="不在校"
        content="10个異常"
        :item="123"
        :color="1"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="jiangzhang"
        title="在校"
        content="10个优常"
        :item="123"
        :color="2"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "LwPageMyExcellentComponent",
  data() {
    return {};
  },
  methods: {
    btnDetail(item) {
      console.log(item);
      this.$router.push({name:'lwPageIntelligentMonitoring'});
    }
  }
};
</script>



<style lang="scss">
@import "../../../assets/scss/_ddd/variable.style.scss";
@import "../../../assets/scss/_ddd/mixin.style.scss";
.lw-page-my-excellent {
  width: computer(1326px);
  margin: 0 auto;
  .lw-my-excellent-list {
    @include base-list();
  }
}
</style>
