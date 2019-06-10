import Vue from 'vue'

export default {
   
    /**
   * 获取学期
   * @param {*} params 
   * @param {*} config 
   */
  async getEditionList(params,config = {}){
    //config.params = params;
    let result = await Vue.http.get(process.env.lwtpkWeb + '/lwtpk-web/outlineDictionary/semesters/'+ params.gradeCode + "/" + params.subjectCode,config)
    return result;
  },
  /**
   * 获取章节列表
   * @param {*} params 
   * @param {*} config 
   */
  async getOutlineList(params,config = {}){
    config.params = params;
    let result = await Vue.http.get(process.env.lwtpkWeb + '/lwtpk-web/outline/outlineList',config)
    return result;
  },


}