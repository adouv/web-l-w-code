export default class queryDetailCtrl {
    constructor($state, $stateParams, BasicConfigInterface, $sce) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.BasicConfigInterface = BasicConfigInterface;
        this.$sce = $sce;
        this.init();
    }
    init() {
        this.searchNumber = this.$stateParams.number;
        this.getApprovalSheet(this.$stateParams.number);
    }
    /**
     * 
     * @param {查询编号} number 
     * @param {事件对象} event 
     */
    goSearch(number, event) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.getApprovalSheet(number);
        }
    }
    /**
     * 查询
     * @param {*查询编号} number 
     */
    getApprovalSheet(number) {
        let reg = /\S/g;
        if (number && reg.test(number)) {
            this.BasicConfigInterface.getApprovalSheet(number).then(res => {
                this.approvalSheet = this.$sce.trustAsHtml(res.data.approvalForm);;
            })
        } else {
            this.$state.go('query.home');
        }
    }
    /**
     * 清空当前编号
     */
    cleanKeywords() {
        this.searchNumber = "";
        this.$state.go('query.home');
    }
}
queryDetailCtrl.$inject = ['$state', '$stateParams', 'BasicConfigInterface', '$sce']