<template>
  <div class="lw-page-gaun">
    <detection></detection>
    <wisdom></wisdom>
    <lw-title title="及时反馈" border="1" style="margin-top:40px;">
      <div slot="right">
        <a-select labelInValue placeholder="按类型汇总呈现" style="width: 180px">
          <a-select-option value="jack">Jack (100)</a-select-option>
          <a-select-option value="lucy">Lucy (101)</a-select-option>
        </a-select>
        <a-select labelInValue placeholder="优常信息" style="width: 180px">
          <a-select-option value="jack">Jack (100)</a-select-option>
          <a-select-option value="lucy">Lucy (101)</a-select-option>
        </a-select>
      </div>
    </lw-title>
    <my-excellent></my-excellent>
    <my-manage-excellent></my-manage-excellent>
    <my-follow-excellent></my-follow-excellent>
  </div>
</template>

<script>
import LwPageDetectionComponent from "./detection/index.vue";
import LwPageWisdomComponent from "./wisdom/index.vue";
import LwPageMyExcellentComponent from "./myExcellent/index.vue";
import LwPageMyManageExcellentComponent from "./myManageExcellent/index.vue";
import LwPageMyFollowExcellentComponent from "./myFollowExcellent/index.vue";
export default {
  name: "LwPageGuanComponent",
  components: {
    detection: LwPageDetectionComponent,
    wisdom: LwPageWisdomComponent,
    "my-excellent": LwPageMyExcellentComponent,
    "my-manage-excellent": LwPageMyManageExcellentComponent,
    "my-follow-excellent": LwPageMyFollowExcellentComponent
  }
};
</script>
