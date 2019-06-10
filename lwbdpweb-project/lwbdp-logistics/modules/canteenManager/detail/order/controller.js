import './detail.css';
export default class canteenDetailCtrl {
    constructor($stateParams,logisticsPurchaseInterface,$config) {
        this.$stateParams = $stateParams;
        this.logisticsPurchaseInterface = logisticsPurchaseInterface;
        this.$config = $config;
        this.init();
    }
    init() {
        this.model = {};
        this.model.purchaseOrderVoList = [];
        this.model.id = this.$stateParams.id;
        this.filePath = this.$config.file.SHOWIMG;
        this.getModel();

    }

    getModel(){
        this.logisticsPurchaseInterface.getById(this.model.id).then(res=>{
            this.model = res.data;
        })
    }
}
canteenDetailCtrl.$inject = ['$stateParams','logisticsPurchaseInterface','$config'];