import Vue from 'vue';
export default {
  async insertLePenProblem(object) {
    let result = await Vue.sql.insert('lw_pen_problem', object);
    return result;
  },
  async selectLwPenProblem(where) {
    let result = await Vue.sql.select('lw_pen_problem', where);
    return result;
  }
}
