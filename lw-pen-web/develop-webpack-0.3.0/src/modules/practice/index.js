import moment from 'moment'
import QuestionServer from '../../_service/question.service'
import AccountServer from '../../_service/account.service'
export default {
  name: "PracticeComponent",
  data() {
    return {
      startTime: new Date(),
      dateFormat: 'YYYY-MM-DD',
      defaultTime: moment(new Date()).format('YYYY-MM-DD'),
      time: '',
      status: '',
      gardenId: '',
      classId: '',
      accountId: '',
      keyword: '',
      questionBagData: [],
      isLoadComplete: false,
      questionBag: [],
      studentCount: 0
    };
  },
  mounted() {
    this.questionBag = {
      page: this.setPageParams(1, 20),
      list: [],
      loaded: false,
      total: 0
    };
    this.getQuestionBagLists();
    this.studentCount = parseInt(this.local$.getItem('studentCount'));
  },
  methods: {
    moment,
    changeStatus(value) {
      this.status = value;
      this.questionBag.page = this.setPageParams(1, 20);
      this.getQuestionBagLists();
      this.$refs.table.scrollTop = 0;
    },
    onChangeDate(date, dateString) {
      this.defaultTime = '';
      this.time = dateString ? dateString : '';
      this.questionBag.page = this.setPageParams(1, 20);
      this.getQuestionBagLists();
      this.$refs.table.scrollTop = 0;
    },
    onSearch() {
      this.questionBag.page = this.setPageParams(1, 20);
      this.getQuestionBagLists();
      this.$refs.table.scrollTop = 0;
    },
    getQuestionBagLists() {
      const _dateTime = this.time ? this.time : this.defaultTime;
      const params = {
        startTime: _dateTime ? _dateTime + ' 00:00:00' : '',
        endTime: _dateTime ? _dateTime + ' 23:59:59' : '',
        status: this.status ? this.status : '',
        gardenId: AccountServer.getGardenId(),
        classId: AccountServer.getSelectClassId(),
        accountId: AccountServer.getAccountId(),
        keyword: this.keyword,
        ...this.questionBag.page
      };
      this.isLoadComplete = false;
      QuestionServer.getQuestionBagList(params, {
        observe: 'response',
        responseType: 'json'
      }).then(Response => {
        this.isLoadComplete = true;
        this.questionBag.list = Response;
        if (Response && Response.xRecordCount) {
          this.questionBag.total = parseInt(Response.xRecordCount);
        }
      });

    },
    changeList(record) {
      if (record && record.page.size < record.total) {
        record.page.size = record.page.size + 20;
      }
      console.log(record);
      //if (this.questionBag.total < this.questionBag.page.size) {
        this.getQuestionBagLists();
      //}

    },
    openWin(path, urlParams = {},status=false) {
      this.win$.openWindow(path, {
        fullscreen: true,
        urlParams: urlParams
      });
      if(status){
        this.local$.removeItem('win_id_library');
        this.win$.closeCurrentWindow();
      }
      
    },
    setPageParams(index, size) {
      return {
        index: index,
        size: size,
        offset: (Number(index) - 1) * Number(size)
      };
    },
    checkNo(e) {
      let reg = /^\S+$/;
      if (e) {
        if (new RegExp(reg).test(e) == false) {
          this.keyword = this.keyword.trim();
        }
      }
    }
  }
};
