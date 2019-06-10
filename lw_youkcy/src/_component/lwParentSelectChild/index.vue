<template>
  <div class="lw-p-component-class-list">
    <el-container>
      <el-aside>
        <div class="lw-p-component-class-list-left-item">
          <div v-for="(garden, index) in gardens" :key="index" style="margin-bottom: 20px">
            <el-checkbox
              :name="index.toString()"
              :indeterminate="garden.isIndeterminate"
              v-model="garden.checkAll"
              @change="handleCheckAllChange"
            >{{garden.name}}</el-checkbox>
            <div style="margin: 10px 20px; font-size: 14px; color: #606266">行政班：</div>
            <div class="lw-p-component-class-list-left-item-checkbox-group-wrap">
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
        <div class="lw-p-component-class-list-right-item">
          <div class="lw-p-component-class-list-right-item-header">
            <el-button type="primary" @click="submit()">提交</el-button>
            <el-select v-model="selectStatus" placeholder="全部状态">
              <el-option
                v-for="item in allStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="lw-p-component-class-list-right-item-body">
            <div class="lw-p-component-class-list-right-item-body-tip">
              已选择{{multipleSelection.length}}项&nbsp;
              <span
                style="cursor: pointer"
                @click="clearSelect()"
              >清空</span>
              <em style="margin-left: 15px; font-style: normal">*您最多可以选择三个学生</em>
            </div>
            <div class="lw-p-component-class-list-right-item-body-table">
              <el-table
                ref="multipleTable"
                :data="studentList"
                tooltip-effect="dark"
                style="width: 100%"
                 :header-cell-style="getRowClass"
              >
                <el-table-column width="55">
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="scope.row.checked"
                      :disabled="scope.row.disable"
                      @change="selectChange(scope.row)"
                    ></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column prop="uid" label="优课学生号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="number" label="学号"></el-table-column>
                <el-table-column prop="gender" label="性别"></el-table-column>
                <el-table-column prop="gradeAndClassName" label="班级"></el-table-column>
                <el-table-column prop="status" label="可用状态"></el-table-column>
                <el-table-column prop="binding" label="绑定状态"></el-table-column>
              </el-table>

              <!-- <div v-show="studentList.length <= 0" >
                <div v-show="!keyWord" style="text-align: center; margin-top: 10px">
                  <img src="../../assets/images/quexing/data_no_result.png" alt="暂无数据">
                </div>
                <div v-show="keyWord" style="text-align: center; margin-top: 10px">
                  <img src="../../assets/images/quexing/search_no_result.png" alt="查询无数据">
                </div>
              </div>-->
            </div>
            <div
              v-show="studentList.length"
              class="lw-p-component-class-list-right-item-body-bottom"
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

export default {
  name: "LWStudentClassListComponent",
  props: ["keyWord", "year", "currentYear", "gardens"],
  data() {
    return {
      allStatus: [
        { label: "全部绑定状态", value: "" },
        { label: "已绑定状态", value: "0" },
        { label: "未绑定状态", value: "1" }
      ],
      selectStatus: "",
      selectGrade: [],
      studentList: [],
      multipleSelection: [],
      flag: true,
      page: {
        page: 1,
        size: 10,
        xRecordCount: 0
      },
      storage: {},
      ParentSelectTags: [],
      id: '',
    };
  },
  methods: {
    // 全局查找学生
    filterStudens() {
      let params = this.getFilterStudensParams();
      student.getStudentsList(params).then(result => {
        this.flag = true;
        this.page.xRecordCount = Number(result.xRecordCount);
        this.studentList = this.endToFontStudentList(result);
      });
    },
    getFilterStudensParams() {
      var params = {};
      params.gardenId = Number(this.local$.getItem('gardenId'));
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
      this.filterStudens();
    },
    // 学生
    endToFontStudentList(data) {
      data = data.map(element => {
        if (this.currentYear) {
          // 当前学年可用
          return (element = Object.assign({}, element, {
            checked: false,
            disable: false,
            gradeAndClassName: `${element.gradeName}_${element.className}`
          }));
        } else {
          // 当前学年不可用
          return (element = Object.assign({}, element, {
            checked: false,
            disable: true,
            gradeAndClassName: `${element.gradeName}_${element.className}`
          }));
        }
      });
      data.forEach(element => {
        if (this.currentYear) {
          // 当前学年可用
          element.status == 1
            ? (element.disable = true)
            : (element.disable = false);
        } else {
          // 当前学年不可用
          element.status == 1
            ? (element.disable = true)
            : (element.disable = true);
        }
        element.status == 1
          ? (element.status = "已禁用")
          : (element.status = "正常");
        element.gender == true
          ? (element.gender = "男")
          : (element.gender = "女");
        element.binding == true
          ? (element.binding = "已绑定")
          : (element.binding = "未绑定");
      });
      data.forEach(element => { // 将路由带过来的对象回显
        this.ParentSelectTags.forEach(item => {
            if(element.id == item.id) {
              element.checked = true;
              // this.multipleSelection.push(element);
            }
        })
      });
      this.multipleSelection = this.ParentSelectTags.concat([]);
      return data;
    },
    selectChange(val) {
      if (val.checked) {
        if (this.multipleSelection.length == 3) {
          val.checked = false;
          this.$message({
            message: "同一家长最多绑定三个学生",
            type: "warning"
          });
          return;
        }
        if (val.binding === "已绑定" && !this.isExidById(val)) {
          console.log(this.ParentSelectTags)
          this.$alert(
            "该学生已经有绑定家长信息，若再次绑定将替换覆盖掉原来的家长信息！",
            "提示",
            {
              confirmButtonText: "确定",
              callback: action => {
                if (action === "confirm") {
                  console.log(this.ParentSelectTags)
                  this.multipleSelection.push(val);
                  console.log(this.ParentSelectTags)
                }
              }
            }
          );
        } else if (val.binding === "未绑定" && !this.isExidById(val)) {
          this.multipleSelection.push(val);
        } else {   // 已经被选择了，禁止再次选择
          val.checked = false;
        }
      } else {
        this.multipleSelection = this.multipleSelection.filter(
          element => element.id != val.id
        );
      }
    },
    clearSelect() {
      this.multipleSelection.forEach(element => {
          this.studentList.forEach(item => {
              if(element.id == item.id) {
                item.checked = false;
              }
          })
      });
      this.multipleSelection = [];
      console.log(this.ParentSelectTags)
    },
    isExidById(id) {
      let bool = this.multipleSelection.some(element => element.id === id);
      return bool;
    },
    submit() {
      this.$router.push({
        path:'/parentAdd',
        query: {
          data: this.multipleSelection,
          from: 'parentSelectChild',
          storage: this.storage,
          id: this.id,
        }
      });
        console.log('bindsubmit'+ this.id);

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
    },
  },
  watch: {
     $route: {
      handler: function(route) {
        this.storage =  route.query.data;
        this.ParentSelectTags = route.query.tags; 
        this.id = route.query.id;
      },
      immediate: true
    },
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
.lw-p-component-class-list {
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
  .el-select {
    width: 160px;
  }
}
</style>