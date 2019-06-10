import Vue from 'vue'

/** 
 * 用户验证服务
 */
export default {
  /**
   * 登录接口（获取token)
   * @param {*} params 
   * @param {*} config 
   */
  async sign(params = {}, config = {}) {
    let result = await Vue.http.post('/lw-authz-server/oauth/token', params, config);
    return result;
  },
  /**
   * 获取用户信息
   * @param {*} params 
   * @param {*} config 
   */
  async getAuthInfo(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('/lw-garden-server/account/auth-info', config);
    return result;
  },
  /**
   * 获取园区列表
   * @param {*} params 
   * @param {*} config 
   */
  async getGardenList(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('/lw-garden-server/garden', config);
    return result;
  },
  /**
   * 获取permission列表
   * @param {*} params 
   * @param {*} config 
   */
  async getPermission(params = {}, config = {}) {
    config.params = params;
    let result = await Vue.http.get('lw-garden-server/permission/getPermissionCodeList', config);
    return result;
  },
  /**
   * 获取指定运维管理员下管理的模块
   * @param {*} params 
   * @param {*} config 
   */
  async getModuleAdmin(params = {}, config = {}) {
    let result = await Vue.http.get('lw-garden-server/module/admin/' + params.adminId, config);
    return result;
  },
}
