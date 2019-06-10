import Vue from 'vue'

export default {
  /**
   * 获取班级
   * @param {*} params 
   * @param {*} config 
   */
  async getClassList(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get(process.env.lwClassInteraction + '/lw-class-interaction/organization/organization/teacher/classes', config);
    return result;
  },
  /**
   * 查询班级下学生
   * @param {*} param 
   * @param {*} config 
   */
  async getClassStudent(params, config = {}) {
    config.params = params;
    let result = await Vue.http.get(process.env.lwClassInteraction + '/lw-class-interaction/organization/organization-account/students', config)
    return result;
  },
  async getStudent(params, config = {}) {
    config.params = params;
    let result = await Vue.http.get(`${process.env.lwClassInteraction}/lw-class-interaction/exercise/answer-record/status`, config);
    return result;
  },
  /**
   * 获取年级
   * @param {*} params 
   * @param {*} config 
   */
  async getGradesList(params, config = {}) {
    config.params = params;
    let result = await Vue.http.get(process.env.lwtpkWeb + '/lwtpk-web/organization/grades', config)
    return result;
  },
  /**
   * 获取学科
   * @param {*} params 
   * @param {*} config 
   */
  async getSubjectList(params, config = {}) {
    config.params = params;
    let result = await Vue.http.get(process.env.lwtpkWeb + '/lwtpk-web/organization/subjects', config)
    return result;
  },
  /**
   * 获取园区用户组
   * @param {*} params 
   * @param {*} config 
   */
  async getDepartemntAccountList(params, config = {}) {
    let result = await Vue.http.get(process.env.lwGardenServer + '/lw-garden-server/department/tree/department-account/' + params, config);
    return result;
  },
  /**
   * 添加班级下的学生（选人控件）
   * @param {*} params 
   * @param {*} config 
   */
  async addOrganizationAccount(params, config = {}) {
    let result = await Vue.http.post(process.env.lwClassInteraction + '/lw-class-interaction/organization/organization-account', params, config);
    return result;
  },
  /**
   * 搜索人员分组（选人控件）
   * @param {*} params 
   * @param {*} config 
   */
  async getDepartmentAccountBySearch(params, config = {}) {
    // let searchKey = params.searchKey !== undefined && params.searchKey !== null && params.searchKey !== '' ? '?searchKey='+params.searchKey : '';
    let result = await Vue.http.get(process.env.lwGardenServer + '/lw-garden-server/department/tree/department-account/search/' + params.id + '?searchKey=' + params.searchKey);
    return result;
  },
  /**
   * 获取用户（选人控件）
   * @param {*} params 
   * @param {*} config 
   */
  async getDepartmentAccountOpenIds(params, config = {}) {
    let result = await Vue.http.get(process.env.lwGardenServer + '/lw-garden-server/department/tree/department-account/openIds', params, config);
    return result;
  },



}
