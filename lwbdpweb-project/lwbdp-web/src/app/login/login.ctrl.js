/**
 * Created by guoyaru on 2017/5/13.
 */
export default class loginCtrl{
    constructor($scope,OAuth2,$state,$config,loginService,$sessionStorage,dialogsManager,lwPermissionService,ngDialog){
        this.$scope=$scope;
        this.OAuth2=OAuth2;
        this.$state=$state;
        this.$config=$config;
        this.loginService=loginService;
        this.$sessionStorage=$sessionStorage;
        this.dialogsManager = dialogsManager;
        this.permission = lwPermissionService;
        this.user = {};
        ngDialog.closeAll();
    }
    login(){
        if(!this.user.username||!this.user.password){
            this.dialogsManager.showMessage('用户名或密码不能为空',{className:'error'});
            return;
        }
        this.OAuth2.getAccessToken(this.user).then( (res)=>{
            this.getUser();
            this.permission.setPermissions();
        },err=>{
            this.dialogsManager.showMessage(err.data.error_description,{className:'error'});
        })
    }
    keyPress(e){
        if(e.which===13){
            this.login();
        }
    }
    // 用户信息
    cacheUser(data){
        this.$sessionStorage.set('account',data);
    }
    getUser(){
        this.loginService.getUserInfo().then((data)=>{
            if(data.data.gardens.length===2&&data.data.gardens.length>2){
                this.$state.go('entry');
            }
            else{
                this.$sessionStorage.set('currentGarden',data.data.gardens[0]);
                this.$state.go('repair');
            }
            this.cacheUser(data.data)
        });
    }

    losePassword(){
        this.dialogsManager.showMessage('请联系管理员',{className:'warning'});
    }
}
loginCtrl.$inject=['$scope','OAuth2','$state','$config','loginService','$sessionStorage','dialogsManager','lwPermissionService','ngDialog'];