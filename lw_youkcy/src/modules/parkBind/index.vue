<template>
  <div class="app-container">
    <el-header>应用园区绑定</el-header>
    <lw-modal :options="modalOptions" v-if="isShow"></lw-modal>
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
          <el-col :span="4">
            <div class="grid-content">
              <el-button
                type="primary"
                :disabled="gardenId == '' || deviceIds.length == 0"
                @click="subBindBtn"
              >提交绑定</el-button>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content" style="text-align:right">
              <el-button @click="$router.push({name:'parkBind'})">重新检测在线设备</el-button>
            </div>
          </el-col>
          <el-col :span="24" style="margin-top:20px">
            <div class="grid-content">
              <span>选择要绑定的园区：{{gardenName}}</span>
              <el-button @click="$router.push({name:'park'})">选择</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="search">
          <el-col :span="24" style="text-align:right;">
            <div class="grid-content">
              <el-input
                placeholder="设备ID"
                v-model="keywords"
                class="input-with-select"
                @change="searchBtn"
                clearable
                style="width:200px"
              >
                <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
              </el-input>
            </div>
          </el-col>
        </el-row>
        <el-row class="select-text">
          <el-col :span="16">
            <div class="grid-content">
              已选择{{stateList.selectedDevice}}项
              <el-button type="text" @click="clearSelected" style="padding-right:15px;">清空</el-button>已选择设备中：在线
              <span class="blue">{{stateList.onLine}}</span>，离线
              <span class="red">{{stateList.offLine}}</span>
            </div>
          </el-col>
          <el-col :span="8" style="text-align:right;padding-right:10px">
            <el-select
              v-model="selectLineState"
              @change="changeOnline"
              placeholder="全部在线状态"
              style="width:140px"
              clearable
            >
              <el-option value="1" label="在线">在线</el-option>
              <el-option value="0" label="离线">离线</el-option>
            </el-select>
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
          <el-table-column align="center" label="设备ID" width="95" prop="deviceHardwareId"></el-table-column>
          <el-table-column label="所属园区" prop="gardenName"></el-table-column>
          <el-table-column label="默认连接网络信息" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.factoryApSsid}}/{{scope.row.factoryApPw}}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="在线状态" width="110" align="center">
            <template slot-scope="scope">{{scope.row.isOnline ? '当前在线' : '当前离线'}}</template>
          </el-table-column>
          <el-table-column label="最新接入平台时间" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span
                style="margin-left: 10px"
              >{{ scope.row.newestConnectTime|dateformats('YYYY-MM- DD HH:mm') }}</span>
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
import { parkBindMenuList } from "../enum";
import DeviceService from "@/_services/device.service";
import parkBackInfoModalComponent from "./parkBackInfoModal.vue";
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
      fullscreenLoading: false,
      gardenId: "", //所选择的园区ID
      gardenName: "", // 所选择的园区名称
      menuList: parkBindMenuList,
      isLeftMenuCenter: true,
      stateList: {
        selectedDevice: 0,
        onLine: 0,
        offLine: 0,
        totalDevice: 0
      },
      total: 30,
      pageSize: 20,
      currentPage: 1,
      menuActive: 0, //左侧菜单选中的key
      keywords: "",
      selectLineState: "", //筛选在线状态
      deviceIds: "",
      centerDialogVisible: false,
      Screenloading: "",
      isSelectAll: false,
      isShow: false,
      modalOptions: {
        title: "",
        centerDialogVisible: true,
        componentName: parkBackInfoModalComponent,
        cancel: false,
        sure: false,
        width: "30%",
        params: {},
        showClose: false,
        save: (params, close) => {
          close();
        }
      }
    };
  },
  mounted() {
    this.getDeviceList();
    this.gardenId = this.$route.query.gardenId
      ? this.$route.query.gardenId
      : "";
    this.gardenName = this.$route.query.gardenName
      ? this.$route.query.gardenName
      : "";
    if (!this.gardenId) {
      this.openFullScreen();
    }
  },
  created() {
    //this.fetchData();
  },
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
      let ids = "";
      val.forEach((element, index) => {
        ids += element.deviceHardwareId + ",";
      });
      this.deviceIds = ids;
    },
    clearSelected(rows) {
      this.stateList.selectedDevice = 0;
      this.$refs.multipleTable.clearSelection();
    },
    selectAll(rows) {
      this.isSelectAll = rows.length > 0 ? true : false;
    },
    searchBtn() {
      this.currentPage = 1;
      this.getDeviceList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDeviceList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDeviceList();
    },
    changeOnline() {
      this.getDeviceList();
    },
    getDeviceList() {
      this.listLoading = true;

      let params = {
        offset: (this.currentPage - 1) * this.pageSize,
        size: this.pageSize,
        isBindGarden: false // 是否绑定园区
      };
      if (this.keywords) {
        params.deviceHardwareId = this.keywords;
      }

      if (this.selectLineState) {
        params.isOnline = this.selectLineState == 0 ? false : true;
      }
      DeviceService.getDeviceList(params)
        .then(response => {
          this.total = Number(response.xRecordCount);
          setTimeout(() => {
            this.list = response;
            this.Screenloading.close();
          }, 1000);
          this.listLoading = false;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    /**
     * 提交绑定操作
     */
    subBindBtn() {
      let idList = this.deviceIds.substring(0, this.deviceIds.lastIndexOf(","));
      let params = {
        gardenId: this.gardenId
      };
      if (this.isSelectAll) {
        params.isAll = this.isSelectAll;
      } else {
        params.idList = idList;
      }
      DeviceService.bindGarden(params)
        .then(response => {
          this.isShow = true;
          this.modalOptions.params = {
            widthVal: 0,
            title: "正在为设备绑定园区中...",
            info: {
              successCount: response,
              errorCount: this.stateList.selectedDevice - response
            }
          };
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    okBtn() {
      this.centerDialogVisible = false;
      this.getDeviceList();
    },
    /**
     * 全屏Loadding
     */
    openFullScreen() {
      this.Screenloading = this.$loading({
        lock: true,
        text: "正在实时检测在线且未绑定园区设备…",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
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
    height: 30px !important;
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