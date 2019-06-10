<template>
  <div class="list-container nodrag-area" flex="dir:top">
    <div class="list-header">
      <!-- 搜索 -->
      <div class="searchquestionIds-wrapper">
        <a-input-search
          placeholder="关键字查询"
          v-model="outParams.keyword"
          style="width: 240px"
          @search="searchQuestionList"
          class="mar-r-10px"
        />
        <a-radio-group v-model="outParams.searchType" @change="changeSearchType">
          <a-radio :value="0">已选{{initSelectParams.tabIndex==0?"章节":"知识点"}}搜索</a-radio>
          <a-radio :value="1">所有{{initSelectParams.tabIndex==0?"章节":"知识点"}}搜索</a-radio>
        </a-radio-group>
      </div>

      <!-- 已选 -->
      <div class="tag-wrapper">
        <span class="gray">已选{{initSelectParams.tabIndex==0?"章节":"知识点"}}：</span>
        <ul v-if="initSelectParams.outlineParams && initSelectParams.outlineParams.length>0 && selectMode != 2">
                <li>
                  <span v-if="initSelectParams.outlineParams">{{initSelectParams.outlineParams[0].name}}</span>
                  <i class="iconfont icon-pc-label-close" @click="removeOutline"></i>
                </li>
              </ul>
              <ul v-if="initSelectParams.outlineParams && selectMode == 2">
                <li :key="data.id" v-for="(data,i) in initSelectParams.outlineParams" > 
                  <span>{{data.name}}</span>
                  <i class="iconfont icon-pc-label-close" @click="removeKnowledge(i)"></i>
                </li>
        </ul>
      </div>

      <!--题型-->
      <div class="type-wrapper">
        <span class="gray">题型：</span>
        <ul v-if="initSelectParams.questionTypeList">
          <li
            :key="data.code"
            v-for="data in initSelectParams.questionTypeList"
            @click="changeQuestionType(data.code)"
            :class="{'active': outParams.typeCode==data.code}"
          >
            <span>{{data.name}}</span>
          </li>
        </ul>
      </div>
    </div>

    <!--试题列表-->
    <div class="list-content auto-scroll" flex-box="1">
      <ul>
        <li class="flex" :key="data.id" v-for="data in initSelectParams.questionList">
          <label><a-checkbox v-model="data.checked" @change="onSelectCheckbox($event,data)"></a-checkbox></label>
          <div class="item-exercise">
            <div class="html-wrapper">
              <div class="html-top">{{data.num}}.</div>
              <div class="dynamic-html" v-html="data.contentHtml"></div>
            </div>
            <div class="operate-wrapper" flex>
              <div class="button-group" flex @click="showExerciseInfo(data)">
                <span class="iconfont icon-pc-answer"></span>
                <span>习题解析</span>
              </div>
            </div>
            <div class="exercises-detail" v-show="data.showInfo">
              <div>
                <div class="font-bold">[ 正确答案 ]</div>
                <div class="dynamic-html" v-html="questionInfo.answer"></div>
              </div>
              <div class="mar-top-30px">
                <div class="font-bold">[ 答案解析 ]</div>
                <div class="dynamic-html" v-html="questionInfo.analysis"></div>
              </div>
            </div>
          </div>
        </li>
      </ul>

      
      <div class="pagination-box" v-if="initSelectParams.totalCount > 10 && initSelectParams.questionList && initSelectParams.questionList.length>0">
        <a-pagination
          :total="initSelectParams.totalCount"
          :defaultCurrent="outParams.pageNo"
          v-if="initSelectParams.totalCount > 0"
          @change="onPageChangedQuestion($event)"
          :defaultPageSize="10"
        />
      </div>
      <div class="spin-loading-div" v-if="!initSelectParams.isLoadComplete">
        <a-spin size="large" :delay="10" class="spin-loading" :spinning="initSelectParams.questionList.length==0"/>
      </div>
      <lw-elliptical-page
        v-if="initSelectParams.isLoadComplete && outParams.isSearch && (!initSelectParams.questionList || initSelectParams.questionList.length==0) || (outParams.keyword && (!initSelectParams.questionList || initSelectParams.questionList.length==0))"
        imgName="no-exercises"
        title="没有相应的试题，请选换其他条件尝试"
      ></lw-elliptical-page>
      <lw-elliptical-page
        v-if="initSelectParams.isLoadComplete && !outParams.isSearch && outParams.keyword=='' && initSelectParams.tabIndex==0&&(!initSelectParams.questionList || initSelectParams.questionList.length==0)"
        imgName="no-exercises"
        title="请选择章节进行选题"
      ></lw-elliptical-page>
      <lw-elliptical-page
        v-if="initSelectParams.isLoadComplete && !outParams.isSearch && outParams.keyword=='' && initSelectParams.tabIndex!=0&&(!initSelectParams.questionList || initSelectParams.questionList.length==0)"
        imgName="no-exercises"
        title="请选择知识点进行选题"
      ></lw-elliptical-page>
      
    </div>
  </div>
