import {
    dateformats
} from './dateFormats.filter'
import {
    exerciseTime
} from './exerciseTime.filter'
import {
    formatSeconds
} from './formatSeconds.filter'
import {
    toPrecision
} from './toPrecision.filter'
import {
    toRightAnswer
} from './toRightAanswer.filter'
/**
 * 过滤器入口
 * @param {*} Vue 实例
 */
export const FilterInit = (Vue) => {
    dateformats(Vue)
    exerciseTime(Vue)
    formatSeconds(Vue)
    toPrecision(Vue)
    toRightAnswer(Vue)
}