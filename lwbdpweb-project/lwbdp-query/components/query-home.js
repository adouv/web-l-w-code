export default class queryHomeCtrl {
    constructor($state) {
        this.$state = $state;
        this.init();
    }
    init() {}
    goSearch(event) {
        if ((!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) && this.searchNumber.length) {
            this.$state.go('query.detail', {
                number: this.searchNumber
            });
        }
    }
    getApprovalSheet() {
        let reg = /\S/g;
        if (this.searchNumber && reg.test(this.searchNumber)) {
            this.$state.go('query.detail', {
                number: this.searchNumber
            });
        }
    }
    cleanKeywords() {
        this.searchNumber = "";
    }
}
queryHomeCtrl.$inject = ['$state']