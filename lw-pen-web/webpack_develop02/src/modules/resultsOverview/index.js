import QuestionService from '../../_service/question.service'
import AccountService from '../../_service/account.service'
import ExerciseService from '../../_service/exercise.service'
import QuestionInfoModalComponent from './questionInfoModal.vue'

export default {
  name: "ResultsOverviewComponent",
  data() {
    return {
      isLoadComplete: false,//loading
      bagId: '',//习题包ID
      classId: '',//班级ID
      questionId: '',
      autoGrade: false,//题类型
      checked: false,
      chartData: [],
      tableDataList: [],
      clickAnswer: '',
      exerciseRecordId: '',
      selfJudgmentModel: 0, //自判类型
      isShowAnswer: false,
      questionInfo: [],//习题详情
      currentIndex: 0, //当前习题索引,
      questionTypeName: '', //当前题型
      questionContentHtml: '', //当前题内容
      rightAnalysisList: [],//已有作答记录的习题列表
      rightItem: [],//当前已有作答记录的item
      load: false,
      selectType: '',
      hasAnalysis: true,//是否有学生作答记录分析
      isAnswerTable: true,//是否有学生作答记录
      questionBagList: [],//习题包列表
      currentQuestionBagItem: [], //当前所做的习题
      analysis: '',//答题分析
      answer: '',//答案
      isAnswerData: false,//主观题是否有提交答案的
    };
  },
  mounted() {
    let urlParams = this.utils$.parseUrlToJson(window.location.search);
    this.bagId = urlParams.bagId;
    this.questionId = urlParams.questionId;
    this.currentIndex = parseInt(urlParams.currentIndex);
    this.classId = AccountService.getSelectClassId();
    this.getBagQuestionList();
    this.answerHasAnalysis();

  },
  methods: {
    /**
         * 获取习题包列表
         */
    getBagQuestionList() {
      const params = {
        questionBagId: this.bagId
      };
      QuestionService.getQuestionListByBagId(params).then(res => {
        if (res) {
          this.questionBagList = res;
          this.resetQuestionItem();
        }
      });
    },

    /**
     * 页面渲染
     * @param {*} currentIndex 
     */
    resetQuestionItem() {
      // this.rightItem = this.rightAnalysisList.questionAnalysisDtoList[this.currentIndex];
      // console.log("rightItem", this.rightItem);
      // this.questionTypeName = this.rightItem.questionType.name;
      // this.questionContentHtml = this.rightItem.questionContent.contentHtml;
      // this.selectType = this.rightItem.questionType.selectType;
      // this.questionId = this.rightItem.id;
      this.currentQuestionBagItem = this.questionBagList[this.currentIndex];
      this.questionTypeName = this.currentQuestionBagItem.questionType.name;
      this.questionContentHtml = this.currentQuestionBagItem.questionContent.contentHtml;
      this.questionId = parseInt(this.currentQuestionBagItem.id);
      this.selectType = this.currentQuestionBagItem.questionType.selectType;
      this.answer = this.currentQuestionBagItem.questionContent.answer;
      this.analysis = this.currentQuestionBagItem.questionContent.analysis;
      console.log(this.currentQuestionBagItem);
    },
    /**
     * 上一题
     */
    prevQuestion() {
      if (this.currentIndex == 0) { } else {
        this.currentIndex -= 1;
        this.clickAnswer = '';
        this.resetQuestionItem();
        this.load = false;
        this.answerHasAnalysis();
      }
    },
    /**
     * 下一题
     */
    nextQuestion() {
      if (this.currentIndex < this.questionBagList.length - 1) {
        this.currentIndex += 1;
        this.clickAnswer = '';
        this.resetQuestionItem();
        this.load = false;
        this.answerHasAnalysis();
      }
    },
    /**
     * 显示题干
     */
    showQuestionContent() {
      let options = {};
      options.title = this.questionTypeName;
      options.componentName = QuestionInfoModalComponent;
      options.height = 600;
      options.width = 800;
      options.showFooter = false;
      options.zpButton = false;
      options.className = 'bgColor'
      options.params = {
        html: this.questionContentHtml,
      }
      options.closes = (params) => {

      }
      this.modal$(options);
    },
    /**
     * 正确答案
     */
    rightAnswer() {
      let options = {};
      options.title = this.questionTypeName;
      options.componentName = QuestionInfoModalComponent;
      options.height = 600;
      options.width = 800;
      options.showFooter = false;
      options.zpButton = false;
      options.className = 'bgColor'
      options.params = {
        answer: this.answer,
        analysis: this.analysis,
        type: true
      }
      options.closes = (params) => {

      }
      this.modal$(options);
    },
    /**
     * 点击echarts改变图表数据
     */
    getChangeData(item) {
      console.log(item);
      //this.clickAnswer = this.utils$.toRightAnswer(item.clickAnswer);
      this.clickAnswer = item.clickAnswer;
      this.getListTable(item.score,item.isRight);
    },
    async getResultList() {
      this.chartData = [];
      this.isShowAnswer = false;
      let params = {
        questionBagId: this.bagId,
        questionId: this.questionId,
        classId: this.classId,
      }
      let res = await ExerciseService.getChartResult(params);

      this.chartData = res;
      this.selfJudgmentModel = res.pattern;
      this.autoGrade = res.autoGrade;
      this.exerciseRecordId = res.exerciseRecordId;
      console.log(this.exerciseRecordId);
      this.showExerciseInfo();
      this.getListTable();
      console.log(this.autoGrade);
      // if (this.selfJudgmentModel == 1) {
      //   this.isShowAnswer = true;
      // }
    },
    getListTable(score = '',isRight = '') {
      this.isLoadComplete = false;
      this.tableDataList = [];
      let params = {
        questionId: this.questionId,
        exerciseRecordId: this.exerciseRecordId,
        classId: this.classId
      }
      if (score) {
        params.score = score;
      }
      if (score == '' && isRight == '') {
        params.answer = this.clickAnswer;
      }
      if(isRight){
        params.isRight = isRight == '对' ? true : false;
      }
      this.clickAnswer = this.clickAnswer != -1 ? this.clickAnswer : '未答题';
      console.log(typeof (this.clickAnswer))
      ExerciseService.getChartTable(params).then(res => {
        this.isLoadComplete = true;
        this.tableDataList = res;
        this.tableDataList.filter((v, i, a) => {
          let item = this.chartData.chartResultDtoList.find(i => i.answer === v.answer);
          if (item !== undefined) {
            v.avgTime = item.avgTime
          } else {
            v.avgTime = 0;
          }
          return a;
        });
        console.log(this.tableDataList);
        this.load = true;
      });
    },
    /**
     * 查询作答记录分析是否有数据
     */
    answerHasAnalysis() {
      let params = {
        questionBagId: this.bagId,
        questionId: this.questionId,
        classId: this.classId
      };
      ExerciseService.answerHasAnalysis(params).then(res => {
        this.hasAnalysis = res;
        if (this.hasAnalysis) {
          this.getResultList().then(res => {
            //this.getRightAnalysisList();
          });
        }
      });
    },
    /**
     * 获取已有作答记录分析的习题包列表
     */
    async getRightAnalysisList() {
      console.log(this.exerciseRecordId);
      let params = {
        exerciseRecordId: this.exerciseRecordId
      };
      let res = await ExerciseService.getRightAnalysisList(params);

      if (res) {
        this.rightAnalysisList = res;
        this.rightAnalysisList.questionAnalysisDtoList.forEach((e, i) => {
          if (e.id == this.questionId) {
            this.currentIndex = i;
            this.rightItem = e;
          }
        });
        this.resetQuestionItem();
      }
    },
    /**
   * 获取习题详情
   */
    showExerciseInfo() {
      this.questionInfo = [];
      const params = {
        questionId: this.questionId
      };
      QuestionService.getExerciseInfo(params).then(res => {
        this.questionInfo = res;
      });
    },
    /**
     * 查看全部
     */
    allTables() {
      this.clickAnswer = '';
      this.getListTable();
    },
    getRightAnswer() {
      this.showExerciseInfo();
      this.isShowAnswer = true;
    },


    /**
     * 打开笔记统览
     */
    openBiji() {
      let urlParams = {
        questionId: this.questionId,
        bagId: this.bagId,
        exerciseRecordId: this.exerciseRecordId,
        currentIndex: this.currentIndex
      };
      this.win$.openWindow('noteList', {
        fullscreen: true,
        urlParams: urlParams
      });
    },
    closeBtn() {
      this.win$.closeCurrentWindow();
    },
    openWin(path, urlParams = {}) {
      this.win$.openWindow(path, {
        fullscreen: true,
        urlParams: urlParams
      })
    },
  }
};
