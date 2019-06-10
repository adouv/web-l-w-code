import './input.css'
export default class supplierContractInputCtrl {
    constructor($scope, ngDialog, logisticsSupplierPactInterface, $sessionStorage, logisticsService, $stateParams, $state, SelectGarden, dialogsManager, $config) {
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.logisticsSupplierPactInterface = logisticsSupplierPactInterface;
        this.$sessionStorage = $sessionStorage;
        this.logisticsService = logisticsService;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.SelectGarden = SelectGarden;
        this.dialogsManager = dialogsManager;
        this.$config = $config;
        this.init();
    }

    init() {
        this.initParams();
        this.initFoodSupplyUnit();
        this.initContractInfo();
    }

    initFoodSupplyUnit() {
        this.logisticsSupplierPactInterface.getFoodSupplyUnit().then(res => {
            this.FoodSupplyUnitList = res.data;
        })
    }

    initParams() {
        this.filePath = this.$config.file.SHOWIMG;
        this.garden = this.$sessionStorage.get("currentGarden");
        this.account = this.$sessionStorage.get('account');
        this.gardenId = this.garden.gardenId;
        this.gardenName = this.garden.gardenName;

        this.amountTypes = [
            {value:0,name:"按实际发生"},
            {value:1,name:"输入具体合同金额"}
        ]
    }

    validateContractNameExists(){
        if(this.contract.name){
            this.logisticsSupplierPactInterface.validateName(this.contract.name,this.contract.id).then(res=>{
                this.validateName = res.data;
                if(!res.data){
                    this.dialogsManager.showMessage('系统中已存在该名称!', {className: 'warning'});
                }
            })
        }
    }

    initContractInfo() {
        if (this.$stateParams.id) {
            this.logisticsSupplierPactInterface.getSupplierContractInfo(this.$stateParams.id).then(res => {
                this.contract = res.data;
                if(res.data.amount == '按实际发生'){
                    this.selectedAmountType = '0';
                }else{
                    this.selectedAmountType = '1';
                }
                this.gardenId = this.contract.firstParty;
                this.gardenName = this.contract.firstPartyName;
                this.contract.validityStart = this.contract.validityStart?new Date(this.contract.validityStart).Format("yyyy-MM-dd hh:mm"):null;
                this.contract.validityEnd = this.contract.validityEnd?new Date(this.contract.validityEnd).Format("yyyy-MM-dd hh:mm"):null;
            })
        } else {
            this.contract = {};
            this.contract.name = '';
            this.contract.attachments = [];
            this.contract.amount = "按实际发生";
            this.selectedAmountType = '0';
            this.contract.firstParty = this.gardenId;
        }
    }

    /**
     * 选择默认园区(多选)
     */
    chooseGarden() {
        this.SelectGarden.dialog({
            ids: this.gardenId,
            single: true
        }, $garden => {
            if ($garden.ids && $garden.ids[0]) {
                this.contract.firstParty = $garden.ids.toString();
                this.gardenId = $garden.ids.toString();
                this.gardenName = $garden.gardenList[0].name+";";
            } else {
                this.dialogsManager.showMessage('合同甲方不能为空！', {
                    className: 'warning'
                });
            }
        });
    }

    goBack(tabName) {
        this.dialogsManager.confirm({
            title: '取消提示',
            content: '取消后本页面所有操作结果将丢失，是否继续？',
            btn: ['是', '否'],
            callback: [() => {
                this.$state.go("logistics.canteen.contract",{sidebarId:'order'});
            }]
        })
    }

    saveContract(tabName) {
        if (!this.validTime()) {
            this.dialogsManager.confirm({
                title: '操作提示',
                content: '确定执行此操作吗？',
                btn: ['是', '否'],
                callback: [() => {
                    if (!this.$stateParams.id) {
                        this.logisticsSupplierPactInterface.addSupplierContract(this.contract).then(res => {
                            this.$state.go("logistics.canteen.contract",{sidebarId:'order'});
                            this.dialogsManager.showMessage('添加成功', {className: 'success'});
                        })
                    } else {
                        this.logisticsSupplierPactInterface.updateSupplierContract(this.contract).then(res => {
                            this.$state.go("logistics.canteen.contract",{sidebarId:'order'});
                            this.dialogsManager.showMessage('更新成功', {className: 'success'});
                        })
                    }
                }]
            })
        }

    }

    validTime() {
        this.validStartTime = !this.contract.validityStart && this.contract.validityEnd;
        this.validEndTime = this.contract.validityStart && !this.contract.validityEnd;
        return this.validStartTime || this.validEndTime;
    }

    // 限制只能输入正实数
    clearNoNum(number) {//"按实际发生"
        if (number) {
            let value= this.checkInputNumber(number, 3);
            this.contract.amount = value;
        }
    }

    checkInputNumber(value, digit) {
        if (!value) {
            return;
        }
        value = value.toString();
        if ('' != value.replace(/\d{1,}\.{0,1}\d{0,}/, '')) {
            value = value.match(/\d{1,}\.{0,1}\d{0,}/) == null ? '' : value.match(/\d{1,}\.{0,1}\d{0,}/);
        }
        value = value.toString();
        if (!value) {
            return;
        }
        if (value.split(".")[0].length > 14) {
            var value_left = value.split(".")[0].substr(0, 14);
            if (value.indexOf(".") != -1) {
                value = value_left + value.substr(value.indexOf("."));
            } else {
                value = value_left;
            }
        }
        if (value.indexOf(".") != -1) {
            value = value.substr(0, value.indexOf(".") + digit);
        }
        return value;
    };

    changeAmountTypeValue(){
        if(this.selectedAmountType != 1){
            this.contract.amount = '按实际发生';
        }else{
            this.contract.amount = '';
        }
    }

}
supplierContractInputCtrl.$inject = ['$scope', 'ngDialog', 'logisticsSupplierPactInterface', '$sessionStorage', 'logisticsService', '$stateParams', '$state', 'SelectGarden', 'dialogsManager', '$config'];
