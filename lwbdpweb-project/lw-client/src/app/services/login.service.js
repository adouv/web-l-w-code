export default class loginService {
    constructor(DaoService, $config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }
     /**
      * 获取用户信息
      */
      getUserInfo(param){
          return this.DaoService.get(this.modules.GARDEN, '/account/auth-info')
      }
      /**
       * 修改个人密码接口
       * @param {*} oldPassword 
       * @param {*} newPassword 
       */
      changePassword(param){
          return this.DaoService.put(this.modules.GARDEN, '/account/password',param)
      }
}
loginService.$inject = ['DaoService', '$config'];