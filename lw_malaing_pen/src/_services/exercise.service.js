import Vue from "vue";
/** 
 * 
 */
export default {
    async getGradeList(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lwtpk-web/organization/teacher/professor/history-lesson-grades", config);
        return result;
    },
    async getSubjectList(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lwtpk-web/organization/subject/teacher-grade-subject", config);
        return result;
    },
    async getAllType(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lw-class-interaction/dictionary/item/applicationtypes", config);
        return result;
    },
    // 查询练习卷列表
    async getExerciseList(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lw-class-interaction/question/practice-paper/list", config);
        return result;
    },
    // 根据年级学科等条件查询习题列表
    async getQuestionByGradeSubject(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lw-class-interaction/question/question/questions-by-grade-course", config);
        return result;
    },
    // 查询组卷下的习题列表
    async getPracticeQuestionList(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lw-class-interaction/question/practice-paper/question-of-practice-paper", config);
        return result;
    },
     // 向组卷下添加习题
     async addPracticeQuestion(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lw-class-interaction/question/practice-paper/practice-paper-addquestion", config);
        return result;
    },
       // 组卷下删除习题
       async deletePracticeQuestion(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lw-class-interaction/question/practice-paper/delete-question-of-practice-paper", config);
        return result;
    },
       // 保存练习卷
       async savePractice(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lw-class-interaction/question/practice-paper/save-practice-paper", config);
        return result;
    }
    ,
       // 查询属性字典
       async getAttrDirectionary(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lw-class-interaction/dictionary/dictionary/question-properties", config);
        return result;
    }
    ,
       async getAttrsById(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lw-class-interaction/dictionary/dictionary/dictionaries-by-pid", config);
        return result;
    }
    ,
       async getQuestionProperties(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get("/lw-class-interaction/practice-paper-question/relation/get-question-properties", config);
        return result;
    }
    ,
    async getQuestionDictionaryItem(params = {}, config = {}) {
     config.params = params;
     let result = await Vue.http.get("/lw-class-interaction/dictionary/item/question-ladder-dictionary-item", config);
     return result;
 }
 ,
 async saveQuestionProperties(params = {}, config = {}) {
  config.params = params;
  let result = await Vue.http.post("/lw-class-interaction/practice-paper-question/relation/save-question-properties", config);
  return result;
}
   
}