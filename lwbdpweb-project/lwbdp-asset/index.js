import './styles/base.css';
import './styles/common.css';
import './styles/iconfont.css';
import './styles/home.css';
import './modules/apply/input/input.css';
import './styles/list-table.css';

// 主依赖
import routing from './routes';
// 对调取接口的封装
import AssetDictionaryInterface from './services/asset.dictionary.interface';
import AssetInterface from './services/asset.interface';
import AssetLibraryInterface from './services/asset.library.interface';
// 服务
import ApplyService from './services/asset.apply.service'
// 指令
import select from './components/select/select.directive';
import onOff from './components/onOff/onOff.directive';
import changeStatus from './components/changeStatus/changeStatus.directive';
import getDom from './components/getDom/getDom'
import selfRequire from './components/selfRequire/selfRequire.directive';

//弹窗模块引入
import showDialogModule from './components/showDialog/index';
//我的申请
import assetApplyCtrl from './modules/apply/list/controller';
import assetLibraryCtrl from './modules/library/controller';
import assetDraftCtrl from './modules/draft/controller';
import assetAllCtrl from './modules/allunits/controller';
import assetDetailCtrl from './modules/apply/audit/controller';
import { countAssetNum, assetInputCtrl } from './modules/apply/input/controller'
//处置统计
import assetStatisticCtrl from './modules/statistic/controller';

// 资产库
import basicLibraryCtrl from './modules/repository/basicLibrary';
import basicLibraryInfoCtrl from './modules/repository/info/basicLibraryInfo';

import assetProjectDetail from './components/order/directive';
import assetAuditFail from './components/audit/directive';
import assetAuditFormCtrl from './modules/apply/audit/controller';
import assetSearchCtrl from './components/search/controller';
import auditAgeLimitCtrl from './components/showDialog/yearLimit/auditAgeLimit'

class AssetController {
    constructor($state, AssetDictionaryInterface, $rootScope, dict, sidebarService, $scope, $sessionStorage) {
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.AssetDictionaryInterface = AssetDictionaryInterface;
        this.dict = dict;
        this.sidebarService = sidebarService;
        this.$scope = $scope;
        this.$sessionStorage = $sessionStorage;
        this.init();
    }
    init() {
            //请求字典
            this.AssetDictionaryInterface.getValidDisposeType().then(res => {
                this.dict.dispose = res.data;
            });
            this.whiteList = ['/draft/:processConfigId/:sidebarId', '/statistic/:processConfigId/:stage/:sidebarId', '/count/:processConfigId/:stage/:sidebarId'];
            this.getSidebarList();
        }
        // 请求侧边栏
    getSidebarList() {
        let flowStates = JSON.parse(this.$sessionStorage.get("flowStates"));
        let flowIds = null;
        if(flowStates){
            flowIds = flowStates['asset'];
        }
        this.sidebarService.getSidebarList('asset', flowIds, (data) => {
            this.sidebarList = data;
        })
    }
}
AssetController.$inject = ['$state', 'AssetDictionaryInterface', '$rootScope', 'dict', 'sidebarService', '$scope', '$sessionStorage'];

export default angular.module('AssetModule', [showDialogModule])
    .config(routing)
    .value('dict', {})
    //列表展示
    .controller('AssetController', AssetController)
    .controller('assetApplyCtrl', assetApplyCtrl)
    .controller('assetLibraryCtrl', assetLibraryCtrl)
    .controller('assetInputCtrl', assetInputCtrl)
    .controller('assetDraftCtrl', assetDraftCtrl)
    .controller('assetAllCtrl', assetAllCtrl)
    .controller('assetDetailCtrl', assetDetailCtrl)
    .controller('assetStatisticCtrl', assetStatisticCtrl)
    .controller('assetAuditFormCtrl', assetAuditFormCtrl)
    .controller('basicLibraryController', basicLibraryCtrl)
    .controller('basicLibraryInfoController', basicLibraryInfoCtrl)
    .controller('assetSearchCtrl', assetSearchCtrl)
    .service('AssetDictionaryInterface', AssetDictionaryInterface)
    .service('AssetInterface', AssetInterface)
    .service('AssetLibraryInterface', AssetLibraryInterface)
    .service('AssetApplyService', ApplyService)
    .filter('countAssetNum', countAssetNum)
    .directive('lwSelect', select)
    .directive('onOff', onOff)
    .directive('changeStatus', changeStatus)
    .directive('assetAuditFail', () => new assetAuditFail())
    .directive('selfRequire', selfRequire)
    .directive('assetProjectDetail', () => new assetProjectDetail())
    .directive('getDom', getDom)
    .name;