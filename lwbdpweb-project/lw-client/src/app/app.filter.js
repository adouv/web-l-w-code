/**
 * @Author hejialin
 * @Description 描述
 */

function flowPercentage() {
    return function (percentage) {
            percentage = percentage?Math.floor(percentage*100):0;
            return percentage+'%';
    }
}

function processFileName() {
    return function (filename, length) {
        let fileLen = filename.replace(/[^\x00-\xff]/g, "aa").length;
        let lastIndex = filename.lastIndexOf('.');
        let suffix = filename.substring(lastIndex - 1, filename.length);
        let suffixLen = suffix.replace(/[^\x00-\xff]/g, "aa").length;
        if (suffixLen + length * 2 <= fileLen) {
            // length = length * 2 - suffixLen - 3;
            // let prefix = filename.substring(0, length);
            let prefix = '';
            let i = 0;
            for (var z = 0; z < (length * 2); z++) {
                if (filename.charCodeAt(z) > 255) {
                    i = i + 2;
                } else {
                    i = i + 1;
                }
                if (i >= length) {
                    prefix = filename.slice(0, (z + 1)) ;
                    break;
                }
            }

            return prefix+'…'+ suffix;
        } else {
            return filename;
        }
    }
}

function trustAsHtml($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}
trustAsHtml.$inject = ['$sce']

function NumberToChinese(){
    let chnUnitChar = ["","十","百","千"];
    let chnUnitSection = ["","万","亿","万亿","亿亿"];
    let chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
    let SectionToChinese = (section)=>{
        let strIns = '', chnStr = '';
        let unitPos = 0;
        let zero = true;
        while(section > 0){
            let v = section % 10;
            if(v === 0){
                if(!zero){
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            }else{
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    }
    return function numberToChinese(num){
        let unitPos = 0;
        let strIns = '', chnStr = '';
        let needZero = false;

        if(num === 0){
            return chnNumChar[0];
        }

        while(num > 0){
            let section = num % 10000;
            if(needZero){
                chnStr = chnNumChar[0] + chnStr;
            }
            strIns = SectionToChinese(section);
            strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }
        if(chnStr.startsWith('一十')){
            chnStr = chnStr.replace('一十','十');
        }
        return chnStr;
    }
}

function formatFileSize() {
    return function (fileSize) {
        if (fileSize < 1024) {
            return fileSize + 'B';
        } else if (fileSize < (1024*1024)) {
            let temp = fileSize / 1024;
            temp = temp.toFixed(2);
            return temp + 'KB';
        } else if (fileSize < (1024*1024*1024)) {
            let temp = fileSize / (1024*1024);
            temp = temp.toFixed(2);
            return temp + 'MB';
        } else {
            let temp = fileSize / (1024*1024*1024);
            temp = temp.toFixed(2);
            return temp + 'GB';
        }
    }
}

function numberToUpperCase() {
    return function (number) {
        if(number*1===0){
            return '零元整'
        }
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(number))
            return "数据非法";
        let unit = "千百拾亿千百拾万千百拾元角分", str = "";
        number += "00";
        let p = number.indexOf('.');
        if (p >= 0)
            number = number.substring(0, p) + number.substr(p+1, 2);
        unit = unit.substr(unit.length - number.length);
        for (let i=0; i < number.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(number.charAt(i)) + unit.charAt(i);
        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    }
}

function toFixed() {
    return function (number,num) {
        if(number&&!isNaN(number*1)&&!isNaN(num*1)){
            return (number*1).toFixed(num)
        }else{
            return number;
        }
    }
}

export default angular.module('lw.filter',[])
    .filter('flowPercentage',flowPercentage)
    .filter('processFileName',processFileName)
    .filter('NumberToChinese',NumberToChinese)
    .filter('trustAsHtml',trustAsHtml)
    .filter('formatFileSize',formatFileSize)
    .filter('ToFixed',toFixed)
    .filter('numberToUpperCase',numberToUpperCase)
    .name;