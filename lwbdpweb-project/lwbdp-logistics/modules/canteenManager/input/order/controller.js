import './input.css'
export default class inputCtrl {
    constructor($stateParams,logisticsPurchaseInterface,SelectGarden,dialogsManager,$scope,ngDialog,$config,$state,$sessionStorage){
        this.$stateParams = $stateParams;
        this.logisticsPurchaseInterface = logisticsPurchaseInterface;
        this.SelectGarden = SelectGarden;
        this.dialogsManager = dialogsManager;
        this.$scope = $scope;
        this.$config = $config;
        this.$state = $state;
        this.$sessionStorage = $sessionStorage;
        this.ngDialog = ngDialog;
        this.init()
    }

    init(){
        this.editCount = 0;
        this.filePath = this.$config.file.SHOWIMG;
        this.model = {};
        this.tempModel = {};
        this.model.purchaseOrderVoList = [];
        this.tempModel.purchaseOrderVoList = [];
        this.model.id = this.$stateParams.id;
        this.tempModel.id = this.$stateParams.id;
        this.purchaseCategories = [{id:''}];
        this.satisfiedLeveles = [{itemValue:''}];
        this.useSuppliers = [];
        this.selectPurchaseOrder = {};
        this.getPurchaseCategory();
        this.getSatisfiedLevel();
        this.initTempPurchaseOrder();
        this.getSuppliers();
        if(this.model.id){
            this.getModel();
        }
        this.$scope.$on('supplier',(scope,data)=>{
            this.selectPurchaseOrder.supplier = data.id;
            this.selectPurchaseOrder.supplierName = data.name;

        });
        this.dateConfig = {
            change:(date)=>{ // 选中时间触发
                console.log(date)
            },
            sure:(date)=>{ // 点击确定触发
                this.logisticsPurchaseInterface.validateReportTime(this.model.id,this.model.gardenId,date).then(res=>{
                    let isNotExist = res.data;
                    if(!isNotExist){
                        this.dialogsManager.showMessage("该采购单位本月份已存在采购单!",{className:'warning'});
                    }
                });
                return false;
            }
        };
        //当前园区
        this.model.gardenName = this.$sessionStorage.get('currentGarden').gardenName;
        this.model.gardenId = this.$sessionStorage.get('currentGarden').gardenId
    }

    initTempPurchaseOrder(){
        this.tempPurchaseOrder = {};
        this.tempPurchaseOrder.attachments = [];
        this.tempPurchaseOrder.category =this.purchaseCategories[0].id;
        this.tempPurchaseOrder.appraise = this.satisfiedLeveles[0].itemValue;
        this.tempPurchaseOrder.purchaseOrderItems = [{}];
       // this.selectPurchaseOrder = this.tempPurchaseOrder;
    }

    fileClick(){
        document.querySelector('#flow-sure-btn').click();
    }

    generatePurchaseOrder(){
        if(this.useSuppliers.indexOf(this.tempPurchaseOrder.supplier)>-1){
            this.dialogsManager.showMessage('供应商不能重复!',{className:'warning'});
            return;
        }
        if(!this.validAmount(this.tempPurchaseOrder.amount)){
            this.dialogsManager.showMessage('采购金额格式不正确!',{className:'warning'});
            this.tempPurchaseOrder.validAmount = true;
            return;
        }
        if(this.tempPurchaseOrder.attachments.length==0){
            this.tempPurchaseOrder.validAttachments = true;
            return;
        }

        this.model.purchaseOrderVoList.unshift(angular.copy(this.tempPurchaseOrder));
        this.tempModel.purchaseOrderVoList.unshift(angular.copy(this.tempPurchaseOrder));
        this.initTempPurchaseOrder();
        this.notPurchaseOrder = false;
        this.dialogsManager.showMessage('采购单生成成功!',{className:'success'});

    }



    getModel(){
        this.logisticsPurchaseInterface.getById(this.model.id).then(res=>{
            this.model = res.data;
            let reportTime = new Date();
            reportTime.setTime(this.model.reportTime);
            this.model.reportTime =reportTime.Format('yyyy-MM')
            this.tempModel = angular.copy(this.model);
            for(let purchaseOrder of this.model.purchaseOrderVoList){
                this.useSuppliers.push(purchaseOrder.supplier);
            }
        })
    }

    /**
     * 选择默认园区(多选)
     */
    chooseGarden() {
        this.SelectGarden.dialog({
            ids: this.model.gardenId,
            single:true
        }, $garden => {
            if ($garden.ids && $garden.ids[0]) {
                //this.contract.firstParty = $garden.ids.toString();
                this.model.gardenId = $garden.ids.toString();
                this.model.gardenName = $garden.gardenList[0].name+";";
                console.log($garden);
            } else {
                this.dialogsManager.showMessage('合同甲方不能为空！', {
                    className: 'warning'
                });
            }
        });
    }
    /*删除采购单*/
    deleteOrder($index){
        this.dialogsManager.confirm({
            title: '取消提示',
            content: '您确定要删除此采购单吗？',
            btn: ['是','否'],
            callback:[()=>{
                this.model.purchaseOrderVoList.splice($index,1)
            }]
        });
    }

    getPurchaseCategory(){
        this.logisticsPurchaseInterface.getPurchaseCategory().then(res=>{
            this.purchaseCategories = res.data;
            this.purchaseCategoryMap =this.getBaseConfigMap(res.data);
            this.tempPurchaseOrder.category = res.data[0].id;
        })
    }

