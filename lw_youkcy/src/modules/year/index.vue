<template>
  <div class="lw-view-year">
    <div class="lw-view-year-header">
      <div class="lw-view-year-header-header"></div>
      <div class="lw-view-year-header-body">
        <span style="font-size: 20px">学年列表</span>
        <el-button class="el-icon-plus" @click="addSchoolYear()">添加学年</el-button>
      </div>
    </div>
    <div class="lw-view-year-body">
      <el-container>
        <el-aside width="25%">
          <div class="lw-view-year-body-left">
            <p>操作说明</p>
          </div>
        </el-aside>
        <el-main>
          <div class="lw-view-year-body-right">
            <div class="lw-view-year-body-right-header">
              <el-button type="primary" @click="batchDelete()">批量删除</el-button>
            </div>
            <div class="lw-view-year-body-right-body">
              <div class="lw-view-year-body-right-body-tip">
                已选择{{multipleSelection.length}}项&nbsp;
                <span
                  style="cursor: pointer"
                  @click="toggleSelection()"
                >清空</span>
              </div>
              <div style="margin-top: 20px" class="lw-view-year-body-right-body-table">
                <el-table
                  ref="multipleTable"
                  :data="schoolYearList"
                  tooltip-effect="dark"
                  style="width: 100%"
                  :header-cell-style="getRowClass"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="55" :selectable="unChecked"></el-table-column>
                  <el-table-column prop="name" label="学年名称"></el-table-column>
                  <el-table-column prop="semesterList" label="包含学期">
                    <template slot-scope="scope">
                      <p class="table-inline">
                        <span>{{ scope.row.term1 }}</span>
                        <span>{{ scope.row.term2 }}</span>
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column label="系统学年">
                    <template slot-scope="scope">
                      <p class="table-inline">
                        <span>{{ scope.row.year1 }}</span>
                        <span>{{ scope.row.year2 }}</span>
                      </p>
                    </template>
                  </el-table-column>
                   <el-table-column label="时间段">
                    <template slot-scope="scope">
                      <p class="table-inline">
                        <span>{{ `${scope.row.startTime1}-${scope.row.endTime1}` }}</span>
                        <span>{{ `${scope.row.startTime2}-${scope.row.endTime2}` }}</span>
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="状态"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        @click="editSchoolYear(scope.row)"
                        type="text"
                        size="small"
                        :disabled="!scope.row.check"
                      >编辑</el-button>
                      <el-button
                        @click="delet(scope.row)"
                        type="text"
                        size="small"
                        :disabled="!scope.row.check"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div class="lw-view-year-body-right-footer">
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
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import schoolYear from "@/_services/schoolYear.service.js";

export default {
  data() {
    return {
      schoolYearList: [],
      page: {
        page: 1,
        size: 10,
        xRecordCount: 0
      },
      multipleSelection: [],
      flag: true,
    };
  },
  created() {
    this.getSchoolYearList();
  },
  methods: {
    getSchoolYearList() {
      schoolYear
        .getSchoolYearList({
          gardenId: Number(this.local$.getItem('gardenId')),
          page: this.page.page,
          size: this.page.size
        })
        .then(result => {
          this.page.xRecordCount = Number(result["xRecordCount"]);
          this.schoolYearList = result.filter(
            element => element instanceof Object
          );
          this.schoolYearList = this.addSchoolYearList(this.schoolYearList);
          this.flag = true;
        });
    },
    addSchoolYear() {
      this.$router.push({ path: "/yearAdd" });
    },
    delet(row) {
      schoolYear.deleteSchoolYear({ ids: row.id.toString() }).then(
        result => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getSchoolYearList();
        },
        error => {
          this.$message({
            message: error.response.data.error_description,
            type: "warning"
          });
        }
      );
    },
    batchDelete() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: `请先选择要删除的学年`,
          type: "warning"
        });
        return;
      }
      let ids = [];
      ids = this.multipleSelection.map(element => {
        return element.id;
      });
      schoolYear.deleteSchoolYear({ ids: ids.join(",") }).then(
        result => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.multipleSelection = [];
          this.$refs.multipleTable.clearSelection();
          this.getSchoolYearList();
        },
        error => {
          this.$message({
            message: error.response.data.error_description,
            type: "warning"
          });
        }
      );
    },
    editSchoolYear(data) {
      this.$router.push({
        path: "/yearAdd",
        query: {
          data
        }
      });
    },
    addSchoolYearList(data) {
      data = data.map(element => {
        let addParams = {
          term1: "",
          term2: "",
          year1: "",
          year2: "",
          check: true,
          status: "",
          startTime1: '',
          startTime2: '',
          endTime1: '',
          endTime2: '',
        };
        element.semesterList.forEach((item, index) => {
          addParams["term" + (index + 1)] = item.name;
          addParams["year" + (index + 1)] = item.year;
          addParams['startTime' + (index + 1)] = item.startTime;
          addParams['endTime' + (index + 1)] = item.endTime;
        });
        if (element.status == 0) {
          addParams.check = false;
          addParams.status = "已完成学年";
        } else if (element.status == 1) {
          addParams.check = true;
          addParams.status = "当前学年";
        } else if (element.status == 2) {
          addParams.check = true;
          addParams.status = "未来学年";
        }
        return (element = Object.assign({}, element, addParams));
      });

      return data;
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
    unChecked(row) {
      return row.check;
    },
    handleSelectionChange(val) {
      if (val) {
        this.multipleSelection = val;
      } else {
        this.multipleSelection = [];
      }
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
    "page.page": {
      handler(newName, oldName) {
        if (newName != oldName && this.flag) {
          this.getSchoolYearList();
        }
      },
      deep: true
    },
    "page.size": {
      handler(newName, oldName) {
        if (newName != oldName ) {
          this.flag = false;
          if(this.page.page != 1) {
            this.page.page = 1
          }
          this.getSchoolYearList();
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.lw-view-year {
  &-header {
    width: 100%;
    height: 115px;
    margin-top: 10px;
    padding: 0 10px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    &-header {
    }
    &-body {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
  &-body {
    margin: 20px 20px 40px 20px;
    & .el-aside {
      width: 25% !important;
      height: 100%;
      background: white;
      height: calc(100vh - 235px);
    }
    & .el-main {
      margin-left: 2px;
      height: 100%;
      background: white;
      height: calc(100vh - 235px);
      position: relative;
    }
    &-left {
      padding: 20px;
      & > p {
        height: 30px;
        color: #2e8df3;
        border-bottom: 1px solid #eeeeee;
      }
    }
    &-right {
      &-body {
        &-tip {
          margin-top: 15px;
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
        &-table {
          width: 100%;
          height: calc(100vh - 450px);
          overflow-y: auto;
          color: #606266;
        }
      }
      &-footer {
        position: absolute;
        bottom: 20px;
        right: 10px;
      }
    }
  }

  .table-inline {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>