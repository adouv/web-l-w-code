import Vue from 'vue'

/** 
 * 笔设备管理
 */
export default {
  /**
   * 查询设备列表信息
   * @param {*} params 
   * @param {*} config 
   */
  async getDeviceList(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('/lw-class-interaction/device/list', config);
    return result;
  },
  /**
   * 绑定应用园区
   * @param {*} params 
   * @param {*} config 
   */
  async bindGarden(params = {}, config = {}) {
    let result = await Vue.http.put('/lw-class-interaction/device/garden', params, config);
    return result;
  },
  /**
   * 绑定学生
   * @param {*} params 
   * @param {*} config 
   */
  async bindStudent(params = {}, config = {}) {
    let result = await Vue.http.put('/lw-class-interaction/device/bindStudent', params, config);
    return result;
  },
  /**
   * 获取已开户学生设备
   * @param {*} params 
   * @param {*} config 
   */
  async getListBindStu(params = {}, config = {}){
    config.params = params;
    let result = await Vue.http.get('/lw-class-interaction/device/listBindStu', config);
    return result;
  }
}
