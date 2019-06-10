<template>
  <div class="app-container">
    <el-header>园区绑定</el-header>
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
              <el-button type="primary">批量导出</el-button>
            </div>
          </el-col>
          
        </el-row>
        <el-row class="search">
          <el-col :span="24" style="text-align:right">
            <div class="grid-content">
              <el-input
                placeholder="园区名称"
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
        <el-row>
          <el-col :span="24">
            <div class="grid-content select-text">已选择{{stateList.selectedDevice}}项
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
          <el-table-column align="center" label="园区ID" width="95">
            <template slot-scope="scope">{{ scope.row.gardenId }}</template>
          </el-table-column>
          <el-table-column label="园区名称">
            <template slot-scope="scope">{{ scope.row.fullName }}</template>
          </el-table-column>
          <el-table-column label="园区开户AP配置信息" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.apSsid }}</span>
              <span>{{ scope.row.apPw }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="园区类型" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.gardenTypeName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="所属行政区" width="200">
            <template slot-scope="scope">
              <template v-if="scope.row.address">
              {{ scope.row.address.provinceName }}/{{ scope.row.address.cityName }}/{{ scope.row.address.districtName }}/{{ scope.row.address.address }}
              </template>
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
import APInfoService from '@/_services/apInfo.service';
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
      menuActive: 1, //右侧菜单选中的key
      keywords: ''
    };
  },
  mounted() {
    this.getDataList();
  },
  created() {
  },
  methods: {
    changeSelect(val) {
      this.stateList.selectedDevice = val.length;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataList();
    },
    clearSelected(rows) {
      this.stateList.selectedDevice = 0;
      this.$refs.multipleTable.clearSelection();
    },
    searchBtn(){
      this.currentPage = 1;
      this.getDataList();
    },
    getDataList() {
      this.listLoading = true;
      let params = {
        offset: (this.currentPage - 1) * this.pageSize,
        size: this.pageSize
      };
      if (this.keywords) {
        params.gardenName = this.keywords;
      }

      APInfoService.getAPInfoGardensList(params)
        .then(response => {
          console.log(response);
          this.total = Number(response.xRecordCount);
          this.list = response;
          this.listLoading = false;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
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
    height: 40px;
    line-height: 40px;
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