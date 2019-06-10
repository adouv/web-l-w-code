import AuthService from '../../../../_service/auth.service';
import Organization from '../../../../_service/organization.service';
/** 
 * 登录
 */
export default {
  name: "SignComponent",
  data() {
    return {
      userName: '',
      password: '',
      isLocalStatus: false,
      params: {
        client_id: 1,
        client_secret: '123',
        scope: 'read',
        grant_type: 'password',
        username: '',
        password: ''
      }
    };
  },
  mounted() {},
  methods: {
    
    getLocalData(param) {
      // localDao.select(param, 'lw_pen_user').then(response => {
      //   if (response.Data.length > 0) {
      //     this.isLocalStatus = true;

      //     //this.local$.setItem('classesArr', JSON.stringify(organization));
      //   } else {

      //   }
      // });
    },
    //登录
    async loginClick() {

      this.local$.clearLocal();

      let noError = true;
      if (!this.params.username || this.params.username === '' || !this.params.password || this.params.password === '') {
        this.$message.error('用户名或密码不能为空！');
        noError = false;
      }
      if (noError) {
        // let userWhere = `accountName='${this.params.username}' and password='${this.encrypt$.dataMD5(this.params.password)}'`;

        // let {
        //   Status,
        //   Data,
        //   Message
        // } = await this.sql$.select('lw_pen_user', userWhere);

        // if (Status === 200 && Message === 'ok' && Data.length > 0) {
        //   let userData = Data[0];
        //   this.local$.setItem('LWToken', userData.LWToken);
        //   this.saveLocalData(JSON.parse(userData.userData), JSON.parse(userData.classesArr));
        // } else {
        //   this.sign();
        // }
        this.sign();
      }
    },
    async sign() {
      AuthService.sign(this.params).then(response => {
        let token = response.access_token;
        this.local$.setItem('LWToken', response.access_token);

        let promiseAll = [];
        promiseAll.push(AuthService.getAuthInfo());
        promiseAll.push(Organization.getClassList());

        this.http$.all(promiseAll).then(this.http$.spread((authInfo, organization) => {
          //存储用户到本地库
          let userParams = {
            accountName: authInfo.accountName,
            accountId: authInfo.accountId,
            password: this.encrypt$.dataMD5(this.params.password),
            gardenId: authInfo.gardens[0].gardenId,
            LWToken: token,
            userData: JSON.stringify(authInfo),
            classesArr: JSON.stringify(organization)
          }
          this.sql$.insert('lw_pen_user', userParams);

          this.saveLocalData(authInfo, organization);
        }));
      }).catch(error => {
        this.$message.error("用户名或密码错误");
      });
    },
    saveLocalData(authInfo, organization, status = false) {
      
      this.local$.setItem('account', JSON.stringify(authInfo));
      this.local$.setItem('classesArr', JSON.stringify(organization));
      console.log(organization.length);
      if (organization && organization.length > 1) {
        this.$router.push({
          name: 'signClass'
        });
      } else {
        if(organization.length == 1){
          this.local$.setItem('selectClassId', organization[0].id);
          this.local$.setItem('selectClassName', organization[0].pname + organization[0].name);
        }
        this.local$.setItem('isLogin', true);
        //登陆成功后通知菜单变更状态
        this.win$.send('login', true);
        this.win$.closeCurrentWindow();
      }
      
    },
    //临时用户
    userSelect() {

    },

  }
};
