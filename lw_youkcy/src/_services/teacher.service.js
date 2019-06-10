import Vue from 'vue';
/** 
 * 教职服务
 */
export default {
    /**
     * 获取教职列表
     * @param {*} [params={}]
     * @param {*} [config={}]
     * @returns
     */
    // async getTeacherList(params = {}, config = {}) {
    //     config.params = params;
    //     config.baseURL = "";
    //     let result = await Vue.http.get('/static/data/teacher.json', config);
    //     return result;
    // },
    async getTeacherList(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get('/lw-garden-server/account', config);
        return result;
    }
}