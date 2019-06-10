import Vue from 'vue';

export default {
    /**
     * 家长管路家长列表获取
     * @params{}
     */
    async getParentList(params = {}, config = {}) {
        config.params = params;
        let result = await Vue.http.get('/lw-garden-server/parent', config);
        return result;
    },
    
    /**
     * 家长单条数据禁用/启用
     * @params {id: string | number, status: string | number}
     * status: 0 | 启用  ； 1 | 禁用
     */
    async putSingleParentForbidden(params = {}, config = {}) {
        let result = await Vue.http.put('/lw-garden-server/parent/status', params, config);
        return result;
    },
    /**
    * 批量家长数据禁用
    * @params {ids: string | number}
    * 
    */
    async putParentsForbidden(params = {}, config = {}) {
        let result = await Vue.http.put('/lw-garden-server/parent/frozen', params, config);
        return result;
    },

    /**
     * 家长提交
     */
    async postParent(params = {}, config ={}) {
        let result = await Vue.http.post('/lw-garden-server/parent', params, config);
        return result;
    },
    /**
     * 家长编辑
     */
    async putParent(params = {}, config ={}) {
        let result = await Vue.http.put('/lw-garden-server/parent', params, config);
        return result;
    }
}