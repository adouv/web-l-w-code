/**
 * @Author guoyaru
 * @Description 后勤运维模块路由表
 */
export default function routes($stateProvider) {
    $stateProvider
        .state('logistics', {
            url: '/logistics', //url地址
            template: require('./index.html'), //使用的视图模版
            controller: 'logisticsCtrl', // 对应的controller
            controllerAs: 'logistics' // 为controller起的别名,在页面上使用
        })
        // 预警预报
        .state('logistics.warn', {
            url:'/warn',
            template:'<ui-view></ui-view>',
        })
        // 预警--列表页
        .state('logistics.warn.list', {
            url:'/list/:sideBarCode',
            template: require('./modules/earlyWarn/myWarn/list/list.html'),
            controller: 'myWarnListCtrl',
            controllerAs: 'myWarnList'
        })
        // 我的预警--详情
        .state('logistics.warn.mineDetail', {
            url:'/mine/detail/:sideBarCode/:id',
            template: require('./modules/earlyWarn/myWarn/detail/detail.html'),
            controller: 'myWarnDetailCtrl',
            controllerAs: 'myWarnDetail'
        })
        // 我的发布--添加
        .state('logistics.warn.publishAdd', {
            url:'/publish/add/:sideBarCode/:id',
            template: require('./modules/earlyWarn/myPublish/add/add.html'),
            controller: 'myPublishAddCtrl',
            controllerAs: 'myPublishAdd'
        })
        // 我的发布--详情
        .state('logistics.warn.publishDetail', {
            url:'/publish/detail/:sideBarCode/:id',
            template: require('./modules/earlyWarn/myPublish/detail/detail.html'),
            controller: 'myPublishDetailCtrl',
            controllerAs: 'myPublishDetail'
        })
        // 全部发布--图表统计
        .state('logistics.warn.allStatistic', {
            url:'/statistic/:sideBarCode',
            template: require('./modules/earlyWarn/allPublish/statistic/statistic.html'),
            controller: 'allPublishStatisticsCtrl',
            controllerAs: 'allPublishStatistics'
        })
        // 基本信息
        .state('logistics.basic', {
            url:'/basic/:module',
            template: require('./modules/basicMessage/list/list.html'),
            controller: 'basicListCtrl',
            controllerAs: 'basicList'
        })
        // 基本信息--详情
        .state('logistics.basicInfo', {
            url:'/basic/info/:moduleCode/:id',
            template: require('./modules/basicMessage/detail/detail.html'),
            controller: 'basicDetailCtrl',
            controllerAs: 'basicDetail'
        })
        // 基本信息--XX监测
        .state('logistics.basicMonitor', {
            url:'/basicMonitor/:monitorModule',
            template: require('./modules/basicMessage/monitor/monitor.html'),
        })
        // 食堂管理
        .state('logistics.canteen', {
            url:'/canteen',
            template: '<ui-view></ui-view>',
        })
        // 食堂管理--列表
        .state('logistics.canteen.order', {
            url:'/order/:sidebarId',
            template: require('./modules/canteenManager/list/list.html'),
            controller: 'canteenListCtrl',
            controllerAs: 'canteenList'
        })
        .state('logistics.canteen.contract', {
            url:'/contract/:sidebarId',
            template: require('./modules/canteenManager/list/list.html'),
            controller: 'canteenListCtrl',
            controllerAs: 'canteenList'
        })
        // 食堂管理--供应商合同
        .state('logistics.canteen.contractInput', {
            url:'/contract/input/:id',
            template: require('./modules/canteenManager/input/contract/input.html'),
            controller: 'canteenContractInputCtrl',
            controllerAs: 'canteenContractInput'       
          })
        // 食堂管理--供应商合同详情
        .state('logistics.canteen.contractDetail', {
            url:'/contract/detail/:id',
            template: require('./modules/canteenManager/detail/contract/detail.html'),
            controller: 'canteenContractDetailCtrl',
            controllerAs: 'canteenContractDetail'
        })
        // 食堂管理--月采购单
        .state('logistics.canteen.orderInput', {
            url:'/order/input/:id',
            template: require('./modules/canteenManager/input/order/input.html'),
            controller: 'canteenOrderInputCtrl',
            controllerAs: 'canteenOrderInput'
        })
        // 食堂管理--月采购单详情
        .state('logistics.canteen.orderDetail', {
            url:'/order/detail/:id',
            template: require('./modules/canteenManager/detail/order/detail.html'),
            controller: 'canteenOrderDetailCtrl',
            controllerAs: 'canteenOrderDetail'
        })
        // 基础运维--在线报修
        .state('logistics.onlineRepair', {
            url:'/onlineRepair',
            template: require('./modules/onlineRepair/repairIndex.html'),
            controller: 'onlineRepairCtrl',
            controllerAs: 'onlineRepair'
        })
}
routes.$inject = ['$stateProvider'];
