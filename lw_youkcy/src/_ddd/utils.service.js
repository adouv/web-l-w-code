import Vue from 'vue';
/** 
 * 
 */
export default {
    /**
     * 将url地址转换为json
     * @param {*} url 
     */
    parseUrlToJson(url) {
        let hash;
        let myJson = {};
        let hashes = url.slice(url.indexOf('?') + 1).split('&');
        for (let i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            myJson[hash[0]] = hash[1];
        }
        return myJson;
    },
    /**
     * 将json对象转换为url
     * @param {*} params 
     */
    parseJsonToUrl(model) {
        let strParams = "";
        if (model) {
            Object.keys(model).forEach(param => {
                if (strParams != "") {
                    strParams += "&";
                }
                strParams += `${param}=${model[param]}`;
            });
        }
        return strParams;
    },
    fromatDate(data) {
        let secondTime = parseInt(data); // 秒
        let minuteTime = 0; // 分
        let hourTime = 0; // 小时
        if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if (minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
            }
        }
        let result = "" + parseInt(secondTime) + "″";

        if (minuteTime > 0) {
            result = "" + parseInt(minuteTime) + "′" + result;
        }
        if (hourTime > 0) {
            result = "" + parseInt(hourTime) + ":" + result;
        }
        return result;
    },
    toRightAnswer(data) {
        let result = '';
        if (data == '√' || data == true || data == 'true') {
            result = '对';
        } else if (data == '×' || data == false || data == 'false') {
            result = '错';
        } else {
            result = data;
        }
        return result;
    },
    showImg(data) {
        return process.env.lwFileserver + '/lw-fileserver/fs/file/showPic?fileName=' + data;
    },
    /**
     * 判断是否中文
     *
     * @param {*} object
     * @returns
     */
    isChinese(object) {
        let entryValue = object;
        let cnChar = entryValue.match(/[^\x00-\x80]/g);
        if (cnChar !== null && cnChar.length > 0) {
            return true;
        }
        return false;
    },
    async getPinYin(object, split, uppercase) {
        split = split || " ";
        uppercase = uppercase || false;
        let len = object.length;
        let result = "";
        let reg = new RegExp('[a-zA-Z0-9\- ]');
        let val;
        let name;
        return await Vue.http.get('/static/data/pinyin.json').then(response => {
            for (let index = 0; index < len; index++) {
                val = object.substr(index, 1);
                if (this.isChinese(val)) {
                    for (var names in response) {
                        if (response[names].indexOf(val) != -1) {
                            name = names;
                        }
                    }
                    if (reg.test(val)) {
                        result += split + val;
                    } else if (name !== false) {
                        result += split + name;
                    }
                } else {
                    result += val;
                }
            }
            if (uppercase) {
                result = result.toUpperCase();
            } else {
                result = result.replace(split, "");
            }
            return result.trim();
        });
    },
    /**
     *
     * @param str 字
     * @returns {*} 结果
     */
    async arraySearch(str) {
        let PinYin = await Vue.http.get('/static/data/pinyin.json');
        for (var name in PinYin) {
            if (PinYin[name].indexOf(str) != -1) {
                return name;
                break;
            }
        }
        return false;
    }
}