<template>
  <div class="config_attr_modal">
    <div class="item">
      <span class="label-text">所属年级：</span>
      <a-select v-model="selectGradeId" style="width: 240px;height:30px;" @change="changeGrade">
        <!-- <a-select-option value="jack">Jack</a-select-option> -->
        <a-select-option
          v-for="(grade,index) of gradeList"
          :key="index+'-grade'"
          :value="grade.id"
        >{{grade.name}}</a-select-option>
      </a-select>
    </div>

    <div class="item">
      <span class="label-text">所属课程：</span>
      <a-select v-model="selectSubjectId" style="width: 240px;height:30px;" @change="changeSubject">
        <!-- <a-select-option value="jack">Jack</a-select-option> -->
        <a-select-option
          v-for="(subject,index) of subjectList"
          :key="index+'-subject'"
          :value="subject.subjectCode"
        >{{subject.name}}</a-select-option>
      </a-select>
    </div>

    <div class="item">
      <span class="label-text">应用类型：</span>
      <a-select v-model="selectTypeId" style="width: 240px;height:30px;" @change="changeType">
        <!-- <a-select-option value="jack">Jack</a-select-option> -->
        <a-select-option
          v-for="(typeItem,index) of typeList"
          :key="index+'-type'"
          :value="typeItem.id"
        >{{typeItem.itemValue}}</a-select-option>
      </a-select>
    </div>

    <div class="item">
      <span class="label-text">练习卷名称：</span>
      <a-input class="input-exercise-name" @change="inputChange" placeholder="30个字符以内，必填"/>
    </div>
  </div>
</template>

<script>
import ExerciseService from "../../_services/exercise.service";
import UserService from "../../_ddd/user.service";
export default {
  name: "ConfigAttrModalComponent",
  props: {
    params: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      tabPosition: "top",
      gardenId: "",
      selectGradeId: "",
      selectGradeCode: "",
      selectSubjectId: "",
      selectTypeId: "",
      gradeList: [],
      subjectList: [],
      typeList: [],
      exerciseName: "",
      countInterval: 0,
      exerciseList: []
    };
  },
  mounted() {
    console.log("接收到参数：", this.params);
    this.params.exerciseName = "";
    this.gardenId = UserService.getGardenId();
    this.teacherId = UserService.getUserId();
    // 查询年级列表
    this.queryGradeList();
    this.queryTypeList();
  },
  methods: {
    onSearch(key) {
      console.log(key);
    },
    onChange(e) {
      console.log(`checked = ${e.target.checked}`);
    },
    changeGrade(value) {
      this.selectGradeId = value;
      console.log(`changeGrade-->selected ${value}`);
      this.gradeList.forEach(item => {
        if (item.id == value) {
          this.selectGradeCode = item.gradeCode;
        }
      });
      this.pageNo = 1;
      this.queryGradeList();
    },
    changeSubject(value) {
      this.selectSubjectId = value;
      console.log(`changeSubject-->selected ${value}`);
    },
    changeType(value) {
      this.selectTypeId = value;
      console.log(`changeType-->selected ${value}`);
      this.pageNo = 1;
      this.querySubjectList();
    },
    inputChange(e) {
      console.log("输入框值变化：", e, "exerciseName:", this.exerciseName);
      this.exerciseName = e.target.value;
      this.params.exerciseName = this.exerciseName;
    },
    // 查询所有年级
    queryGradeList() {
      ExerciseService.getGradeList({
        gardenId: this.gardenId,
        teacherId: this.teacherId
      }).then(res => {
        console.log("ConfigAttrModalComponent获取年级接口返回：", res);
        if (res && res.length > 0) {
          if (this.selectGradeId == "") {
            this.selectGradeId = res[0].id;
            this.selectGradeCode = res[0].gradeCode;
          }
          this.gradeList = res;
          this.params.selectGradeId = this.selectGradeId;
          this.querySubjectList();
        }
      });
    },
    // 查询所有学科
    querySubjectList() {
      ExerciseService.getSubjectList({
        gardenId: this.gardenId,
        teacherId: this.teacherId,
        gradeId: this.selectGradeId
      }).then(res => {
        console.log("ConfigAttrModalComponent查询所有学科接口返回：", res);
        if (res && res.length > 0) {
          if (this.selectSubjectId == "") {
            this.selectSubjectId = res[0].subjectCode;
          }
          this.subjectList = res;
          this.params.selectSubjectId = this.selectSubjectId;
        }
      });
    },
    // 查询所有类型
    queryTypeList() {
      ExerciseService.getAllType().then(res => {
        console.log("ConfigAttrModalComponent查询所有类型接口返回：", res);
        if (res) {
          this.typeList = res;
          this.selectTypeId = res[0].id;
          this.params.selectTypeId = this.selectTypeId;
        }
      });
    },
    handleChange() {},
    callback(val) {
      console.log(val);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/scss/index.scss";
.config_attr_modal {
  width: 100%;
  height: 280px;
  // height: 509px;
  text-align: center;
  .item:not(:first-child) {
    margin-top: 30px;
  }
  .item:first-child {
    margin-top: 20px;
  }
  .item {
    .label-text {
      width: 100px;
      display: inline-block;
      text-align: right;
      font-size: 16px;
      color: #333333;
    }
  }
  .cursor-hover {
    cursor: pointer;
  }
  .input-exercise-name {
    width: 240px;
    height: 30px;
  }

  .ant-tabs-bar {
    border-bottom: none;
  }
  .ant-tabs-nav-scroll .ant-tabs-nav .ant-tabs-tab {
    background-color: #ffffff;
    border: solid 1px #dddddd;
    margin-right: 0;
    border-radius: 0;
    padding-bottom: 0;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #333333;
    width: 120px;
    height: 36px;
    line-height: 36px;
    text-align: center;
  }
  .ant-tabs {
    height: 36px;
  }
  // .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  .ant-tabs-nav-scroll .ant-tabs-nav .ant-tabs-tab.ant-tabs-tab-active {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #ffffff;
    background-color: #226cfb;
    height: 36px;
    line-height: 36px;
    text-align: center;
  }
}
</style>