/**
 * Created by xuhongbo on 2017/05/17.
 * @description 修缮项目的路由表.
 */
export default function routes($stateProvider) {
    $stateProvider
        .state('purchase', {
            url: '/purchase',
            template: require('./index.html'),
            controller: 'purchaseCtrl',
            controllerAs: 'purchase'
        })
        .state('purchase.apply', {
            url: '/apply/:processConfigId/:stage',
            template: require('./modules/apply/list/list.html'),
            controller: 'purchaseApplyCtrl',
            controllerAs: 'purchaseApply'
        })
        .state('purchase.audit', {
            url: '/audit/:processConfigId/:stage',
            template: require('./modules/apply/list/list.html'),
            controller: 'purchaseApplyCtrl',
            controllerAs: 'purchaseApply'
        })
        .state('purchase.library', {
            url: '/library/:processConfigId/:stage',
            template: require('./modules/library/list.html'),
            controller: 'purchaseLibraryCtrl',
            controllerAs: 'purchaseLibrary'
        })
        .state('purchase.input', {
            url: '/input/:processConfigId/:sidebarId',
            template: require('./modules/apply/input/input.html'),
            controller: 'purchaseInputCtrl',
            controllerAs: 'purchaseInput'
        })
        .state('purchase.edit', {
            url: '/edit/:id/:sidebarId',
            template: require('./modules/apply/input/input.html'),
            controller: 'purchaseInputCtrl',
            controllerAs: 'purchaseInput'
        })
        .state('purchase.fromEdit', {
            url: '/fromEdit/:id/:sidebarId',
            template: require('./modules/apply/input/input.html'),
            controller: 'purchaseInputCtrl',
            controllerAs: 'purchaseInput'
        })
        .state('purchase.form', {
            url: '/form/:taskId/:id/:sidebarId',
            template: require('./modules/apply/audit/audit.html'),
            controller: 'purchaseFormCtrl',
            controllerAs: "purchaseForm"
        })
        .state('purchase.detail', {
            url: '/detail/:taskId/:id/:sidebarId',
            template: require('./modules/apply/audit/audit.html'),
            controller: 'purchaseFormCtrl',
            controllerAs: "purchaseForm"
        })
        .state('purchase.draft', {
            url: '/draft/:processConfigId/:sidebarId',
            template: require('./modules/draft/draft.html'),
            controller: 'purchaseDraftListCtrl',
            controllerAs: "purchaseDraftList"
        })
        .state('purchase.all', {
            url: '/all',
            template: require('./modules/allunits/allunits.html'),
            controller: 'purchaseAllCtrl',
            controllerAs: "purchaseAll"
        })
        //处置统计
        .state('purchase.statistic', {
            url: '/statistic/:processConfigId/:stage/:sidebarId',
            template: require('./modules/statisticalChart/statisticalChart.html'),
            controller: 'purchaseStatisticalChartCtrl',
            controllerAs: 'purchaseStatisticalChart'
        })
        // 项目申报统计
        .state('purchase.declare', {
            url: '/declare/:processConfigId/:sidebarId',
            template: require('./modules/declare/declare.html'),
            controller: 'purchaseDeclareCtrl',
            controllerAs: 'purchaseDeclare'
        })
}
routes.$inject = ['$stateProvider'];
