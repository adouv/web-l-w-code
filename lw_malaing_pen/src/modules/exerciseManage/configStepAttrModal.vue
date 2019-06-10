<template>
  <div class="config_attr_step_modal">
    <div class="select-group">
      <span class="label-attr">试题属性：</span>
      <a-select v-model="selectOne" style="width:160px;height:30px;" @change="directionaryChange">
        <a-select-option
          v-for="(item,index) of attrDirecionaryList"
          :key="item.id"
          :value="item.id"
        >{{item.name}}</a-select-option>
      </a-select>

      <a-select v-model="selectTwo" style="width:160px;height:30px;" @change="attrChange">
        <a-select-option
          v-for="(item,index) of stepAttrList"
          :key="item.id"
          :value="item.id"
        >{{item.name}}</a-select-option>
      </a-select>
    </div>

    <div class="step-attr-list">
      <!-- 一阶 题 -->
      <div class="item">
        <div class="step-title">第<span class="step-num">1</span>阶
        </div>
        <div class="content">
          <div class="question-num">第{{params.index+1}}题</div>
          <!-- <div class="question-title">{{params.questionItem.content}}</div> -->
          <div class="question-content">
            <!-- <span v-for="answerItem of question.options" :key="answerItem.id">A.非负数</span> -->
            <!-- <span >A.非负数</span> -->
            {{ params.questionItem.content}}
          </div>
        </div>
      </div>
      
        <!-- 二阶 认知程度 -->
      <div class="item" v-if="(selectTwo==4||selectTwo==7)&&questionList[0]">
        <div class="step-title">
          第<span class="step-num">2</span>阶
          <span class="step-subtitle">{{questionList[0].prompt}}</span>
        </div>
        <div class="content">
          <div class="question-title-bold">{{questionList[0].questionStem}}</div>
          <div class="question-content">
            <!-- <span v-for="answerItem of question.options" :key="answerItem.id">A.非负数</span> -->
            <span
              v-for="(optionTwo,index) of questionList[0].option"
              :key="index"
            >{{optionTwo.option}}{{optionTwo.content}}</span>
          </div>
        </div>
      </div>

      <div class="item"  v-if="(selectTwo==5||selectTwo==6)&&questionList&& questionList.length>0">
        <div class="step-title">
          第<span class="step-num">2</span>阶
          <span class="step-subtitle">{{questionList[0].prompt}}</span>
          </div>
        <div class="content">
          <div class="question-title-bold">{{questionList[0].questionStem}}</div>
          <div class="question-radio-group">
            <a-radio-group @change="checkChange(value)" v-model="value">
              <div class="input-item" v-for="(optionItem,index) of questionList[0].option" :key="'input-'+index">
                <a-radio :style="radioStyle" :value="index+1" class="radio-check"></a-radio>
                正确项：{{optionItem.option}}
                <a-input class="text-input" @change="inputChange" v-model="optionItem.content" placeholder="100个字以内，必填" maxlength=100></a-input>
                <div v-show="index>1&&index<7" class="right-btn-group">
                  <i  
                    class="icon iconfont icon-pc-plus1 btn-add"
                    @click="addOption(questionList[0].option,index)"
                    alt
                  ></i>
                  <i  
                    class="icon iconfont icon-pc-minus1 btn-delete"
                    @click="deleteOption( questionList[0].option,index)"
                    alt
                  ></i>
                </div>
              </div>
            </a-radio-group>
          </div>
        </div>
      </div>

 
      <div class="item"  v-if="selectTwo==7&&questionList&&  questionList.length==3">
        <div class="step-title">
          第<span class="step-num">3</span>阶
          <span class="step-subtitle">{{questionList[1].prompt}}</span>
          </div>
        <div class="content">
          <div class="question-title-bold">{{questionList[1].questionStem}}</div>
          <div class="question-radio-group">
            <a-radio-group @change="checkChange(value)" v-model="value">
              <div class="input-item" v-for="(optionItem,index) of questionList[1].option" :key="'input2-'+index">
                <a-radio :style="radioStyle" :value="index+1" class="radio-check"></a-radio>
                正确项：{{optionItem.option}}
                <a-input class="text-input" @change="inputChange" v-model="optionItem.content" placeholder="100个字以内，必填" maxlength=100></a-input>
                <div v-show="index>1&&index<7" class="right-btn-group">
                  <i  
                    class="icon iconfont icon-pc-plus1 btn-add"
                    @click="addOption(questionList[1].option,index)"
                    alt
                  ></i>
                  <i  
                    class="icon iconfont icon-pc-minus1 btn-delete"
                    @click="deleteOption( questionList[1].option,index)"
                    alt
                  ></i>
                </div>
              </div>
            </a-radio-group>
          </div>
        </div>
      </div>


