import Vue from 'vue'
/** 
 * 工具类服务
 */
export default {
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
     * 获取对象的交集
     * 实体对象格式必须为：{id,value,check}
     * @param {*} otherSet
     * @param {*} object
     * @returns
     */
    difference(otherSet, object) {
        let differenceSet = [];
        object.forEach(element => {
            if (!otherSet.findIndex(i => i.id === element.id) > 0) {
                differenceSet.push(element);
            }
        });
        return differenceSet;
    },
    /**
     * 图片转base64
     *
     * @param {*} url 图片地址
     * @returns
     */
    imageUrlToBase64(url) {
        let result = "";
        let image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = url;
        image.onload = () => {
            result = this.getImageBase64(image);
        };
        return result;
    },
    /**
     * 通过canvas获取图片base64
     *
     * @param {*} image 图片对象
     * @returns
     */
    getImageBase64(image) {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        let imageExtensionName = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase();
        let dataURL = canvas.toDataURL(`image/${imageExtensionName}`);
        return dataURL;
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
     * 分转元
     * @param {*} price
     * @returns
     */
    subTransfer(price) {
        let str = (price / 100).toFixed(2) + '';
        return str;
    },
    /**
     * 根据体重/身高计算BMI值
     *
     * @param {*} weight
     * @param {*} height
     * @returns
     */
    getBMI(weight, height) {
        let pow = Math.pow(height / 100, 2);
        let result = weight / pow;
        return result.toFixed(2);
    },
    getNumberLabel(list, start, end, uint) {
        for (let index = start; index <= end; index++) {
            list.push({
                value: index + "",
                label: `${index}${uint}`
            });
        }
    },
    /**
     * 获取开始和结束数字列表，加单位
     *
     * @param {*} start
     * @param {*} end
     * @param {*} unit
     */
    getNumberList(list = [], start = 0, end = 100, unit = "", isDefault = false) {
        if (isDefault) {
            list.push({
                key: 0,
                value: '请选择'
            });
        }

        for (let index = start; index <= end; index++) {
            let item = {
                key: index,
                value: `${index}${unit}`
            };
            list.push(item);
        }
        return list;
    },
    /**
     * 获取当前时间 年、月、日、时、分、秒
     */
    getCurrentDate() {
        let date = new Date();
        return {
            year: date.getFullYear(),
            month: (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
            day: date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        };
    },
    convertData(obj = null, type = 0) {
        let date = null;
        if (obj !== null) {
            date = new Date(obj);
        } else {
            date = new Date();
        }

        let year = date.getFullYear();
        let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        switch (type) {
            case 0:
                return `${year}年${month}月${day}日`;
                break;
            case 1:
                return `${year}年${month}月${day}日${hour}时${minute}分${second}秒`;
                break;
            case 2:
                return `${year}-${month}-${day}`;
                break;
            case 3:
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                break;
            case 4:
                return `${year}-${month}-${day} ${hour}:${minute}`;
                break;
            case 5:
                return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
                break;
            case 6:
                return `${year}/${(date.getMonth() + 1)}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                break;
        }
    },
    /**
     * 根据生日计算年龄
     * @param {*} birthday 生日 
     */
    getAge(birthday) {
        let date = new Date();
        let currentYear = date.getFullYear();
        let oldDate = new Date(birthday);
        let oldYear = oldDate.getFullYear();
        return currentYear - oldYear;
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
    },
    /**
     * 试管颜色
     * @param {*} color 
     */
    testItemTypeColor(color = 0) {
        let result = "";
        switch (color) {
            case 0:
                result = "黄";
                break;
            case 1:
                result = "紫";
                break;
            case 2:
                result = "红";
                break;
            case 3:
                result = "绿";
                break;
        };
        return result;
    },
    /**
     * 打印小票
     * @param {*} item 订单参数
     */
    printSmallTicket(item) {
        if (!this.isPC()) {
            Vue.tip("请在电脑端进行打印！");
            return;
        }

        let LODOP = Vue.getLodop();
        if (LODOP === undefined) {
            return;
        }
        LODOP.PRINT_INIT("打印小票" + item.OrderID);
        LODOP.SET_PRINTER_INDEX("XP-58");
        LODOP.SET_PRINT_PAGESIZE(3, "56mm", "10mm", "");

        //打印HTML
        LODOP.ADD_PRINT_HTM(
            "0cm",
            "0cm",
            "100%",
            "100%",
            document.getElementById("tdPrintDetail").innerHTML
        );
        LODOP.PREVIEW();
    },
    /**
     * 打印标签
     * @param {*} orderInfo 订单对象
     * @param {*} testItemInfo 检测项目对象
     * @param {*} type 0为单个检测项目打印，1为多个检测项目打印
     */
    printLabel(orderInfo, testItemInfo, type = 0) {
        if (!this.isPC()) {
            Vue.tip("请在电脑端进行打印！");
            return;
        }
        let testItemList = [];
        let OrderNumber = orderInfo.OrderNumber;
        let name = orderInfo.UserName;
        let age = this.getAge(orderInfo.Birthday);
        let gender = "";
        let color = "黄管";
        let LODOP = Vue.getLodop();
        console.log(LODOP);
        if (LODOP === undefined) {
            return;
        }

        if (type === 0) {
            if (testItemInfo.IsMan === 0) {
                name = orderInfo.UserName;
                age = this.getAge(orderInfo.Birthday);
            } else {
                name = orderInfo.MateName;
                age = this.getAge(orderInfo.MateBirthDay);
            }

            gender = testItemInfo.IsMan === 0 ? '女' : '男';

            color = this.testItemTypeColor(testItemInfo.TypeColor) + "管";

            testItemInfo.TestItemDetail.forEach(element => {
                testItemList.push(element.TestItemName);
            });

            LODOP.PRINT_INIT("打印条形码");
            LODOP.SET_PRINTER_INDEX("Xprinter XP-360B");
            LODOP.SET_PRINT_PAGESIZE(1, "50mm", "30mm", "");
            LODOP.ADD_PRINT_TEXT("1mm", "2mm", "42mm", "3mm", `姓名:${name} 性别:${gender} 年龄:${age}岁`);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

            LODOP.ADD_PRINT_TEXT("1mm", "43mm", "14mm", "3mm", color);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

            LODOP.ADD_PRINT_TEXT("5mm", "2mm", "48mm", "3mm", `订单编号:${OrderNumber}`);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);
            LODOP.ADD_PRINT_TEXT("9mm", "2mm", "48mm", "21mm", `检测项目:${testItemList.join(';').toString()}`);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 7);

            LODOP.NEWPAGE();
            LODOP.PREVIEW();
        } else {
            LODOP.PRINT_INIT("打印条形码");
            LODOP.SET_PRINTER_INDEX("Xprinter XP-360B");
            LODOP.SET_PRINT_PAGESIZE(1, "50mm", "30mm", "");

            let pageSize = 0;

            testItemInfo.forEach(testItemType => {
                testItemList = [];

                gender = testItemType.IsMan === 0 ? '女' : '男';

                if (testItemType.IsMan === 0) {
                    name = orderInfo.UserName;
                    age = this.getAge(orderInfo.Birthday);
                } else {
                    name = orderInfo.MateName;
                    age = this.getAge(orderInfo.MateBirthDay);
                }

                color = this.testItemTypeColor(testItemType.TypeColor) + "管";;

                testItemType.TestItemDetail.forEach(element => {
                    testItemList.push(element.TestItemName);
                });

                LODOP.ADD_PRINT_TEXT("1mm", "2mm", "42mm", "3mm", `姓名:${name} 性别:${gender} 年龄:${age}岁`);
                LODOP.SET_PRINT_STYLEA(++pageSize, "FontSize", 7);

                LODOP.ADD_PRINT_TEXT("1mm", "43mm", "14mm", "3mm", color);
                LODOP.SET_PRINT_STYLEA(++pageSize, "FontSize", 7);

                LODOP.ADD_PRINT_TEXT("5mm", "2mm", "48mm", "3mm", `订单编号:${OrderNumber}`);
                LODOP.SET_PRINT_STYLEA(++pageSize, "FontSize", 7);
                LODOP.ADD_PRINT_TEXT("9mm", "2mm", "48mm", "21mm", `检测项目:${testItemList.join(';').toString()}`);
                LODOP.SET_PRINT_STYLEA(++pageSize, "FontSize", 7);
                LODOP.NEWPAGE();
            });
            LODOP.PRINT();
        }
    },
    /**
     * 判断是否PC端
     * @returns
     */
    isPC() {
        let userAgentInfo = navigator.userAgent;
        let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        let flag = true;
        for (let index = 0; index < Agents.length; index++) {
            const element = Agents[index];
            if (userAgentInfo.indexOf(element) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
}