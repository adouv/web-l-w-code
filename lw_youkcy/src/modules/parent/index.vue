<template>
  <div class="lw-view-parentList">
    <div class="lw-view-parentList-header">
      <div class="lw-view-parentList-header-top"></div>
      <div class="lw-view-parentList-header-body">
        <span style="font-size: 20px">家长名单</span>
        <div class="lw-view-parentList-header-body-center">
          <el-select v-model="schoolYear" placeholder="请选择">
            <el-option
              v-for="item in schoolYearsList"
              :key="item.id.toString()"
              :label="item.name.toString()"
              :value="item.id.toString()"
            ></el-option>
          </el-select>
          <el-input placeholder="请输入优课号、学号、姓名" v-model="keyWord">
            <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer"></i>
          </el-input>
        </div>
        <div>
          <el-button @click="addParent()">添加家长</el-button>
          <el-button type="primary" @click="exportparentList()">导出名单</el-button>
        </div>
      </div>
      <div class="lw-view-parentList-header-bottom">
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="班级名单" name="first"></el-tab-pane>
          <el-tab-pane label="考场名单" name="second" :disabled="true"></el-tab-pane>
        </el-tabs> -->
      </div>
    </div>
    <div class="lw-view-parentList-body">
      <div v-show="activeName === 'first'">
        <lw-parent-class-list :gardens="gardenTree" :year="schoolYear" :currentYear="schoolYearIsCurrent" :keyWord="keyWord"></lw-parent-class-list>
      </div>
      <div v-show="activeName === 'second'"></div>
    </div>
  </div>
</template>

<script>
import student from "@/_services/student.service.js";

export default {
  data() {
    return {
      schoolYear: "",
      schoolYearIsCurrent: true,
      schoolYearsList: [],
      keyWord: "",
      gardenTree: [],
      parentList: [],
      activeName: "first"
    };
  },
  created() {
    student.getSchoolYear({ gardenId: Number(this.local$.getItem('gardenId')) }).then(result => {
      this.schoolYearsList = result;
      this.schoolYear = result[0].id.toString();
    });

    student.getClassList({ gardenId: this.local$.getItem('gardenId') }).then(result => {
      result = result.map(element => {
        return (element = Object.assign({}, element, {
          checkAll: false,
          isIndeterminate: false,
          checkClasses: []
        }));
      });
      this.gardenTree = result;
    });
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    addParent() {
      let name = "";
      this.schoolYearsList.forEach(element => {
        if (element.id == this.schoolYear) {
          name = element.name;
        }
      });
      let data = { academicYearId: this.schoolYear, academicYearName: name };
      this.$router.push({
        path: "/parentAdd",
        query: { data }
      });
    },
    exportparentList() {
      
    }
  },
  watch: {
      schoolYear(newName, oldName) {
          let pastYear = [];
          let currentYear = [];
          pastYear = this.schoolYearsList.filter(element => !element.currentYear);
          currentYear = this.schoolYearsList.filter(element => element.currentYear);
          pastYear.forEach(element => {
              if(newName == element.id) {
                  this.schoolYearIsCurrent = false;
              }
          });
          currentYear.forEach(element => {
              if(newName == element.id) {
                  this.schoolYearIsCurrent = true;
              }
          })
      }
  },
};
</script>

<style lang="scss" scoped>
.lw-view-parentList {
  &-header {
    width: 100%;
    margin-top: 10px;
    padding: 0 10px;
    background: white;
    &-top {
      height: 35px;
    }
    &-body {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      &-center {
        display: flex;
        flex-direction: row;
        & .el-select {
          width: 200px;
          margin-right: 20px;
        }
      }
    }
    &-bottom {
      margin-top: 10px;
      height: 54px;
      & .el-tabs {
        position: relative;
        bottom: -16px;
      }
    }
  }
  &-body {
    margin: 20px 20px 40px 20px;
  }
}
</style>