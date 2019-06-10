<template>
  <div class="lw-p-component-teacher-list">
    <el-container>
      <el-aside v-if="type===0">
        <div class="lw-p-component-teacher-list-left-item">
          <div v-for="(garden, index) in gardens" :key="index" style="margin-bottom: 20px">
            <el-checkbox
              :name="index.toString()"
              :indeterminate="garden.isIndeterminate"
              v-model="garden.checkAll"
              @change="handleCheckAllChange"
            >{{garden.name}}</el-checkbox>
            <div style="margin: 10px 20px; font-size: 14px; color: #606266">行政班：</div>
            <div class="lw-p-component-teacher-list-left-item-checkbox-group-wrap">
              <el-checkbox-group
                v-model="garden.checkClasses"
                @change="handleCheckedClassesChange($event, garden ,garden.id ,index)"
              >
                <el-checkbox
                  v-for="(clazz, index) in garden.classOrganizationList"
                  :label="clazz"
                  :key="index"
                >{{clazz.name}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="lw-p-component-teacher-list-right-item">
          <div class="lw-p-component-teacher-list-right-item-header">
            <div>
              <el-button type="primary" @click="batchDisabled()">批量禁用</el-button>
            </div>
            <div>
              <el-select v-model="selectStatuso" placeholder="所有任课状态" v-if="type===1" style>
                <el-option
                  v-for="item in allKe"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="selectStatus" placeholder="全部状态">
                <el-option
                  v-for="item in allStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="lw-p-component-teacher-list-right-item-body">
            <div class="lw-p-component-teacher-list-right-item-body-tip">
              已选择{{multipleSelection.length}}项&nbsp;
              <span
                style="cursor: pointer"
                @click="toggleSelection()"
              >清空</span>
            </div>
            <div class="lw-p-component-teacher-list-right-item-body-table">
              <el-table
                ref="multipleTable"
                :data="studentList"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="getRowClass"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
              >
                <el-table-column style="cur" type="selection" width="55" :selectable="unChecked"></el-table-column>

                <el-table-column prop="accountId" label="优课号"></el-table-column>

                <el-table-column prop="displayName" label="姓名"></el-table-column>

                <el-table-column label="性别">
                  <template slot-scope="scope">
                    <p class="table-inline">
                      <span>{{ (scope.row.gender===0 && scope.row.gender===null) ? '男' : '女' }}</span>
                    </p>
                  </template>
                </el-table-column>

                <el-table-column label="任教班级">
                  <template slot-scope="scope">
                    <p class="table-inline">
                      <!-- <span v-for="(item,index) in scope.row.ClassList" :key="index">{{item}}</span> -->
                    </p>
                  </template>
                </el-table-column>

                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <p class="table-inline">
                      <!-- <span v-if="scope.row.status">禁用</span>
                      <span v-if="!scope.row.status">启用</span> -->
                      <span>{{scope.row.status}}</span>
                    </p>
                  </template>
                </el-table-column>

                <el-table-column width="200" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      v-if="scope.row.check"
                      @click.stop="handleClick(scope.row)"
                      type="text"
                      size="small"
                      v-show="currentYear"
                    >禁用</el-button>
                    <el-button
                      v-if="!scope.row.check"
                      @click.stop="handleClick(scope.row)"
                      type="text"
                      size="small"
                      v-show="currentYear"
                    >启用</el-button>
                    <el-button
                      @click.stop="$router.push({path:'editTeacher'})"
                      type="text"
                      size="small"
                      v-show="currentYear"
                    >编辑</el-button>
                    <el-button
                      @click.stop="$router.push({path:'setTeacher'})"
                      type="text"
                      size="small"
                      v-show="currentYear"
                    >设置人脸比对ID</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              v-show="studentList.length"
              class="lw-p-component-teacher-list-right-item-body-bottom"
            >
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.page"
                :page-sizes="[10, 20, 40, 80]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.xRecordCount"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import student from "@/_services/student.service.js";
import parentService from "@/_services/parent.service.js";
import teacherService from "@/_services/teacher.service.js";

export default {
  name: "LWTeacherListComponent",
  props: ["keyWord", "year", "currentYear", "gardens", "type"],
  data() {
    return {
      allKe: [
        { label: "所有任课状态", value: "" },
        { label: "任课人员", value: "0" },
        { label: "非任课人员", value: "1" }
      ],
      allStatus: [
        { label: "全部状态", value: "" },
        { label: "正常状态", value: "0" },
        { label: "禁用状态", value: "1" }
      ],
      selectStatuso: "",
      selectStatus: "",
      selectGrade: [],
      studentList: [],
      multipleSelection: [],
      flag: true,
      page: {
        page: 1,
        size: 10,
        xRecordCount: 0
      }
    };
  },

  methods: {
    // 全局查找学生
    filterStudens() {
      //let params = this.getFilterStudensParams();
      teacherService.getTeacherList().then(response => {
        this.studentList = response;
      });
    },

    getFilterStudensParams() {
      var params = {};
      params.gardenId = Number(this.local$.getItem("gardenId"));
      params.academicYearId = this.year || "";
      params.keyWord = this.keyWord || "";
      params.status = this.selectStatus;
      params.classIds = this.selectGrade
        .reduce(function(prev, curr) {
          return prev.concat(curr);
        }, [])
        .map(element => element.id)
        .join(",");
      params.page = this.page.page;
      params.size = this.page.size;
      this.$emit("sendFilterParams", params);
      return params;
    },

    // 班级
    handleCheckAllChange(val, evt) {
      // 根据event对象的name判断当前全部操作属于哪一个年级
      let index = evt.currentTarget.name;
      let garden = this.gardens[index];

      garden.checkClasses = val ? garden.classOrganizationList : [];
      garden.isIndeterminate = false;
      // 将选中的班级放入selectGrade中
      this.selectGrade[index] = garden.checkClasses;
      // 监听数组不成功，采用此种方法
      this.page.page = 1;
      this.page.size = 10;
      this.filterStudens();
    },
    handleCheckedClassesChange(value, garden, pId, index) {
      if (value) {
        let checkedCount = value.length;
        garden.checkAll = checkedCount == garden.classOrganizationList.length;
        garden.isIndeterminate =
          checkedCount > 0 &&
          checkedCount < garden.classOrganizationList.length;
        this.selectGrade[index] = value;
      } else {
        // 改年级下没有选中的班级
        garden.checkAll = false;
        garden.isIndeterminate = false;
        this.selectGrade[index] = [];
      }

      // 监听数组不成功，采用此种方法
      this.page.page = 1;
      this.page.size = 10;
      this.filterStudens();
    },
    handleRowClick(row, column, event) {
      console.log(row, column, event);
      this.$router.push({ name: "checkTeacher" });
    },
    // 家长
    endToFontStudentList(data) {
      data = data.map(element => {
        let addParams = {};
        element.studentList.forEach((item, index) => {
          addParams["studentName" + (index + 1)] = item.name;
          addParams["studentNumber" + (index + 1)] = item.number;
          addParams["studentGender" + (index + 1)] = item.gender;
          addParams["studentgradeAndClass" + (index + 1)] = `${
            item.gradeName ? item.gradeName : ""
          }_${item.calssName ? item.calssName : ""}`;
        });
        if (this.currentYear) {
          // 当前学年可用
          return (element = Object.assign(
            {},
            element,
            {
              check: true
            },
            addParams
          ));
        } else {
          // 当前学年不可用
          return (element = Object.assign(
            {},
            element,
            {
              check: false
            },
            addParams
          ));
        }
      });
      data.forEach(element => {
        if (this.currentYear) {
          // 当前学年可用
          element.status == 1
            ? (element.check = false)
            : (element.check = true);
        } else {
          // 当前学年不可用
          element.status == 1
            ? (element.check = false)
            : (element.check = false);
        }
        element.status == 1
          ? (element.status = "已禁用")
          : (element.status = "正常");
        element.gender == 1 ? (element.gender = "男") : (element.gender = "女");
      });

      console.log(data);
      return data;
    },
    batchDisabled() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: `请选择要删除的数据选项！`,
          type: "warning"
        });
        return;
      }
      let ids = [];
      ids = this.multipleSelection.map(element => {
        return element.id;
      });
      parentService.putParentsForbidden({ ids: ids.join(",") }).then(result => {
        this.filterStudens();
      });
      this.multipleSelection = [];
      this.$refs.multipleTable.clearSelection();
      this.$message({
        message: `批量禁用成功`,
        type: "success"
      });
    },
    handleClick(row) {
      var status;
      if (row.check) {
        status = 1;
      } else {
        status = 0;
      }
      parentService
        .putSingleParentForbidden({ id: row.id, status: status })
        .then(result => {
          if (status == 0) {
            row.status = "正常";
          } else if (status == 1) {
            row.status = "已禁用";
            this.multipleSelection = [];
            this.$refs.multipleTable.clearSelection();
          }
          row.check = !row.check;
          this.$message({
            message: `${row.status}成功`,
            type: "success"
          });
        });
    },
    editStudentAdd(data) {
      this.$router.push({
        path: "/parentAdd",
        query: {
          data,
          from: "parentFromEdit"
        }
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
          this.multipleSelection.push(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
        this.multipleSelection = [];
      }
    },
    handleSelectionChange(val) {
      if (val) {
        this.multipleSelection = val;
      } else {
        this.multipleSelection = [];
      }
    },
    unChecked(row, evt) {
      return row.check;
    },
    handleSizeChange(val) {
      this.page.size = val;
    },
    handleCurrentChange(val) {
      this.page.page = val;
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    }
  },
  watch: {
    year(newName, oldName) {
      if (newName != oldName) {
        if (
          this.selectStatus != "" ||
          this.page.page != 1 ||
          this.page.size != 10
        ) {
          this.flag = false;
          this.selectStatus = "";
          this.page.page = 1;
          this.page.size = 10;
        }
        this.filterStudens();
      }
    },
    keyWord(newName, oldName) {
      if (newName != oldName && this.flag) {
        if (this.page.page != 1 || this.page.size != 10) {
          this.flag = false;
          this.page.page = 1;
          this.page.size = 10;
        }
        this.filterStudens();
      }
    },
    selectStatus(newName, oldName) {
      if (newName != oldName && this.flag) {
        if (this.page.page != 1 || this.page.size != 10) {
          this.flag = false;
          this.page.page = 1;
          this.page.size = 10;
        }
        this.filterStudens();
      }
    },
    "page.page": {
      handler(newName, oldName) {
        if (newName != oldName && this.flag) {
          this.filterStudens();
        }
      },
      deep: true
    },
    "page.size": {
      handler(newName, oldName) {
        if (newName != oldName && this.flag) {
          if (this.page.page != 1) {
            this.page.page = 1;
          }
          this.filterStudens();
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.lw-p-component-teacher-list {
  width: 100%;
  .el-aside {
    width: 25% !important;
    height: 100%;
    background: white;
    height: calc(100vh - 260px);
    .el-checkbox {
      margin-right: 25px !important;
      min-width: 25%;
    }
    .el-checkbox + .el-checkbox {
      margin: 0;
    }
  }
  .el-main {
    margin-left: 2px;
    height: 100%;
    background: white;
    height: calc(100vh - 260px);
  }
  &-left-item {
    margin: 20px;
    &-checkbox-group-wrap {
      margin-left: 20px;
      .el-checkbox {
        margin-bottom: 10px !important;
      }
    }
  }
  &-right-item {
    height: 100%;
    position: relative;
    &-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    &-body-tip {
      margin-top: 10px;
      height: 30px;
      line-height: 30px;
      text-indent: 24px;
      border-radius: 5px;
      background: rgba(102, 177, 255, 0.5);
      opacity: 0.5;
      color: black;
      & > span {
        color: #007dff;
      }
    }
    &-body-table {
      margin-top: 20px;
      width: 100%;
      height: calc(100vh - 450px);
      overflow-y: auto;
      color: #606266;
    }
    &-body-bottom {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
  .table-inline {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .el-select {
    width: 160px;
  }
}
</style>