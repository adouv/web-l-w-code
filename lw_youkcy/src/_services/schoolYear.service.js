import Vue from 'vue';

/**
 * 学年管理服务
 */

export default {
    // 学年管理
    /**
     * 获取学年列表
     * @params {gardenId: number,page: number,size: number}
     */
    async getSchoolYearList(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get('/lw-garden-server/academic', config);
        return result;
    },

    /**
     *批量删除/删除学年信息
     * @param {ids: string} params 
     * @param {*} config 
     */
    async deleteSchoolYear(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.delete('/lw-garden-server/academic', config);
        return result;
    },

    // 添加学年
    /**
     * 添加学年信息
     * @params{name: string, semesterList: [{name: string, startTime: string, endTime: string}]}
     * startTime: '2019-3-1' 格式
     */
    async postSchoolYear(params = {}, config = {}) {
        let result = await Vue.http.post('/lw-garden-server/academic', params, config);
        return result;
    },
     /**
     * 编辑学年信息
     * @params{id: number,name: string, semesterList: [{name: string, startTime: string, endTime: string}]}
     * startTime: '2019-3-1' 格式
     */
    async putSchoolYear(params = {}, config = {}) {
        let result = await Vue.http.put('/lw-garden-server/academic', params, config);
        return result;
    }
}