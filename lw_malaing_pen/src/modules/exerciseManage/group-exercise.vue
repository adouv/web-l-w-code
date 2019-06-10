<template>
  <div class="group_exercise">
    <div class="content-container">
      <a-tabs class="height-100"  style="text-align: left;">
        <a-tab-pane tab="手动组卷" key="1">
          <div  style="text-align: center;">
            <a-select defaultValue="全部题类" style="width: 240px;height:30px;" @change="handleChange">
              <a-select-option
                v-for="(item,index) of questionCategoryList "
                :key="index+'-category'"
                :value="item.id"
              ></a-select-option>
            </a-select>

            <a-select defaultValue="全部题型" style="width: 240px;height:30px;" @change="handleChange">
              <a-select-option
                v-for="(item,index) of questionTypeList "
                :key="index+'-type'"
                :value="item.id"
              ></a-select-option>
            </a-select>

            <a-select
              defaultValue="全部试题阶梯属性"
              style="width: 240px;height:30px;"
              @change="handleChange"
            >
              <a-select-option
                v-for="(item,index) of questionAttributeList "
                :key="index+'-attribute'"
                :value="item.id"
              ></a-select-option>
            </a-select>
            <span class="total-exercise">共计{{questionList.length}}道题</span>
          </div>

          <div class="exercise-list">
            <div class="exercise-item" v-for="(item,index) of questionList" :key="index">
              <div class="item-left">
                <div class="exercise-title">第{{index+1}}题</div>
                <div class="exercise-content">{{item.content}}</div>
                <div class="exercise-labels">
                  <span class="label-text label-caption">章节:</span>
                  <span class="label-value label-caption-value"></span>
                  <span class="label-text label-knowledge">知识点:</span>
                  <span class="label-value label-knowledge-value"></span>
                  <span class="label-text label-require">认知要求和能力标准:</span>
                  <span class="label-value label-require-value"></span>
                  <span class="label-text label-attribute">试题阶梯属性:</span>
                  <span class="label-value label-attribute-value"></span>
                </div>
              </div>
              <div class="item-right">
                <div class="config-properties" @click="configProperties(item,index)">配置属性</div>
                <div class="remove-properties" @click="deleteQuestion(item,index)">移出组卷</div>
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="自动组卷" key="2">
          <div style="width:100%;height:100%;"></div>
        </a-tab-pane>
        <a-button slot="tabBarExtraContent" type="primary" icon="plus" @click="addExercise">添加试题</a-button>
      </a-tabs>

      <!-- 添加组卷 弹窗 -->
      <div>
        <!-- <lw-add-exercise></lw-add-exercise> -->
      </div>
    </div>
    <div class="footer-container">
      <a-button class="cancel" @click="cancelExercise">取消</a-button>
      <a-button class="submit-exercise" type="primary" @click="commitExercise">提交组卷</a-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import ExerciseService from "../../_services/exercise.service";
import UserService from "../../_ddd/user.service";
import ResponderModalComponent from "./responderModal.vue";
import ConfigAttrModalComponent from "./configAttrModal";
import ConfigStepAttrModalComponent from "./configStepAttrModal";
import { Modal } from "ant-design-vue";

