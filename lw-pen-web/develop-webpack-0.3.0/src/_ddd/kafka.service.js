import Vue from 'vue'
const kafka = window.require('kafka-node');
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: '127.0.0.1:9092' });
const Offset = kafka.Offset;
const offset = new Offset(client);


let bufferPool = [];
/** 
 * kafka consumer service
 */
export default {
    /**
     * 开始监听kafka数据
     *
     * @param {*} cb
     */
    start(cb) {
        let partition = 0;
        let topic = 'lwk';
        offset.fetchLatestOffsets([topic], (error, offsets) => {
            if (error) {
                return handleError(error);
            }
            let consumer = new Consumer(
                client, [
                    { topic: 'lwk', offset: offsets[topic][partition], partition: 0 }
                ], {
                    autoCommit: false,
                    fromOffset: true
                }
            );
            consumer.on('message', message => {
                try {
                    let data = JSON.parse(message.value);
                    bufferPool.push(data);
                } catch (error) {
                    console.log(error);
                }
            });

            setInterval(() => {
                const data = bufferPool.shift();
                if (data && data.length > 0) {
                    this.dispatch(data, cb);
                }
            }, 5);
            // consumer.on('offsetOutOfRange', (topic) => {
            //     console.log("------------- offsetOutOfRange ------------");
            //     // topic.maxNum = 2;
            //     // offset.fetch([topic], function(err, offsets) {
            //     //     console.log(offsets);
            //     //     var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
            //     //     consumer.setOffset(topic.topic, topic.partition, min);
            //     // });
            // });

            consumer.on('error', error => {
                console.log('#kafka错误---region');
                console.log(error);
                console.log('#kafka错误---endregion');
            });

            consumer.commit((error, data) => {
                console.log(error);
                console.log(data);
            });
        });
    },
    /**
     * 数据处理
     *
     * @param {*} data
     * @param {*} cb
     */
    dispatch(data, cb) {
        let problemDto = {};
        let penDto = {};

        if (data.length === 113) {
            problemDto = this.problemData(data);
            cb(problemDto, 113);
        }

        if (data.length === 20) {
            penDto = this.penData(data);
            cb(penDto, 20);
        }
    },
    /**
     * 按键数据转换
     * @param {*} args
     * @returns
     */
    problemData(args) {
        let problemDto = {};

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
        problemDto.type = null;
        problemDto.questionId = null;
        problemDto.classId = null;
        problemDto.className = null;
        problemDto.bagId = null;
        problemDto.exerciseRecordId = null;
        problemDto.analysis = null;
        problemDto.answer = null;
        problemDto.content = null;
        problemDto.contentHtml = null;
        problemDto.autoGrade = null;
        problemDto.selectType = null;
        problemDto.createTime = this.createTime();
        Vue.msql.insert('lw_pen_problem', problemDto);

        return problemDto;
    },
    /**
     * 笔记数据转换
     * @param {*} args
     * @returns
     */
    penData(args) {
        let penDto = {};

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
        penDto.type = null;
        penDto.questionId = null;
        penDto.classId = null;
        penDto.className = null;
        penDto.bagId = null;
        penDto.exerciseRecordId = null;
        penDto.analysis = null;
        penDto.answer = null;
        penDto.content = null;
        penDto.contentHtml = null;
        penDto.autoGrade = null;
        penDto.selectType = null;
        penDto.createTime = this.createTime();
        Vue.msql.insert('lw_pen_notes', penDto);

        return penDto;
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
    /**
     * 创建时间
     * @returns
     */
    createTime() {
        return new Date().getTime().toString();
    },
    /**
     * 按键转换
     * @param {*} prob
     * @returns
     */
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