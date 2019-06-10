/**
 * @Author hejialin
 * @Description 账户服务
 */
export default class accountService{
    constructor(DaoService,$config){
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     * 获取对应账户信息
     * @param accountsIds
     * @param callback
     */
    getAccountByIds(accountsIds,callback){
        this.DaoService.get(this.modules.ACCOUNT,'/account/simple',{accountIds:accountsIds.join(',')}).then(res=>{
            callback&&callback(res);
        });
    }

    /**
     * 通过园区ID获取用户
     * @param gardenId
     * @param callback
     */
    getAccountByGardenId(gardenId,callback){
        this.DaoService.get(this.modules.ACCOUNT,'/account/garden/'+gardenId).then(res=>{
            callback&&callback(res);
        });
    }

    getCurrentAccount(callback){
        this.DaoService.get(this.modules.ACCOUNT,'/account/auth-info').then(res=>{
            callback&&callback(res);
        });
    }
}
accountService.$inject = ['DaoService','$config'];