const plainOptions = ["Apple", "Pear", "Orange"];
const defaultCheckedList = ["Apple", "Orange"];
export default {
  name: "GroupExerciseComponent",
  data() {
    return {
      tabPosition: "top",
      questionCategoryList: [],
      questionTypeList: [],
      questionAttributeList: [],
      questionList: [],
      gardenId: "",
      teacherId:"",
      practicePaperId: "",
      questionClassId: "",
      questionTypeId: "",
      ladderPropertiesId: "",
      pageNo:1,
      keyword: "",
      configAtrrInfo: {},
      offset: 50,
      isLoading: false,
      hasMore: true,
      visible: false
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.gardenId = UserService.getGardenId();
      this.teacherId = UserService.getUserId();
    // 查询练习卷下所有题
    this.getPracticeQuestionList();
  },
  methods: {
    callback(val) {
      console.log(val);
    },
    showModal() {
      this.visible = true;
    },
    hideModal() {
      this.visible = false;
    },
    cancelExercise() {
      this.$router.push("/exerciseManage");
    },
    // 查询练习卷下所有题
    getPracticeQuestionList() {
      let params = {
        gardenId: this.gardenId,
        practicePaperId: this.practicePaperId,
        questionClassId: this.questionClassId,
        questionTypeId: this.questionTypeId,
        ladderPropertiesId: this.ladderPropertiesId,
        pageNo:this.pageNo//多余
      };
      ExerciseService.getPracticeQuestionList(params).then(res => {
        console.log("手动组卷页面获取题列表接口：", res);
        if (res) {
          this.questionList = res;
        }
      });
    },
    deleteQuestion(item, index) {
      let params = {
        gardenId: this.gardenId,
        practicePaperId: this.practicePaperId,
        questionId: item.questionId
      };
      ExerciseService.deletePracticeQuestion(params).then(res => {
        console.log("组卷页面删除题接口：", res);
        if (res&&res.status=="success") {
          this.questionList.splice(index, 1);
        } 
      });
    },

    configProperties(item,index) {
      console.log("item,index",item,index);
        let options = {};
      let myThis = this;
      options.title = "配置属性";
      options.componentName = ConfigStepAttrModalComponent;
      options.height = 600;
      options.width = 1000;
      options.showSave = true;
      options.saveText = "确定";
      options.params = {
       questionItem:item,
       index:index,
        practicePaperId: this.practicePaperId,
        stepAttrInfo:{propertiesIdsStr:"",properties:[]},
      };
      /*   : "默认标题",
        showTitle: true,
        cleanText: "取消",
        : , */
      options.isShow = true;
      options.showFooter = true;
      options.zpButton = false;
      options.idName = "modal-config-step-attr";
      options.save = (params, info) => {
        console.log(
          "弹框保存",
          params,
         params.attrList
        );
        //  options.isShow=true;
        let showModal = true;
      let isValid=true;
      if(params.stepAttrInfo.properties){
        params.stepAttrInfo.properties.forEach((item,index,arr)=>{
          if(item.canAdd=="1"){
            item.option.forEach(option=>{
              if(option.content==""){
                isValid=false;
              }
            })
          }
        })
      }else{
        isValid=false;
      }
 if(isValid) {
    showModal = false;
 }
       
        this.$eventHub.$emit("showConfigStepModal", showModal);
        if (!showModal) {
          this.saveQuestionProperties(item,params);
         params.stepAttrInfo={};
        } else {
          this.$message.info("请配置属性!");
        }
      };
      options.closes = params => {
        console.log("弹框关闭，注销事件showConfigStepModal");
        this.$eventHub.$off("showConfigStepModal");
        params.stepAttrInfo={};
      };
      this.modal$(options);
    },
    saveQuestionProperties(question,params){
      let stepStr=JSON.stringify(params.stepAttrInfo.properties)
console.log("stepStr:",stepStr,typeof stepStr);
         let requestParams = {
          practicePaperId: this.practicePaperId,
          gardenId: this.gardenId,
          questionId:question.questionId,
      questionPropertiesId:params.stepAttrInfo.propertiesIdsStr,
      steps:"a"
        };
        ExerciseService.saveQuestionProperties(requestParams).then(res => {
          console.log("保存习题属性接口返回：", res);
          if (res) {
          }
        });
    },
    addPracticeQuestion(params) {
      let questionIds = "";
      if (params.onceStatusList && params.onceStatusList.length > 0) {
        params.onceStatusList.forEach((item, index, arr) => {
          if (item.checked) {
            questionIds += item.questionId + ",";
          }
        });
        questionIds = questionIds.substring(0, questionIds.length - 1);
        let requestParams = {
          practicePaperId: this.practicePaperId,
          gardenId: this.gardenId,
          teacherId:this.teacherId,
          questionClassId: this.questionClassId,
          questionTypeId: this.questionTypeId,
          questionIds: questionIds
        };
        ExerciseService.addPracticeQuestion(requestParams).then(res => {
          console.log("向组卷添加习题接口返回：", res);
          if (res) {
            this.practicePaperId = res.practicePaperId;
            // 添加成功，向列表中添加
            this.syncExerciseList(params.onceStatusList);
          }
        });
        // 添加成功，向列表中添加
        // this.syncExerciseList(params.onceStatusList);
      }
    },
    syncExerciseList(onceStatusList) {
      let tmpList = [];
      if (this.questionList.length == 0) {
        onceStatusList.forEach(question => {
          if (question.checked) {
            this.questionList.push(question);
          }
        });
      } else {
         onceStatusList.forEach(item => {
          if (
            item.checked &&
            !this.isContain(this.questionList, item.questionId)
          ) {
            tmpList.push(item);
          }
        });
        if(tmpList&&tmpList.length>0){
          tmpList.forEach(item=>{
            this.questionList.unshift(item);
          })
        }
        // this.questionList = this.questionList.unshift(...tmpList);
        // this.questionList = this.questionList.concat(tmpList);
      }
      console.log("添加后的习题列表：", this.questionList);
      // 重新查询习题列表or本地操作
      // this.getPracticeQuestionList();
    },
    isContain(list, questionId) {
      let flag = false;
      list.forEach(item => {
        if (item.questionId == questionId) {
          flag = true;
        }
      });
      return flag;
    },
    addExercise(show = true) {
      let options = {};
      let myThis = this;
      options.title = "添加试题";
      options.componentName = ResponderModalComponent;
      options.height = 600;
      options.width = 1000;
      options.showSave = true;
      options.saveText = "确定";
      options.params = {
        savedExerciseList: this.questionList,
        onceStatusList: []
      };
      /*   : "默认标题",
        showTitle: true,
        cleanText: "取消",
        : , */
      options.isShow = true;
      options.showFooter = true;
      options.zpButton = false;
      options.idName = "modal-add-exercise";
      options.save = (params, info) => {
        console.log(
          "弹框保存",
          params.savedExerciseList,
          params.onceStatusList
        );
        //  options.isShow=true;
        let showModal = true;
        params.onceStatusList.forEach(item => {
          if (item.checked) {
            showModal = false;
          }
        });
        this.$eventHub.$emit("showModal", showModal);
        if (!showModal) {
          // 添加习题
          this.addPracticeQuestion(params); // 是否需要调用接口？？？
        } else {
          // this.$message.info("请选择习题!");
          this.$message.info("请选择习题!");
          //  this.$message.info('This is a normal message');
        }
      };
      options.closes = params => {
        console.log("弹框关闭，注销事件showModal");
        this.$eventHub.$off("showModal");
      };
      // Vue.modal$(options);
      this.modal$(options);
    },
    isEmptyConfig(params) {
      /* for(let key in params){
        console.log(typeof key)
      } */
      return (
        params.selectGradeId &&
        params.selectSubjectId &&
        params.selectTypeId &&
        params.exerciseName
      );
    },
    commitExercise(show = true) {
      //判断参数是否为空
      /*    if (this.isEmptyConfig(this.configAtrrInfo)) {
          // 保存组卷
          this.savePractice(this.configAtrrInfo);
          return;
      } */
      let options = {};
      let myThis = this;
      options.title = "配置练习卷属性";
      options.componentName = ConfigAttrModalComponent;
      options.height = 350;
      options.width = 500;
      options.showSave = true;
      options.saveText = "确定";
      options.params = this.configAtrrInfo;
      /*   : "默认标题",
        showTitle: true,
        saveText: "保存",
        cleanText: "取消",
        : , */
      options.showFooter = true;
      options.zpButton = false;
      options.idName = "modal-config-properties";
      options.save = (params, info) => {
        console.log("弹框保存", params, this.configAtrrInfo,this.questionList);
        let showModal = true;
        if (this.isEmptyConfig(params)) {
          showModal = false;
          if (this.questionList.length == 0) {
            this.$message.info("请添加练习题!");
          } else {
            // 保存组卷
            this.savePractice(params);
          }
        } else {
          this.$message.info("请配置练习卷属性!");
        }
        this.$eventHub.$emit("showConfigAttrModal", showModal);
      };
      options.closes = params => {
        this.configAtrrInfo = {};
        console.log("弹框关闭，注销事件showConfigAttrModal");
        this.$eventHub.$off("showConfigAttrModal");
      };
      this.modal$(options);
    },
    savePractice(options) {
      let params = {
        practicePaperId: this.practicePaperId,
        gardenId: this.gardenId,
        gradeCode: options.selectGradeCode,
        subjectCode: options.selectSubjectId,
        applicationTypeId: options.selectTypeId,
        name: options.exerciseName
      };
      ExerciseService.savePractice(params).then(res => {
        console.log("保存练习卷接口返回：", res);
        if (res) {
          this.configAtrrInfo = {};
          let message =
            res && res.status != "failure"
              ? "保存练习卷成功！"
              : "保存练习卷失败！";
          this.$message.info(message);
          this.$router.push("/exerciseManage");
        }
      });
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < plainOptions.length;
      this.checkAll = checkedList.length === plainOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      });
    },
    switchTab(index) {
      console.log(index);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped  lang="scss" >
@import "../../assets/scss/index.scss";
.group_exercise {
  height: 100%;
  display: flex;
  padding: 0 20px;
  flex-direction: column;
  .content-container {
    flex: 1;
    // border: 1px solid green;
    .height-100 {
      height: 100%;
    }
    .group_exercise .ant-tabs-nav-container .ant-tabs-nav-wrap .ant-tabs-nav-scroll{
      text-align: left!important;
    }
    .total-exercise {
      float: right;
      margin-right: 20px;
      font-family: MicrosoftYaHei;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      line-height: 40px;
      color: #333333;
    }

    .exercise-list {
      // height: 100%;
      height: 528px;
      width: 100%;
      overflow-y: auto;
      .exercise-item {
        background-color: #ffffff;
        border: solid 1px #dddddd;
        text-align: left;
        margin-top: 20px;
        padding: 12px 21px 10px 20px;
        display: flex;
        flex-direction: row;
        position: relative;
        .item-left {
          flex: 1;
          margin-right: 97px;
          .exercise-title {
            font-family: MicrosoftYaHei;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #333333;
          }
          .exercise-content {
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            display: -webkit-box;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #333333;
            margin-bottom: 22px;
          }
          .exercise-labels {
            .label-text {
              width: 1190px;
              height: 13px;
              font-family: MicrosoftYaHei;
              font-size: 12px;
              font-weight: normal;
              font-stretch: normal;
              letter-spacing: 0px;
              color: #999999;
            }
            .label-value {
              font-family: MicrosoftYaHei;
              font-size: 12px;
              font-weight: normal;
              letter-spacing: 0px;
              color: #666666;
            }
          }
        }
        .item-right {
          position: absolute;
          /* height: 100%; 无效*/
          height: 100%;
          right: 21px;
          top: 0;
          vertical-align: middle;
          display: flex;
          justify-content: center;
          flex-direction: column;
          div {
            cursor: pointer;
            font-family: MicrosoftYaHei;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #226cfb;
          }
          .config-properties {
            margin-bottom: 19px;
          }
        }
      }
    }
  }
  .footer-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    button {
      width: 100px;
      height: 35px;
    }
    .cancel {
      border-radius: 6px;
      border: solid 1px #226cfb;
      margin-right: 20px;
    }
    .submit-exercise {
      background-image: linear-gradient(90deg, #3e7ef9 0%, #226cfb 100%),
        linear-gradient(#34383f, #34383f);
      background-blend-mode: normal, normal;
      border-radius: 6px;
    }
  }
}
</style>
