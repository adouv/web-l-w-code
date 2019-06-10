<template>
  <div class="lw-view-studentAdd">
    <div class="lw-view-studentAdd-header">
      <div class="lw-view-studentAdd-header-header">面包屑的位置</div>
      <div class="lw-view-studentAdd-header-body">
        <span v-show="!id" style="font-size: 20px">添加学生信息</span>
        <span v-show="id" style="font-size: 20px">编辑学生信息</span>
        <el-button type="primary" class="el-icon-plus" @click="uploadStudensListDialog=true" v-if="!id">上传学生名单</el-button>
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
        <el-form-item label="学生姓名" prop="name">
          <el-input v-model.trim="ruleForm.name" placeholder="请输入学生姓名"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="number">
          <el-input v-model.trim="ruleForm.number" placeholder="请输入学号" @input="testNumber"></el-input>
        </el-form-item>
        <el-form-item label="性別" prop="gender">
          <el-select v-model="ruleForm.gender" placeholder="请选择性別">
            <el-option
              v-for="(sex,index) in sexs"
              :key="index"
              :label="sex.name"
              :value="sex.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学年" prop="academicYearName">
          <el-input v-model="ruleForm.academicYearName" :disabled="true"></el-input>
        <p v-if="!ruleForm.academicYearName" style="color:#f56c6c;margin:0;line-height:20px">系统检测不到当前时间所在的学年，请在左侧“学年学期管理”栏将当前时间纳入到学年信息后再行添加！</p>
        </el-form-item>
        <el-form-item label="年级" prop="gradeId">
          <el-select v-model="ruleForm.gradeId" placeholder="请选择年级" @visible-change="getZoneLists">
            <el-option
              v-for="grade in gradesList"
              :key="grade.id"
              :label="grade.name"
              :value="grade.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行政班" prop="classId">
          <el-select v-model="ruleForm.classId" placeholder="请选择班级">
            <el-option
              v-for="clazz in classesList"
              :key="clazz.id"
              :label="clazz.name"
              :value="clazz.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否借读" prop="isTransient">
          <el-select v-model="ruleForm.isTransient">
            <el-option
              v-for="(borrowing,index) in borrowings"
              :key="index"
              :label="borrowing.name"
              :value="borrowing.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-top: 40px">
          <!-- <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>-->
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="lw-view-studentAdd-footer"></div>

    <el-dialog title="批量上传学生数据" :visible.sync="uploadStudensListDialog" width="600px" center>
      <span>选择批量学生数据文件:</span>
      <div class="dialog">
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
        *学生数据文件必须按照标准模板上传
        <span
          style="color: #1296DB; cursor: pointer"
          @click="templateDownLoad()"
        >学生数据模板下载</span>
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
import student from "@/_services/student.service.js";
import templateDownLoadService from "@/_services/templateDown.service.js";
export default {
  data() {
    return {
      id: "",
      uploadStudensListDialog: false,
      fileInfo: "",
      successUploadFile: true,
      gradesList: [],
      classesList: [],
      academicYearName: "",
      academicYearId: "",
      ruleForm: {
        name: "",
        number: "",
        gender: true,
        academicYearName: "",
        gradeId: "",
        classId: "",
        isTransient: ""
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
        number: [
          { required: true, message: "请输入学号", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "不能为空且字符不能超过20个字符",
            trigger: "blur"
          }
        ],
        academicYearName: [
          { required: true, message: "请输入学年", trigger: "change" },
          { min: 1, max: 100, message: "请输入规范学年", trigger: "change" }
        ],
        gradeId: [{ required: true, message: "请选择年级", trigger: "change" }],
        classId: [{ required: true, message: "请选择班级", trigger: "change" }]
      },
      sexs: [{ name: "男", value: true }, { name: "女", value: false }],
      borrowings: [{ name: "正常", value: '0' }, { name: "借读", value: '1' }]
    };
  },
  created() {
    let data = this.$route.query.data;
    if (data) {
      this.ruleForm.name = data.name;
      this.ruleForm.number = data.number;
      this.ruleForm.gender = data.gender === "男" ? true : false;
      this.ruleForm.academicYearName = data.academicYearName;
      this.ruleForm.gradeId = data.gradeId ? data.gradeId.toString() : "";
      this.ruleForm.classId = data.classId ? data.classId.toString() : "";
      this.ruleForm.isTransient = data.isTransient ? data.isTransient.toString() : "0";
      // 清空表单后 学年的数据来源
      this.id = data.id;
      this.academicYearName = data.academicYearName;
      this.academicYearId = data.academicYearId;
    }
    student
      .getGradesList({ gardenId: Number(this.local$.getItem("gardenId")) })
      .then(result => {
        this.gradesList = result.data;
      });
  },
  methods: {
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
    templateDownLoad() {
      templateDownLoadService.getStudentTemplateDown();
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.ruleForm, {
            gardenId: Number(this.local$.getItem("gardenId")),
            academicYearName: this.academicYearName,
            academicYearId: this.academicYearId
          });
          if (!this.id) {
            // 添加
            student.postStudentsList(params).then(
              result => {
                this.$message({
                  message: "添加学生成功",
                  type: "success"
                });
                // this.resetForm("ruleForm");
                this.$router.push({ path: "/student" });
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
            student.putStudentsList(params).then(
              result => {
                this.$message({
                  message: "编辑学生成功",
                  type: "success"
                });
                this.$router.push({ path: "/student" });
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
    testNumber() {
       this.$nextTick(() => {
         this.ruleForm.number = this.ruleForm.number.replace(/\D/g, '');
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.academicYearName = this.academicYearName;
    },
    getZoneLists(flag) {
     if(!flag) { // 下拉框收回
        if(this.$route.query.data.gradeId.toString() !== this.ruleForm.gradeId) {  // 当改变选择新的年级 ，清空之前选中的班级
          this.ruleForm.classId = ''
        }
     }
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
  .dialog {
    margin-top: 20px;
    // display: flex;
    // flex-direction: row;
    // justify-content: center;
    .el-input {
      width: 400px;
      margin-right: 20px;
    }
    .upload-demo {
      // position: relative;
      // left: -36%;
      .el-upload {
        width: 70px;
      }
      .el-upload-list {
        // position: absolute;
        // top: 0;
        // right: -130px;
      }
    }
  }
  .error {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: start;
    align-items: flex-start;
    height: 100px;
    overflow-y: auto;
    & > p {
      margin-right: 15px;
    }
  }
}
</style>