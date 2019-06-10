import moment from 'moment'
/** 
 * 时间格式化过滤器
 */
export const dateformats = (Vue) => {
    Vue.filter('dateformats', (dataStr, pattern = 'YYYY/MM/DD HH:mm:ss') => {
        return moment(dataStr).format(pattern)
    })
}