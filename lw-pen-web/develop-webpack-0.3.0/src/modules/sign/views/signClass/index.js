import AccountService from '../../../../_service/account.service';
import Organization from '../../../../_service/organization.service'

export default {
  name: "SignClassComponent",
  data() {
    return {
      classList: {},
      singleValue: ''
    };
  },
  mounted() {
    this.classList = AccountService.getSelectClassList();
    Organization.getClassList().then(res=>{
      this.classList = res;
      this.singleValue = this.classList[0].id;
    });
    document.getElementsByClassName("ant-select-selection-selected-value").title = '';
    document.getElementsByClassName("ant-select-dropdown-menu-item").title = '';
  },
  methods: {
    handleChange(value) {
      this.singleValue = value;
      document.getElementsByClassName("ant-select-selection-selected-value").title = '';

    },
    isEmpty(str) {
      if (str || str == 0) {
        return str + "";
      } else {
        return "";
      }
    },
    subBtn(){
      let myThis = this;
      let className = '';
      this.classList.forEach(element => {
        if (this.singleValue === element.id) {
          className = myThis.isEmpty(element.pname) + myThis.isEmpty(element.name);
          myThis.local$.setItem('selectClassName', className);
          myThis.local$.setItem('selectClassId', element.id);
        }
      });
      this.local$.setItem('isLogin', true);
      //登陆成功后通知菜单变更状态
      this.win$.send('login', true);
      this.win$.closeCurrentWindow();
    },
    close() {
      this.win$.closeCurrentWindow();
    }
  },
 
};
