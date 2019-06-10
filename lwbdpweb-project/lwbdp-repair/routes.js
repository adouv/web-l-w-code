/**
 * Created by xuhongbo on 2017/05/17.
 * @description 修缮项目的路由表.
 */
export default function routes($stateProvider) {
    $stateProvider
        .state('repair', {
            url: '/repair',
            template: require('./index.html'),
            controller: 'repairCtrl',
            controllerAs: 'repair'
        })
        //项目储备-->我的申请
        .state('repair.apply', {
            url: '/apply/:processConfigId/:stage',
            template: require('./modules/apply/list/apply.html'),
            controller: 'repairApplyListCtrl',
            controllerAs: 'repairApplyList'
        })

        //项目储备-->我的审核
        .state('repair.audit', {
            url: '/audit/:processConfigId/:stage',
            template: require('./modules/apply/list/apply.html'),
            controller: 'repairApplyListCtrl',
            controllerAs: 'repairApplyList'
        })
        //项目储备-->项目储备库
        .state('repair.library', {
            url: '/library/:processConfigId/:stage',
            template: require('./modules/library/list.html'),
            controller: 'libraryCtrl',
            controllerAs: 'library'
        })
        //我的申请-->草稿箱
        .state('repair.edit', {
            url: '/edit/:id/:sidebarId',
            template: require('./modules/apply/input/input.html'),
            controller: 'repairInputCtrl',
            controllerAs: 'repairInput'
        })
        //我的申请-->草稿箱
        .state('repair.formEdit', {
            url: '/formEdit/:id/:sidebarId',
            template: require('./modules/apply/input/input.html'),
            controller: 'repairInputCtrl',
            controllerAs: 'repairInput'
        })
        //我的申请-->草稿箱
        .state('repair.draft', {
            url: '/draft/:processConfigId/:sidebarId',
            template: require('./modules/draft/draft.html'),
            controller: 'repairDraftListCtrl',
            controllerAs: 'repairDraftList'
        })
        //我的申请-->全单位所有收件箱
        .state('repair.all', {
            url: '/all',
            template: require('./modules/allunits/allunits.html'),
            controller: 'repairAllListCtrl',
            controllerAs: 'repairAllList'
        })
        //项目储备-->我的添加
        .state('repair.append', {
            url: '/append/:processConfigId/:sidebarId',
            template: require('./modules/apply/input/input.html'),
            controller: 'repairInputCtrl',
            controllerAs: 'repairInput'
        })
        .state('repair.detail', {
            url: '/detail/:id/:sidebarId',
            template: require('./modules/apply/audit/audit.html'),
            controller: 'repairFormCtrl',
            controllerAs: "repairForm"
        })
        .state('repair.form', {
            url: '/form/:id/:sidebarId',
            template: require('./modules/apply/audit/audit.html'),
            controller: 'repairFormCtrl',
            controllerAs: "repairForm"
        })
        //处置统计
        .state('repair.statistic', {
            url: '/statistic/:processConfigId/:stage/:sidebarId',
            template: require('./modules/statisticalChart/statisticalChart.html'),
            controller: 'statisticalChartCtrl',
            controllerAs: 'statisticalChart'
        })
}
routes.$inject = ['$stateProvider'];
