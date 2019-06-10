import './detail.css';
export default class canteenDetailCtrl {
    constructor($state, logisticsSupplierPactInterface,$config,$stateParams,dialogsManager) {
        this.$state = $state;
        this.logisticsSupplierPactInterface = logisticsSupplierPactInterface;
        this.$config = $config;
        this.$stateParams = $stateParams;
        this.dialogsManager = dialogsManager;
        this.init();
    }

    init() {
        this.initParams();
        this.initContractInfo();
    }

    initParams(){
        this.filePath = this.$config.file.SHOWIMG;
    }

    initContractInfo() {
        this.logisticsSupplierPactInterface.getSupplierContractInfo(this.$stateParams.id).then(res => {
            console.log(res.data);
            this.contract = res.data;
        })
    }
    goBack(tabName) {
        this.$state.go("logistics.canteen.contract",{sidebarId:'order'});
    }

}
canteenDetailCtrl.$inject = ['$state', 'logisticsSupplierPactInterface','$config','$stateParams','dialogsManager'];
