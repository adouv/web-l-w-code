import moment from 'moment'

import {
  mapActions,
  mapGetters
} from 'vuex'
import QuestionService from '../../_service/question.service'
import AccountService from '../../_service/account.service'
import ExerciseService from '../../_service/exercise.service'
import JudgeModalComponent from './judgeModal.vue'
import ResponderModalComponent from './responderModal.vue'
export default {
  name: "SubjectiveProblemComponent",
  data() {
    return {
      selectMenu: {},
      selectQuestion: {},
      bagId: '', //习题包ID
      questionBagList: [], //习题包列表
      currentQuestionBagItem: [], //当前所做的习题
      currentIndex: 0, //当前习题索引,
      questionTypeName: '', //当前题型
      questionContentHtml: '', //当前题内容
      isShowPreview: false, //是否显示答判学生
      //studentList: [], //学生列表
      hasAnalysis: false, //用于结果通览是否可用
      classId: '', //班级ID
      questionId: '',
      autoGrade: false, //题类型
      // #####################################
      countInterval: 0,
      showMenus: false, // 是否显示菜单状态
      selfJudgmentModel: '-1',
      //开始答题记录时间
      startTime: {
        hour: 0,
        second: 0,
        minute: 0,
      },
      activeIndex: 0,
      answerStatue: "initial", //initial 未开始，ongoing 进行中 end结束
      answerStatueObj: {
        initial: "开始答题",
        ongoing: "结束答题",
        end: "开始答题"
      },
      judgeStatue: "initial", //initial 未开始，ongoing 进行中 end结束 
      judgeStatueObj: {
        initial: "开始自判",
        ongoing: "结束自判",
        end: "开始自判"
      },
      isShowCountTip: false,
      countTipText: "3", //倒计时文本
      tipCountInerval: 0,
      tipParams: {
        startCountTips: ["3", "2", "1", "开始答题"],
        endCountTips: ["", "", "3", "2", "1", "结束答题"],
        startJudgeTips: ["3", "2", "1", "开始自判"],
        endJudgeTips: ["3", "2", "1", "结束自判"]
      },
      isVisible: false,
      penidList: [],
      answerList: [],
      les: [],
      isResponder: 'initial', //抢答状态 initial 未开始，ongoing 进行中
      statusLength: 0,
      penList: [],
      responderPenId: '', //抢答
      exerciseRecordId: 0,
      studentInfo: [],
      audioSrc: '',
      showStudentNoteList: false
    };
  },
  mounted() {
    let myThis = this;
    myThis.isResponder = 'initial';
    myThis.responderPenId = '';
    this.sql$.select('lw_pen_notes').then(response => {
      this.statusLength = response.Data.length;
      // if (this.statusLength === 0) {
      //   this.$notification.open({
      //     message: '提示',
      //     description: '未检测到智写笔答题接收器硬件设备，答题操作无法进行！',
      //     duration: null
      //   });
      //   this.win$.send('menuNoClick', false);
      // }
    });
    let urlParams = this.utils$.parseUrlToJson(window.location.search);
    this.bagId = parseInt(urlParams.eId);
    this.classId = parseInt(AccountService.getSelectClassId());
    //进入答题页面后通知更换菜单
    this.win$.send('menuType', false);

    this.win$.receive('operation', (event, args) => {
      // console.log('operation:', args);
      myThis.selectMenu = args;
      myThis.activeIndex = args.key;
      switch (args.key) {
        case 0:
          //开始答题
          myThis.answerStatue = args.switch ? 'initial' : 'ongoing';
          myThis.isResponder = 'initial';
          myThis.responderPenId = '';
          //myThis.changeAudio(args.switch);
          let type = args.switch ? 0 : 1;
          myThis.audioPlay(type);
          myThis.showCountTip();
          break;
        case 1:
          //开始自判
          myThis.isVisible = true;

          myThis.judgeStatue = args.switch ? 'initial' : 'ongoing';
          myThis.isResponder = 'initial';
          myThis.responderPenId = '';
          let _isModal = document.getElementById("modal-jude");
          if (myThis.judgeStatue == 'initial' && !_isModal) {
            myThis.judgeModal();
          } else {
            myThis.showCountTip();
          }
          break;
        case 2:
          myThis.isResponder = 'ongoing';
          let isModal = document.getElementById("modal-qiangda");
          if (!isModal) {
            myThis.rushToAnswer();
          }

          break;
        case 3:
          myThis.answerCase();
          break;
      }
    });

    this.win$.receive('answerData', (event, args) => {
      // console.log('answerData:', args);
      let data = args.data;
      let lwUdp = args.lwUdp;
      let len = args.len;
      let selfJudgment = myThis.local$.getItem('selfJude');
      selfJudgment = selfJudgment ? JSON.parse(selfJudgment) : '';
      //更新学生状态
      // myThis.queryClassStudents(myThis.classId);
      myThis.setShow({
        params: {
          penid: data.penid,
          show: true
        }
      });
      let status = 0;
      if (len > 20) {
        status = 1;
      } else {
        if (data.pressure === 0) {
          status = data.pressure;
        } else {
          status = 1;
        }
      }
      myThis.setStatus({
        params: {
          penid: data.penid,
          status: status
        }
      });

      this.getSubmit({
        params: {}
      });
      this.getNoSubmit({
        params: {}
      });
      this.getOperation({
        params: {}
      });
      this.setType({
        params: {
          questionBagId: this.bagId,
          questionId: this.selectQuestion.questionId,
          classId: this.classId,
        }
      });

      if (len > 20 && !lwUdp.switch) {
        if (myThis.answerStatue == 'ongoing') {
          //开始答题
          if (data.selectType === 1 || data.selectType === 3) {
            myThis.upAnswerRecord(data);
          } else if (data.selectType === 2 || data.selectType === 7) {
            // 多选题
            if (data.probLetter == 'OK') {
              myThis.resetAnswerData(false);
            } else {
              let include = myThis.penidList.includes(data.penid);
              if (!include) {
                myThis.penidList.push(data.penid);
              }
              myThis.answerList.push(data);
            }
          }
        }
        if (myThis.judgeStatue == 'ongoing') {
          //开始自判
          if (selfJudgment.pattern == 1) {
            myThis.upAnswerRecord(data, true); //自判类型为对错模式
          } else {
            //自判类型为赋分模式
            if (data.probLetter == 'OK') {
              myThis.resetAnswerData(true, selfJudgment.maxScore);
            } else {
              let include = myThis.penidList.includes(data.penid);
              // console.log(include);
              if (!include) {
                myThis.penidList.push(data.penid);
              }
              myThis.answerList.push(data);
            }

          }
        }
        if (myThis.isResponder == 'ongoing') {
          myThis.responderPenId = '';
          //开始抢答
          if (data.probLetter == 'OK' && myThis.responderPenId == '') {
            myThis.responderPenId = data.penid;
            // console.log(myThis.responderPenId)
            myThis.rushToAnswer(false);
            myThis.rushToAnswer2();
          }

        }
      } else {
        //正在写
      }
    });

    //保存习题包练习记录
    this.saveExerciseRecord().then(response => {
      //获取习题列表
      this.getBagQuestionList();
    });

  },
  created() {
    document.onkeydown = (e) => {
      if (e.code === "PageUp") {
        if (this.currentIndex === 0) {
          return;
        }
        this.prevQuestion();
      }

      if (e.code === "PageDown") {
        if (this.currentIndex === (this.questionBagList.length - 1)) {
          return;
        }
        this.nextQuestion();
      }
    }
    // this.noteListHeight = document.getElementById("list").offsetHeight;
    // console.log('123',this.noteListHeight);
  },
  methods: {
    ...mapActions(["getList", "getSubmit", "getNoSubmit", "getOperation", "setShow", "setStatus", "setType", "setUdpList"]),
    moment,
    /**
     * 倒计时321
     */
    showCountTip() {
      let myThis = this;
      let count = -1;
      let n = 4;
      myThis.isShowCountTip = true;
      if (myThis.answerStatue == 'ongoing') {
        n = 6;
      }
      myThis.win$.send('menuNoClick', false);
      myThis.tipCountInerval = setInterval(() => {
        count++;
        // if (myThis.selectMenu.switch) {
        //   myThis.countTipText = myThis.tipParams.startCountTips[count];
        // } else {
        //   myThis.countTipText = myThis.tipParams.endCountTips[count];
        // }

        if (count == n) { //结束
          clearInterval(myThis.tipCountInerval);
          myThis.isShowCountTip = false;
          myThis.win$.send('updateState', {
            selectMenu: myThis.selectMenu,
            selectQuestion: myThis.selectQuestion
          });
          if (myThis.selectMenu.key === 0 && !myThis.selectMenu.switch) {
            myThis.local$.removeItem('lwUdp');
            myThis.local$.setItem('lwUdp', JSON.stringify(this.selectMenu));
          }
        }
        // if (count === 4) {
        //   this.countTipText = this.tipParams.startCountTips[count];
        //   clearInterval(this.tipCountInerval);
        //   this.isShowCountTip = false;
        //   this.win$.send('answer', {});
        // }

        if (this.activeIndex == 0) {
          switch (this.answerStatue) {
            case "initial": //开始做题
              this.countTipText = this.tipParams.startCountTips[count];
              if (count == n) { //结束
                clearInterval(this.tipCountInerval);
                this.isShowCountTip = false;
                this.answerStatue = "ongoing";
                this.audioStop(0);
                //更新状态
                this.createAnswerRecordHandle();
              }
              break;
            case "ongoing": //结束做题
              this.countTipText = this.tipParams.endCountTips[count];
              if (count == n) { //结束
                clearInterval(this.tipCountInerval);
                this.isShowCountTip = false;
                this.answerStatue = "initial";
                setTimeout(() => {
                  this.audioStop(1);
                }, 1000);
                if (this.currentIndex === this.questionBagList.length) {
                  this.updateAnswerAnalysis(this.questionBagList[this.currentIndex].id);
                }
              }
              break;
            case "end":
              break;
          }
        } else if (this.activeIndex == 1) {
          switch (this.judgeStatue) { //开始自判
            case "initial":
              this.countTipText = this.tipParams.startJudgeTips[count];
              if (count == n) { //结束
                clearInterval(this.tipCountInerval);
                this.isShowCountTip = false;
                //this.showJudgeModal();
                // this.btnClick();
                this.judgeStatue = "ongoing";
              }
              break;
            case "ongoing": //结束自判
              this.countTipText = this.tipParams.endJudgeTips[count];
              if (count == n) { //结束
                clearInterval(this.tipCountInerval);
                this.isShowCountTip = false;
                //this.endCount();
                this.local$.removeItem('selfJude');
                this.judgeStatue = "initial";
                if (this.currentIndex === this.questionBagList.length) {
                  this.updateAnswerAnalysis(this.questionBagList[this.currentIndex].id);
                }
              }
              break;
            case "end":
              break;
          }
        }
      }, 800);
    },
    resetAnswerData(type, maxScore) {
      let result = '';

      this.penidList.forEach(e => {
        let answerArr = [];
        let item = [];
        this.answerList.forEach(element => {
          if (e == element.penid) {
            if (element.selectType === 2 || element.selectType === 7 && (element.probNum >= 1 && element.probNum <= 7)) {
              answerArr.push(element.probLetter);
            } else {
              result += element.probNum;
            }
            item = element;
          }
        });
        if (maxScore) {
          if (maxScore <= parseInt(result)) {
            result = maxScore;
          }
        } else {
          result = Array.from(new Set(answerArr));
          result = result.join('');
        }
        this.upAnswerRecord(item, type, result);
      });
      this.penidList = [];
      this.answerList = [];

    },
    /**
     * 更新学生作答记录
     * @param {*} data 答题数据
     * @param {*} type 自判类型时传值
     * @param {*} result 多选题或赋分模式时的数据
     */
    upAnswerRecord(data, type = false, result = '') {
      let answer = '';
      let isRight = '';
      if (data.probLetter == '-2') {
        isRight = false;
      } else if (data.probLetter == '-3') {
        isRight = true;
      }
      // console.log(result);
      if (data.selectType === 1 && (data.probNum >= 1 && data.probNum <= 7)) {
        answer = data.probLetter;
      } else if (data.selectType === 2 || data.selectType === 7) {
        answer = result;
      } else if (data.selectType === 3) {
        if (data.probLetter == '-2') {
          answer = '错';
        } else if (data.probLetter == '-3') {
          answer = '对';
        }
      }
      let answerRecordItem = {
        studentId: data.penid,
        questionBagId: data.bagId,
        questionId: data.questionId,
        classId: data.classId,
        answer: answer,
        isRight: type ? isRight : '',
        score: type ? result : ''
      };
      // console.log(answerRecordItem);
      if(answerRecordItem.answer != '' || answerRecordItem.isRight != '' || answerRecordItem.score != ''){
        ExerciseService.updateAnswerRecord(answerRecordItem).then(res => {
          this.answerList = [];
          this.updateAnswerAnalysis(this.questionId);
        });
      }


    },
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
     * 保存习题包练习记录
     */
    async saveExerciseRecord() {
      let params = {
        classId: this.classId,
        questionBagId: this.bagId
      };
      await ExerciseService.saveExerciseRecord(params).then(res => {
        // console.log(res);
        this.exerciseRecordId = res.id;
      });
    },
    /**
     * 更新习题包练习记录
     */
    updateExerciseRecord() {
      let params = {
        classId: this.classId,
        questionBagId: this.bagId
      };
      ExerciseService.updateExerciseRecord(params);
    },
    /**
     * 创建学生作答记录分析
     */
    createAnswerAnalysis() {
      let params = {
        questionBagId: this.bagId,
        classId: this.classId,
        questionId: this.questionId
      };
      return ExerciseService.createAnswerAnalysis(params);
    },
    /**
     * 更新学生作答记录分析
     */
    updateAnswerAnalysis(questionId) {
      let params = {

        questionBagId: this.bagId,
        classId: this.classId,
        questionId: questionId // 前一题
      };
      ExerciseService.updateAnswerAnalysis(params);
    },
    /**
     * 创建学生作答记录
     */
    createAnswerRecord() {
      let params = {
        questionBagId: this.bagId,
        classId: this.classId,
        questionId: this.questionId,
      };
      return ExerciseService.createAnswerRecord(params);
    },
    /**
     * 更新学生作答记录
     * @param {*} item 
     *  item{ studentId :学生ID,answer:学生答案【客观题时传值】,score:得分【赋分模式时传值】,isRight:对错【对错模式时传值】}
     */
    updateAnswerRecord(item) {
      let params = {
        questionBagId: this.bagId,
        classId: this.classId,
        questionId: this.questionId,
        studentId: item.studentId,
        answer: item.answer,
        score: item.score,
        isRight: item.isRight
      };
      return ExerciseService.updateAnswerRecord(params);
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
      });
    },
    /**
     * 更新当前题模式
     * @param {*} pattern 模式
     * @param {*} maxScore 满分分数
     */
    updateAnswerAnalysisPattern(pattern, maxScore) {
      let params = {
        questionBagId: this.bagId,
        questionId: this.questionId,
        classId: this.classId,
        pattern: pattern,
        maxScore: maxScore
      };
      ExerciseService.updateAnswerAnalysisPattern(params);
    },
    /**
     * 页面渲染
     * @param {*} currentIndex 
     */
    resetQuestionItem() {
      this.currentQuestionBagItem = this.questionBagList[this.currentIndex];
      this.questionTypeName = this.currentQuestionBagItem.questionType.name;
      this.questionContentHtml = this.currentQuestionBagItem.questionContent.contentHtml;
      this.questionId = parseInt(this.currentQuestionBagItem.id);
      this.autoGrade = this.currentQuestionBagItem.questionType.autoGrade;

      this.selectQuestion.questionId = this.currentQuestionBagItem.questionContent.questionId;
      this.selectQuestion.classId = this.local$.getItem('selectClassId');
      this.selectQuestion.className = this.local$.getItem('selectClassName');
      this.selectQuestion.bagId = this.bagId;
      this.selectQuestion.analysis = this.currentQuestionBagItem.questionContent.analysis;
      this.selectQuestion.answer = this.currentQuestionBagItem.questionContent.answer;
      this.selectQuestion.content = this.currentQuestionBagItem.questionContent.content;
      this.selectQuestion.contentHtml = this.currentQuestionBagItem.questionContent.contentHtml;
      this.selectQuestion.autoGrade = this.currentQuestionBagItem.questionType.autoGrade;
      this.selectQuestion.selectType = parseInt(this.currentQuestionBagItem.questionType.selectType);
      this.selectQuestion.exerciseRecordId = parseInt(this.exerciseRecordId);
      // console.log(this.selectQuestion);
      this.win$.send('currentQuestion', this.selectQuestion);

      //更新当前题
      this.local$.removeItem('lwQuestion');
      this.local$.setItem('lwQuestion', JSON.stringify(this.selectQuestion));

      //自判开启时下一题引用前面设置的自判模式
      let selfJudgment = this.local$.getItem('selfJude');
      selfJudgment = selfJudgment ? JSON.parse(selfJudgment) : '';
      if (selfJudgment) {
        if (!this.autoGrade && this.judgeStatue == 'ongoing' && selfJudgment) {
          this.createAnswerRecord().then(res => {
            this.createAnswerAnalysis().then(res => {
              this.updateAnswerAnalysisPattern(selfJudgment.pattern, selfJudgment.maxScore);
            })
          });
        }
      } else {
        //开始答题或开始自判时创建学生作答记录和学生作答记录分析
        if (this.answerStatue == 'ongoing' || this.judgeStatue == 'ongoing') {
          // console.log('创建学生作答记录')
          this.createAnswerRecordHandle();
        }
      }


      //查询作答记录分析是否有数据
      //this.answerHasAnalysis();
      //查询学生列表
      this.queryClassStudents(this.classId);
    },
    /**
     * 第一题
     */
    goFirstQuestion() {
      if (this.currentIndex == 0) {} else {
        // 如果是主观题自判模式，跳到上一个主观题
        // let autoGrade = this.questionBagList[0].questionType.autoGrade;
        // if (!autoGrade && this.judgeStatue == 'ongoing') {
        //     this.currentIndex = 0;
        // } else {
        //}
        this.currentIndex = 0;

        this.resetQuestionItem();
      }

    },
    /**
     * 上一题
     */
    prevQuestion() {
      if (this.currentIndex == 0) {} else {
        let autoGrade = this.questionBagList[this.currentIndex].questionType.autoGrade;
        let subjectivePosArr = [];
        if (!autoGrade && this.judgeStatue == 'ongoing') {
          for (let i = 0; i < this.currentIndex; i++) {
            let item = this.questionBagList[i];
            if (!item.questionType.autoGrade) {
              subjectivePosArr.push(i);
            }
          }
          if (subjectivePosArr.length > 0) {
            this.currentIndex = subjectivePosArr[subjectivePosArr.length - 1];
          }
        } else {
          this.currentIndex -= 1;
        }

        this.resetQuestionItem();

      }
    },
    /**
     * 下一题
     */
    nextQuestion() {
      let lastIndex = this.currentIndex;
      if (this.currentIndex < this.questionBagList.length - 1) {
        // 如果是主观题自判模式，跳到下一个主观题
        let autoGrade = this.questionBagList[this.currentIndex].questionType.autoGrade;
        let subjectivePosArr = [];
        if (!autoGrade && this.judgeStatue == "ongoing") {
          for (let i = this.currentIndex + 1; i < this.questionBagList.length; i++) {
            let item = this.questionBagList[i];
            if (!item.questionType.autoGrade) {
              subjectivePosArr.push(i);
            }
          }
          if (subjectivePosArr.length > 0) {
            this.currentIndex = subjectivePosArr[0];
          }
        } else {
          this.currentIndex += 1;
        }
        this.resetQuestionItem();
      }
    },
    /**
     * 最后一题
     */
    goLastQuestion() {
      let lastPos = this.questionBagList.length - 1;
      if (this.currentIndex == lastPos) {} else {
        // 如果是主观题自判模式，跳到上一个主观题
        let autoGrade = this.questionBagList[lastPos].questionType.autoGrade;
        if (this.judgeStatue == "ongoing") {
          if (!autoGrade) {
            this.currentIndex = lastPos;
          }
        } else {
          this.currentIndex = lastPos;
        }
        this.resetQuestionItem();
      }

    },
    /**
     * 退出做题
     */
    quiteExercise() {
      this.updateExerciseRecord();
      //退出做题更换菜单通知主进程
      this.win$.send('menuType', true);
      this.win$.closeCurrentWindow();
      this.local$.removeItem('selfJude');
    },

    /**
     * 查询班级下的学生
     * @param {*} classId 
     */
    queryClassStudents(classId) {
      //this.studentList = [];
      let param = {
        questionBagId: this.bagId,
        questionId: this.selectQuestion.questionId,
        classId: classId,
        //keyword: this.keywords
      }
      this.getList({
        params: param
      });
      this.getSubmit({
        params: {}
      });
      this.getNoSubmit({
        params: {}
      });
      this.getOperation({
        params: {}
      });
    },
    /**
     * 关闭答判情况
     */
    closeAnswer() {
      this.isShowPreview = false;
    },
    /**
     * 打开结果统览
     */
    openResult() {  
      let urlParams = {
        questionId: this.questionId,
        bagId: this.bagId,
        currentIndex: this.currentIndex
      };
      this.openWin('resultsOverview', urlParams);
      
    },
    /**
     * 打开笔记统览
     */
    openNoteList() {
      let urlParams = {
        questionId: this.questionId,
        bagId: this.bagId,
        exerciseRecordId: this.exerciseRecordId
      };
      this.openWin("noteList", urlParams);
    },
    openWin(path, urlParams = {}) {
      this.win$.openWindow(path, {
        fullscreen: true,
        urlParams: urlParams
      })
    },

    /**
     * w创建作答记录
     */
    createAnswerRecordHandle() {
      this.createAnswerRecord().then(res => {
        this.createAnswerAnalysis();
      });
    },
    // ####################################################################
    showHideMenu() {
      this.showMenus = this.showMenus ? false : true;
    },
    /**
     * 开始答题
     */
    switchAnswerStatue() {
      // console.log("开始答题")
      if (this.judgeStatue == "ongoing") {
        return;
      }
      this.activeIndex = 0;
      this.showCountTip();
    },
    /**
     * 开始自判
     */
    switchJudgeStatue() {
      // console.log('开始自判');
      if (this.answerStatue == "ongoing" || this.autoGrade) {
        return;
      }
      this.activeIndex = 1;
      this.isVisible = true;
      if (this.judgeStatue == 'initial') {
        this.judgeModal();
      } else {
        this.showCountTip();
      }

    },
    /**
     * 抢答
     */
    rushToAnswer(show = true) {
      if (!show) {
        document.getElementById("modal-qiangda").remove();
        return;
      }
      let options = {};
      let myThis = this;
      options.title = '抢答';
      options.componentName = ResponderModalComponent;
      options.height = 200;
      options.width = 400;
      options.showFooter = false;
      options.zpButton = false;
      options.idName = "modal-qiangda";
      options.closes = (params) => {
        // console.log("关闭操作");
        myThis.win$.send('close', {
          selectMenu: myThis.selectMenu,
        });
        myThis.isResponder = 'initial';
        myThis.responderPenId = '';
      };
      this.modal$(options);
      this.win$.send('updateState', {
        selectMenu: myThis.selectMenu,
        selectQuestion: myThis.selectQuestion
      });
    },
    /**
     * 抢答
     */
    rushToAnswer2(show = true) {
      if (!show) {
        document.getElementById("modal-qiangda2").remove();
        return;
      }
      let options = {};
      let myThis = this;
      let responderPenId = myThis.responderPenId;
      setTimeout(() => {
        myThis.responderPenId = '';
      }, 3000);
      options.title = '抢答';
      options.componentName = ResponderModalComponent;
      options.height = 200;
      options.width = 400;
      options.showFooter = false;
      options.zpButton = false;
      options.idName = "modal-qiangda2";
      options.closes = (params) => {
        // console.log("关闭操作");
        myThis.win$.send('close', {
          selectMenu: myThis.selectMenu,
        });
        myThis.isResponder = 'initial';
        myThis.responderPenId = '';
      };

      if (responderPenId) {
        myThis.getAnswerRecordStudent().then(response => {
          options.params = {
            name: myThis.studentInfo.studentName,
            penid: responderPenId,
            autoGrade: myThis.autoGrade,
            questionId: myThis.questionId,
            bagId: myThis.bagId,
            exerciseRecordId: myThis.exerciseRecordId,
            selectMenu: myThis.selectMenu
          }
          options.save = (params, close) => {
            close();
          }
        });
      }
      this.modal$(options);
    },
    /**
     * 获取学生信息和答案
     */
    async getAnswerRecordStudent() {
      let parmas = {
        questionId: this.questionId,
        studentId: this.responderPenId,
        exerciseRecordId: this.exerciseRecordId
      };
      let res = await ExerciseService.getAnswerRecordStudent(parmas);
      this.studentInfo = res;

    },
    /**
     * 答判情况
     */
    answerCase() {
      this.isShowPreview = this.isShowPreview ? false : true;
      if (this.isShowPreview) {
        this.queryClassStudents(this.classId);
      }
    },

    judgeModal() {
      this.win$.send("menuNoClick", false);
      let options = {};
      options.title = '配置该道题的自判模式';
      options.componentName = JudgeModalComponent;
      options.height = 200;
      options.width = 400;
      options.showFooter = false;
      options.zpButton = true;
      options.saveText = "开始自判"
      options.idName = "modal-jude";
      options.closes = (params) => {
        // console.log("关闭操作");
        this.win$.send('close', {
          selectMenu: this.selectMenu,
        });
      };
      options.params = {
        pattern: 0,
        maxScore: ''
      };
      options.save = (params, close) => {

        if (params.pattern == 0 && !params.maxScore) {
          this.$message.error("满分设置不能为空");
          return;
        }
        this.local$.removeItem('selfJude');
        this.local$.setItem('selfJude', JSON.stringify({
          pattern: params.pattern,
          maxScore: params.maxScore
        }));
        // this.selfJudgmentModel = params.pattern;
        this.createAnswerRecord().then(res => {
          this.createAnswerAnalysis().then(res => {
            this.updateAnswerAnalysisPattern(params.pattern, params.maxScore);
            this.showCountTip();
          })
        });
        close();
      };
      this.modal$(options);
    },
    btnCloseLwNoteList(event) {
      this.showStudentNoteList = false;
    },
    audioPlay(type) {
      if (type === 0) {
        if (!this.audioStartFlag) {
          this.$refs.audioStart.play();
          this.audioStartFlag = true;
        }
      } else {
        if (!this.audioEndFlag) {
          this.$refs.audioEnd.play();
          this.audioEndFlag = true;
        }
      }
    },
    audioStop(type) {
      if (type === 0) {
        if (this.audioStartFlag) {
          this.$refs.audioStart.pause();
          this.$refs.audioStart.currentTime = 0;
          this.audioStartFlag = true;
        }
      } else {
        if (this.audioEndFlag) {
          this.$refs.audioEnd.pause();
          this.$refs.audioEnd.currentTime = 0;
          this.audioEndFlag = true;
        }
      }

    },
    onPlay(type) {
      if (type === 0) {
        this.audioStartFlag = true;
      } else {
        this.audioEndFlag = true;
      }
    },
    onPause(type) {
      if (type === 0) {
        this.audioStartFlag = false;
      } else {
        this.audioEndFlag = false;
      }
    }
  },
  computed: {
    ...mapGetters(["studentList"])
  }
};
