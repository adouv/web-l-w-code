import chooseFundNumber from './chooseFundNumber.html';

class chooseAmountNumberCtrl {
    constructor(ProjectInterface, $scope, dialogsManager) {
        this.$scope = $scope;
        this.dialogsManager = dialogsManager;
        this.ProjectInterface = ProjectInterface;
        this.getCondition();
        this.$scope.selectedList = [];
        this.$scope.selectedIds = [];
        this.list = angular.copy(this.$scope.list);
    }

    getCondition() {
        this.ProjectInterface.getCapitalNature().then(res => {
            this.natureList = res.data;
            this.natureId = res.data[0].itemValue;
        });
        this.ProjectInterface.getCapitalCategory().then(res => {
            this.categoryList = res.data;
            this.categoryId = res.data[0].itemValue;
        });
    }

    remove(index) {
        let target = this.findAmountNum(this.list, this.$scope.selectedList[index].id);
        target.availableAmount += this.$scope.selectedList[index].amount;
        this.$scope.selectedList.splice(index, 1);
        this.$scope.selectedIds.splice(index, 1);
    }

    /**
     * 验证金钱
     * @param price
     * @return {*}
     */
    controlPrice(data, attrName, maxAmount) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        data[attrName] = this.validAmount(data[attrName], maxAmount);
    }

    stopEvent(){
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
    }

    validAmount(price, maxAmount) {
        if (price && price < maxAmount || price && !maxAmount) {
            price = price.replace(/[^\d.]/g, "");
            price = price.replace(/\.{2,}/g, ".");
            price = price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
            price = price.replace(/^([0-9])(\d{14}).*$/, '$1$2');
            if (price.indexOf('.') < 0 && price != "") {
                price = parseFloat(price);
            }
            let len = price.toString().length;
            if (price > 9999999999999.99) {
                price = price.toString().substring(0, len - 1)
            }
            if (price === 9999999999999.99) {
                price = 9999999999999.99
            }
            return price;
        } else if (price >= maxAmount) {
            return maxAmount;
        }
    }

    sureKeywords(keywords) {
        this.keywords = keywords;
    }

    // 回车查询
    goSearch(event, keywords) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.sureKeywords(keywords)
        }
        if (keywords == '') {
            this.list = angular.copy(this.$scope.list);
        }
    }

    validateAmount(){
        if(!this.allotAmount.amount){
            this.dialogsManager.showMessage('分配金额不能为0！',{className:'warning'});
            return false;
        }
        return true;
    }

    allotFinanceAmount(data, index) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        if (data.availableAmount) {
            this.showAllotAmount  = true;
            this.allotAmount = angular.copy(data);
            this.allotAmount.index = index;
        } else {
            this.wranMessage('该资金文号无剩余金额可分配！');
        }
    }

    sureAllot() {
        if(this.validateAmount()){
            let data = this.allotAmount;
            let alreadyAmount = this.findAmountNum(this.$scope.selectedList, data.id);
            if (!alreadyAmount) {
                this.$scope.selectedList.push({id: data.id, name: data.name, amount: data.amount, nature: data.nature});
                this.$scope.selectedIds.push(data.id);
            } else {
                alreadyAmount.amount += data.amount;
            }
            this.list[this.allotAmount.index].availableAmount -= data.amount;
            this.allotAmount = null;
            this.showAllotAmount = false;
        }
    }

    findAmountNum(list, id) {
        for (let data of list) {
            if (data.id == id) {
                return data;
            }
        }
    }

    cancelAllot() {
        this.allotAmount = null;
        this.showAllotAmount = false;
    }

    cleanAmount() {
        this.noFinanceAmount = null;
        this.$scope.selectedList.forEach((amount, index) => {
            this.remove(index);
            this.list.push(index)
        })
    }

    clickSure() {
        let amountSum = parseFloat(this.$scope.maxAmount||0)-parseFloat(this.$scope.currentAmount||0);
        if (this.noFinanceAmount) {
            if(amountSum>=parseFloat(this.noFinanceAmount)/10000){
                this.$scope.callback({avalData: parseFloat(this.noFinanceAmount)/10000});
                this.$scope.show = false;
            }else{
                this.wranMessage('本项目分配的资金总额已经超过其财政预算评审报告的审定金额，请重新调整分配金额！');
            }
        } else {
            let totalAmount = 0;
            this.$scope.selectedList.forEach(data=>{
                totalAmount += parseFloat(data.amount);
            })
            if(amountSum>=totalAmount){
                this.$scope.callback({avalData: this.$scope.selectedList});
                this.$scope.list = angular.copy(this.list);
                this.$scope.show = false;
            }else{
                this.wranMessage('本项目分配的资金总额已经超过其财政预算评审报告的审定金额，请重新调整分配金额！');
            }
        }
    }

    wranMessage(content){
        this.dialogsManager.confirm({
            title: "提示",
            btn: ['','确定'],
            content: content,
            callback: () => {
                this.showAllotAmount = false;
            }
        })
    }

    clickCancel() {
        this.$scope.show = false;
    }
}

chooseAmountNumberCtrl.$inject = ['ProjectInterface', '$scope', 'dialogsManager'];

export default function chooseFundNumberDirective() {
    return {
        restrict: "AE",
        replace: true,
        template: chooseFundNumber,
        scope: {
            show: "=",
            list: '=',
            maxAmount:'=',
            currentAmount:'=',
            callback: '&'
        },
        controller: chooseAmountNumberCtrl,
        controllerAs: 'amount'
    }
}
chooseFundNumberDirective.$inject = [];
