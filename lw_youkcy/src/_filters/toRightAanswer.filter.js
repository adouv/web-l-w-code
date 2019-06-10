
/** 
 * 客观题过滤器
 */
export const toRightAnswer = (Vue) => {
    Vue.filter('toRightAnswer', (data) => {
        let result = ''
        if (data == '√' || data == true || data == 'true') {
            result = '对'
        } else if (data == '×' || data == false || data == 'false') {
            result = '错'
        } else {
            result = data
        }
        return result
    })
}