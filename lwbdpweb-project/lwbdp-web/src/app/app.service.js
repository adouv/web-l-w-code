/**
 * Created by lw-yf-025 on 2017/3/17.
 */
export default class AppService{
    constructor(DaoService,$config,$sessionStorage) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
        this.$sessionStorage = $sessionStorage;
    }
    
    login(user){
        return this.DaoService.get(this.modules.ASSET,'/login',angular.extend({type:'OAuth2App'},user)).then(data=>{
            this.$sessionStorage.set('access_token',data.data.data.TOKEN);
        });
    }

}
AppService.$inject = ['DaoService','$config','$sessionStorage'];
