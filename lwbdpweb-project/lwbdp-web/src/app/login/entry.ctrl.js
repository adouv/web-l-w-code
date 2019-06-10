/**
 * Created by lw-yf-011 on 2017/5/15.
 */
export default class chooseCtrl{
    constructor($sessionStorage,$state){
        this.$sessionStorage=$sessionStorage;
        this.$state=$state;
        this.init();
    }
    init(){
        this.accountMsg=this.$sessionStorage.get('account');
    }
    // 当前园区信息
    enterGarden(garden){
        this.$sessionStorage.set('currentGarden',garden);
        this.$state.go('home');
    }
}
chooseCtrl.$inject=['$sessionStorage','$state'];