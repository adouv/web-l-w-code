import OrganizationService from '../../_service/organization.service'
import OutlineService from '../../_service/outline.service'
import AccountService from '../../_service/account.service'
import KnowledgeService from '../../_service/knowledge.service'
import QuestionService from '../../_service/question.service';
export default {
  name: "LibraryComponent",
  data() {
    return {
      selectMode: 0,//选择模式（0-课表大纲模式，1-知识点单选模式，2-知识点多选模式
      initSelectParams: {
        totalCount: 0, //总条数
        isLoadComplete: false,//loading
        questionList: [], //题列表,
        questionTypeList: [],//题型列表
        tabIndex: 0,//标签默认显示项
        outlineParams: [],
      },
      outParams: {
        pageNo: 1,
        offset: 0,
        checkedExerciseIds: [],//选中的习题ID
        typeCode: "", // 题型Code
        keyword: "", //搜索关键字
        searchType: 0, //搜索类型
        outlineIds: [],
        isLoadQuestion: true,
        isSearch: false
      },
      //左侧所需参数
      outlineNodes: [],//左侧查询数据
      gradeList: [],//年级列表
      subjectList: [],//学科
      editionList: [],//学期
      selectParams: {
        gradeCode: '',
        subjectCode: '',
        semesterCode: '',
        gradeId: '',
        classId: '',
        single: true
      },//切换后选择项
      outlineParams: {
        gradeCode: '',
        subjectCode: '',
        semesterCode: '',
        resource: 'exercise'
      },
      defaultSelectValue: {
        grade: '暂无年级',
        subject: '暂无学科',
        semester: '暂无学期',
      },
      classList: ''

    }
  },
  mounted() {
    this.initSelectParams.isLoadComplete = true;
    this.getGradesList();
    this.outlineNodes = [];
    this.selectParams.classId = this.local$.getItem('selectClassId');
    this.classList = AccountService.getSelectClassList();
    if (this.selectParams.gradeCode && this.selectParams.subjectCode) {
      this.getQuestionList(this.outParams.offset);
    }
  },
  methods: {
    /**
     * 获取子组件(libraryTemplate)的动态传值
     * @param {*} data 
     */
    getOutParams(data) {
      this.outParams = data;

      if (this.outParams.isLoadQuestion === true) {
        this.getQuestionList(this.outParams.offset);
      }
    },
    /**
     * 获取子组件(collapseTree)的动态传值
     * @param {*} key 
     */
    getSelectNodes(key) {
      let arr = [{id:1,name:'cc'},{id:2,name:'bb'}];
      console.log(arr.includes(1));
      if(this.selectParams.single && this.selectMode !==2 ){
        this.initSelectParams.outlineParams = [key];
        this.outParams.outlineIds = key.id;
        this.getQuestionList(this.outParams.offset);
      }else{
        if(this.initSelectParams.outlineParams.length < 4){
          this.update(key);  
          this.getQuestionList(this.outParams.offset);
        }else{
          this.$message.error("最多可选4个知识点！");
        }
      }
      
    },
    update(item){
      let index = 0;  
      for(let rec of this.initSelectParams.outlineParams) {  // Search for corresponding record
        if(rec.id == item.id) {  // Record matched
          // Delete old record
          this.initSelectParams.outlineParams.splice(index, 1);
        }
        index++;
      }
      this.initSelectParams.outlineParams.push(item);
    },
    /**
     * 章节/知识点 标签切换
     * @param {*} event 
     */
    tabChange(event) {
      this.initSelectParams.tabIndex = event;
      this.selectMode = event;
      this.outParams.outlineIds = [];
      this.initSelectParams.outlineParams = [];
      if (this.initSelectParams.tabIndex == 0) {
        this.getEditionList(this.selectParams.gradeCode, this.selectParams.subjectCode);
      } else {
        this.getKnowledgeList(this.selectParams.gradeCode, this.selectParams.subjectCode);
      }
    },
    /**
     * 切换年级
     * @param {*} event 
     */
    changeGrade(event) {
      this.defaultOutParams();
      if (event && this.selectParams.gradeCode != event) {
        this.selectParams.gradeCode = event;
        this.selectParams.subjectCode = null;
        this.outlineNodes = [];
        this.initSelectParams.questionList = [];
        this.selectParams.semesterCode = null;
        this.defaultSelectValue.subject = '暂无学科';
        this.defaultSelectValue.semester = '暂无学期';
        const code = this.gradeList.find(item => item.gradeCode === event).id;
        this.getSubjectListByGrade(code);
      }

    },
    /**
     * 切换学科
     * @param {*} event 
     */
    changeSubject(event) {
      this.defaultOutParams();
      if (event && this.selectParams.subjectCode != event) {
        this.selectParams.subjectCode = event;
        this.selectParams.semesterCode = null;
        this.defaultSelectValue.semester = '暂无学期';
        this.outlineNodes = [];
        this.initSelectParams.questionList = [];
        this.getTypeListByCondition();
        if (this.initSelectParams.tabIndex == 0) {
          this.getEditionList(this.selectParams.gradeCode, event);
        } else {
          this.getKnowledgeList(this.selectParams.gradeCode, event);
        }
      }
    },
    /**
     * 切换学期
     * @param {*} event 
     */
    changeEdition(event) {
      this.defaultOutParams();
      if (event && this.selectParams.semesterCode != event) {
        this.selectParams.semesterCode = event;
        this.outlineNodes = [];
        this.initSelectParams.questionList = [];
        this.getOutlineList(Object.assign(this.outlineParams, this.selectParams));
        //this.selectedNode$.action({ type: TreeAction.ASSIGN, item: [] });
      }
    },
    /**
     * 重置默认参数
     */
    defaultOutParams() {
      this.outParams.checkedExerciseIds = [];
      this.outParams.keyword = '';
      this.outParams.pageNo = 1;
      this.outParams.offset = 0;
      this.outParams.outlineIds = [];
      this.outParams.searchType = 0;
      this.outParams.isSearch = false;
      this.outParams.typeCode = '';
      this.outParams.isLoadQuestion = true;
    },
    /**
     * 获取年级列表
     */
    getGradesList() {
      this.gradeList = [];
      OrganizationService.getGradesList().then(res => {
        if (res.data) {
          this.gradeList = res.data;
          this.selectParams.gradeCode = this.selectParams.gradeCode || res.data[0].gradeCode;
          if (this.selectParams.gradeCode) {
            this.defaultSelectValue.grade = this.selectParams.gradeCode;
          }
          for (const grade of res.data) {
            if (grade.gradeCode === this.selectParams.gradeCode) {
              this.getSubjectListByGrade(grade.id);
            }
          }
        }

      });
    },
    /**
     * 获取学科
     * @param {*} gradeId 
     */
    getSubjectListByGrade(gradeId) {
      this.subjectList = [];
      let param = {
        //gardenId: AccountService.getGardenId(),
        gradeId: gradeId,
        //classId: this.selectParams.classId

      };

      OrganizationService.getSubjectList(param).then(res => {
        if (res.data.length > 0) {
          this.subjectList = res.data;
          this.selectParams.subjectCode = this.selectParams.subjectCode || (res.data[0] ? res.data[0].id : '');
          this.defaultSelectValue.subject = this.selectParams.subjectCode;
          this.getTypeListByCondition();
          if (this.initSelectParams.tabIndex == 0) {
            this.getEditionList(this.selectParams.gradeCode, this.selectParams.subjectCode);
          } else {
            this.getKnowledgeList(this.selectParams.gradeCode, this.selectParams.subjectCode);
          }
        }
      });
    },
    /**
     * 获取学期
     * @param {*} gradeCode 
     * @param {*} subjectCode 
     */
    getEditionList(gradeCode, subjectCode) {
      let param = {
        gradeCode: gradeCode,
        subjectCode: subjectCode
      };
      OutlineService.getEditionList(param).then(res => {
        if (res.length > 0) {
          this.editionList = res;
          this.selectParams.semesterCode = res[0] ? res[0].id : '';
          this.defaultSelectValue.semester = this.selectParams.semesterCode;
          this.getOutlineList(Object.assign(this.outlineParams, this.selectParams));
        }
      });

    },
    /**
     * 获取章节大纲数据
     * @param {*} outlineParams 
     */
    getOutlineList(outlineParams) {
      this.initSelectParams.isLoadComplete = false;

      OutlineService.getOutlineList(outlineParams).then(res => {
        this.initSelectParams.isLoadComplete = true;
        this.outlineNodes = res.map(Data => this.treeNodeOutline(Data));
        this.getQuestionList(this.outParams.offset);
      });
    },
    /**
     * 获取知识点大纲数据
     */
    getKnowledgeList(gradeCode, subjectCode, name = '') {
      let params = {
        gradeCode: gradeCode,
        subjectCode: subjectCode
      }
      this.initSelectParams.isLoadComplete = false;

      KnowledgeService.getKnowledgeList(params).then(res => {
        this.initSelectParams.isLoadComplete = true;
        this.outlineNodes = res.map(Data => this.treeNodeKnowledge(Data));
        this.getQuestionList(this.outParams.offset);
      });


    },
    /**
     * 知识点数据处理统一返回
     * @param {*} item 
     * @param {*} level 
     */
    treeNodeKnowledge(item, level = 1) {
      // 在校本题库中所有节点都可以点选
      const isLibrary = true;
      if (item.knowledgePointVos && item.knowledgePointVos.length > 0) {
        let isSelect = isLibrary ? level !== 0 : level !== 1;
        let isShow = true;
        const children = item.knowledgePointVos.map(data => {
          if (level === 2 && !isLibrary) {
            if (isSelect && data.knowledgePointVos && item.knowledgePointVos.length > 0) {
              isSelect = false;
            }
          }
          if (!data.knowledgePointVos && item.knowledgePointVos.length < 0) {
            isShow = false;
          }

          return this.treeNodeKnowledge(data, level + 1);
        });
        return {
          name: item.name,
          id: item.id,
          level,
          isSelect,
          children: children,
          isShow
        };

      } else {
        return {
          name: item.name,
          id: item.id,
          isSelect: true,
          level,
          isShow: false
        };
      }
    },
    /**
     * 章节数据处理统一返回
     * @param {*} item 
     */
    treeNodeOutline(item) {
      // 在校本题库中所有节点都可以点选
      const isLibrary = true;
      if (item.childOutlineList.length > 0) {
        let isSelect = isLibrary ? item.level > 0 : item.level > 1;
        let isShow = true;
        const children = item.childOutlineList.map(data => {
          if (data.level < 4 && !isLibrary) {
            if (isSelect && data.childOutlineList.length > 0) {
              isSelect = false;
            }
          }
          if (!data.childOutlineList && data.childOutlineList < 0) {
            isShow = false;
          }
          return this.treeNodeOutline(data);
        });
        return {
          isOpen: item.isOpen,
          rootId: item.rootId,
          name: item.title,
          id: item.id,
          level: item.level,
          isSelect,
          children: children,
          canPrepare: item.canPrepare,
          isShow
        };
      } else {
        return {
          isOpen: item.isOpen,
          rootId: item.rootId,
          name: item.title,
          id: item.id,
          isSelect: true,
          level: item.level,
          canPrepare: item.canPrepare,
          isShow: false
        };
      }
    },
    /**
     * 切换单选/多选
     */
    toggleModel() {
      this.selectParams.single = !this.selectParams.single;
      if (this.selectParams.single) {
        //单选
        this.selectMode = 1;
      } else {
        //多选
        this.selectMode = 2;
      }
    },
    /**
     * 获取题型列表
     */
    getTypeListByCondition() {
      const params = {
        gradeCode: this.selectParams.gradeCode,
        subjectCode: this.selectParams.subjectCode,
        semesterCode: this.selectParams.semesterCode ? this.selectParams.semesterCode : ''
      };
      //console.log(params);
      QuestionService.getDictionaryTypeList(params).then(res => {
        this.initSelectParams.questionTypeList = res;
        this.initSelectParams.questionTypeList.unshift({ name: '全部', code: '' });
      });
    },
    /**
     * 获取右侧习题列表
     * @param offset
     * @param outlineIds
     */
    getQuestionList(offset, outlineIds = "") {
      this.initSelectParams.isloadComplete = false;
      this.initSelectParams.questionList = [];
      const currentOutlineId = typeof this.outParams.outlineIds === 'string' ? this.outParams.outlineIds : this.outParams.outlineIds.join(',');
      outlineIds = !this.searchType ? currentOutlineId : '';
      const params = {
        selectMode: this.selectMode,
        subjectCode: this.selectParams.subjectCode,
        gradeCode: this.selectParams.gradeCode,
        pointIds: this.selectMode !== 0 ? outlineIds : null,
        outlineIds: this.selectMode === 0 ? outlineIds : null,
        typeCode: this.outParams.typeCode,
        level: '',
        keyword: this.outParams.keyword,
        offset: this.outParams.offset,
        size: 10,
      };
      QuestionService.getQuestionList(params).then(res => {
        this.initSelectParams.isloadComplete = true;
        if (res && res.xRecordCount) {
          this.initSelectParams.totalCount = parseInt(res.xRecordCount);
        }
        this.initSelectParams.questionList = res || res.map(item => {
          if (this.checkedExerciseIds.includes(item.id)) {
            item.checked = true;
          }
        });
      });

    },
    /**
   * 批量加入习题包
   */
    checkedAllExercise(isAnswer) {
      if(!AccountService.getSelectClassId()){
        this.$message.error('当前用户没有授课班级');
        return;
      }
      if (this.outParams.checkedExerciseIds.length > 0) {
        const params = {
          classId: AccountService.getSelectClassId(),
          questionIds: this.outParams.checkedExerciseIds.join(',')
        };
        QuestionService.saveQuestionBag(params).then(res => {
          if (res) {
            this.outParams.checkedExerciseIds = [];
            if (!isAnswer) {
              this.$message.success('加入习题包成功！');
            } else {
              let win_id = this.local$.getItem("win_id_practice");
              this.win$
                .getRemote()
                .BrowserWindow.fromId(parseInt(win_id))
                .close();
              this.local$.removeItem('win_id_library');
              this.openWin('subjectiveProblem', true, { eId: res });
            }
          }

        }).catch(error => {
          console.log("捕获到错误,", error);
          this.$message.error("加入习题包失败！");
        });

      }

    },
    openWin(path, fullscreen = false, urlParams = {}) {
      this.win$.openWindow(path, {
        fullscreen: fullscreen,
        urlParams: urlParams
      })
      this.win$.closeCurrentWindow();
    },
    back(){
      this.local$.removeItem('win_id_library');
      let win_id = this.local$.getItem("win_id_practice");
      this.win$
        .getRemote()
        .BrowserWindow.fromId(parseInt(win_id))
        .close();
      
      this.openWin('practice');
    }
  }
};
