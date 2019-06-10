export default class loginService{
    constructor(DaoService,$config){
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     * 获取用户信息
     */
    getUserInfo(param) {
        return this.DaoService.get(this.modules.GARDEN, '/account/auth-info')
    }
}
loginService.$inject = ['DaoService', '$config'];