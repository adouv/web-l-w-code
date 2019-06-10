
/** 
 * 时间格式化过滤器
 */
export const toPrecision = (Vue) => {
    Vue.filter('toPrecision', (data) => {
        return parseFloat((data * 100).toPrecision(12)) + "%"
    })
}