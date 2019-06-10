import Vue from 'vue';

export default {

    /**
     * 学生添加学生信息模板下载
     */

    getStudentTemplateDown() {
        let token = window.localStorage.getItem('LWToken');
        location.href = 'http://10.0.0.84:8083/lw-garden-server/student/download-template?TOKEN=' + token;
    },

    /**
     * 学生添加信息批量上传
     * @params = {gardenId: string, fileName: string}
     */

    async postStudentBatchUpLoad(params = {}, config = {}) {
        config.headers = {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA"
        }
        let result = await Vue.http.post('/lw-garden-server/student/import', params, config);
        return result;
    },

    /**
     * 学生管理导出
     * @params = {}
     */
    async getStudentexport(config = {}) {
        let token = window.localStorage.getItem('LWToken');
        window.location.href = `http://10.0.0.84:8083/lw-garden-server/student/export?gardenId=${config.gardenId}&academicYearId=${config.academicYearId}&keyWord=
        ${config.keyWord}&status=${config.status}&classIds=${config.classIds}&TOKEN=${token}`
    }

}