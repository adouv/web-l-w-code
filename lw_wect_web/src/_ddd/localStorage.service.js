import Vue from 'vue'
/** 
 * 本地存储服务
 */
export default {
    /**
     * 通过key获取本地存储
     * @param {*} key 键
     */
    getItem(key) {
        return localStorage.getItem(key)
    },
    /**
     * 获取当前登录用户信息
     * @returns {}
     */
    getUser() {
        let object = JSON.parse(this.getItem('tdUser'));
        return object;
    },
    /**
     * 设置本地存储
     * @param {*} key 键
     * @param {*} value 值
     */
    setItem(key, value) {
        localStorage.setItem(key, value)
    },
    /**
     * 清楚所有本地存储
     */
    clear() {
        localStorage.clear()
    },
    /**
     * 通过key删除本地存储
     * @param {*} key 键
     */
    removeItem(key) {
        localStorage.removeItem(key)
    },
    /**
     * 通过key判断本地存储是否存在
     *
     * @param {*} key 键
     * @returns
     */
    existsItem(key) {
        return localStorage.getItem(key) || localStorage.getItem(key) !== undefined || localStorage.getItem(key) !== null || localStorage.getItem(key) !== ''
    },
    userEmpty() {
        let user = JSON.parse(this.getItem("tdUser"));
        if (Vue.utils.isEmpty(user.UserName) && Vue.utils.isEmpty(user.IDCard) && Vue.utils.isEmpty(user.Birthday) && Vue.utils.isEmpty(user.Email)) {
            return true;
        }
        return false;
    },
    mateEmpty() {
        let user = JSON.parse(this.getItem("tdUser"));
        if (Vue.utils.isEmpty(user.MateName) && Vue.utils.isEmpty(user.MateBirthDay) && Vue.utils.isEmpty(user.MateIDCard)) {
            return true;
        }
        return false;
    },
    getUser() {
        return JSON.parse(this.getItem("tdUser"));
    },
    getType() {
        return parseInt(this.getItem("tdType"));
    }
}