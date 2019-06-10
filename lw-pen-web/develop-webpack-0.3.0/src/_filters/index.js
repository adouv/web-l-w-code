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
 * 
 */
export const filterService = (Vue) => {
    dateformats(Vue)
    exerciseTime(Vue)
    formatSeconds(Vue)
    toPrecision(Vue)
    toRightAnswer(Vue)
}