<template>
  <a-tabs @change="callback" type="card" :activeKey="tabIndex" class="responder-content">
    <!-- <a-tab-pane tab="手动添加" key="1"></a-tab-pane> -->
    <!-- <a-tab-pane tab="i课优练习包" key="2"></a-tab-pane> -->
    <a-tab-pane tab="Word导入" key="1"></a-tab-pane>
    <a-tab-pane tab="校本题库" key="2">
      <div style="position:relative">
        <div class="select-header">
          <a-select
            defaultValue="全部年级"
            style="width: 240px;height:30px;"
            @change="changeGrade"
            v-model="selectGradeId">
            <!-- <a-select-option value="jack">Jack</a-select-option> -->
            <a-select-option
              v-for="(grade,index) of gradeList"
              :key="index+'-grade'"
              :value="grade.id"
            >{{grade.name}}</a-select-option>
          </a-select>

          <a-select
            defaultValue="全部学科"
            style="width: 240px;height:30px;"
            @change="changeSubject"
            v-model="selectSubjectId"
          >
            <!-- <a-select-option value="jack">Jack</a-select-option> -->
            <a-select-option
              v-for="(subject,index) of subjectList"
              :key="index+'-subject'"
              :value="subject.subjectCode"
            >{{subject.name}}</a-select-option>
          </a-select>

          <a-select defaultValue="全部题类" style="width: 240px;height:30px;" @change="handleChange"></a-select>

          <a-select defaultValue="全部题型" style="width: 240px;height:30px;" @change="handleChange"></a-select>

          <span class="total-select-text">
            已选择
            <span class="small-blue-text">{{selectCount}}</span>道题
          </span>
          <span class="small-blue-text cursor-hover" @click="clearCheck">清空</span>

          <a-input-search placeholder="按章节或知识点筛选" class="search" @search="onSearch"/>
        </div>

        <div class="exercise-list">
          <div class="exercise-item" v-for="(item,index) of exerciseList" :key="index">
            <div class="item-left">
              <a-checkbox @change="checkChange(index,$event)" :checked="item.checked||false"></a-checkbox>
            </div>
            <div class="item-right">
              <!-- <div class="exercise-title">第一题</div> -->
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
          </div>
 <div class="loading-text"  v-bind:style="{'display':exerciseList.length<20&&!hasMore?'none':'block'}">
            <span
              style="display: inline;
    cursor: pointer;"
              @click="loadMore"
             
            >{{loadingText}}</span>
          </div>
        </div>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import ExerciseService from "../../_services/exercise.service";
