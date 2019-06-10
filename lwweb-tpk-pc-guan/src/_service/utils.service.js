import Vue from 'vue';
/** 
 * 
 */
export default {
    /**
     * 获取导航列表
     * @param {*} [params={}]
     * @param {*} [config={}]
     * @returns
     */
    async GetLwNavList(params = {}, config = {}) {
        config.params = params;
        let random = (Math.random() * 10000) + 9999999999999;
        let result = await Vue.http.get(`../../static/data/nav.json?${random}`, config);
        return result;
    },
    /**
     * 获取图表工具栏语言包
     *
     * @param {*} [params={}]
     * @param {*} [config={}]
     * @returns
     */
    async GetHighchartsLang(params = {}, config = {}) {
        config.params = params;
        let random = (Math.random() * 10000) + 9999999999999;
        let result = await Vue.http.get(`../../static/data/highcharts.lang.json?${random}`, config);
        return result;
    },
    /**
     * 折线图数据
     *
     * @param {*} [params={}]
     * @param {*} [config={}]
     * @returns
     */
    async GetInside(params = {}, config = {}) {
        config.params = params;
        let random = (Math.random() * 10000) + 9999999999999;
        let result = await Vue.http.get(`../../static/data/api-beijing.json?${random}`, config);
        return result;
    },
    /**
     * 获取气泡图数据
     *
     * @param {*} [params={}]
     * @param {*} [config={}]
     * @returns
     */
    async GetBubble(params = {}, config = {}) {
        config.params = params;
        let random = (Math.random() * 10000) + 9999999999999;
        let result = await Vue.http.get(`../../static/data/life-expectancy.json?${random}`, config);
        return result;
    }
}