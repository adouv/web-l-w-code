import Vue from 'vue';

/**
 *  UtilService
 *  工具类
 */
export default {
    /**
     * base64转blob
     * @param {*} base64 base64字符串
     * @return url地址
     */
    excelBase64ToBlob(base64) {
        let base = atob(base64);
        let length = base.length;
        let u8arr = new Uint8Array(length);
        while (length--) {
            u8arr[length] = base.charCodeAt(length);
        }
        let blob = new Blob([u8arr], {
            type: "application/vnd.ms-excel"
        });
        return URL.createObjectURL(blob);
    },

    parseTime(time, cFormat) {
        if (arguments.length === 0) {
            return null
        }
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if (('' + time).length === 10) time = parseInt(time) * 1000
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            let value = formatObj[key]
            if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return time_str
    },
    /**
     * 获取下一个月
     * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
     */
    getNextMonth(date) {
        var arr = date.split('-');
        var year = arr[0]; //获取当前日期的年份
        var month = arr[1]; //获取当前日期的月份
        var day = arr[2]; //获取当前日期的日
        var days = new Date(year, month, 0);
        days = days.getDate(); //获取当前日期中的月的天数
        var year2 = year;
        var month2 = parseInt(month) + 1;
        if (month2 == 13) {
            year2 = parseInt(year2) + 1;
            month2 = 1;
        }
        var day2 = day;
        var days2 = new Date(year2, month2, 0);
        days2 = days2.getDate();
        if (day2 > days2) {
            day2 = days2;
        }
        if (month2 < 10) {
            month2 = '0' + month2;
        }

        var t2 = year2 + '-' + month2 + '-' + day2;
        return t2;
    },
    /**
     * 删除base64前缀（data:image/png;base64,）
     *
     * @param {*} base64
     * @returns
     */
    removeBase64Prefix(base64) {
        let index = base64.lastIndexOf(',') + 1;
        return base64.substring(index, base64.length);
    },
    /**
     * 对象转为get请求参数字符串，即（id=1&name=张三）
     *
     * @param {*} model
     */
    modelToGetRequestParameter(model) {
        let urlStr = "";
        Object.keys(model).forEach(param => {
            if (urlStr !== "") {
                urlStr += "&";
            }
            urlStr += `${param}=${model[param]}`;
        });
        return urlStr;
    },
    /**
     * 将数据为null的更换为字符串空
     * @param {*} data 
     */
    dataFormat(data) {
        Object.keys(data).forEach(key => {
            if (data[key] === null) {
                data[key] = "";
            }
        });
        return data;
    },
    handler: function(e) {
        e.preventDefault();
    },
    /*解决页面层级相互影响滑动的问题*/
    closeTouch() {
        document
            .getElementsByTagName("body")[0]
            .addEventListener("touchmove", this.handler, {
                passive: false
            }); //阻止默认事件
    },
    openTouch() {
        document
            .getElementsByTagName("body")[0]
            .removeEventListener("touchmove", this.handler, {
                passive: false
            }); //打开默认事件
    },
    /**
     * 判断字段是否为空
     * @param {*} object 
     */
    isEmpty(object) {
        if (!object || object === null || object === "" || object === undefined) {
            return false;
        }
        return true;
    }
}