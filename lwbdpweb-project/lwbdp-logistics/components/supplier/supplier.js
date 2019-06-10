export default class supplierCtrl {
    constructor($scope) {
        this.$scope = $scope;
        this.init();
    }

    init() {
        this.$scope.$on('suppliers', (scope, data) => {
            this.suppliers = data.suppliers;
            for(let value of data.suppliers){
                if(value.id === data.supplier.id){
                    value.checked = true
                }else{
                    value.checked = false
                }
            }
        });
    }
    chooseId(id,name){
        this.supplier={
            id:id,
            name:name+";"
        }
    }

    sureSupplier(closeThisDialog){
        this.$scope.$emit('supplier',this.supplier);
        closeThisDialog();
    }


}
supplierCtrl.$inject = ['$scope'];
