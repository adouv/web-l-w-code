import Vue from 'vue';
export default {
  async insertLePenNotes(object) {
    let result = await Vue.sql.insert('lw_pen_notes', object);
    return result;
  },
  async selectLwPenNotes(where) {
    let result = await Vue.sql.select('lw_pen_notes', where);
    return result;
  }
}
