<template>
  <div class="lw-view-studentAdd">
    <div class="lw-view-studentAdd-header">
      <div class="lw-view-studentAdd-header-header"></div>
      <div class="lw-view-studentAdd-header-body">
        <span style="font-size: 20px">设置教职工人脸比对ID</span>
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
        <el-form-item label="优课号" style="height:25px;margin-bottom:10px;">958040989</el-form-item>

        <el-form-item label="姓名" style="height:25px;margin-bottom:10px;">张川</el-form-item>

        <el-form-item label="性别" style="height:25px;margin-bottom:10px;">男</el-form-item>

        <el-form-item label="任教班级" style="height:25px;margin-bottom:10px;">高一_5班</el-form-item>

        <el-form-item label="年龄" style="height:25px;margin-bottom:10px;">36岁</el-form-item>

        <el-form-item label="籍贯" style="height:25px;margin-bottom:10px;">江苏建宁</el-form-item>

        <el-form-item label="人脸ID照片" prop="email">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList2"
            list-type="picture"
          >
            <el-button size="small" type="primary" style="width:100px;display:inline;">点击上传</el-button>
            <el-tooltip placement="right" style="width:100px;display:inline;">
              <div
                slot="content"
                style="width:200px;"
              >1、必须是教职工的免冠白底或蓝底的面部清晰(不带眼睛不化妆)、正常曝光且符合正常证件照拍摄要求的工作证件照；
                <br>2、为了系统能够更好的准确的实现比对，照片不能是经过美化和过度的后期处理的照片，同时最好是教职工本人3年以内所拍摄的照片；
                <br>3、照片格式只支持jpg、jpeg、png原生格式，大小最大不超过2M；不支持格式二次编辑或损坏的文件。
                <br>说明：此处的限制要求说明还要根据所选用的AI摄像头的照片ID要求进行二次灵活修改。
              </div>
              <el-button size="small" style="border:none; color:blue;">上传要求?</el-button>
            </el-tooltip>
          </el-upload>
        </el-form-item>
        
        <el-form-item>
          <div>
            <div slot="tip" class="el-upload__tip">符合要求的人脸ID照片示例:</div>
            <div slot="tip" class="el-upload__tip" style="display:flex;">
              <img src="../../../assets/images/u4557.jpg" width="130" height="182">
              <span style="height:182px;line-height:182px;padding:0 5px;">或</span>
              <img src="../../../assets/images/u4561.jpg" width="130" height="182">
            </div>
          </div>
        </el-form-item>

        <el-form-item style="margin-top: 40px">
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="lw-view-studentAdd-footer"></div>

    <el-dialog title="批量上传教职工人脸比对ID照片" :visible.sync="uploadStudensListDialog" width="600px" center>
      <span>选择批量教职工人脸比对ID数据压缩包文件:</span>
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
        *右侧的标准模板压缩包每次下载时均包含当前园区全部最新的教职工信息
        <span
          style="color: #1296DB; cursor: pointer"
          @click="templateDownLoad()"
        >标准模板压缩包下载</span>
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
  name: "TeacherSetComponent",
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
      uploadStudensListDialog: false,
      successUploadFile: true,
      fileInfo: "",
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
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        email: [
          { required: true, message: "请选择人脸ID照片", trigger: "blur" }
        ]
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