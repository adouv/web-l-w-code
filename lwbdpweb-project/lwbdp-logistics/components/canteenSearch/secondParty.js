export default class secondPartyCtr {
    constructor($scope,logisticsPurchaseInterface) {
        this.$scope = $scope;
        this.logisticsPurchaseInterface = logisticsPurchaseInterface;
        this.init();
    }

    init() {
        this.secondParties = [];

        this.$scope.$on('secondParty', (scope, data) => {
            this.secondPartyNameAry = [];
           this.secondParties = data.secondParties || [];
            this.logisticsPurchaseInterface.getSuppliers().then(res=>{
                this.allSecondParties = res.data;
                for(let v of this.allSecondParties){
                    if(this.secondParties.indexOf(v.id)>-1){
                        v.checked = true
                        this.secondPartyNameAry.push(v.name);
                    }else{
                        v.checked = false
                    }

                }
            })


        });
    }

    getSecondParty(){
        this.logisticsPurchaseInterface.getSuppliers().then(res=>{
            this.supplierPactCondition.allSecondParties = res.data;
        })
    }
    checked($event,data){
        let checkbox = event.target;
        if(checkbox.checked && this.secondParties.indexOf(data.id) < 0){
            this.secondParties.push(data.id);
            this.secondPartyNameAry.push(data.name);

        }
        if (!checkbox.checked && this.secondParties.indexOf(data.id) !== -1) {
            this.secondParties.splice(this.secondParties.indexOf(data.id),1);
            this.secondPartyNameAry.splice(this.secondParties.indexOf(data.id),1);
        }
    }

    sureSupplier(closeThisDialog){
        this.secondPartyName = this.secondPartyNameAry.join(";");
        this.$scope.$emit('selectSecondPartys',{'secondParties':this.secondParties,'secondPartyName':this.secondPartyName});
        closeThisDialog();
    }


}
secondPartyCtr.$inject = ['$scope','logisticsPurchaseInterface'];
