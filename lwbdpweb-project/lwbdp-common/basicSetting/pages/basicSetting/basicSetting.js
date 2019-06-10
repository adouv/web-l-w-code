import './basicSetting.css';
export default class basicSettingCtrl {
    constructor($state,$stateParams,$scope,$rootScope) {
        this.$state = $state;
        this.$scope = $scope;
        this.$stateParams = $stateParams;
        this.$rootScope = $rootScope;
        this.init();
    }
    init() {
        if(this.$stateParams.module){
            this.$scope.module = this.$stateParams.module;
        }
    }
    
    getModule(){
        let module = this.$stateParams.module;
    }
}
basicSettingCtrl.$inject = ['$state','$stateParams','$scope','$rootScope'];