<template>
  <div class="lw-view-yearAdd">
    <div class="lw-view-yearAdd-header">
      <div class="lw-view-yearAdd-header-header"></div>
      <div class="lw-view-yearAdd-header-body">
        <span v-if="!id" style="font-size: 20px">添加学年</span>
        <span v-if="id" style="font-size: 20px">编辑学年</span>
      </div>
    </div>
    <div class="lw-view-yearAdd-body">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="学年名称" prop="name">
          <el-input v-model.trim="ruleForm.name"></el-input>
        </el-form-item>
        <div>
          <p>所含学期及时间段:</p>
          <div class="term">
            <el-form-item label="秋季学期" prop="autumnTerm">
              <el-date-picker
                v-model="ruleForm.autumnTerm"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="pickAutumnTime"
              ></el-date-picker>
            </el-form-item>
            <span class="term-year">所属系统学年：{{ruleForm.autumnTerm && ruleForm.autumnTerm.length > 0 ? ruleForm.autumnTerm[0].slice(0,4) : ''}}</span>
          </div>
          <div class="term">
            <el-form-item label="春季学期" prop="springTerm">
              <el-date-picker
                v-model="ruleForm.springTerm"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="pickSpringTime"
              ></el-date-picker>
            </el-form-item>
            <span class="term-year">所属系统学年：{{ruleForm.springTerm && ruleForm.springTerm.length > 0 ? ruleForm.springTerm[0].slice(0,4) : ''}}</span>
          </div>
        </div>
        <el-form-item style="margin-top: 40px">
          <!-- <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>-->
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="lw-view-yearAdd-footer"></div>
  </div>
</template>

<script>
import schoolYearService from "@/_services/schoolYear.service.js";
export default {
  data() {
    return {
      id: "",
      ruleForm: {
        name: "",
        autumnTerm: [],
        springTerm: []
      },
      rules: {
        name: [
          { required: true, message: "请输入学年名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "不能为空且字符不能超过20个字符",
            trigger: "blur"
          }
        ],
        autumnTerm: [
          { required: true, message: "请选择日期", trigger: "change" }
        ],
        springTerm: [
          { required: true, message: "请选择日期", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    getDate(type) {
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      if (type === "ymd") {
        // year month day
        return year + "-" + month + "-" + day;
      } else if (type === "y") {
        return year;
      }
    },
    pickAutumnTime(times) {
      if (times.length > 0) {
        // 当秋季学年已选中，春季学年必须在秋季学年之后
        if (this.ruleForm.springTerm.length > 0) {
          if (
            new Date(this.ruleForm.autumnTerm[1]).getTime() >
            new Date(this.ruleForm.springTerm[0]).getTime()
          ) {
            this.$message({
              message: "所选春季学年与秋季学年冲突",
              type: "warning"
            });
            this.ruleForm.autumnTerm = [];
            return;
          }

          // 两个学期必须间隔一年
          let autumnYear = new Date(times[0]).getFullYear();
          let springYear = new Date(this.ruleForm.springTerm[1]).getFullYear();
          if (springYear - autumnYear >= 2 || springYear - autumnYear === 0) {
            this.$message({
              message: "所选春季学年与秋季学年不符合规范",
              type: "warning"
            });
            this.ruleForm.autumnTerm = [];
          }
        }
      }
    },
    pickSpringTime(times) {
      if (times.length > 0) {
        let currentDay = this.getDate("ymd");
        // 当秋季学年已选中，春季学年必须在秋季学年之后
        if (this.ruleForm.autumnTerm.length > 0) {
          if (
            new Date(this.ruleForm.autumnTerm[1]).getTime() >
            new Date(this.ruleForm.springTerm[0]).getTime()
          ) {
            this.$message({
              message: "所选秋季学年与春季学年冲突",
              type: "warning"
            });
            this.ruleForm.springTerm = [];
            return;
          }
        }

        // 判断春季日期是否小于当前日期
        if (new Date(times[1]).getTime() <= new Date(currentDay).getTime()) {
          this.$message({
            message: "不能添加历史学年",
            type: "warning"
          });
          this.ruleForm.autumnTerm = [];
          this.ruleForm.springTerm = [];
          return;
        }
      }
      // 两个学期必须间隔一年
      let autumnYear = new Date(this.ruleForm.autumnTerm[0]).getFullYear();
      let springYear = new Date(times[1]).getFullYear();
      if (springYear - autumnYear != 1) {
        this.$message({
          message: "所选秋季学年与春季学年不符合规范",
          type: "warning"
        });
        this.ruleForm.springTerm = [];
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.postParams();
          if (!this.id) {
            // 添加
            schoolYearService.postSchoolYear(params).then(
              result => {
                this.$message({
                  message: "添加学年成功",
                  type: "success"
                });
                this.$router.push({ path: "/year" });
              },
              error => {
                this.$message({
                  message: error.response.data.error_description,
                  type: "warning"
                });
              }
            );
          } else {
            // 编辑
            params = Object.assign({}, params, { id: this.id });
            schoolYearService.putSchoolYear(params).then(
              result => {
                this.$message({
                  message: "编辑学年成功",
                  type: "success"
                });
                this.$router.push({ path: "/year" });
              },
              error => {
                this.$message({
                  message: error.response.data.error_description,
                  type: "warning"
                });
              }
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    postParams() {
      let params = {};
      params.gardenId = Number(this.local$.getItem("gardenId"));
      params.name = this.ruleForm.name;
      params["semesterList[" + 0 + "].name"] = "秋季学期";
      params["semesterList[" + 0 + "].startTime"] = this.ruleForm.autumnTerm[0];
      params["semesterList[" + 0 + "].endTime"] = this.ruleForm.autumnTerm[1];
      params["semesterList[" + 1 + "].name"] = "春季学期";
      params["semesterList[" + 1 + "].startTime"] = this.ruleForm.springTerm[0];
      params["semesterList[" + 1 + "].endTime"] = this.ruleForm.springTerm[1];
      return params;
    }
  },
  created() {
    let data = this.$route.query.data;
    if (data) {
      this.id = data.id;
      this.ruleForm.name = data.name;
      this.ruleForm.autumnTerm = [
        data.semesterList[0]["startTime"],
        data.semesterList[0]["endTime"]
      ];
      this.ruleForm.springTerm = [
        data.semesterList[1]["startTime"],
        data.semesterList[1]["endTime"]
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.lw-view-yearAdd {
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
    padding: 20px;
    background: white;
    & .el-form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      & .el-form-item {
        width: 400px;
        & .el-input,
        .el-select,
        .el-button {
          width: 400px;
        }
        & .el-date-editor {
          width: 400px;
        }
      }
     
    }
  }
   .term {
        position: relative;
        .term-year {
          position: absolute;
          right: -340px;
          bottom: 10px;
          width: 200px;
        }
        
      }
}
</style>