import Vue from 'vue'

export default {
    /**
     * 保存习题包练习记录
     * @param {*} params 
     * @param {*} config 
     */
    async saveExerciseRecord(params, config = {}) {
        let result = await Vue.http.post(process.env.lwClassInteraction + '/lw-class-interaction/exercise/exercise-record', params, config);
        return result;
    },
    /**
     * 更新习题包练习记录
     * @param {*} params 
     * @param {*} config 
     */
    async updateExerciseRecord(params, config = {}) {
        let result = await Vue.http.put(process.env.lwClassInteraction + '/lw-class-interaction/exercise/exercise-record', params, config);
        return result;
    },
    /**
     * 创建学生作答记录分析
     * @param {*} params 
     * @param {*} config 
     */
    async createAnswerAnalysis(params, config = {}) {
        let result = await Vue.http.post(process.env.lwClassInteraction + '/lw-class-interaction/exercise/answer-analysis', params, config);
        return result;
    },
    /**
     * 更新学生作答记录分析
     * @param {*} params 
     * @param {*} config 
     */
    async updateAnswerAnalysis(params, config = {}) {
        let result = await Vue.http.put(process.env.lwClassInteraction + '/lw-class-interaction/exercise/answer-analysis', params, config);
        return result;
    },
    /**
     * 创建学生作答记录
     * @param {*} params 
     * @param {*} config 
     */
    async createAnswerRecord(params, config = {}) {
        let result = await Vue.http.post(process.env.lwClassInteraction + '/lw-class-interaction/exercise/answer-record', params, config);
        return result;
    },
    /**
     * 更新学生作答记录
     * @param {*} params 
     * @param {*} config 
     */
    async updateAnswerRecord(params, config = {}) {
        let result = await Vue.http.put(process.env.lwClassInteraction + '/lw-class-interaction/exercise/answer-record', params, config);
        return result;
    },
    /**
     * 查询作答记录分析是否有数据
     * @param {*} params 
     * @param {*} config 
     */
    async answerHasAnalysis(params, config = {}) {
        config.params = params;
        let result = await Vue.http.get(process.env.lwClassInteraction + '/lw-class-interaction/exercise/answer-analysis/hasAnalysis', config);
        return result;
    },
    /**
     * 更新当前题模型
     * @param {*} params 
     * @param {*} config 
     */
    async updateAnswerAnalysisPattern(params, config = {}) {
        let result = await Vue.http.put(process.env.lwClassInteraction + '/lw-class-interaction/exercise/answer-analysis/pattern', params, config);
        return result;
    },
    /**
     * 答题结果统览chart接口（客观题）
     * @param {*} params 
     * @param {*} config 
     */
    async getChartResult(params, config = {}) {
        config.params = params;
        let result = await Vue.http.get(process.env.lwClassInteraction + '/lw-class-interaction/exercise/answer-analysis', config);
        return result;
    },
    /**
     * 答题结果统览表格数据回显
     * @param {*} params 
     * @param {*} config 
     */
    async getChartTable(params, config = {}) {
        config.params = params;
        let result = await Vue.http.get(process.env.lwClassInteraction + '/lw-class-interaction/exercise/answer-analysis/table', config);
        return result;
    },
    /**
     * 获取已有作答记录分析的习题包列表
     * @param {*} params 
     * @param {*} config 
     */
    async getRightAnalysisList(params, config = {}) {
        config.params = params;
        let result = await Vue.http.get(process.env.lwClassInteraction + '/lw-class-interaction/exercise/answer-analysis/rightAnalysis', config);
        return result;
    },
    /**
     * 查询学生信息与答案
     * @param {*} params 
     * @param {*} config 
     */
    async getAnswerRecordStudent(params, config = {}) {
        config.params = params;
        let result = await Vue.http.get(process.env.lwClassInteraction + '/lw-class-interaction/exercise/answer-record/student', config);
        return result;
    }

}