import './list.css'
export default class canteenListCtr {
    constructor(ngDialog, $stateParams, $state,logisticsPurchaseInterface,logisticsSupplierPactInterface,$scope,dialogsManager,$sessionStorage,lwGardenService,lwPermissionService) {
        this.ngDialog = ngDialog;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.$scope = $scope;
        this.logisticsPurchaseInterface = logisticsPurchaseInterface;
        this.logisticsSupplierPactInterface = logisticsSupplierPactInterface;
        this.dialogsManager = dialogsManager;
        this.$sessionStorage = $sessionStorage;
        this.gardenService = lwGardenService;
        this.lwPermissionService = lwPermissionService;
        this.init();
    }

    init() {
        this.purchaseOrderKeywords = '';
        this.supplierPactKeywords = '';
        this.hasPurchaseOrderSearch = false;
        this.hasSupplierPactSearch = false;
        this.purchase = {};
        this.purchase.datas = [];
        this.supplierPact = {};
        this.supplierPact.datas = [];
        this.gardenIds = [];
        this.initParams();

        this.getVisibleGarden();
        this.receiveChildData();
    }

    receiveChildData(){
        this.$scope.$on('purchaseOrderSearch',(scope,data)=>{
            this.hasPurchaseOrderSearch = true;
            this.purchaseOrderKeywords = '';
            this.purchaseOrderCondition = angular.copy(data);
            this.purchase.paginationConf.onChange(0, this.purchase.paginationConf.itemsPerPage);
        })
        this.$scope.$on('supplierPactSearch',(scope,data)=>{
            this.hasSupplierPactSearch = true;
            this.supplierPactKeywords = '';
            this.supplierPactCondition = angular.copy(data);
            this.supplierPact.paginationConf.onChange(0, this.supplierPact.paginationConf.itemsPerPage);
        })
    }

    /**
     * 获取用户可见园区
     */
    getVisibleGarden() {
        this.gardenService.getVisualGardenList(false, res => {
            this.gardenIds = res.data.map((garden)=>garden.gardenId);
            this.purchasePageConfig();
            this.supplierPactPageConfig();
        })
    }

    initParams(){
        console.log(this.$state.current.name);
        let permission = this.lwPermissionService.hasPermission("logistics:purchaseOrder:list");
        this.tabName = this.$state.current.name.split(".")[2];
        if(!permission && this.tabName == "order"){
            this.switchTable("contract");
    }
        this.accountId = this.$sessionStorage.get('account').accountId;
    }
    getMoreSearch() {
        this.ngDialog.open({
            closeByDocument: false,
            className: 'bdp layer_fixed',
            template: require('../../../components/canteenSearch/canteenSearch.html'),
            plain: true,
            controller: 'canteenSearchCtrl',
            controllerAs: 'canteenSearch',
            scope: this.$scope,
            onOpenCallback: () => {
                let condition = this.tabName=='order'?this.purchaseOrderCondition:this.supplierPactCondition;
                this.$scope.$broadcast('tab',{
                    tabName:this.tabName,
                    condition:condition
                });
            }
        })
    }

    clearPurchaseOrderKeywords(){
        this.purchaseOrderKeywords = '';
        this.purchase.paginationConf.onChange(0, this.purchase.paginationConf.itemsPerPage);
    }
    clearSupplierPactKeywords(){
        this.supplierPactKeywords = '';
        this.supplierPact.paginationConf.onChange(0, this.supplierPact.paginationConf.itemsPerPage);
    }

    deletePurchaseCondition(){
        this.showPurchaseSearch=false;
        this.purchaseOrderCondition={};
        this.purchase.paginationConf.onChange(0, this.purchase.paginationConf.itemsPerPage);
    }
    deleteSupplierPactCondition(){
        this.showSupplierPactSearch=false;
        this.supplierPactCondition={};
        this.supplierPact.paginationConf.onChange(0, this.supplierPact.paginationConf.itemsPerPage);
    }