import UserService from "../../_ddd/user.service";
import { clearInterval } from "timers";
export default {
  name: "ResponderModalComponent",
  props: {
    params: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      tabIndex: "2",
      gardenId: "",
      selectGradeId: "",
      selectGradeCode: "",
      selectSubjectId: "",
      questionClassId: "",
      typeCode: "",
      pageNo: 1,
      gradeList: [],
      subjectList: [],
      keyword: "",
      hasMore: true,
      loadingText: "",
      selectCount: 0,
      countInterval: 0,
      exerciseList: []
    };
  },
  mounted() {
    console.log("接收到的参数：", this.params);
    this.gardenId = UserService.getGardenId();
    this.teacherId = UserService.getUserId();
    // 查询年级列表
    this.queryGradeList();
    // this.querySubjectList();
  
  },
  methods: {
    onSearch(key) {
      console.log(key);
      this.keyword = key;
      this.pageNo = 1;
      this.queryQuestionByGradeSubject();
    },
    changeGrade(value) {
      this.selectGradeId = value;
      console.log(`changeGrade-->selected ${value}`);
      this.gradeList.forEach(item=>{
        if(item.id==value){
          this.selectGradeCode=item.gradeCode;
        }
      });
      this.pageNo=1;
      this.queryGradeList();
    },
    changeSubject(value) {
      this.selectSubjectId = value;
      console.log(`changeSubject-->selected ${value}`);
      this.pageNo=1;
      this.querySubjectList();
    },
    // 查询所有年级
    queryGradeList() {
      ExerciseService.getGradeList({
        gardenId: this.gardenId,
        teacherId: this.teacherId
      }).then(res => {
        console.log("ResponderModalComponent获取年级接口返回：", res);
        if (res && res.length > 0) {
          if (this.selectGradeId == "") {
            this.selectGradeId = res[0].id;
            this.selectGradeCode = res[0].gradeCode;
          }
          this.gradeList = res;
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
        console.log("ResponderModalComponent查询所有学科接口返回：", res);
        if (res && res.length > 0) {
          if (this.selectSubjectId == "") {
            this.selectSubjectId = res[0].subjectCode;
          }
          this.subjectList = res;
            this.queryQuestionByGradeSubject();
        }
      });
    },
    loadMore() {
      this.queryQuestionByGradeSubject();
    },
    queryQuestionByGradeSubject() {
      let params = {
        keyword: this.keyword,
        gradeCode: this.selectGradeCode,
        subjectCode: this.selectSubjectId,
        questionClassId: this.questionClassId,
        typeCode: this.typeCode,
        pageNo: this.pageNo
      };
      ExerciseService.getQuestionByGradeSubject(params).then(res => {
        console.log("根据年级学科查询题 接口返回：", res);
      res.forEach((item, index, arr) => {
        item.checked = false;
      });
      if (res) {
        if (this.pageNo == 1) {
          this.exerciseList = res;
        } else {
          this.exerciseList = this.exerciseList.concat(res);
        }
        console.log("this.exerciseList.length:", this.exerciseList.length);
        if (this.exerciseList.length < 20) {
          this.loadingText = "";
        }else{
      if (this.hasMore) {
          this.loadingText = "点击加载更多";
        }
        if (!this.hasMore) {
          this.loadingText = "已加载全部";
        }
        }
          this.pageNo++;
        // 回显选中状态
        this.echoCheckStatus();
      }
      } );
    },
    echoCheckStatus() {
      let selectCount=0;
      this.params.savedExerciseList.forEach((selectItem, index, arr) => {
        this.exerciseList.forEach((item, index, arr) => {
          if (selectItem.questionId == item.questionId) {
            selectCount++;
            item.checked = true;
          } 
          //  绑定checkbox状态
        });
      });
      this.selectCount=selectCount;
      this.params.onceStatusList = this.exerciseList;
    },
    checkChange(index, e) {
      let checked = e.target.checked;
      console.log(`checked = ${e.target.checked}`, index, e);
      // 更新item选中状态
      this.updateQuestionCheck(index, checked);
      // 获取选中个数
      this.selectCount = this.getQuestionCheckNum();
      // 更新选中列表
      this.params.onceStatusList = this.exerciseList;
    },
    clearCheck() {
      this.exerciseList.forEach(item => {
        item.checked = false;
      });
      this.selectCount=0;
    },
    updateQuestionCheck(index, checked) {
      this.exerciseList[index].checked = checked;
    },
    getQuestionCheckNum() {
      let num = 0;
      this.exerciseList.forEach((item, index, arr) => {
        if (item.checked) {
          num++;
        }
      });
      return num;
    },
    handleChange() {},
    callback(val) {
      console.log("切换卡片栏", val);
      this.tabIndex = val;
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/scss/index.scss";
.responder-content {
  width: 100%;
  height: 509px;
  .select-header {
    margin-top: 19px;
    margin-bottom: 20px;
    .ant-select {
      width: 120px !important;
      height: 30px !important;
    }
  }
  .total-select-text {
    width: 94px;
    height: 14px;
    margin-right: 19px;
    margin-left: 20px;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #333333;
  }
  .small-blue-text {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #226cfb;
  }
  .cursor-hover {
    cursor: pointer;
  }
  .search {
    width: 180px;
    height: 30px;
    float: right;
  }
  .loading-text {
    // position: absolute;
    // margin-top: 30px;
    margin: 10px 0;
    bottom: 19px;
    // cursor: pointer;
    text-align: center;
    left: 0;
    right: 0;
    font-family: MicrosoftYaHei;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #999999;
  }
  .exercise-list {
    // height: 100%;
    height: 374px;
    width: 100%;
    overflow-y: auto;
    background-color: white;
    /*  .exercise-item:last-child {
      margin-bottom: 30px;
    } */
    .exercise-item:not(:first-child) {
      margin-top: 20px;
    }
    .exercise-item {
      background-color: #ffffff;
      text-align: left;
      // padding: 12px 21px 10px 20px;
      display: flex;
      flex-direction: row;
      position: relative;
      .item-right {
        flex: 1;
        border: solid 1px #dddddd;
        /* padding-top: 12px; */
        padding: 12px 20px 10px;
        // margin-right: 97px;
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
      .item-left {
        position: relative;
        /* height: 100%; 无效*/
        height: 100%;
        // right: 21px;
        top: 0;
        vertical-align: middle;
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding-top: 12px;
        margin-right: 20px;
        .ant-checkbox {
          width: 16px;
          height: 17px;
          background-color: #f8f8f8;
          border-radius: 3px;
          border: solid 0px #cccccc;
        }
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