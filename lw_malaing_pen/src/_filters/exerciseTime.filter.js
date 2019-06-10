
/** 
 * 时间格式化过滤器
 */
export const exerciseTime = (Vue) => {
    Vue.filter('exerciseTime', (value) => {
        if ((value + '').length < 2) {
            return '0' + value
        } else {
            return value
        }
    })
}