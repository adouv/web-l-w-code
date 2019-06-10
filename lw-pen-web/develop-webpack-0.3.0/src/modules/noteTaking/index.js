import ExerciseService from '../../_service/exercise.service'
import AccountService from '../../_service/account.service'
export default {
    name: "NoteTakingComponent",
    data() {
        return {
            name: '',
            studentId: '',
            questionId: '',
            autoGrade: false,
            penData: 0,
            studentInfo: [],
            exerciseRecordId: 0
        };
    },
    mounted() {
        let myThis = this;
        this.penData = 0;
        let urlParams = this.utils$.parseUrlToJson(window.location.search);
        this.studentId = parseInt(urlParams.studentId);
        this.questionId = urlParams.questionId;
        this.autoGrade = urlParams.autoGrade == 'true' ? true : false;
        this.exerciseRecordId = urlParams.exerciseRecordId;
        this.bagId = urlParams.exerciseRecordId;
        // let boxWidth = document.getElementById("inner-box-a").offsetWidth;
        // let boxHeight = document.getElementById("inner-box-a").offsetHeight;
        // console.log(boxWidth, boxHeight);
        // this.bagId = parseInt(urlParams.bagId);
        // this.classId = parseInt(AccountService.getSelectClassId());
        // this.exerciseRecordId = parseInt(urlParams.exerciseRecordId);
        // this.getAnswerRecordStudent();
        // myThis.canvas.canvasWidth = window.innerWidth;
        // myThis.canvas.canvasHeight = window.innerHeight;
        // myThis.canvas.penCanvas = document.getElementById('canvas');
        // myThis.canvas.context = myThis.canvas.penCanvas.getContext('2d');

        // myThis.canvas.context.fillStyle = myThis.canvas.fillColor;
        // myThis.canvas.context.clearRect(0, 0, myThis.canvas.canvasWidth, myThis.canvas.canvasHeight);
        // myThis.canvas.context.fillRect(0, 0, myThis.canvas.canvasWidth, myThis.canvas.canvasHeight);

        // let marginTop = 50;
        // let marginLeft = 50;
        // let minX = 999999;
        // let minY = 999999;

        // this.canvas.scale = 1000 / 2479;
        // console.log(this.canvas.scale);

        // let where = ` 
        //   penid=${parseInt(this.studentId)} 
        //   and questionId=${parseInt(this.questionId)} 
        //   and exerciseRecordId=${parseInt(this.exerciseRecordId)} 
        // `;

        // this.sql$.select('lw_pen_notes', where).then(response => {
        //   if (response && response.Data.length > 0) {
        //     myThis.penData = response.Data.length;
        //     response.Data.forEach(args => {
        //       if (args.packet_type === 1) {
        //         if (args.pressure !== 0) {

        //           if (minX > args.x) {
        //             minX = args.x;
        //           }

        //           if (minY > args.y) {
        //             minY = args.y;
        //           }

        //           args.x = args.x - minX + marginLeft;
        //           args.y = args.y - minY + marginTop;

        //           myThis.penStroke(args);
        //         } else {
        //           args.x = -1;
        //           args.y = -1;
        //           myThis.penStroke(args);
        //         }
        //       }
        //     });
        //   }
        // });

    },
    methods: {
        penStroke(curLoc) {
            //let curTimestamp = new Date().getTime();
            //开始绘制
            this.canvas.context.beginPath();

            let scale = this.canvas.scale;

            let distance = this.calcDistance(this.lastLoc, curLoc);

            if (distance > this.canvas.distanceWidth) {
                this.canvas.context.moveTo(curLoc.x * scale, curLoc.y * scale);
            } else {
                this.canvas.context.moveTo(this.lastLoc.x * scale, this.lastLoc.y * scale);
                this.canvas.context.lineTo(curLoc.x * scale, curLoc.y * scale);
            }

            let lineWidth = 1;
            //设置样式
            this.canvas.context.strokeStyle = this.canvas.strokeColor;
            this.canvas.context.lineWidth = lineWidth;
            //设置或返回线条末端线帽的样式
            //this.canvas.context.lineCap = 'round';
            //设置或返回所创建边角的类型，当两条线交汇时
            //this.canvas.context.lineJoin = 'round';
            this.canvas.context.stroke();
            //记录上次值
            this.lastLoc = curLoc;
            // this.canvas.lastTimestamp = curTimestamp;
            // this.canvas.lastLineWidth = lineWidth;
        },
        /**
         * 计算间距
         * @param {*} loc1
         * @param {*} loc2
         * @returns
         */
        calcDistance(loc1, loc2) {
            return Math.sqrt(Math.pow(loc1.x - loc2.x, 2) + Math.pow(loc1.y - loc2.y, 2));
        },
        handleDragStart(event) {
            console.log(event);
        },

        closeBtn() {
            this.win$.closeCurrentWindow();
        },
        getAnswerRecordStudent() {
            let parmas = {
                questionId: this.questionId,
                studentId: this.studentId,
                exerciseRecordId: this.exerciseRecordId
            };
            ExerciseService.getAnswerRecordStudent(parmas).then(res => {
                this.studentInfo = res;
            });

        }
    }
};