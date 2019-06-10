import Vue from 'vue'

export default {
  async insertWin(key, name) {
    let model = {};
    model.key = key;
    model.name = name;
    let result = await Vue.sql.insert('lw_pen_win', model);
    return result;
  },
  async updateWin(key, name) {
    let model = {};
    model.key = key;
    let result = await Vue.sql.update('lw_pen_win', model, `name='${name}'`);
    return result;
  },
  async selectWin(name) {
    let result = await Vue.sql.select('lw_pen_win', `name='${name}'`);
    return result;
  }
}
