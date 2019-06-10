/**
 * Created by xuhongbo on 2017/05/17.
 * @description 修缮项目的主入口.
 */

import './styles/base.css';
import './styles/common.css';
import './styles/iconfont.css';
import './styles/list-table.css';
import  './styles/addProjectMaterial.css'

//引入主依赖
import repairRouter from './routes';

//引入指令
import dynamic from './components/dynamicDOM/dynamic.directive'

// 引入服务
import repairInterface from './services/repair.interface'
import repairService from './services/repair.service';
import repairListService from './services/repair.list.service';
//引入控制器
import applyListCtrl from './modules/apply/list/controller'
import draftListCtrl from './modules/draft/controller'
import allListCtrl from './modules/allunits/controller'
import repairSearchCtrl from './components/search/controller'
//弹窗模块引入
import showDialog from './components/showDialog/index'

//我的项目--草稿箱
import repairInputCtrl from './modules/apply/input/controller';
import repairFormCtrl from './modules/apply/audit/controller';
import {statusPosition,backToTop} from './components/position/position';
// 图表统计
import statisticalChart from'./modules/statisticalChart/statisticalChart';

import RepairWorkFlowInterface from './services/repair.workflow.interface';
import RepairDictionaryInterface from './services/repair.dictionary.interface';
import libraryCtrl from './modules/library/controller'
import repairProjectDetail from './components/order/controller';
import autoScroll from './directive/autoScroll';
class repairCtrl{
    constructor(sidebarService, $scope, $sessionStorage){
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
            flowIds = JSON.parse(flowStates)['repair'];
        }
        this.sidebarService.getSidebarList('repair',flowIds,(data)=>{
            this.sidebarList = data;
        })
    }
}
repairCtrl.$inject=['sidebarService','$scope','$sessionStorage'];
export default angular.module('repairModule', [showDialog])
    .config(repairRouter)
    .controller('repairCtrl', repairCtrl)
    .controller('libraryCtrl', libraryCtrl)
    .controller('repairApplyListCtrl', applyListCtrl)
    .controller('repairAllListCtrl', allListCtrl)
    .controller('repairDraftListCtrl', draftListCtrl)
    .controller('repairInputCtrl', repairInputCtrl)
    .controller('repairFormCtrl', repairFormCtrl)
    .controller('statisticalChartCtrl', statisticalChart)
    .controller('repairSearchCtrl', repairSearchCtrl)
    .directive('dynamic', dynamic)
    .directive('statusPosition', ()=>new statusPosition())
    .directive('backToTop', ()=>new backToTop())
    .directive('autoScroll', ()=>new autoScroll())
    .directive('repairProjectDetail', ()=>new repairProjectDetail())
    .service('repairService', repairService)
    .service('repairInterface', repairInterface)
    .service('repairListService', repairListService)
    .service('RepairWorkFlowInterface', RepairWorkFlowInterface)
    .service('RepairDictionaryInterface', RepairDictionaryInterface)
    .name