    goSupplierPactSearch(event){
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.hasSupplierPactSearch = true;
            this.supplierPact.paginationConf.onChange(0, this.supplierPact.paginationConf.itemsPerPage);
        }
    }
    goPurchaseOrderSearch(event){
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.hasPurchaseOrderSearch = true;
            this.purchase.paginationConf.onChange(0, this.purchase.paginationConf.itemsPerPage);
        }
    }

    purchasePageConfig() {
        this.purchase.paginationConf = {
            onChange: (offset, size) => {
                this.getPurchaseOrderData(offset, size, (datas,total,gardenCount) => {
                    this.purchase.datas = datas;
                    this.purchase.gardenCount = gardenCount || 0;
                    this.purchase.paginationConf.totalItems = total || 0;
                })
            }
        }
    }

    supplierPactPageConfig() {
        this.supplierPact.paginationConf = {
            onChange: (offset, size) => {
                this.getSupplierPactData(offset, size, (datas,total,gardenCount) => {
                    this.supplierPact.datas = datas;
                    this.supplierPact.gardenCount = gardenCount || 0;
                    this.supplierPact.paginationConf.totalItems = total || 0;

                })
            }
        }
    }

    switchTable(tab){
        this.tabName =tab;
        if(tab=='order'){
            this.$state.go('logistics.canteen.order',{sidebarId:this.$stateParams.sidebarId});
        }else{
            this.$state.go('logistics.canteen.contract',{sidebarId:this.$stateParams.sidebarId});
        }
    }


    getSupplierPactData(offset,size,callback){
        let condition = angular.copy(this.supplierPactCondition)||{};
        condition.offset = offset;
        condition.size = size;
        condition.keywords = this.supplierPactKeywords;
        condition.firstParties = condition.firstParties||this.gardenIds;
        delete condition.gardenName;
        this.logisticsSupplierPactInterface.getList(condition).then(res=>{
            let totalItems = res.headers()['x-record-count'];
            let gardenCount = res.headers()['first-party-count'];
            callback(res.data,totalItems,gardenCount);
        })
    }


    getPurchaseOrderData(offset,size,callback){
        let condition = angular.copy(this.purchaseOrderCondition)||{};
        condition.offset = offset;
        condition.size = size;
        condition.keywords = this.purchaseOrderKeywords;
        condition.gardenIds = condition.gardenIds||this.gardenIds;
        delete condition.gardenName;
        this.logisticsPurchaseInterface.getList(condition).then(res=>{
            let totalItems = res.headers()['x-record-count'];
            let gardenCount = res.headers()['garden-count'];
            callback(res.data,totalItems,gardenCount);
        })
    }

    toUpdatePurchaseOrder(id,$event){
        $event.stopPropagation();
        this.$state.go('logistics.canteen.orderInput',{id:id});
    }

    toUpdateSupplierContract(id,$event){
        $event.stopPropagation();
        this.$state.go('logistics.canteen.contractInput',{id:id});
    }

    deleteSupplierContract(id,$event){
        $event.stopPropagation();
        this.dialogsManager.confirm({
            title: '删除提示',
            content: '您确定要删除此供应商合同吗？',
            btn: ['是','否'],
            callback:[()=>{
                this.logisticsSupplierPactInterface.deleteSupplierContract(id).then(res=>{
                    this.dialogsManager.showMessage('删除成功！', {className: 'success'});
                    this.supplierPact.paginationConf.onChange(0, this.supplierPact.paginationConf.itemsPerPage);
                })
            }]
        });

    }

    exportPurchaseOrder(){
        this.logisticsPurchaseInterface.export();
    }

    exportSupplierPact(){
        this.logisticsSupplierPactInterface.export();
    }

    deletePurchaseOrder(id,$event){
        $event.stopPropagation();
        this.dialogsManager.confirm({
            title: '删除提示',
            content: '您确定要删除此采购单吗？',
            btn: ['是','否'],
            callback:[()=>{
                this.logisticsPurchaseInterface.deletePurchaseOrder(id).then(res=>{
                    this.dialogsManager.showMessage('删除成功！', {className: 'success'});
                    this.purchase.paginationConf.onChange(this.purchase.paginationConf.offset, this.purchase.paginationConf.itemsPerPage);
                })
            }]
        });
    }

}
canteenListCtr.$inject = ['ngDialog', '$stateParams', '$state','logisticsPurchaseInterface','logisticsSupplierPactInterface','$scope','dialogsManager','$sessionStorage','lwGardenService','lwPermissionService'];
