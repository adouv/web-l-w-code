export default class canteenSearchCtrl {
    constructor($scope,dialogsManager,SelectGarden,$sessionStorage,ngDialog) {
        this.$scope = $scope;
        this.dialogsManager = dialogsManager;
        this.SelectGarden = SelectGarden;
        this.$sessionStorage = $sessionStorage;
        this.ngDialog =ngDialog;
        this.init();
    }

    init() {
        this.gardenIds = [];

        this.purchaseCondition = {};
        this.supplierPactCondition = {};
        this.$scope.$on('tab',(res,data)=>{
            this.tabName = data.tabName;
            if(this.tabName=='order'){
                this.purchaseCondition = angular.copy(data.condition)||{};
                if(!this.purchaseCondition.gardenIds){
                    this.gardenIds.push(this.$sessionStorage.get('currentGarden').gardenId);
                }else{
                    this.gardenIds = this.purchaseCondition.gardenIds;
                }
            }else{
                this.supplierPactCondition = angular.copy(data.condition)||{};
                if(!this.supplierPactCondition.firstParties){
                    this.gardenIds.push(this.$sessionStorage.get('currentGarden').gardenId);
                }else{
                    this.gardenIds = this.supplierPactCondition.firstParties;
                }
            }
        })

        this.$scope.$on('selectSecondPartys',(res,data)=>{
            this.supplierPactCondition.secondParties = data.secondParties;
            this.supplierPactCondition.secondPartyName = data.secondPartyName;
        })
    }



    /**
     * 选择默认园区(多选)
     */
    chooseGarden(condition) {
        this.SelectGarden.dialog({
            ids: this.gardenIds,
            single:false
        }, $garden => {
            if(this.tabName=='order'){
                condition.gardenName= $garden.gardenList.map(garden=>garden.name).join(";")+";";
                condition.gardenIds = $garden.gardenList.map(garden=>garden.id);
            }else{
               condition.firstParties = $garden.gardenList.map(garden=>garden.id);
               condition.firstPartyName = $garden.gardenList.map(garden=>garden.name).join(";")+";";
            }

        });
    }

    searchPurchaseOrder(closeThisDialog){
        if(!this.validPurchaseOrderCondition()){
            this.$scope.$emit('purchaseOrderSearch',this.purchaseCondition)
            closeThisDialog();
        }
    }

    /*
     * 选择供应商
     * */
    selectSecondParty(){
        this.ngDialog.open({
            disableAnimation: true,
            closeByDocument: false,
            className: 'bdp layer_fixed_small',
            template: require('./secondParty.html'),
            plain: true,
            controller: 'secondPartyCtr',
            controllerAs: 'secondParty',
            scope: this.$scope,
            onOpenCallback: () => {
                this.$scope.$broadcast('secondParty',{
                    secondParties:this.supplierPactCondition.secondParties

                });
            }
        })
    }

    validPurchaseOrderCondition(){
        this.PurchaseOrder = {};
        this.PurchaseOrder.validReportTimeStart = !this.purchaseCondition.reportTimeStart&&this.purchaseCondition.reportTimeEnd;
        this.PurchaseOrder.validReportTimeEnd = this.purchaseCondition.reportTimeStart&&!this.purchaseCondition.reportTimeEnd;
        this.PurchaseOrder.validAmountStart = !this.purchaseCondition.amountMin&&this.purchaseCondition.amountMax;
        if(this.purchaseCondition.amountMin){
            let valid = this.validAmount(this.purchaseCondition.amountMin);
            if(!valid){
                this.PurchaseOrder.validAmountStart = !valid;
                this.dialogsManager.showMessage('采购金额格式不正确!',{className:'warning'});
            }
        }
        this.PurchaseOrder.validAmountEnd = this.purchaseCondition.amountMin&&!this.purchaseCondition.amountMax;

        if(this.purchaseCondition.amountMax){
            let valid = this.validAmount(this.purchaseCondition.amountMax)
            if(!valid){
                this.PurchaseOrder.validAmountEnd = !valid;
                this.dialogsManager.showMessage('采购金额格式不正确!',{className:'warning'});
            }
        }
        this.PurchaseOrder.validCreateTimeStart = !this.purchaseCondition.createTimeStart&&this.purchaseCondition.createTimeEnd;
        this.PurchaseOrder.validCreateTimeEnd = this.purchaseCondition.createTimeStart&&!this.purchaseCondition.createTimeEnd;
        return this.PurchaseOrder.validReportTimeStart||this.PurchaseOrder.validReportTimeEnd||
               this.PurchaseOrder.validAmountStart||this.PurchaseOrder.validAmountEnd||
               this.PurchaseOrder.validCreateTimeStart||this.PurchaseOrder.validCreateTimeEnd;
    }

    searchSupplierPact(closeThisDialog){
        if(!this.validSupplierPactCondition()){
            this.$scope.$emit('supplierPactSearch',this.supplierPactCondition)
            closeThisDialog();
        }

    }
    validSupplierPactCondition(){
        this.SupplierPact = {};
        this.SupplierPact.validValidityStart = !this.supplierPactCondition.validityStart&&this.supplierPactCondition.validityEnd;
        this.SupplierPact.validValidityEnd = this.supplierPactCondition.validityStart&&!this.supplierPactCondition.validityEnd;
        this.SupplierPact.validAmountStart = !this.supplierPactCondition.amountMin&&this.supplierPactCondition.amountMax;
        if(this.supplierPactCondition.amountMin){
            let valid = this.validAmount(this.supplierPactCondition.amountMin);
            if(!valid){
                this.SupplierPact.validAmountStart = !valid;
                this.dialogsManager.showMessage('合同金额格式不正确!',{className:'warning'});
            }
        }
        this.SupplierPact.validAmountEnd = this.supplierPactCondition.amountMin&&!this.supplierPactCondition.amountMax;

        if(this.supplierPactCondition.amountMax){
            let valid = this.validAmount(this.supplierPactCondition.amountMax)
            if(!valid){
                this.SupplierPact.validAmountEnd = !valid;
                this.dialogsManager.showMessage('合同金额格式不正确!',{className:'warning'});
            }
        }
        this.SupplierPact.validCreateTimeStart = !this.supplierPactCondition.createTimeStart&&this.supplierPactCondition.createTimeEnd;
        this.SupplierPact.validCreateTimeEnd = this.supplierPactCondition.createTimeStart&&!this.supplierPactCondition.createTimeEnd;
        return this.SupplierPact.validValidityStart||this.SupplierPact.validValidityEnd||
            this.SupplierPact.validAmountStart||this.SupplierPact.validAmountEnd||
            this.SupplierPact.validCreateTimeStart||this.SupplierPact.validCreateTimeEnd;
    }

    validAmount(amount){
        let reg = /^\d+(\.\d{2})?$/;
        return reg.test(amount);
    }



}
canteenSearchCtrl.$inject = ['$scope','dialogsManager','SelectGarden','$sessionStorage','ngDialog'];
