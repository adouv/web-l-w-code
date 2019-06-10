/**
 * Created by lw-yf-011 on 2017/5/13.
 */

export default class rootCtrl {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
        this.showView()
    }

    showView(){
        this.$rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            this.isShowUiView = (toState.name=='login'||toState.name=='entry');
        });
    }

}
rootCtrl.$inject = ['$rootScope'];
