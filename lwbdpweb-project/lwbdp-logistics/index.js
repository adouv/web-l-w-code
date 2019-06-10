/**
 * @Author guoyaru
 * @Description 后勤运维模块项目入口
 */

// 导入css
import './styles/base.css'
import './styles/common.css'
import './styles/iconfont.css'
import './styles/warnDetail.css'
// 导入路由
import logisticsRouter from './routes'
// 导入服务
import logisticsInterface from  './services/logistics.interface'
import logisticsPurchaseInterface from  './services/logistics.purchase.interface'
import logisticsSupplierPactInterface from  './services/logistics.supplier.pact.interface'
import logisticsService from  './services/logistics.service'
import baseInfoInterface from './services/base.info.interface'
import baseInfoReadInterface from './services/base.info.read.interface'
import logisticsOnlineRepairInterface from './services/logistics.online.repair.interface'
// 导入控制器
import myWarnListCtrl from './modules/earlyWarn/myWarn/list/controller'
import myWarnDetailCtrl from './modules/earlyWarn/myWarn/detail/controller'
import myPublishAddCtrl from './modules/earlyWarn/myPublish/add/controller'
import myPublishDetailCtrl from './modules/earlyWarn/myPublish/detail/controller'
import allPublishStatisticsCtrl from './modules/earlyWarn/allPublish/statistic/controller'
import basicListCtrl from './modules/basicMessage/list/controller'
import basicDetailCtrl from './modules/basicMessage/detail/controller'
import canteenListCtrl from './modules/canteenManager/list/controller'
import canteenContractInputCtrl from './modules/canteenManager/input/contract/controller'
import canteenContractDetailCtrl from './modules/canteenManager/detail/contract/controller'
import canteenOrderInputCtrl from './modules/canteenManager/input/order/controller'
import canteenOrderDetailCtrl from './modules/canteenManager/detail/order/controller'
import onlineRepairCtrl from './modules/onlineRepair/controller'
// 弹窗控制器
import moreSearchCtrl from './components/search/search'
import moveMoreSearchCtrl from './components/moveSearch/moveSearch'
import canteenSearchCtrl from './components/canteenSearch/canteenSearch'
import secondPartyCtr from './components/canteenSearch/secondParty'
import addBasicCtrl from './components/addBasic/addBasic'
import supplierCtrl from './components/supplier/supplier'

class logisticsCtrl{
    constructor(sidebarService,$scope){
        this.sidebarService = sidebarService;
        this.$scope = $scope;
        this.init();
    }
    init(){
        this.whiteList = ['/draft/:processConfigId/:sidebarId','/contract/:sidebarId','/statistic/:processConfigId/:stage/:sidebarId'];
        this.getSidebarList();
    }
    // 请求侧边栏
    getSidebarList(){
        this.sidebarService.getSidebarList('logistics',null,(data)=>{
            this.sidebarList = data;
        })
    }
}
logisticsCtrl.$inject=['sidebarService','$scope'];

export default angular.module('logisticsModule',[])
    .config(logisticsRouter)
    .controller('logisticsCtrl',logisticsCtrl)
    .service('logisticsInterface',logisticsInterface)
    .service('logisticsPurchaseInterface',logisticsPurchaseInterface)
    .service('logisticsSupplierPactInterface',logisticsSupplierPactInterface)
    .service('baseInfoInterface',baseInfoInterface)
    .service('baseInfoReadInterface',baseInfoReadInterface)
    .service('logisticsService',logisticsService)
    .service('logisticsOnlineRepairInterface',logisticsOnlineRepairInterface)
    .controller('myWarnListCtrl',myWarnListCtrl)
    .controller('myWarnDetailCtrl',myWarnDetailCtrl)
    .controller('myPublishAddCtrl',myPublishAddCtrl)
    .controller('myPublishDetailCtrl',myPublishDetailCtrl)
    .controller('allPublishStatisticsCtrl',allPublishStatisticsCtrl)
    .controller('basicListCtrl',basicListCtrl)
    .controller('basicDetailCtrl',basicDetailCtrl)
    .controller('canteenListCtrl',canteenListCtrl)
    .controller('canteenContractInputCtrl',canteenContractInputCtrl)
    .controller('canteenContractDetailCtrl',canteenContractDetailCtrl)
    .controller('canteenOrderInputCtrl',canteenOrderInputCtrl)
    .controller('canteenOrderDetailCtrl',canteenOrderDetailCtrl)
    .controller('moreSearchCtrl',moreSearchCtrl)
    .controller('moveMoreSearchCtrl',moveMoreSearchCtrl)
    .controller('canteenSearchCtrl',canteenSearchCtrl)
    .controller('secondPartyCtr',secondPartyCtr)
    .controller('addBasicCtrl',addBasicCtrl)
    .controller('onlineRepairCtrl',onlineRepairCtrl)
    .controller('supplierCtrl',supplierCtrl)
    .name
