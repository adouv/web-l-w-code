import Vue from 'vue'

export default{
    /**
     * 获取知识点列表
     * @param {*} params 
     * @param {*} config 
     */
    async getKnowledgeList(params,config={}){
        config.params = params;
        let result = await Vue.http.get(process.env.lwtpkWeb + '/lwtpk-web/knowledge/list',config);
        return result;
    }
}