    getBaseConfigMap(baseConfigs){
        let map = {};
        for(let baseConfig of baseConfigs){
            map[baseConfig.id] = baseConfig.name;
        }
        return map;
    }


    getDictionaryMap(dictionaries){
       let dictionaryMap = {};
       for(let item of dictionaries){
           dictionaryMap[item.itemValue] = item.itemName;
       }
       return dictionaryMap;
    }

    getSatisfiedLevel(){
        this.logisticsPurchaseInterface.getSatisfiedLevel().then(res=>{
            this.satisfiedLeveles = res.data;
            this.satisfiedLeveleMap = this.getDictionaryMap(res.data);
            this.tempPurchaseOrder.appraise = this.satisfiedLeveles[0].itemValue;
        })
    }

    cancelEdit($index){
        this.editCount = this.editCount-1;
        this.model.purchaseOrderVoList[$index] = angular.copy(this.tempModel.purchaseOrderVoList[$index]);
        this.model.purchaseOrderVoList[$index].showEdit = false;
    }

    completeEdit($index){
        this.editCount = this.editCount-1;
        let purchaseOrder = this.model.purchaseOrderVoList[$index];
        console.log(purchaseOrder);
        if(this.useSuppliers.indexOf(purchaseOrder.supplier)>0){
            this.dialogsManager.showMessage('供应商不能重复!',{className:'warning'});
            return;
        }
        if(!this.validAmount(purchaseOrder.amount)){
            this.dialogsManager.showMessage('采购金额格式不正确!',{className:'warning'});
            purchaseOrder.validAmount = true;
            return;
        }else{
            purchaseOrder.validAmount = false;
        }
        if(purchaseOrder.attachments.length==0){
            purchaseOrder.validAttachments = true;
            return;
        }else{
            purchaseOrder.validAttachments = false;
        }
        this.model.purchaseOrderVoList[$index].showEdit = false;
       this.tempModel.purchaseOrderVoList[$index] = angular.copy(this.model.purchaseOrderVoList[$index]);
    }

    getSuppliers(){
        this.logisticsPurchaseInterface.getSuppliers().then(res=>{
            this.suppliers = res.data;
        })
    }

    /**
     * 限制数字为正整数
     */
    restrictNumber(purchaseOrderItem){
        let number = purchaseOrderItem.number||'';
        purchaseOrderItem.number = number.replace(/[^\d]/g,"");

    }

    submit(){
        this.validReportTime = !this.model.reportTime;
        this.validGardenName = !this.model.gardenName;
        let purchaseSize = this.model.purchaseOrderVoList.length;
        this.validPurchaseSize = purchaseSize||0;
        if(purchaseSize==0){
            this.notPurchaseOrder = true;
            this.dialogsManager.showMessage('请添加采购单!',{className:'warning'}); //消息类型有:成功success 错误error 警告warning
            return;
        }
        if(this.editCount>0){
            this.dialogsManager.showMessage('上部存在未完成的采购单,不能保存!',{className:'warning'}); //消息类型有:成功success 错误error 警告warning
            return;
        }
        if(this.validGardenName||this.validReportTime){
            this.dialogsManager.showMessage('有必填项没填写!',{className:'warning'});
        }else{
            let data = angular.copy(this.model);
            delete data.purchaseOrderVoList;
            data.purchaseOrders = angular.copy(this.model.purchaseOrderVoList);
            this.logisticsPurchaseInterface.submit(data).then(res=>{
                this.dialogsManager.showMessage('采购单添加成功！', {
                    className: 'success'
                });
                this.$state.go("logistics.canteen.order",{sidebarId:'order'});
            })
        }
    }

    validAmount(amount){
        let reg = /^\d+(\.\d{2})?$/;
        return reg.test(amount);
    }




    /*
    * 选择供应商
    * */
    selectSupplier(purchaseOrder){
        this.selectPurchaseOrder = purchaseOrder;
        this.ngDialog.open({
            disableAnimation: true,
            closeByDocument: false,
            className: 'bdp layer_fixed_small',
            template: require('../../../../components/supplier/supplier.html'),
            plain: true,
            controller: 'supplierCtrl',
            controllerAs: 'supplier',
            scope: this.$scope,
            onOpenCallback: () => {
                this.$scope.$broadcast('suppliers',{
                    suppliers:this.suppliers,
                    supplier:{
                        id:purchaseOrder.supplier,
                        name:purchaseOrder.supplierName
                    }
                });
            }
        })
    }

    goBack(){
        this.$state.go("logistics.canteen.order",{sidebarId:'order'});
    }

    toCancel(){
        this.dialogsManager.confirm({
            title: '取消提示',
            content: '取消后本页面所有操作结果将丢失，是否继续？',
            btn: ['是','否'],
            callback:[()=>{
                this.goBack();
            }]
        });
    }

    /**
     *  显示placeHolder
     */
    showPlaceHolder(index,placeHolder,placeHolderName){
        this.tempPurchaseOrder.purchaseOrderItems[index][placeHolder] = placeHolderName;
    }
}
inputCtrl.$inject = ['$stateParams','logisticsPurchaseInterface','SelectGarden','dialogsManager','$scope','ngDialog','$config','$state','$sessionStorage'];