</template>

<script>
import QuestionService from "../../_service/question.service";
export default {
  name: "LibraryTemplateComponent",
  props: ["initSelectParams",  "selectParams","selectMode"],
  data() {
    return {
      questionInfo:'',
      outParams:{
        pageNo:1,
        offset:0,
        checkedExerciseIds:[],//选中的习题ID
        typeCode:"", // 题型Code
        keyword: "", //搜索关键字
        searchType: 0, //搜索类型
        outlineIds: [],
        isLoadQuestion: true,
        isSearch: false
      },

    };
  },
  mounted() {
  },
  methods: {
    searchQuestionList(value) {
      this.outParams.checkedExerciseIds = [];
      this.outParams.keyword = value;
      this.outParams.pageNo = 1;
      this.outParams.offset = 0;
      this.outParams.outlineIds = [];
      this.outParams.searchType = 0;
      this.outParams.isSearch = true;
      this.outParams.isLoadQuestion = true;
      this.$emit('outParams',this.outParams);
    },
    /**
     * 点击题型加载数据
     * @param code
     */
    changeQuestionType(code) {
      this.outParams.typeCode = code;
      this.outParams.pageNo = 1;
      this.outParams.offset = 0;
      this.outParams.outlineIds = [];
      this.outParams.searchType = 0;
      this.outParams.isLoadQuestion = true;
      this.outParams.isSearch = true;
      this.$emit('outParams',this.outParams);
    },
    /**
     * 切换搜索类型
     */
    changeSearchType(e){
      this.outParams.keyword = '';
      this.outParams.pageNo = 1;
      this.outParams.offset = 0;
      this.outParams.checkedExerciseIds = [];//选中的习题ID
      this.outParams.outlineIds = [];
      this.outParams.searchType = e.target.value;
      this.outParams.isSearch = true;
      this.outParams.isLoadQuestion = true;
      this.$emit('outParams',this.outParams);
    },
    removeOutline(){
      this.initSelectParams.outlineParams = [];
      this.outParams.outlineIds = [];
      this.outParams.isLoadQuestion = true;
      this.outParams.isSearch = false;
      this.$emit('outParams',this.outParams);

    },
    /**
     * 显示习题详解
     */
    showExerciseInfo(data) {
      QuestionService.getQuestionContent(data.id).then(res => {
        if (data.showInfo) {
          data.showInfo = false;
        } else {
          for (const questionItem of this.initSelectParams.questionList) {
            if(questionItem.id == data.id){
              data.showInfo = true; 
            }else{
              questionItem.showInfo = false;
            }
          }
          
        }
        this.questionInfo = res;
      });
    },
    /**
     * checkbox复选框选择题加入习题包
     * @param event
     * @param data
     */
    onSelectCheckbox(event, data) {
      const checkIndex = this.outParams.checkedExerciseIds.indexOf(data.id);
      if (checkIndex < 0) {
        this.outParams.checkedExerciseIds.push(data.id);
      } else {
        this.outParams.checkedExerciseIds.splice(checkIndex, 1);
      }
      this.outParams.isLoadQuestion = false;
      this.$emit('outParams',this.outParams);
    },
    /**
     * 分页
     * @param event
     */
    onPageChangedQuestion(event) {
      this.outParams.outlineIds = [];
      this.outParams.searchType = 0;
      this.outParams.isLoadQuestion = true;
      if (this.outParams.pageNo !== event) {
        this.outParams.pageNo = event;
        this.outParams.offset = (event - 1) * 10;
        this.$emit('outParams',this.outParams);
      }
    },
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/index.scss";

.list-container {
  padding-left: computer(20px);
  height: 100%;
  .list-header {
    width: 100%;
  }
  .ant-tabs{
    overflow: auto;
  }
  .search-wrapper {
    ::-webkit-input-placeholder {
      color: #999;
    }
    label {
      margin-left: computer(20px);
      font-size: computer(14px);
      color: #333;
    }
  }
  .tag-wrapper {
    margin-top: computer(8px);
    font-size: computer(14px);
    display: flex;
    flex-wrap: wrap;
    min-height: 41px;
    & > span {
      line-height: computer(30px);
      display: inline-block;
      vertical-align: top;
    }
    ul {
      list-style: none;
      display: inline-block;
      flex: 1;
    }
    li {
      cursor: default;
      display: inline-block;
      background-color: #eee;
      border-radius: computer(15px);
      padding-left: computer(15px);
      line-height: computer(30px);
      margin: 0 computer(10px) computer(10px) 0;
      color: #333;
      i {
        cursor: pointer;
        padding: 0 computer(8px);
        &:before {
          font-size: computer(14px);
        }
        &:hover {
          color: #00a0e9;
        }
      }
    }
  }
  .type-wrapper {
    font-size: computer(14px);
    display: flex;
    span {
      display: inline-block;
      vertical-align: top;
      line-height: computer(30px);
    }
    ul {
      list-style: none;
      display: inline-block;
      flex: 1;
    }
    li {
      cursor: pointer;
      display: inline-block;
      font-size: computer(14px);
      line-height: computer(30px);
      border-radius: computer(15px);
      padding: 0 computer(15px);
      margin: 0 computer(10px) 0 0;
      color: $color_font-center;
      &:hover {
        color: #00a0e9;
      }
      &.active {
        cursor: default;
        color: #fff;
        background-color: #00a0e9;
      }
    }
    button {
      float: right;
    }
  }
  .list-content {
    //height: 400px;
    height: calc(100% - #{computer(140px)});
    margin-top: computer(10px);
    li {
      padding-bottom: computer(10px);
      
      label {
        padding-top: computer(20px);
        width: computer(36px);
      }
      .item-exercise {
        flex: 1;
        position: relative;
        .html-wrapper {
          padding: 10px 20px;
          min-height: 30px;
          font-size: computer(14px);
          border: 1px solid #eee;
          display: flex;
          .html-top {
            vertical-align: top;
            color: $color_font-deep;
          }
          div {
            display: inline-block;
          }
        }
        .operate-wrapper {
          width: 100%;
          height: computer(40px);
          justify-content: flex-end;
          padding: 0 20px;
          border: 1px solid #eee;
          border-top: 0;
        }
        .exercises-detail {
          border: 1px solid #eee;
          border-top: 0;
          padding: 10px 20px;
          background-color: #f8f8f8;
          font-size: 14px;
          .font-bold {
            margin-bottom: 6px;
          }
        }
      }
      .button-group {
        color: $color_main;
        font-size: computer(14px);
        line-height: computer(40px);
        cursor: pointer;
        margin-left: computer(40px);
        span:first-child {
          margin-right: computer(10px);
        }
      }
    }
  }
  .pagination-box {
    padding: 0 0 20px;
    text-align: center;
  }
  .flex{
    display: flex;
  }
}
</style>