<!-- 三阶 程度 -->
   
      <div class="item" v-if="selectTwo==6&&questionList[1]">
        <div class="step-title">
          第<span class="step-num">3</span>阶
          <span class="step-subtitle">{{questionList[1].prompt}}</span>
        </div>
        <div class="content">
          <div class="question-title-bold">{{questionList[1].questionStem}}</div>
          <div class="question-content">
            <span
              v-for="(optionFour,index) of questionList[1].option"
              :key="index"
            >{{optionFour.option}}{{optionFour.content}}</span>
          </div>
        </div>
      </div>

<!-- 四阶 程度 -->
    <div class="item" v-if="selectTwo==7&& questionList.length>0&&questionList[2]">
        <div class="step-title">
          第<span class="step-num">4</span>阶
          <span class="step-subtitle">{{questionList[2].prompt}}</span>
        </div>

        <div class="content">
          <div class="question-title-bold">{{questionList[2].questionStem}}</div>
          <div class="question-content">
            <span
              v-for="(optionFour,index) of questionList[2].option"
              :key="index"
            >{{optionFour.option}}{{optionFour.content}}</span>
          </div>
        </div>
      </div> 

    </div>
  </div>
</template>
<script>
import ExerciseService from "../../_services/exercise.service";
import UserService from "../../_ddd/user.service";
export default {
  name: "ConfigStepAttrModalComponent",
  props: {
    params: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      value: 1,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      },
      letterList:["A","B","C","D","E","F","G"],
      gardenId: "",
      isConfig:true,//是否配置过
      attrDirecionaryList: [],
      stepAttrList: [],
      selectOne: "",
      selectTwo: "",
      stepTwoInfo: {},
      stepId:"",
      stepThreeInfo: {},
      stepFourInfo: {},
      questionList: []
    };
  },
  mounted() {
    this.gardenId = UserService.getGardenId();
    console.log("获取到参数：", this.params);
    this.queryAttrDirectionary();
  },
  methods: {
    inputChange(event) {
      console.log("输入变化了:", event.target.value);
    },
    directionaryChange(value) {
      this.selectOne = value;
      console.log("字典切换了...", this.selectOne);
      this.params.stepAttrInfo.propertiesIdsStr= this.selectOne+","+this.selectTwo+","+this.stepId;
    },
    attrChange(value) {
      // this.selectTwo=value;
      this.$set(this.$data, "selectTwo", value);
      console.log("属性切换了...", this.selectTwo);
        this.params.stepAttrInfo.propertiesIdsStr= this.selectOne+","+this.selectTwo+","+this.stepId;
        this.isConfig=false;
      this.queryAttrsById(this.selectOne);
    },
    addOption(options, index) {
      if(options.length==7) return;
      console.log("新增一行：", options, index);
      options.splice(index+1,0,{content: "",isAnswer: false,option: this.letterList[index+1]});
      // 更新后面输入框序号
      options.forEach((item,index,arr)=>{
        item.option=this.letterList[index];
      });
    },
    deleteOption(options , index) {
       if(options.length==3) return;
      console.log("删除一行：", options , index);
        options.splice(index,1);
      // 更新后面输入框序号
      options.forEach((item,index,arr)=>{
        item.option=this.letterList[index];
      });
    },
    checkChange(e) {
      console.log("复选框check变化了：", e);
    },
    queryAttrDirectionary() {
      ExerciseService.getAttrDirectionary({}).then(res => {
        if (res && res.length > 0) {
          this.attrDirecionaryList = res;
          if (this.selectOne == "") {
            this.selectOne = res[0].id;
          }
            this.params.stepAttrInfo.propertiesIdsStr= this.selectOne+","+this.selectTwo+","+this.stepId;
          this.queryAttrsById(this.selectOne);
        }
      });
    },
    queryAttrsById(id) {
      ExerciseService.getAttrsById({ pid: id }).then(res => {
        console.log("获取到n阶属性：", res);
        if (res && res.length > 0) {
          if(this.isConfig){
          this.stepAttrList = res;
          if (this.selectTwo == "") {
            // this.selectTwo=res[0].id;
            this.$set(this.$data, "selectTwo", res[0].id);
          }
            this.params.stepAttrInfo.propertiesIdsStr= this.selectOne+","+this.selectTwo+","+this.stepId;
          //   获取习题阶梯属性
          this.queryQuestionProperties();
          }else{
              this.questionList = [];
         let params = {
        dictionaryId: this.selectTwo
      };
      ExerciseService.getQuestionDictionaryItem(params).then(res => {
        console.log("获取习题阶梯字典项：", res);
        if (res) {
           this.params.stepAttrInfo.properties=res.itemValue;
          this.stepId=res.id;
           this.params.stepAttrInfo.propertiesIdsStr= this.selectOne+","+this.selectTwo+","+this.stepId;
          res.itemValue[0].questionIndex = this.params.questionItem.index;
          this.$set(this.$data, "questionList", res.itemValue);
          this.$set(this.$data, "stepThreeInfo", res.itemValue[1]);
          console.log(" this.questionList:", this.questionList);
        }
      });
          }
        }
      });
    },
    queryQuestionProperties() {
      this.questionList = [];
      let params = {
        gardenId: this.gardenId,
        practicePaperId: this.params.practicePaperId,
        questionId: this.params.questionItem.questionId
      };
      ExerciseService.getQuestionProperties(params).then(res => {
        console.log("获取习题属性集合：", res);
        if (res&&res.properties.length>0) {
          this.isConfig=true;
          this.params.stepAttrInfo.properties=res.properties;
          this.stepId=res.questionPropertiesId;
           this.params.stepAttrInfo.propertiesIdsStr= this.selectOne+","+this.selectTwo+","+this.stepId;
          res.properties[0].questionIndex = this.params.questionItem.index;
          this.$set(this.$data, "questionList", res.properties);
          this.$set(this.$data, "stepThreeInfo", res.properties[1]);
          console.log(" this.questionList:", this.questionList);
        }else{//无数据表示第一次配置，获取阶梯字典项
         this.isConfig=false;
        this.queryAttrsById(this.selectOne);

        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/index.scss";
.config_attr_step_modal {
  height: 508px;
  overflow-y: auto;
  //   外层9px 20px 0 20px !important;
  padding: 10px 10px 0 0px;
  .select-group {
    .label-attr {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #333333;
    }
  }

  .step-attr-list {
    margin-top: 19px;
    .item:not(:first-child) {
      margin-top: 28px;
    }
    .item {
      .step-title {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #333333;
        .step-num {
          font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: normal;
          letter-spacing: 0px;
          color: #226cfb;
        }
        .step-subtitle {
          font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: normal;
          letter-spacing: 0px;
          color: #999999;
          margin-left: 12px;
          display: inline-block;
          margin-bottom: 19px;
        }
      }
      .content {
        margin-left: 56px;
        margin-bottom: 8px;
        .question-num,
        .question-title,
        .question-content {
          font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #333333;
          margin-top: 5px;
          span {
            margin-right: 50px;
          }
        }
        .question-title-bold {
          font-family: MicrosoftYaHei;
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: 0px;
          color: #333333;
        }
        .ant-radio-group {
          width: 100%;
        }
        .question-radio-group {
          margin-top: 20px;
          .input-item :not(:last-child) {
            // margin-bottom: 8px;
            // margin-bottom: 4px;
          }
          .input-item {
            display: flex;
            position: relative;
            align-items: center;
            margin-bottom: 9px;
            .text-input {
              margin-right: 64px;
              flex: 1;
              margin-left: 15px;
            }
            .radio-check {
              margin-right: 5px;
              margin-bottom: 0; /*阻止继承**/
            }
            .right-btn-group {
              position: absolute;
              right: 0;
              margin-left: 19px;
              .btn-add {
                marign-right: 8px;
              }
              i {
                cursor: pointer;
                color: #226cfb;
                width: 28px;
                height: 28px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
