<template>
  <div class="lw-view-studentAdd">
    <div class="lw-view-studentAdd-header">
      <div class="lw-view-studentAdd-header-header"></div>
      <div class="lw-view-studentAdd-header-body">
        <span v-if="!id" style="font-size: 20px">添加家长</span>
        <span v-if="id" style="font-size: 20px">编辑家长</span>
        <!-- <el-button type="primary" class="el-icon-plus" @click="uploadStudensListDialog=true">上传家长名单</el-button> -->
      </div>
    </div>
    <div class="lw-view-studentAdd-body">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="家长姓名" prop="name">
          <el-input v-model.trim="ruleForm.name" placeholder="请输入家长姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model.trim="ruleForm.phone"
            placeholder="请输入手机号"
            maxlength="11"
            @input="testNumber"
            @blur="testNumberFormat()"
          ></el-input>
          <p v-show="phoneFormatError" style="color:#f56c6c;margin:0;line-height:20px">请输入正确格式手机号</p>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model.trim="ruleForm.email" placeholder="请输入电子邮箱"></el-input>
        </el-form-item>
        <el-form-item label="绑定学生">
          <div class="tags">
            <p>
              <el-tag
                v-for="tag in tags"
                :key="tag.name"
                closable
                :type="tag.type"
                @close="tagClose(tag)"
              >{{tag.name}}</el-tag>
            </p>
            <el-button @click="enterBind()" :class="{'errorInfo': tagsWarning}">选择</el-button>
          </div>
          <p
            v-show="tagsWarning"
            style="color: #f56c6c;position: absolute; top: 15px"
          >{{ tagsWarning }}</p>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input type="textarea" :rows="6" v-model="ruleForm.comment" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 40px">
          <!-- <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>-->
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="lw-view-studentAdd-footer"></div>
  </div>
</template>

<script>
import parent from "@/_services/parent.service.js";
export default {
  data() {
    return {
      id: "",
      ruleForm: {
        name: "",
        phone: "",
        email: "",
        comment: ""
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
        phone: [
          { required: true, message: " ", trigger: "blur" },
          {
            min: 1,
            max: 11,
            message: " ",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      phoneFormatError: false,
      tags: [],
      tagsWarning: ""
    };
  },
  created() {
    
    let data = this.$route.query.data;
    let from = this.$route.query.from;
    let ruleFrom = this.$route.query.storage;
    let id = this.$route.query.id;
    if (data && from === "parentFromEdit") {
      this.ruleForm.name = data.name;
      this.ruleForm.phone = data.phone;
      this.ruleForm.email = data.email;
      this.tags = data.studentList.map(element => {
        return (element = Object.assign({}, element, { type: "" }));
      });
      // 清空表单后 学年的数据来源
      this.id = data.id;
    } else if (data && from === "parentSelectChild") {
      this.ruleForm = ruleFrom;
      this.id = id;
      this.tags = data.map(element => {
        return (element = Object.assign({}, element, { type: "" }));
      });
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.tags.length > 0) {
            let tagId = this.tags.map(element => element.id);
            let params = Object.assign({}, this.ruleForm, {
              gardenId: Number(this.local$.getItem("gardenId")),
              studentIds: tagId.join(",")
            });
            if (!this.id) {
              // 添加
              parent.postParent(params).then(
                result => {
                  this.$message({
                    message: "添加家长成功",
                    type: "success"
                  });
                  this.$router.push({ path: "/parent" });
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
              parent.putParent(params).then(
                result => {
                  this.$message({
                    message: "编辑家长成功",
                    type: "success"
                  });
                  this.$router.push({ path: "/parent" });
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
            // 如果没有选择tags
            this.tagsWarning = "请绑定学生";
          }
        } else {
          if (this.tags.length == 0) {
            this.tagsWarning = "请绑定学生";
          }
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.academicYearName = this.academicYearName;
    },
    testNumber() {
      this.$nextTick(() => {
        this.ruleForm.phone = this.ruleForm.phone.replace(/\D/g, "");
      });
    },
    testNumberFormat() {
      let reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
      if (!reg.test(this.ruleForm.phone)) {
        this.phoneFormatError = true;
      } else {
        this.phoneFormatError = false;
      }
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