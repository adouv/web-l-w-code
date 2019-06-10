<template>
  <div class="lw-page-my-manage-excellent">
    <lw-stitle title="我管理的优常" style="margin-top:39px;"></lw-stitle>
    <div class="lw-my-manage-excellent-list">
      <lw-card
        icon="jiangzhang"
        title="代课"
        content="36个优常"
        :item="123"
        :color="3"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="yichang"
        title="不讲课"
        content="7个优常"
        :item="123"
        :color="4"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="yichang"
        title="迟到"
        content="10个異常"
        :item="123"
        :color="1"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="jiangzhang"
        title="缺课"
        content="10个优常"
        :item="123"
        :color="2"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="jiangzhang"
        title="早退"
        content="10个优常"
        :item="123"
        :color="3"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="jiangzhang"
        title="换课"
        content="10个优常"
        :item="123"
        :color="4"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
      <lw-card
        icon="jiangzhang"
        title="代课"
        content="10个优常"
        :item="123"
        :color="1"
        :type="1"
        @clickEvent="btnDetail"
      ></lw-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "LwPageMyManageExcellentComponent",
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
.lw-page-my-manage-excellent {
  width: computer(1326px);
  margin: 0 auto;
  .lw-my-manage-excellent-list {
    @include base-list();
  }
}
</style>
