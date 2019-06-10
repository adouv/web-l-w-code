<template>
  <div class="jude-content">
    <div class="con">
      <p>
        设备开户时除了将用户信息下发至智写笔设备之外，还需要同时将该设备开机时默认连接
        的网络信息（SSID和对应的PW）一起下发至智写笔设备中。这样才能保证智写笔设备在其
        使用的场所(教室或办公室)开机后能够正常接入网络。
      </p>

      <p>
        所以，请确保首先将左侧的选项卡切换至“班级教室智写笔AP配置”和“教师专用智写笔AP
        配置”选项下配置好相应班级教室和教师智写笔要连接的AP信息后再进行设备的用户开户操作。
      </p>

      <p>
        对于没有配置任何教室连接AP信息和教师连接AP信息的班级和教师，在此页面将不显示没
        有配置接入AP班级下的所有学生和没有配置任何接入AP信息的所有教师用户。
      </p>

      <p>
        对于智写笔设备默认连网信息和最新班级教室接入AP信息或教师接入AP信息不符的情况，
        统一到“设备管理/已开户学生设备列表页或已开户教师设备列表页”做相应的批量操作处理即
        可。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "JudgeModalComponent",
  props: {
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.jude-content {
  .con{
    p {
      text-indent: 1.8rem;
      line-height: 25px;
    }
  }
}
</style>