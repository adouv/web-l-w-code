import Vue from 'vue'

/** 
 * AP信息管理
 */
export default {
  /**
   * 开户园区AP信息列表
   * @param {*} params 
   * @param {*} config 
   */
  async getAPInfoGardensList(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('/lw-class-interaction/apinfo/ap-info/gardens', config);
    return result;
  },
  /**
   * 获取班级教室智写笔AP配置列表
   * @param {*} params 
   * @param {*} config 
   */
  async getAPInfoClass(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('/lw-class-interaction/apinfo/ap-info/class', config);
    return result;
  },
  /**
   * 修改教室的AP信息
   * @param {*} params 
   * @param {*} config 
   */
  async updateAPInfo(params = {}, config = {}) {
    let result = await Vue.http.put('/lw-class-interaction/apinfo/ap-info',params, config);
    return result;
  }
}
