<template>
  <div class="lw-view-studentAdd">
    <div class="lw-view-studentAdd-header">
      <div class="lw-view-studentAdd-header-header"></div>
      <div class="lw-view-studentAdd-header-body">
        <span style="font-size: 20px">添加教职工信息</span>
        <el-button type="primary" class="el-icon-plus" @click="uploadStudensListDialog=true">批量上传</el-button>
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
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model.trim="ruleForm.name"
            maxlength="20"
            @keyup.native="getPinYin"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>

        <el-form-item label="登录名" v-if="ruleForm.pinyin">{{ruleForm.pinyin}}</el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="ruleForm.gender">
            <el-radio-button label="1">男</el-radio-button>
            <el-radio-button label="0">女</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="出生年月">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="ruleForm.birther"
            style="width: 100%;"
            :picker-options="pickerOptions1"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="籍贯">
          <el-col :span="11">
            <el-select placeholder="请选省/直辖市" v-model="ruleForm.province" style="width: 100%;">
              <el-option label="北京" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-col>
          <el-col class="line" :span="2" style="text-align:center;">-</el-col>
          <el-col :span="11">
            <el-select placeholder="请选市" v-model="ruleForm.city" style="width: 100%;">
              <el-option label="北京" value="shanghai"></el-option>
              <el-option label="北京" value="beijing"></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="办公室电话">
          <el-input placeholder="请输入电话" v-model="ruleForm.tel" maxlength="11"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input placeholder="请输入手机号" v-model.trim="ruleForm.phone" maxlength="11"></el-input>
        </el-form-item>

        <el-form-item label="微信号">
          <el-input placeholder="请输入微信号" v-model="ruleForm.wect" maxlength="11"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input placeholder="请输入邮箱" v-model="ruleForm.email" maxlength="11"></el-input>
        </el-form-item>

        <el-form-item label="QQ">
          <el-input placeholder="请输入QQ" v-model="ruleForm.qq" maxlength="11"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="pwd">
          <el-input type="password" placeholder="请输入密码" v-model.trim="ruleForm.pwd" maxlength="11"></el-input>
        </el-form-item>

        <el-form-item label="再次输入密码" prop="rpwd">
          <el-input type="password" placeholder="请输入密码" v-model.trim="ruleForm.rpwd" maxlength="11"></el-input>
        </el-form-item>

        <el-form-item style="margin-top: 40px">
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="lw-view-studentAdd-footer"></div>

    <el-dialog title="批量上传教职工数据" :visible.sync="uploadStudensListDialog" width="600px" center>
      <span>选择批量教职工数据文件:</span>
      <div class="dialog" style="margin-top:10px;">
        <!-- <el-input v-model="fileName"></el-input> -->
        <el-upload
          class="upload-demo"
          :action="'false'"
          :http-request="upload"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
          :on-change="newhandleChange"
          :limit="1"
          :on-exceed="handleExceed"
        >
          <el-button type="primary">选择</el-button>
        </el-upload>
      </div>
      <p>
        *教职工数据文件必须按照标准模板上传
        <span
          style="color: #1296DB; cursor: pointer"
          @click="templateDownLoad()"
        >教职工数据模板下载</span>
      </p>
      <p v-show="fileInfo" style="color:red">文件数据格式错误信息：</p>
      <p v-show="fileInfo" style="display: flex; flex-direction: row">
        <span style="margin-left:20px; margin-right: 60px">excel行列位置</span>
        <span>错误原因</span>
      </p>
      <div v-show="fileInfo" class="error">
        <p v-for="(file,index) in fileInfo" :key="index">
          <span style="margin-left:45px; margin-right: 95px">{{index}}</span>
          <span>{{file}}</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadStudensListDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="uploadStudensListDialog = false"
          :disabled="successUploadFile"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import parent from "@/_services/parent.service.js";
export default {
  name: "TeacherAddComponent",
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
      pickerOptions1: {
        disabledDate(time) {
          var dateTime = new Date(Date.now());
          dateTime = dateTime.setDate(dateTime.getDate() - 1);
          dateTime = new Date(dateTime);
          return time.getTime() >= dateTime;
        }
      },
      id: "",
      uploadStudensListDialog: false,
      successUploadFile: true,
      fileInfo: "",
      ruleForm: {
        name: "", //姓名
        pinyin: "", //姓名拼音
        gender: "0", //性别
        birther: "", //生日
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
    getPinYin() {
      if (this.ruleForm.name) {
        this.utils$.getPinYin(this.ruleForm.name, " ", false).then(response => {
          this.ruleForm.pinyin = response;
        });
      } else {
        this.ruleForm.pinyin = "";
      }
    },
    beforeAvatarUpload(file, files) {
      const isExcel = file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        this.$message.error("上传头像图片只能是 excel格式!");
      }
      return isExcel;
    },
    upload(item, files) {
      let format = new FormData();
      format.append("gardenId", Number(this.local$.getItem("gardenId")));
      format.append("fileData", item.file);
      this.http$
        .post("/lw-garden-server/student/import", format, {
          uploader: true,
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(
          result => {
            this.fileInfo = result.data;
            if (!this.fileInfo) {
              this.successUploadFile = false;
            }
          },
          err => {
            this.successUploadFile = true;
            this.$message({
              message: error.response.data.error_description,
              type: "warning"
            });
          }
        );
    },
    newhandleChange(file, fileList) {
      if (fileList.length >= 2) {
        fileList = fileList.slice(-1);
      }
    },
    handleRemove(file, fileList) {
      this.fileInfo = "";
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 2 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
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