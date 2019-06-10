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
          v-for="item in gandenList"
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
              <el-button
                type="primary"
                @click="batch"
                :disabled="isBatch && stateList.selectedDevice != total"
              >批量导出</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="search">
          <el-col :span="4">
            <div class="grid-content">
              <el-input
                placeholder="上课教室、上课班级"
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
            <div class="grid-content">
              已选择{{stateList.selectedDevice}}项
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
          <el-table-column align="center" label="上课教室">
            <template slot-scope="scope">{{ scope.row.name }}{{scope.row.cName ? '(' + scope.row.cName + ')' : ''}}</template>
          </el-table-column>
          <el-table-column label="上课班级">
            <template slot-scope="scope">{{scope.row.className}}</template>
          </el-table-column>
          <el-table-column label="智写笔接入AP网络信息" align="center">
            <template slot-scope="scope">
              <p>SSID：{{ scope.row.apSsid}}</p>
              <p>密码：{{ scope.row.apPw}}</p>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="已绑定设备数" align="center">
            <template slot-scope="scope">{{scope.row.deviceCount ? scope.row.deviceCount : '0'}}</template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="apConfig(scope.row)" type="text" size="small">配置</el-button>
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
import { accountOpenMenuList } from "@/modules/enum";
import APInfoConfigComponent from "./apInfoConfigModal.vue";
import AuthService from "@/_services/auth.service";
import APInfoService from "@/_services/apInfo.service";
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
      gandenList: [],
      menuList: accountOpenMenuList,
      isLeftMenuCenter: false,
      stateList: {
        selectedDevice: 0,
        onLine: 0,
        offLine: 0
      },
      total: 30,
      pageSize: 20,
      currentPage: 1,
      isShow: false,
      menuActive: 1, //右侧菜单选中的key
      selectAPInfo: "",
      keywords: "",
      modalOptions: {},
      isBatch: true // 批量操作
    };
  },
  mounted() {
    this.isShow = false;
    this.isBatch = true;
    this.getGardensList();
    this.gardenId = this.local$.getItem("gardenId");
  },
  created() {},
  methods: {
    changeSelect(val) {
      this.stateList.selectedDevice = val.length;
    },
    /**
     * 清空选择项
     */
    clearSelected(rows) {
      this.stateList.selectedDevice = 0;
      this.$refs.multipleTable.clearSelection();
    },
    /**
     * 选择全部
     */
    selectAll(rows) {
      this.stateList.selectedDevice = rows.length > 0 ? this.total : 0;
    },
    selectGarden(val) {
      this.getDataList();
      this.local$.setItem("gardenId", val);
    },
    searchBtn() {
      this.currentPage = 1;
      this.getDataList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataList();
    },
    /**
     * 批量导出
     */
    batch() {
      this.isBatch = false;
      this.isShow = true;
    },
    /**
     * 配置
     */
    apConfig(row) {
      console.log(row);
      this.isShow = true;
      this.modalOptions = {
        title: "教室马良笔可接入网络AP信息配置",
        centerDialogVisible: true,
        componentName: APInfoConfigComponent,
        cancel: true,
        sure: true,
        showClose: true,
        params: {
          name: row.name,
          cName: row.cName,
          apSsid: "",
          apPw: ""
        }
      };
      this.modalOptions.save = (params, close) => {
        console.log(params);
        if (!params.apSsid || !params.apPw) {
          this.$message.error("网络SSID或网络访问密码为必填项");
          return;
        }
        let data = {
          classRoomId: row.id,
          gardenId: row.gardenId,
          apInfoId: row.apInfoId,
          apSsid: params.apSsid,
          apPw: params.apPw
        };
        APInfoService.updateAPInfo(data)
          .then(response => {
            this.getDataList();
          })
          .catch(error => {
            this.$message.error(error);
          });
        console.log(data);
        close();
      };
    },
    /**
     * 获取园区列表
     */
    getGardensList() {
      AuthService.getGardenList()
        .then(response => {
          this.gandenList = response;
          this.getDataList();
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    /**
     * 获取班级教室智写笔AP配置列表
     */
    getDataList(gardenId = "") {
      this.listLoading = true;

      let params = {
        offset: (this.currentPage - 1) * this.pageSize,
        size: this.pageSize,
        gardenId: gardenId ? gardenId : this.gardenId
      };
      if (this.keywords) {
        params.keyWords = this.keywords;
      }
      APInfoService.getAPInfoClass(params)
        .then(response => {
          this.total = Number(response.xRecordCount);
          this.list = response;
          this.list.forEach(element => {
            let cName = "";
            let className = "";
            if (element.administrativeClassList) {
              element.administrativeClassList.forEach(r => {
                cName += r.pName + r.name + ",";
              });
              element.cName = cName.substring(0, cName.lastIndexOf(","));
            } 

            if (element.classList) {
              element.classList.forEach(c => {
                className += c.pName + c.name + ",";
              });
              element.className = cName.substring(0, className.lastIndexOf(","));
            }
            
          });
          console.log(this.list, "222");
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