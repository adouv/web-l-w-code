/**
 * @Author hejialin
 * @Description 描述
 */
export default class validCtrl{
    constructor(){}
    /**
     * 验证数量
     * @param nowNum
     * @return {*}
     */
    validNumber(nowNum,numName){
        if (nowNum) {
            nowNum = nowNum+'';
            if (nowNum != undefined && nowNum.substring(0, 1) == '.') {
                nowNum = "";
            }
            if(numName == 'buyNum' && nowNum.toString().indexOf('0')==0){
                nowNum = "";
            }
            nowNum = nowNum.replace(/[^\d]/g, "");
            nowNum = nowNum.replace(/^([0-9])(\d{5}).*$/, '$1$2');
            if (nowNum.indexOf('.') < 0 && nowNum != "") {
                nowNum = parseFloat(nowNum);
            }
            let len = nowNum.toString().length;
            if (nowNum > 100000) {
                nowNum = nowNum.toString().substring(0, len-1)
            }
            if (nowNum === 100000) {
                nowNum = 100000;
            }
            return nowNum;
        }
    }

    /**
     * 验证金钱
     * @param price
     * @return {*}
     */
    validPrice(price){
        if(price){
            price = price.toString();
            if (price) {
                price = price.replace(/[^\d.]/g, "");
                price = price.replace(/\.{2,}/g, ".");
                price = price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                price = price.replace(/^([0-9])(\d{14}).*$/, '$1$2');
                if (price.indexOf('.') < 0 && price != "") {
                    price = parseFloat(price);
                }
                let len = price.toString().length;
                if (price > 9999999999999.99) {
                    price = price.toString().substring(0, len - 1)
                }
                if (price === 9999999999999.99) {
                    price = 9999999999999.99
                }
                return price;
            }
        }
    }

    /**
     * 校验手机号格式
     */
    validPhone(phone, validNum) {
        let mobileRex = /^((\+?86)|(\+86))?(1[3|4|5|7|8][0-9]\d{8})$/;
        let phoneRex = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        return mobileRex.test(phone) || phoneRex.test(phone);
    }
}
