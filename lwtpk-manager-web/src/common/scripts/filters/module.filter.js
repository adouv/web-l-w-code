/**
 * Created by hejialin on 2016/10/26.
 */
var comfilter = angular.module('lw.filter',[]);
comfilter.filter('dateFormat',function () {
    return function (data,fmt) {
        if(data){
            return new Date(data).Format(fmt);
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
comfilter.filter('foreach',function () {
    return function (list,attr,split) {
        if(list&&list[0]){
            var attrName = '';
            for(var i=0,len=list.length;i<len;i++){
                attrName += list[i][attr]+split;
            }
            return attrName;
        }
    }
});