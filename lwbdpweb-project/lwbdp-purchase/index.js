/**
 * @Author hejialin
 * @Description 描述
 */

import './styles/base.css';
import './styles/common.css';
import './styles/iconfont.css';
import './styles/list-table.css'

// 路由
import purchaseRouter from './routes'
// 控制器
import purchaseApply from './modules/apply/list/controller';
import purchaseLibrary from './modules/library/controller';
import purchaseInput from './modules/apply/input/controller';
import purchaseAuditform from './modules/apply/audit/controller';
import purchaseDraftList from './modules/draft/controller';
import purchaseAll from './modules/allunits/controller';
import purchaseSearch from './components/search/controller';
import purchaseStatisticalChart from './modules/statisticalChart/purchaseStatisticalChart';
import purchaseDeclare from './modules/declare/controller'
import purchaseDeclareDialog from './components/declareDialog/declareDialog'
import purchaseFixedAsset from './components/fixedAsset/fixedAsset'
// 服务
import purchaseService from './services/purchas.service';
import purchaseInterface from './services/purchas.interface';

import purchaseProjectDetail from './components/project/detail/controller';

import selectItem from './components/selectItem';

class purchaseCtrl{
    constructor(sidebarService,$scope,$sessionStorage){
        this.sidebarService = sidebarService;
        this.$scope = $scope;
        this.$sessionStorage = $sessionStorage;
        this.init();
    }
    init(){
        this.whiteList = ['/draft/:processConfigId/:sidebarId','/statistic/:processConfigId/:stage/:sidebarId'];
        this.getSidebarList();
    }
    // 请求侧边栏
    getSidebarList(){
        let flowStates = this.$sessionStorage.get("flowStates");
        let flowIds = null;
        if(flowStates){
            flowIds = JSON.parse(flowStates)['purchase'];
        }
        this.sidebarService.getSidebarList('purchase',flowIds,(data)=>{
            this.sidebarList = data;
        })
    }
}
purchaseCtrl.$inject=['sidebarService','$scope','$sessionStorage'];

export default angular.module('purchaseModule',[selectItem])
    .config(purchaseRouter)
    .controller('purchaseCtrl',purchaseCtrl)
    .controller('purchaseApplyCtrl',purchaseApply)
    .controller('purchaseLibraryCtrl',purchaseLibrary)
    .controller('purchaseInputCtrl',purchaseInput)
    .controller('purchaseFormCtrl',purchaseAuditform)
    .controller('purchaseDraftListCtrl',purchaseDraftList)
    .controller('purchaseAllCtrl',purchaseAll)
    .controller('purchaseSearchCtrl', purchaseSearch)
    .controller('purchaseStatisticalChartCtrl', purchaseStatisticalChart)
    .controller('purchaseDeclareCtrl', purchaseDeclare)
    .controller('purchaseDeclareDialogCtrl', purchaseDeclareDialog)
    .controller('purchaseFixedAssetCtrl', purchaseFixedAsset)
    .service('purchaseService',purchaseService)
    .service('purchaseInterface',purchaseInterface)
    .directive('purchaseProjectDetail',()=>new purchaseProjectDetail())
    .name
