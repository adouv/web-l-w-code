/**
 * Created by hejialin on 2016/10/26.
 */
import angular from 'angular'

var comfilter = angular.module('lw.filter',[]);
comfilter.filter('dateFormat',function () {
    return function (date,fmt) {
        if(date){
            return new Date(date).Format(fmt);
        }
    }
});
comfilter.filter('dateToWeek',function () {
    return function (date) {
        if(date){
            var week_zh = ['日','一','二','三','四','五','六'];
            var dateNumber = new Date(date).getDay();
            return week_zh[dateNumber];
        }
    }
});

comfilter.filter('flowPercentage',function () {
    return function (percentage) {
        if(percentage){
            percentage = Math.floor(percentage*100);
            return percentage+'%';
        }
    }
});
