<template>
  <div class="lw-view-studentAdd">
    <div class="lw-view-studentAdd-header">
      <div class="lw-view-studentAdd-header-header"></div>
      <div class="lw-view-studentAdd-header-body">
        <span style="font-size: 20px">查看教职工信息</span>
      </div>
    </div>
    <div class="lw-view-studentAdd-body">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="优课号" style="height:25px;margin-bottom:10px;">958040989</el-form-item>

        <el-form-item label="姓名" style="height:25px;margin-bottom:10px;">张川</el-form-item>

        <el-form-item label="性别" style="height:25px;margin-bottom:10px;">男</el-form-item>

        <el-form-item label="任教班级" style="height:25px;margin-bottom:10px;">高一_5班</el-form-item>

        <el-form-item label="年龄" style="height:25px;margin-bottom:10px;">36岁</el-form-item>

        <el-form-item label="籍贯" style="height:25px;margin-bottom:10px;">江苏建宁</el-form-item>

        <el-form-item label="用户登录名" style="height:25px;margin-bottom:10px;">zhangchuan</el-form-item>

        <el-form-item label="角色" style="height:25px;margin-bottom:10px;">角色</el-form-item>

        <el-form-item label="办公室电话" style="height:25px;margin-bottom:10px;">010-5612314543</el-form-item>

        <el-form-item label="手机号" style="height:25px;margin-bottom:10px;">18656569696</el-form-item>

        <el-form-item label="微信号" style="height:25px;margin-bottom:10px;">dkljl4545</el-form-item>

        <el-form-item label="邮箱" style="height:25px;margin-bottom:10px;">zhangchuan@163.com</el-form-item>

        <el-form-item label="QQ" style="height:25px;margin-bottom:10px;">455698845</el-form-item>

        <el-form-item label="人脸ID照片">
          <div style="display:flex;padding-top:10px;">
            <img src="../../../assets/images/u4557.jpg" width="130" height="182">
          </div>
        </el-form-item>

        <el-form-item style="margin-top: 40px">
          <el-button type="primary" @click="submitForm('ruleForm')">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="lw-view-studentAdd-footer"></div>
  </div>
</template>

<script>
import parent from "@/_services/parent.service.js";
export default {
  name: "TeacherCheckComponent",
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    var checkRPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (!(value === this.ruleForm.pwd)) {
        return callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      fileList2: [],
      id: "",
      ruleForm: {
        name: "", //姓名
        pinyin: "", //姓名拼音
        gender: "0", //性别
        birther: "2019-03-20", //生日
        place: "", //籍贯
        province: "",
        city: "",
        tel: "", //办公室电话
        phone: "", //手机号
        wect: "", //微信
        email: "", //邮箱
        qq: "", //QQ
        pwd: "", //密码
        rpwd: "" //再次输入密码
      },
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "不能为空且字符不能超过20个字符",
            trigger: "blur"
          }
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "不能为空且字符不能超过20个字符",
            trigger: "blur"
          }
        ],
        rpwd: [{ required: true, validator: checkRPwd, trigger: "blur" }],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }]
      }
    };
  },
  created() {},
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$router.push({ name: "teacherList" });
          return true;
        } else {
          return false;
        }
        // if (valid) {
        //   if (this.tags.length > 0) {
        //     let tagId = this.tags.map(element => element.id);
        //     let params = Object.assign({}, this.ruleForm, {
        //       gardenId: Number(this.local$.getItem("gardenId")),
        //       studentIds: tagId.join(",")
        //     });
        //     if (!this.id) {
        //       // 添加
        //       parent.postParent(params).then(
        //         result => {
        //           this.$message({
        //             message: "添加家长成功",
        //             type: "success"
        //           });
        //           this.$router.push({ path: "/parent" });
        //         },
        //         error => {
        //           this.$message({
        //             message: error.response.data.error_description,
        //             type: "warning"
        //           });
        //         }
        //       );
        //     } else {
        //       // 编辑
        //       params = Object.assign({}, params, { id: this.id });
        //       parent.putParent(params).then(
        //         result => {
        //           this.$message({
        //             message: "编辑家长成功",
        //             type: "success"
        //           });
        //           this.$router.push({ path: "/parent" });
        //         },
        //         error => {
        //           this.$message({
        //             message: error.response.data.error_description,
        //             type: "warning"
        //           });
        //         }
        //       );
        //     }
        //   } else {
        //     // 如果没有选择tags
        //     this.tagsWarning = "请绑定学生";
        //   }
        // } else {
        //   if (this.tags.length == 0) {
        //     this.tagsWarning = "请绑定学生";
        //   }
        //   return false;
        // }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.academicYearName = this.academicYearName;
    },
    enterBind() {
      this.$router.push({
        name: "parentSelectChild",
        query: {
          data: this.ruleForm,
          tags: this.tags || [],
          id: this.id
        }
      });
    },
    tagClose(val) {
      this.tags = this.tags.filter(element => element.id != val.id);
    }
  },
  watch: {
    "ruleForm.gradeId": {
      handler: function(newName, oldName) {
        if (newName != oldName && newName) {
          student.getClassesList({ gradeId: newName }).then(result => {
            this.classesList = result.data;
          });
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    myHeader() {
      return {
        TOKEN: this.local$.getItem("LWToken")
      };
    },
    myData() {
      return {
        gardenId: Number(this.local$.getItem("gardenId")),
        fileName: this.fileName
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.lw-view-studentAdd {
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
        & .el-select,
        .el-button {
          width: 300px;
        }
      }
    }
  }
  .tags {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    p {
      width: 100%;
      .el-tag {
        margin-right: 5px;
      }
    }
    .el-button {
      width: 70px !important;
    }
    &::before {
      content: "*";
      color: #f56c6c;
      position: absolute;
      left: -76px;
      top: 0px;
    }
  }
  .errorInfo {
    border: 1px solid #f56c6c;
    color: #999999;
  }
}
</style>