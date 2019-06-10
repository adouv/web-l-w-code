/**
 * @Author hejialin
 * @Description 修缮列表页服务（公共代码）
 */
export default class repairListService{
    constructor($rootScope,ngDialog){
        this.$rootScope = $rootScope;
        this.ngDialog = ngDialog
    }
    /*
     * 更多条件搜索弹窗
     * */
    getMoreSearch(condition,callback,allunits,isLibrary){
        let scope = this.$rootScope.$new();
        scope.callback = callback;
        scope.condition = condition;
        scope.isAllunits = allunits;
        scope.isLibrary = isLibrary;
        this.ngDialog.open({
            closeByDocument: false,
            className: 'bdp layer_fixed',
            template: require('../components/search/search.html'),
            plain: true,
            controller: 'repairSearchCtrl',
            controllerAs: 'repairSearch',
            scope:scope
        })
    }
}
repairListService.$inject = ['$rootScope','ngDialog'];
