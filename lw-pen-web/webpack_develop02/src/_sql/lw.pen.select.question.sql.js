import Vue from 'vue';
export default {
  async selectQuestionSigle() {
    let result = await Vue.sql.select('lw_pen_select_question', `id=1`);
    return result;
  },
  async insertDefaultQuestion() {
    let model = {};
    model.questionId = 0;
    model.classId = 0;
    model.className = "";
    model.bagId = 0;
    model.analysis = "";
    model.answer = "";
    model.content = "";
    model.contentHtml = "";
    model.autoGrade = false;
    model.selectType = 0;
    model.type = 0;
    let result = await Vue.sql.insert('lw_pen_select_question', model);
    return result;
  },
  async updateQuestionSigle(object) {
    let model = {};

    model.questionId = object.bagId !== -1 ? object.questionId : 0;
    model.classId = object.bagId !== -1 ? object.classId : 0;
    model.className = object.bagId !== -1 ? object.className : "";
    model.bagId = object.bagId !== -1 ? object.bagId : 0;
    model.analysis = object.bagId !== -1 ? object.analysis : "";
    model.answer = object.bagId !== -1 ? object.answer : "";
    model.content = object.bagId !== -1 ? object.content : "";
    model.contentHtml = object.bagId !== -1 ? object.contentHtml : "";
    model.autoGrade = object.bagId !== -1 ? object.autoGrade : false;
    model.selectType = object.bagId !== -1 ? object.selectType : 0;
    model.type = object.bagId !== -1 ? 0 : -1;

    let result = await Vue.sql.update('lw_pen_select_question', model, `id=1`);
    return result;
  }
}
