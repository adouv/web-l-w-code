import Vue from 'vue'
const dgram = window.require('dgram');
const server = dgram.createSocket('udp4');
let bufferPool = [];
let penList = [];
/**
 * udp服务
 */
export default {
    /**
     * udp服务
     * @param {*} prod
     * @param {*} window
     */
    udpService(prod, callback) {
        try {
            server.bind(prod);

            server.on('close', () => {
                console.log(`the udp server is down`);
            });

            server.on('error', err => {
                console.log(err);
            });

            server.on('listening', () => {
                console.log('udp server has started...');
            });

            server.on('message', (msg, rinfo) => {
                // console.log(msg);
                if (msg.toJSON().data.length > 20) {
                    server.send(msg, rinfo.port, rinfo.address);
                }
                bufferPool.push(msg.toJSON().data);
            });

            setInterval(() => {
                const data = bufferPool.shift();
                if (data && data.length > 0) {
                    this.penArgsAnalysis(data, callback);
                }
            }, 5);
        } catch (error) {
            console.log(error.message);
        }
    },
    /**
     * 笔数据解析
     */
    async penArgsAnalysis(args, callback) {
        let lwUdp = {
            key: -1,
            label: "-",
            end: "-",
            icon: "-",
            show: -1,
            switch: -1,
            disabled: -1
        };
        let lwQuestion = {
            questionId: -1,
            classId: -1,
            className: "-",
            bagId: -1,
            exerciseRecordId: -1,
            analysis: "-",
            answer: "-",
            content: "-",
            contentHtml: "-",
            autoGrade: false,
            selectType: -1,
            type: -1
        };
        if (Vue.local.getItem("lwUdp")) {
            lwUdp = JSON.parse(Vue.local.getItem("lwUdp"));
        }
        if (Vue.local.getItem('lwQuestion')) {
            lwQuestion = JSON.parse(Vue.local.getItem('lwQuestion'));
        }

        let problemDto = {};
        let penDto = {};

        if (args.length > 20) {
            problemDto.batch = this.getBatchNumber();
            problemDto.tag = args[0];
            problemDto.len = args[1];
            problemDto.packet_type = args[2];
            problemDto.sn = this.parentByte(args.splice(3, 2));
            problemDto.penid = this.parentByte(args.splice(3, 4));
            problemDto.penbox_vol = args[3];
            problemDto.pen_vol = args[4];
            problemDto.prob_num = args[5];
            problemDto.prob = args.splice(6, args[5]).toString();
            let probFromat = this.probFromat(problemDto.prob);
            problemDto.probNum = probFromat.num;
            problemDto.probLetter = probFromat.letter;
            problemDto.chk = args[args.length - 1];
            problemDto.type = lwUdp.key;
            problemDto.questionId = lwQuestion.questionId;
            problemDto.classId = lwQuestion.classId;
            problemDto.className = lwQuestion.className;
            problemDto.bagId = lwQuestion.bagId;
            problemDto.exerciseRecordId = lwQuestion.exerciseRecordId;
            problemDto.analysis = lwQuestion.analysis;
            problemDto.answer = lwQuestion.answer;
            problemDto.content = lwQuestion.content;
            problemDto.contentHtml = lwQuestion.content;
            problemDto.autoGrade = lwQuestion.autoGrade;
            problemDto.selectType = lwQuestion.selectType;
            problemDto.createTime = this.createTime();
            // console.log(problemDto);
            Vue.msql.insert('lw_pen_problem', problemDto);
            callback(problemDto, lwUdp, args.length);
        } else {
            penDto.batch = this.getBatchNumber();
            penDto.tag = args[0];
            penDto.len = args[1];
            penDto.packet_type = args[2];
            penDto.penid = this.parentByte(args.splice(3, 4));
            penDto.pressure = this.parentByte(args.splice(3, 2));
            penDto.x = this.parentByte(args.splice(3, 4));
            penDto.y = this.parentByte(args.splice(3, 4));
            penDto.penbox_vol = args[3];
            penDto.pen_vol = args[4];
            penDto.chk = args[5];
            penDto.type = lwUdp.key;
            penDto.questionId = lwQuestion.questionId;
            penDto.classId = lwQuestion.classId;
            penDto.className = lwQuestion.className;
            penDto.bagId = lwQuestion.bagId;
            penDto.exerciseRecordId = lwQuestion.exerciseRecordId;
            penDto.analysis = lwQuestion.analysis;
            penDto.answer = lwQuestion.answer;
            penDto.content = lwQuestion.content;
            penDto.contentHtml = lwQuestion.content;
            penDto.autoGrade = lwQuestion.autoGrade;
            penDto.selectType = lwQuestion.selectType;
            penDto.createTime = this.createTime();
            // console.log(penDto);
            Vue.msql.insert('lw_pen_notes', penDto);
            callback(penDto, lwUdp, args.length);
        };
    },
    /**
     * 字节转换（位移）
     *
     * @param {*} data
     * @returns
     */
    parentByte(data) {
        let result = 0;
        for (let i = 0, len = data.length; i < len; i++) {
            var s = 8 * i;
            result += data[i] << s;
        }
        return result;
    },
    /**
     * 获取批次后
     *
     * @returns
     */
    getBatchNumber() {
        let date = new Date();
        let batch = date.getFullYear() + "" + (date.getMonth() < 10 ? (date.getMonth() + 1) : date.getMonth()) + "" + date.getDate();
        return batch;
    },
    createTime() {
        return new Date().getTime().toString();
    },
    udpClose(callback) {
        server.close(callback);
    },
    probFromat(prob) {
        let probParams = {
            num: "",
            letter: ""
        };
        switch (prob) {
            case "49":
                probParams.num = "1";
                probParams.letter = "A";
                break;
            case "50":
                probParams.num = "2";
                probParams.letter = "B";
                break;
            case "51":
                probParams.num = "3";
                probParams.letter = "C";
                break;
            case "52":
                probParams.num = "4";
                probParams.letter = "D";
                break;
            case "53":
                probParams.num = "5";
                probParams.letter = "E";
                break;
            case "54":
                probParams.num = "6";
                probParams.letter = "F";
                break;
            case "55":
                probParams.num = "7";
                probParams.letter = "G";
                break;
            case "56":
                probParams.num = "8";
                probParams.letter = "-1"; //-1代表↑
                break;
            case "57":
                probParams.num = "9";
                probParams.letter = "-2"; //-2代表×
                break;
            case "48":
                probParams.num = "0";
                probParams.letter = "-3"; //-3代表√
                break;
            case "127":
                probParams.num = "00";
                probParams.letter = "DEL";
                break;
            case "13":
                probParams.num = "11";
                probParams.letter = "OK";
                break;
        };
        return probParams;
    }
}