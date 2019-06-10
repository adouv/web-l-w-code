<template>
  <div class="app-container">
    <el-header>应用园区绑定</el-header>
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
              <el-button type="primary">批量解绑</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="search">
          <el-col :span="24" style="text-align:right;">
            <div class="grid-content">
              <el-input
                placeholder="设备ID或学校名称"
                v-model="keywords"
                class="input-with-select"
                @change="searchBtn"
                clearable
                style="width:220px"
              >
                <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
              </el-input>
            </div>
          </el-col>
        </el-row>
        <el-row class="select-text">
          <el-col :span="6">
            <div class="grid-content">
              已选择{{stateList.selectedDevice}}项
              <el-button type="text" @click="clearSelected">清空</el-button>
            </div>
          </el-col>
          <el-col :span="18" style="text-align:right;padding-right:10px">
            <el-select
              v-model="openAccountStatus"
              @change="selectChange($event,'openAccountStatus')"
              placeholder="开户状态"
              clearable
              style="width:140px"
            >
              <el-option value="1" label="已开户">已开户</el-option>
              <el-option value="0" label="未开户">未开户</el-option>
            </el-select>
            <el-select
              v-model="selectLineState"
              @change="selectChange($event,'selectLineState')"
              placeholder="在线状态"
              clearable
              style="width:140px"
            >
              <el-option value="1" label="当前在线">当前在线</el-option>
              <el-option value="0" label="当前离线">当前离线</el-option>
            </el-select>
            <el-select
              v-model="status"
              @change="selectChange($event,'selectLineState')"
              placeholder="有效状态"
              clearable
              style="width:140px"
            >
              <el-option value="1" label="有效">有效</el-option>
              <el-option value="0" label="无效">无效</el-option>
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
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="设备ID" width="95">
            <template slot-scope="scope">{{ scope.row.deviceHardwareId }}</template>
          </el-table-column>
          <el-table-column label="所属应用园区" prop="gardenName"></el-table-column>
          <el-table-column label="开户状态" prop="gardenName">
            <template slot-scope="scope">{{scope.row.openAccountStatus ? '已开户' : '未开户'}}</template>
          </el-table-column>
          <el-table-column label="默认连接网络信息" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.factoryApSsid}}/{{scope.row.factoryApPw}}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="在线状态" width="110" align="center">
            <template slot-scope="scope">{{scope.row.isOnline ? '当前在线' : '当前离线'}}</template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="最近一次使用时间" width="200">
            <template slot-scope="scope">
              <i class="el-icon-time"/>
              <span
                style="margin-left: 10px"
              >{{ scope.row.newestConnectTime|dateformats('YYYY-MM- DD HH:mm') }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="状态" width="110" align="center">
            <template slot-scope="scope">{{scope.row.status ? '有效' : '无效'}}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">禁用</el-button>
              <el-button type="text" size="small">解绑</el-button>
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
import { parkBindMenuList } from "../../enum";
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
      menuList: parkBindMenuList,
      isLeftMenuCenter: false,
      stateList: {
        selectedDevice: 0,
        onLine: 0,
        offLine: 0
      },
      total: 30,
      pageSize: 20,
      currentPage: 1,
      menuActive: 2, //右侧菜单选中的key
      keywords: "",
      deviceIds: [],
      selectLineState: "",//在线状态
      openAccountStatus: "",//开户状态
      status: ""//有效状态
    };
  },
  mounted() {
    this.getDeviceList();
  },
  created() {},
  methods: {
    changeSelect(val) {
      this.stateList.selectedDevice = val.length;
      this.deviceIds = val;
      val.forEach((element, index) => {
        this.deviceIds[index] = element.deviceHardwareId;
      });
    },
    clearSelected(rows) {
      this.stateList.selectedDevice = 0;
      this.$refs.multipleTable.clearSelection();
    },
    searchBtn() {
      this.currentPage = 1;
      this.getDeviceList();
    },
    selectChange(event,type=''){
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
    getDeviceList() {
      this.listLoading = true;
      let params = {
        offset: (this.currentPage - 1) * this.pageSize,
        size: this.pageSize,
        isBindGarden: true // 是否绑定园区
      };
      if (this.keywords) {
        params.deviceHardwareId = this.keywords;
      }

      if (this.selectLineState) {
        params.isOnline = this.selectLineState == 0 ? false : true;
      }
      if (this.status) {
        params.status = this.status == 0 ? false : true;
      }
      if (this.openAccountStatus) {
        params.openAccountStatus = this.openAccountStatus == 0 ? false : true;
      }
      DeviceService.getDeviceList(params)
        .then(response => {
          console.log(response);
          this.total = Number(response.xRecordCount);
          this.list = response;
          // this.list.forEach(element=>{
          //   element.deviceApDtoList.forEach(e=>{
          //     this.list.apInfo += e.apSsid + '/' + e.apPw;
          //   })
          // })
          console.log(this.list)
          this.listLoading = false;
        })
        .catch(error => {
          this.$message.error(error);
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