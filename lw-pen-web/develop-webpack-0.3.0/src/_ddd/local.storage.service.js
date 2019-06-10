/** 
 * 本地存储服务
 */
export default {
    /**
     * 通过key获取本地存储
     * @param {*} key 键
     */
    getItem(key) {
        if (this.existsItem(key)) {
            return localStorage.getItem(key)
        } else {
            return "";
        }
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
        return localStorage.getItem(key) !== undefined && localStorage.getItem(key) !== null
    },
    clearLocal() {
        this.removeItem('LWToken');
        this.removeItem('account');
        this.removeItem('classesArr');
        this.removeItem('selectClassId');
        this.removeItem('selectClassName');
        this.removeItem('isLogin');
        this.removeItem('win_id_subjectiveProblem');
        this.removeItem('win_id_noteLists');
    }
}