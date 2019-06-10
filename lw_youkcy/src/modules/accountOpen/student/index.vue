<template>
  <div class="app-container">
    <lw-modal :options="modalOptions" v-if="isShow"></lw-modal>
    <el-header>园区绑定</el-header>
    <el-container>
      <el-aside width="300px">
        <div class="grid-content">
          <lw-park-left-menu
            :menu="menuList"
            :isCenter="isLeftMenuCenter"
            :stateList="stateList"
            :menuActive="menuActive"
            :leftStuOpen="leftStuOpen"
          ></lw-park-left-menu>
        </div>
      </el-aside>
      <el-main>
        <el-row class="select-park">
          <el-col :span="24">
            <div class="grid-content">
              <el-button type="primary" @click="accountOpen" :disabled="studentList.length==0">提交开户</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row class="search">
          <el-col :span="4">
            <div class="grid-content">
              <el-input
                placeholder="姓名、学号搜索"
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
          <el-col :span="14">
            <div class="grid-content">
              已选择{{stateList.selectedDevice}}项
              <el-button type="text" @click="clearSelected">清空</el-button>
            </div>
          </el-col>
          <el-col :span="10" style="text-align:right;padding-right:10px">
            <el-select
              v-model="gradeId"
              @change="changeGarden"
              placeholder="所有年级"
              clearable
              style="width:140px"
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
              @change="changeGrade"
              placeholder="所有班级"
              clearable
              style="width:140px"
            >
              <el-option
                :value="item.id"
                :label="item.name"
                v-for="item in classesData"
                :key="item.id"
              >{{item.name}}</el-option>
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
          <el-table-column align="center" label="优课号" width="95">
            <template slot-scope="scope">{{ scope.row.uid }}</template>
          </el-table-column>
          <el-table-column label="学籍号">
            <template slot-scope="scope">{{ scope.row.number }}</template>
          </el-table-column>
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="性别" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.gender? '男' : '女' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="所在年级班级" width="200">
            <template slot-scope="scope">
              <template>{{ scope.row.gradeName }}{{ scope.row.className }}</template>
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
import { accountOpenMenuList } from "../../enum";
import StudentService from "@/_services/student.service";
import DeviceService from "@/_services/device.service";
import BackInfoModalComponent from "./backInfoModal.vue";
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
      menuList: accountOpenMenuList,
      isLeftMenuCenter: false,
      leftStuOpen: true, //学生开户，左侧不显示菜单项
      stateList: {
        selectedDevice: 0,
        onLine: 0,
        offLine: 0
      },
      total: 30,
      pageSize: 20,
      currentPage: 1,
      menuActive: 1, //右侧菜单选中的key
      keywords: "",
      classesData: [], //班级列表
      gradeList: [], //年级列表
      gradeId: '', //年级ID
      classId: '', // 班级Id
      isBatch: 0, // 设备是否全选
      isStudentBatch: false, //学生是否全选
      studentList: [], //学生列表
      isShow: false,
      modalOptions: {
        title: "",
        centerDialogVisible: true,
        componentName: BackInfoModalComponent,
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
    this.gardenId = this.$route.query.gardenId
      ? this.$route.query.gardenId
      : "";
    this.isBatch = this.$route.query.isBatch ? this.$route.query.isBatch : 0;
    this.getGradeList();
    this.getDataList();
  },
  created() {},
  methods: {
    changeSelect(row) {
      this.stateList.selectedDevice = row.length;
      this.studentList = row;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataList();
    },
    changeGarden(val) {
      this.getClassesData();
    },
    changeGrade(val) {
      this.getDataList(val);
    },
    /**
     * 全选
     */
    selectAll(rows) {
      this.isStudentBatch = rows.length > 0 ? true : false;
      this.stateList.selectedDevice = rows.length > 0 ? this.total : 0;
      this.studentList = rows;
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
     * 获取学生列表
     */
    getDataList(classId) {
      this.listLoading = true;
      let params = {
        //offset: (this.currentPage - 1) * this.currentPage,
        size: this.pageSize,
        gardenId: this.gardenId,
        gradeId: this.gradeId,
        classId: classId ? classId : this.classId,
        page: this.currentPage
      };
      if (this.keywords) {
        params.keyWord = this.keywords;
      }
      StudentService.getStudentList(params)
        .then(response => {
          this.total = Number(response.xRecordCount);
          this.list = response;
          this.listLoading = false;
        })
        .catch(error => {
          this.$message.error(error);
        });
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
          //this.classId = res.data[0].id;
          this.getDataList();
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
        // this.gradeId = res.data[0].id;
        //this.getClassesData();
      });
    },
    /**
     * 提交开户
     */
    accountOpen() {
      let params = {
        gardenId: this.gardenId
      };
      if (this.isBatch != 1) {
        let parkInfo = this.local$.getItem("parkInfo")
          ? JSON.parse(this.local$.getItem("parkInfo"))
          : "";

        let deviceIds = "";
        parkInfo.forEach(Element => {
          deviceIds += Element.id + ",";
        });
        params.deviceIds = deviceIds.substring(0, deviceIds.lastIndexOf(","));
      }
      let studentIds = "";
      this.studentList.forEach(Element => {
        studentIds += Element.id + ",";
      });
      studentIds = studentIds.substring(0, studentIds.lastIndexOf(","));
      if (this.isStudentBatch) {
        params.gradeId = this.gradeId;
        params.classId = this.classId;
        params.keyWords = this.keywords;
      } else {
        params.studentIds = studentIds;
      }
      DeviceService.bindStudent(params).then(response => {
        console.log(response);
        this.isShow = true;
        this.modalOptions.params = {
          widthVal: 0,
          title: "正在为设备开户...",
          info: response
        };
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