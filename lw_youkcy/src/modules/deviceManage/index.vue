<template>
  <div class="app-container">
    <lw-modal :options="modalOptions" v-if="isShow"></lw-modal>
    <el-header>
      <span>设备管理</span>
      <el-select
        v-model="gardenId"
        @change="selectGarden"
        placeholder="请选择园区"
        style="width:200px;float:right"
        clearable
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
              <el-button type="primary">按右侧方式批量操作</el-button>
              <el-select v-model="selectAPInfo" placeholder="同步应用接入AP信息">
                <el-option
                  v-for="item in APoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
        <el-row class="search">
          <el-col :span="24" style="text-align:right;">
            <div class="grid-content">
              <el-input
                placeholder="设备ID、姓名或学号"
                v-model="keywords"
                class="input-with-select"
                @change="searchBtn"
                clearable
                style="width:300px"
              >
                <el-button slot="append" icon="el-icon-search" @click="searchBtn"></el-button>
              </el-input>
            </div>
          </el-col>
        </el-row>
        <el-row class="select-text">
          <el-col :span="5">
            <div class="grid-content">
              已选择{{stateList.selectedDevice}}项
              <el-button type="text" @click="clearSelected">清空</el-button>
            </div>
          </el-col>
          <el-col :span="19">
            <div class="grid-content">
              <el-select
                v-model="isOnline"
                clearable
                placeholder="在线状态"
                style="width:120px"
                @change="changeStatus"
              >
                <el-option value="1" label="在线">在线</el-option>
                <el-option value="0" label="离线">离线</el-option>
              </el-select>
              <el-select
                v-model="connectionStatus"
                clearable
                placeholder="应用可连接状态"
                style="width:150px"
                @change="changeStatus"
              >
                <el-option value="0" label="全部可连接">全部可连接</el-option>
                <el-option value="1" label="部分可连接">部分可连接</el-option>
                <el-option value="2" label="不可连接">不可连接</el-option>
              </el-select>
              <el-select
                v-model="gradeId"
                clearable
                @change="changeGarden"
                placeholder="所有年级"
                style="width:150px"
              >
                <el-option
                  :value="item.id"
                  :label="item.name"
                  v-for="item in gradeList"
                  :key="item.id"
                >{{item.name}}</el-option>
              </el-select>
              <el-select
                v-model="classId"
                clearable
                @change="changeGrade"
                placeholder="所有班级"
                style="width:150px"
              >
                <el-option
                  :value="item.id"
                  :label="item.name"
                  v-for="item in classesData"
                  :key="item.id"
                >{{item.name}}</el-option>
              </el-select>
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
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column align="center" label="设备ID" width="95">
            <template slot-scope="scope">{{ scope.row.deviceHardwareId }}</template>
          </el-table-column>
          <el-table-column label="年级班级">
            <template slot-scope="scope">{{ scope.row.gradeName }}{{ scope.row.className }}</template>
          </el-table-column>
          <el-table-column label="绑定学生信息" align="center">
            <template slot-scope="scope">
              <p>姓名：{{ scope.row.userName }}</p>
              <p>学号：{{ scope.row.userNumber }}</p>
              <p>优课号：{{ scope.row.uid }}</p>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="在线状态" align="center">
            <template slot-scope="scope">{{scope.row.isOnline ? '当前在线' : '当前离线'}}</template>
          </el-table-column>
          <el-table-column class-name="status-col" label="应用可连接状态" align="center">
            <template slot-scope="scope">
              <div @click="connectBtn(scope.row)" class="cursor">
              <span v-if="scope.row.connectStatus == 0" class="green">全部可连接</span>
              <span v-else-if="scope.row.connectStatus == 1" class="yellow">部分可连接</span>
              <span v-else class="red">全部不可连接</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">挂失</el-button>
              <el-button type="text" size="small">更换</el-button>
              <el-button type="text" size="small">注销</el-button>
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
import { penDeviceMenuList } from "../enum";
import AuthService from "@/_services/auth.service";
import StudentService from "@/_services/student.service";
import DeviceService from "@/_services/device.service";
import connectModalComponent from './connectModal.vue';
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
      gardenId: "",
      gardenList: [],
      menuList: penDeviceMenuList,
      isLeftMenuCenter: false,
      stateList: {
        selectedDevice: 0,
        onLine: 0,
        offLine: 0
      },
      total: 0,
      pageSize: 20,
      currentPage: 1,
      menuActive: 0, //右侧菜单选中的key
      APoptions: [
        {
          value: 0,
          label: "同步应用接入AP信息"
        },
        {
          value: 1,
          label: "挂失"
        },
        {
          value: 2,
          label: "注销"
        }
      ],
      selectAPInfo: 0, //批量选择 应用接入AP连接信息
      classesData: [], //班级列表
      gradeList: [], //年级列表
      gradeId: "", //年级ID
      classId: "", // 班级Id
      isOnline: '',//在线状态
      connectionStatus: '',//应用可连接状态
      keywords: '',
      isShow: false,
      modalOptions: {
        title: "设备开户前准备工作提示",
        centerDialogVisible: true,
        componentName: connectModalComponent,
        cancel: false,
        sure: true,
        params:{},
        showClose: true,
        save:(params,close) => {
          close();
        }
      }
    };
  },
  mounted() {
    this.getGardenList();
    this.getDataList();
    this.isShow = false;
    this.gardenId = this.local$.getItem('gardenId');
  },
  created() {
  },
  methods: {
    changeSelect(val) {
      this.stateList.selectedDevice = val.length;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataList();
    },
    /**
     * 切换园区
     */
    selectGarden(val) {
      this.local$.setItem('gardenId', val);
      this.getGradeList();
      
    },
    /**
     * 获取已开户学生设备列表
     */
    getDataList() {
      this.listLoading = true;

      let params = {
        offset: (this.currentPage - 1) * this.pageSize,
        size: this.pageSize
      };
      if (this.keywords) {
        params.keyWords = this.keywords;
      }
      if(this.gardenId){
        params.gardenId = this.gradeId;
      }
      if(this.classId){
        params.classId = this.classId;
      }
      if(this.gradeId){
        params.gradeId = this.gradeId;
      }
      if(this.isOnline){
        params.isOnline = this.isOnline == 1 ? true : false;
      }
      if(this.connectionStatus){
        params.connectionStatus = this.connectionStatus;
      }
      DeviceService.getListBindStu(params)
        .then(response => {
          this.total = Number(response.xRecordCount);
          this.list = response;
          this.listLoading = false;
        });
    },
    /**
     * 获取园区列表
     */
    getGardenList() {
      AuthService.getGardenList()
        .then(response => {
          this.gardenList = response;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    changeGarden(val) {
      this.getClassesData();
    },
    changeGrade(val) {
      this.getDataList(val);
    },
    changeStatus(){
      this.getDataList();
    },
    /**
     * 清空选项
     */
    clearSelected(rows) {
      this.stateList.selectedDevice = 0;
      this.$refs.multipleTable.clearSelection();
    },
    /**
     * 关键字搜索
     */
    searchBtn() {
      this.currentPage = 1;
      this.getDataList();
    },
    /**
     * 获取班级
     */
    getClassesData() {
      let params = {
        gradeId: this.gradeId
      };
      StudentService.getClassesList(params)
        .then(res => {
          this.classesData = res.data;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    /**
     * 获取年级
     */
    getGradeList() {
      let params = {
        gardenId: this.gardenId
      };
      StudentService.getGradesList(params).then(res => {
        this.gradeList = res.data;
      });
    },
    /**
     * 应用可连接列表
     */
    connectBtn(row){
      console.log(row);
      this.isShow = true;
      this.modalOptions.title = '学生设备可连接应用AP接入及可连接状态信息',
      this.modalOptions.centerDialogVisible = true,
      this.modalOptions.componentName = connectModalComponent;
      this.modalOptions.cancel = false;
      this.modalOptions.sure = true;
      this.modalOptions.params = row;
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
    margin-top: 20px;
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
  .el-col-19 {
    text-align: right;
    padding-right: 10px;
  }
}
</style>