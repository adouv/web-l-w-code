<template>
  <div class="app-container">
    <el-header>选择应用园区</el-header>
    <el-container>
      <el-main>
        <el-row class="select-park">
          <el-col :span="24">
            <div class="grid-content">
              <el-button type="primary" @click="$router.push({name:'parkBind',query: { gardenId: currentRow.id, gardenName:currentRow.fullName }})" :disabled="!currentRow">确定</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="search">
          <el-col :span="4">
            <div class="grid-content">
              <el-input
                placeholder="园区名称"
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
        <el-table
          ref="singleTable"
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          highlight-current-row
          @current-change="handleCurrentChangeRow"
          style="margin-top:10px"
        >
          <el-table-column align="center" label="园区ID" width="95">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="园区名称">
            <template slot-scope="scope">{{ scope.row.fullName }}</template>
          </el-table-column>
          <el-table-column label="园区类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.gardenTypeName }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="园区行政区别" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.originAddress.provinceName }}/{{ scope.row.originAddress.cityName }}/{{ scope.row.originAddress.districtName }}/{{ scope.row.originAddress.address }}</span>
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
import AuthInfoService from "@/_services/auth.service";
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
      total: 1,
      pageSize: 20,
      currentPage: 1,
      menuActive: 2, //右侧菜单选中的key
      keywords: "",
      currentRow: ''
    };
  },
  mounted() {
    console.log(this.currentRow,'----');
    this.getDataList();
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
    // checkboxInit(row,index){
    //   console.log(row,index)
    // },
    //选择当前行数
    handleCurrentChangeRow(val) {
      this.currentRow = val;
      console.log(this.currentRow);
    },
    searchBtn() {
      this.currentPage = 1;
      this.getDataList();
    },
    changeSelect(val, index) {
      console.log(val);
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
    getDataList() {
      this.listLoading = true;
      let params = {
        keywords: this.keywords,
        offset: (this.currentPage - 1) * this.pageSize,
        size: this.pageSize
      };
      AuthInfoService.getGardenList(params)
        .then(response => {
          this.total = Number(response.xRecordCount);
          console.log(response);
          this.list = response;
          console.log(this.total);
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