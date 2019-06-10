<template>
  <div class="jude-content">
    <div class="con">
      <div class="info">
        <span>姓名：{{params.userName}}</span>
        <span>学号：{{params.userNumber}}</span>
        <span>优课号：{{params.uid}}</span>
        <span>
          整体可连接状态：
          <label v-if="params.connectStatus == 0" class="green">全部可连接</label>
          <label v-else-if="params.connectStatus == 1" class="yellow">部分可连接</label>
          <label v-else class="red">全部不可连接</label>
        </span>
      </div>
      <div class="list">
        <div class="title"><p>可接入AP信息及状态：</p></div>
        <div class="con-list">
          <el-table :data="params.deviceApDtoList" style="width: 100%">
            <el-table-column prop="classRoomId" label="所在教室名称" width="180"></el-table-column>
            <el-table-column  label="最新AP连接信息" width="180">
              <template slot-scope="scope">
                <p>SSID:{{scope.row.apSsid}}</p>
                <p>PW:{{scope.row.apPw}}</p>
              </template>
            </el-table-column>
            <el-table-column  label="设备中存储的AP连接信息">
              <template slot-scope="scope">
                <p>SSID:{{scope.row.apSsid}}</p>
                <p>PW:{{scope.row.apPw}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="可连接状态">
              <template slot-scope="scope">
                <span v-if="scope.row.updateConnectStatus == true" class="green">可连接</span>
                <span v-else class="red">不可连接</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "openTypeModal",
  props: ["params"],
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.jude-content {
  .con {
    .info{
      margin-bottom: 20px;
      span{
        margin-right:40px;
      }
    }
    .list{
      .title{
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
        line-height: 20px;
      }
    }
    .con-list{
      height: 200px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}
</style>