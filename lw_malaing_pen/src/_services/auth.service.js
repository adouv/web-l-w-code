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
        let result = await Vue.http.post('/lw-authz-server/oauth/token', params, config)
        return result
    },
    /**
     * 获取用户信息
     * @param {*} params 
     * @param {*} config 
     */
    async getAuthInfo(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get('/lw-garden-server/account/auth-info', config)
        return result
    }
}