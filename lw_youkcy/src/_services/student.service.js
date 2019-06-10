import Vue from 'vue';

/**
 * 学生管理服务
 *
 */

export default {
  // 学生名单
  /**
   * 获取学年名称
   * @param {gardenId: string | number}
   */
  async getSchoolYear(params = {}, config = {}) {
    config.params = params
    let result = await Vue.http.get('/lw-garden-server/academic/date', config);
    return result;
  },
  /**
   * 班级名单
   * @param {gardenId: string | number}
   */
  async getClassList(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('/lwtpk-web/organization/garden/tree', config);
    return result;
  },

  /**
   * 学生表格
   * @params {
   *     gardenId:  number;
   *     
   * }
   */
  async getStudentsList(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('/lw-garden-server/student', config);
    return result;
  },


  /**
   * 学生单条数据禁用/启用
   * @params {id: string | number, status: string | number}
   * status: 0 | 启用  ； 1 | 禁用
   */
  async putSingleStudentForbidden(params = {}, config = {}) {
    let result = await Vue.http.put('/lw-garden-server/student/status', params, config);
    return result;
  },
  /**
   * 批量学生数据禁用
   * @params {ids: string | number}
   * 
   */
  async putStudentsForbidden(params = {}, config = {}) {
    let result = await Vue.http.put('/lw-garden-server/student/frozen', params, config);
    return result;
  },

  //  添加学生
  /**
   * 添加学生信息
   * @params {
   *     name:  string;
   *     gender: boolean; true | 男  false | 女
   *      number: number | string
   *     academicYearName: string;
   *     gradeId: string
   *      classId: string
   *  isTransient: number | string  是否借读 0：正常 1：借读
   * }
   */
  async postStudentsList(params = {}, config = {}) {
    let result = await Vue.http.post('/lw-garden-server/student', params, config);
    return result;
  },
  /**
   * 编辑学生信息
   * @params {
   *      id: number;
   *     name:  string;
   *     gender: boolean; true | 男  false | 女
   *      number: number | string
   *     academicYearName: string;
   *     gradeId: string
   *      classId: string
   *  isTransient: number | string  是否借读 0：正常 1：借读
   * }
   */
  async putStudentsList(params = {}, config = {}) {
    let result = await Vue.http.put('/lw-garden-server/student', params, config);
    return result;
  },
  /**
   * 查询年级列表
   * @params {gardenId: number}
   */
  async getGradesList(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('lwtpk-web/organization/grades', config);
    return result;
  },

  /**
   * 查询年级下的班级列表
   * @params {gradeId: string}
   */
  async getClassesList(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('lwtpk-web/organization/classes', config);
    return result;
  },

  /**
   * 获取学生列表
   * @params {gradeId: string}
   */
  async getStudentList(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('lw-garden-server/student/list', config);
    return result;
  }
}
