<template>
  <div class="park-left-menu">
    <ul v-if="!leftStuOpen" >
      <li
        v-for="item in menu"
        :key="item.key"
        :class="{'active':item.key===menuActive}"
        @click="jump(item.url)"
      >{{item.label}}</li>
    </ul>
    <template v-if="leftStuOpen">
      <div>
        <p>已选设备：
          <span class="blue">{{deviceData.length}}</span>
        </p>
        <p>在线
          <span class="blue">{{onLine}}</span>，离线
          <span class="red">{{offLine}}</span>
        </p>
      </div>
      <el-collapse class="list">
        <el-collapse-item
          :title="item.title"
          :name="index+1"
          v-for="(item,index) in deviceData"
          :key="index"
        >
          <div class="blue">应用园区：</div>
          <div class="gardenName">{{item.gardenName}}</div>
        </el-collapse-item>
      </el-collapse>
    </template>
    <div class="aside-center">
      <template v-if="isCenter">
        <p>
          当前检测到的在线设备总数：
          <span class="blue">{{stateList.totalDevice}}</span>个
        </p>
      </template>
    </div>
    <template v-if="explain">
      <div class="aside-bottom" v-html="explain"></div>
    </template>
  </div>
</template>

<script>
import DeviceService from "@/_services/device.service";
export default {
  name: "lwParkLeftMenuComponent",
  props: ["menu", "isCenter", "stateList", "menuActive", "leftStuOpen"],
  data() {
    return {
      explain: "",
      deviceData: [], //用于学生开户的设备列表
      onLine: 0, // 当前选择设备中在线统计
      offLine: 0, // 当前选择设备中离线统计
      gardenId:0,
      isBatch:0
    };
  },
  mounted() {
    this.gardenId = this.$route.query.gardenId
      ? this.$route.query.gardenId
      : "";
    this.isBatch = this.$route.query.isBatch
      ? this.$route.query.isBatch
      : 0 ;
    let item = this.menu.filter((v, i, a) => {
      return v.key === this.menuActive;
    })[0];
    this.explain = item.explain;
    let parkInfo = this.local$.getItem("parkInfo");
    if (parkInfo && this.isBatch == 0) {
      this.deviceData = JSON.parse(parkInfo);
      this.deviceData = this.changeData(this.deviceData);
    }else if(this.isBatch == '1'){
      this.getDeviceList(this.gardenId);
    }
  },
  methods: {
    jump(val) {
      this.$router.push({ name: val });
    },
    getDeviceList(gardenId = "") {
      let params = {
        gardenId: gardenId
      };
      DeviceService.getDeviceList(params)
        .then(response => {
          this.deviceData = response;
          this.deviceData = this.changeData(this.deviceData);
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    changeData(data){
      data.forEach((Element, index) => {
        let onLineText = Element.isOnline ? "在线" : "离线";
        let title =
          (index + 1) +
          ". 设备ID：" +
          Element.deviceHardwareId +
          " (" +
          onLineText +
          ")";
        Element.title = title;
      });
      return data;
    }
  }
};
</script>

<style lang="scss">

.park-left-menu {
  margin-top: 10px;
  font-size: 14px;
  ul {
    
    li {
      height: 20px;
      line-height: 20px;
      padding-left: 10px;
      cursor: pointer;
      margin: 20px 0;
    }
    li:hover,
    .active {
      color: #3a8ee6;
      border-right: 4px solid #3a8ee6;
    }
  }
  .aside-center {
    font-size: 14px;
    margin: 100px 5px 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 100px;
    padding-left: 5px;
    span {
      margin: 0 2px;
    }
  }
  .aside-bottom {
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 10px;
    margin: 10px 5px;
  }
  .gardenName {
    text-indent: 2em;
  }
  .list{
    height: 600px;
    overflow-x: hidden;
  }
   .list::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  
  .list::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background-color: gainsboro;
    opacity: 0.2;
  }
  
  .list::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    // -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    opacity: 0.2;
    background: #e5e3ed;
  }
  .el-collapse{
    border-bottom: none;
  }
}
</style>

