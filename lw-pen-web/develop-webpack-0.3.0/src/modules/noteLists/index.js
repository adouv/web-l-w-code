import organizationService from '../../_service/organization.service';
export default {
    name: "NoteListComponent",
    data() {
        return {
            params: {
                pageSize: 2,
                offset: 1,
                classId: 0
            },
            max: 0,
            min: 0,
            questionId: '',
            exerciseRecordId: '',
            bagId: '',
            studentList: []
        };
    },
    mounted() {

        let urlParams = this.utils$.parseUrlToJson(window.location.search);
        this.questionId = urlParams.questionId;
        this.exerciseRecordId = urlParams.exerciseRecordId;
        this.bagId = urlParams.exerciseRecordId;

        this.getStudentList();


    },
    methods: {
        getStudentList() {
            this.params.classId = this.local$.getItem('selectClassId');
            this.studentList = [];
            organizationService.getClassStudent(this.params).then(response => {
                response.forEach(element => {
                    this.studentList.push(element);
                });
            });
        },
        btnPrev() {
            // this.params.offset--;
            // if (this.params.offset === 0) {
            //     this.params.offset = 1;
            //     return;
            // }
            this.getStudentList();
        },
        btnNext() {
            // this.params.offset++;
            // console.log(this.params.offset);
            // let index = this.params.pageSize * this.params.offset;
            // if (index > parseInt(this.studentList.xRecordCount)) {
            //     return;
            // }
            this.getStudentList();

        },
        btnMax(index) {
            this.$refs.lwNote[index].max(1.3);
        },
        btnMin(index) {
            this.$refs.lwNote[index].min(1.3);
        },

        closeBtn() {
            this.win$.closeCurrentWindow();
        }
    }
};