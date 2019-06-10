import Vue from 'vue'

export default {
    /**
     * 获取习题包列表
     * @param {*} params 
     * @param {*} config 
     */
    async getQuestionBagList(params, config = { observe: 'response', responseType: 'json' }) {
        config.params = params;
        let result = await Vue.http.get(process.env.lwClassInteraction + '/lw-class-interaction/question/question-bag/list', config)
        return result
    },
    /**
     * 获取题型列表
     * @param {*} params 
     * @param {*} config 
     */
    async getDictionaryTypeList(params, config = {}) {
        config.params = params;
        let result = await Vue.http.get(process.env.lwtpkWeb + '/lwtpk-web/dictionaryType/typeList', config);
        return result;
    },
    /**
    * 获取习题列表
    * @param {*} params 
    * @param {*} config 
    */
    async getQuestionList(params, config = { observe: 'response', responseType: 'json' }) {
        config.params = params;
        let result = await Vue.http.get(process.env.lwtpkWeb + '/lwtpk-web/question', config);
        return result;
    },
    /**
     * 获取习题详情
     * @param {*} params 
     * @param {*} config 
     */
    async getQuestionContent(params, config = {}) {
        let result = await Vue.http.get(process.env.lwtpkWeb + '/lwtpk-web/question/content/' + params, config);
        return result;
    },
    /**
     * 校本题库保存习题包
     * @param {*} params 
     * @param {*} config 
     */
    async saveQuestionBag(params, config = {}) {
        let result = await Vue.http.post(process.env.lwClassInteraction + '/lw-class-interaction/question/question-bag', params, config);
        return result;
    },
    /**
     * 根据习题包ID查询习题列表
     * @param {*} params 
     */
    async getQuestionListByBagId(params, config = {}) {
        config.params = params;
        let result = await Vue.http.get(process.env.lwClassInteraction + '/lw-class-interaction/question/question/list', config);
        return result;
    },
    /**
     * 查询习题内容
     * @param {*} params 
     */
    async getExerciseInfo(params, config = {}) {
        config.params = params;
        let result = await Vue.http.get(process.env.lwClassInteraction + '/lw-class-interaction/question/question-content', config);
        return result;
    }
}