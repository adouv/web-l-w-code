<template>
  <div class="app-container">
    <lw-modal :options="modalOptions" v-if="isShow"></lw-modal>
    
    <el-header>
      <span>设备开户</span>
      <el-select
        v-model="gardenId"
        @change="selectGarden"
        placeholder="请选择园区"
        style="width:200px;float:right"
      >
        <el-option
          :label="item.name"
          v-for="item in gardenList"
          :key="item.id"
          :value="item.id"
        >{{item.name}}</el-option>
      </el-select>
    </el-header>
    <el-container>
      <el-aside width="300px">
        <div class="grid-content">
          <lw-park-left-menu
            :menu="menuList"
            :isCenter="isLeftMenuCenter"
            :stateList="stateList"
            :menuActive="menuActive"
          ></lw-park-left-menu>
        </div>
      </el-aside>
      <el-main>
        <el-row class="select-park">
          <el-col :span="24">
            <div class="grid-content">
              <el-button type="primary" @click="batch" :disabled="!isBatch && deviceList.length <= 0">批量绑定</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="search">
          <el-col :span="4">
            <div class="grid-content">
              <el-input
                placeholder="设备ID"
                v-model="keywords"
                class="input-with-select"
                @change="searchBtn"
                clearable
              >
                <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
              </el-input>
            </div>
          </el-col>
        </el-row>
        <el-row class="select-text">
          <el-col :span="24">
            <div class="grid-content">已选择{{stateList.selectedDevice}}项
              <el-button type="text" @click="clearSelected">清空</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          fit
          highlight-current-row
          @selection-change="changeSelect"
          @select-all="selectAll"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="设备ID" width="95">
            <template slot-scope="scope">{{ scope.row.deviceHardwareId }}</template>
          </el-table-column>
          <el-table-column label="年级班级">
            <template slot-scope="scope">{{ scope.row.class ? scope.row.class: '未绑定' }}</template>
          </el-table-column>
          <el-table-column label="绑定学生信息" align="center">
            <template slot-scope="scope">{{ scope.row.student ? scope.row.student: '未绑定' }}</template>
          </el-table-column>
          <el-table-column class-name="status-col" label="在线状态" align="center">
            <template slot-scope="scope">{{scope.row.isOnline ? '当前在线' : '当前离线'}}</template>
          </el-table-column>
          <el-table-column class-name="status-col" label="最近一次接入平台时间" align="center">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span
                style="margin-left: 10px"
              >{{ scope.row.newestConnectTime|dateformats('YYYY-MM- DD HH:mm') }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="studentOpenBtn(scope.row)" type="text" size="small" :disabled="isBatch || deviceList.length >= 1">学生开户</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[20, 50, 100, 200]"
          :page-size="pageSize"
          :current-page="currentPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getList } from "@/api/table";
import { accountOpenMenuList } from "../enum";
import TipsModalComponent from "./tipsModal.vue";
import OpenTypeModalComponent from './openTypeModal.vue';
import AuthService from "@/_services/auth.service";
import DeviceService from "@/_services/device.service";
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      gardenId: 0,
      gardenList: [],
      menuList: accountOpenMenuList,
      isLeftMenuCenter: false,
      stateList: {
        selectedDevice: 0,
        onLine: 0,
        offLine: 0
      },
      total: 30,
      pageSize: 10,
      currentPage: 1,
      isShow: false,
      menuActive: 0, //右侧菜单选中的key
      selectAPInfo: "",
      modalOptions: {
        title: "设备开户前准备工作提示",
        centerDialogVisible: true,
        componentName: TipsModalComponent,
        cancel: false,
        sure: true,
        width: "30%",
        params:{},
        showClose: false,
        save:(params,close) => {
          close();
        }
      },
      keywords: "",
      isBatch: false, // 批量开户操作
      deviceList: []
    };
  },
  mounted() {
    console.log(this.menuList);
    //this.tips();
    this.sign();
    this.getGardenList();
    this.local$.removeItem('parkInfo');
    console.log();
    this.isShow = true;
    if(this.local$.getItem('accountTip') == 'true'){
      this.isShow = false;
      this.local$.removeItem('accountTip');
    }
    
    this.isBatch = false;
    this.gardenId = this.local$.getItem('gardenId');
  },
  created() {},
  methods: {
    fetchData() {
      this.listLoading = true;
      getList(this.listQuery).then(response => {
        this.total = response.length;
        this.list = response.data.items;
        this.listLoading = false;
      });
    },
    changeSelect(val) {
      this.stateList.selectedDevice = val.length;
      this.deviceList = val;
      this.isBatch = false;
    },
    /**
     * 清空选择项
     */
    clearSelected(rows) {
      this.stateList.selectedDevice = 0;
      this.$refs.multipleTable.clearSelection();
    },
    selectAll(rows){
      this.isBatch = rows.length > 0 ? true : false;
      this.stateList.selectedDevice = rows.length > 0 ? this.total : 0;
      this.deviceList = rows;
    },
    selectGarden(val) {
      this.getDeviceList();
      this.local$.setItem('gardenId', val);
    },
    searchBtn() {
      this.currentPage = 1;
      this.getDeviceList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getDeviceList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDeviceList();
    },
    /**
     * 批量开户
     */
    batch(){
      this.isShow = true;
      this.modalOptions.title = '请选择批量开户的操作类型',
      this.modalOptions.centerDialogVisible = true,
      this.modalOptions.componentName = OpenTypeModalComponent;
      this.modalOptions.cancel = true;
      this.modalOptions.sure = false;
      this.modalOptions.params = {
        gardenId: this.gardenId,
        isBatch: this.isBatch
      }
      if(!this.isBatch){
        this.local$.removeItem('parkInfo');
        this.local$.setItem('parkInfo',JSON.stringify(this.deviceList));
      }
    },
    /**
     * 学生开户
     */
    studentOpenBtn(row){
      console.log(row);
      this.local$.removeItem('parkInfo');
      let parkInfo = [{
        id: row.id,
        deviceHardwareId: row.deviceHardwareId,
        isOnline: row.isOnline,
        gardenName: row.gardenName
      }]
      this.local$.setItem('parkInfo',JSON.stringify(parkInfo));
      this.$router.push({name:'studentOpen',query:{gardenId: this.gardenId}});
    },
    /**
     * 获取园区列表
     */
    getGardenList() {
      AuthService.getGardenList()
        .then(response => {
          this.gardenList = response;
          this.getDeviceList();
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    getDeviceList(gardenId = "") {
      this.listLoading = true;

      let params = {
        offset: (this.currentPage - 1) * this.pageSize,
        size: this.pageSize,
        gardenId: gardenId ? gardenId : this.gardenId,
        isBindStudent: false,
        isBindGarden: true
      };
      if (this.keywords) {
        params.deviceHardwareId = this.keywords;
      }

      DeviceService.getDeviceList(params)
        .then(response => {
          this.total = Number(response.xRecordCount);
          this.list = response;
          this.listLoading = false;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    sign() {
      let params = {
        client_id: 1,
        client_secret: "123",
        scope: "read",
        grant_type: "password",
        username: "yunwei",
        password: "000000"
      };
      AuthService.sign(params)
        .then(response => {
          let token = response.access_token;
          this.local$.setItem("LWToken", response.access_token);
          console.log(response);
          let promiseAll = [];
          promiseAll.push(AuthService.getAuthInfo());

          this.http$.all(promiseAll).then(this.http$.spread(authInfo => {}));
        })
        .catch(error => {
          this.$message.error("用户名或密码错误");
        });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  background: #ffffff;
  margin-top: 10px;
  .el-header {
    padding-right: 0;
  }
  .el-aside {
    border: 1px solid #eee;
    padding: 10px;
  }
  .el-main {
    padding: none;
    border: 1px solid #eee;
    margin-left: 10px;
  }
  .search {
    .el-col-4 {
      float: right;
    }
  }
  .select-park {
    .el-col {
      margin-bottom: 10px;
    }
  }
  .select-text {
    background: #d3dce6;
    border-radius: 4px;
    height: 50px;
    line-height: 50px;
    margin: 10px 0;
    padding-left: 20px;
    .el-button {
      font-size: 16px;
      margin-left: 10px;
    }
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>