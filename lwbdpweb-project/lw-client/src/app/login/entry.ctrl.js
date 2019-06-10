export default class chooseCtrl{
    constructor($sessionStorage,$state,$config,clientService){
        this.$sessionStorage=$sessionStorage;
        this.$state=$state;
        this.init();
        this.$config = $config;
        this.filePath = this.$config.file.SHOWIMG;
        clientService.setWindowSize(380, 500);
        this.isClient = clientService.isClient();
    }
    init(){
        this.accountMsg = this.$sessionStorage.get('account');
    }
    // 当前园区信息
    enterGarden(garden){
        this.$sessionStorage.set('currentGarden',garden);
        this.$state.go('connect.look');
    }
}
chooseCtrl.$inject=['$sessionStorage','$state','$config','clientService'];