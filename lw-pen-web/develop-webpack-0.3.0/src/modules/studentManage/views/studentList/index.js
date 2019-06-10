import AccountService from '../../../../_service/account.service'
import Organization from '../../../../_service/organization.service'
export default {
  name: "StudentListComponent",
  data() {
    return {
      classList: [],
      singleValue: '',
      studentList: [],
      keywords: "",
      isLoadComplete: false,
      selectClassName: '',
      classId: ''
    };
  },
  mounted() {
    this.selectClassName = this.local$.getItem('selectClassName');
    this.classId = this.$route.query.classId ? this.$route.query.classId : '';
    this.singleValue = this.classId ? this.classId : AccountService.getSelectClassId();
    Organization.getClassList().then(res => {
      this.classList = res;
      this.classList.forEach((item, index, arr) => {
        if (item.id == this.singleValue) {
          this.selectClassName = this.isEmpty(item.pname) + this.isEmpty(item.name) + " (" + (item.countStudent ? item.countStudent : 0) + "人)";
        }
      });
    });
    if (this.singleValue) {
      this.queryClassStudents();
    }


  },
  methods: {
    addStudentModal() {
      this.$router.push({
        name: 'addStudent',
        query: { classId: this.singleValue }
      })
    },
    onSearch() {
      if (this.singleValue) {
        this.queryClassStudents();
      }
    },
    selecChange(value) {
      this.keywords = this.singleValue == value ? this.keywords : '';
      this.classList.forEach(element => {
        if (value === element.id) {
          this.singleValue = value;
        }
      });
      this.queryClassStudents();
    },
    /**
     * 查询班级下的学生
     * @param {*} classId 
     */
    queryClassStudents(classId) {
      this.studentList = [];
      let param = {
        classId: this.singleValue,
        keyword: this.keywords
      }
      this.isLoadComplete = false;
      Organization.getClassStudent(param).then(response => {
        this.studentList = response;
        this.local$.removeItem('studentCount');
        this.local$.setItem('studentCount', this.studentList.length);
        this.studentList.forEach(item => {
          if (item.imgUrl) {
            item.imgUrl = this.utils$.showImg(item.imgUrl);
          } else {
            if (item.gender === 0) {
              item.imgUrl = require('../../../../assets/images/nv.png');
            } else if (item.gender === 1) {
              item.imgUrl = require('../../../../assets/images/na.png');
            } else {
              item.imgUrl = require('../../../../assets/images/na.png');
            }
          }
        })
        this.isLoadComplete = true;
      })

    },
    isEmpty(str) {
      if (str || str == 0) {
        return str + "";
      } else {
        return "";
      }
    },
    checkNo(e) {
      let reg = /^\S+$/;
      if (e) {
        if (new RegExp(reg).test(e) == false) {
          this.keywords = this.keywords.trim();
        }
      }
    }
  }
};
