/**
 * @Author guoyaru
 * @Description 我的预警 列表页
 */

/*
 *  在$inject中注入某个服务,在constructor中可以使用
 *  将这些服务挂载到this下
 *  经常使用的服务有
 *  $state 查看当前路由信息
 *  $stateParams 查看路由后传递的参数的信息
 *  $sessionStorage 查看本地存储 例:this.$sessionStorage.set('名称') 设置本地存储 this.$sessionStorage.get('名称') 获取本地存储
 *  logisticsInterface 调取服务,主要是调后端的接口 例:this.logisticsInterface.getList('参数').then(res=>{ console.log(res是得到的结果)})
 *  dialogsManager 吐司提示,确认/取消框提示 例:this.dialogsManager.showMessage('消息名称',{className:'消息类型'}) 消息类型有:成功success 错误error 警告warning
 * */
import './list.css'
export default class lisCtrl {
    constructor($scope, ngDialog, logisticsInterface, $sessionStorage, logisticsService, $stateParams, $state, dialogsManager,lwGardenService,SelectGarden) {
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.logisticsInterface = logisticsInterface;
        this.$sessionStorage = $sessionStorage;
        this.logisticsService = logisticsService;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.dialogsManager = dialogsManager;
        this.gardenService = lwGardenService;
        this.SelectGarden = SelectGarden;
        this.init();
    }

    init() {
        this.getVisibleGarden();
        this.initParams();
        this.pageConfig();
        this.receiveChildData();
    }

    initParams() {
        this.garden = this.$sessionStorage.get("currentGarden");
        this.account = this.$sessionStorage.get('account');
        this.condition = {};
        this.condition.sideBarCode = this.$stateParams.sideBarCode;
        this.condition.gardenIds = this.garden.gardenId;
        this.gardenList = [this.garden];
        this.isDefaultSearch = true;
    }

    // 交互规则：先从高级搜索筛选条件，再进行关键字匹配，不清空关键字；先输入关键字，后用高级筛选，则清空关键字
    receiveChildData(){
        this.$scope.$on("childCondition", (scope, data) => {
            this.condition = angular.copy(data);
            for (let key in data) {
                if (data[key] !== '' && key !== 'sideBarCode' && key !== 'keywords' && key !== 'gardenIds') {
                    this.isShowCancel = true;
                    this.isDefaultSearch = false;
                    break;
                }
            }
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
        })
    }

    /**
     * 选择默认园区(多选)
     */
    chooseGarden() {
        if(!this.onlyMine){
            this.SelectGarden.dialog({
                ids: this.condition.gardenIds
            }, $garden => {
                if ($garden.ids && $garden.ids[0]) {
                    this.condition.gardenIds = $garden.ids.toString();
                    this.gardenList = $garden.gardenList;
                    this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
                } else {
                    this.dialogsManager.showMessage('参统学校（机关)不能为空！', {
                        className: 'warning'
                    });
                }
            });
        }
    }

    /**
     * 获取用户可见园区
     */
    getVisibleGarden() {
        this.gardenService.getVisualGardenList(false, res => {
            this.visibleGardens = res.data;
        })
    }

    /**
     * 我参与的
     */
    getMyProject(checked){
        this.accountId = checked?this.account.accountId:null;
        this.paginationConf.onChange(0,this.paginationConf.itemsPerPage);
    }

    /**
     * 调取分页数据
     */
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList, totalItems, emergencyCounts, undoCounts, doneCounts) => {
                    this.pageList = pageList;
                    this.paginationConf.totalItems = totalItems || 0;
                    this.paginationConf.emergencyCounts = emergencyCounts || 0;
                    this.paginationConf.undoCounts = undoCounts || 0;
                    this.paginationConf.doneCounts = doneCounts || 0;
                })
            }
        }
    }

    getList(offset, size, callback) {
        this.logisticsInterface.getNoticeList(
                this.condition.sideBarCode,
                this.condition.type,
                this.condition.urgencyLevel,
                this.condition.gardenIds,
                this.condition.publishStatus,
                this.condition.startTime,
                this.condition.endTime,
                null,
                this.condition.keywords,
                this.condition.gardenName,
                this.accountId,
                this.condition.dealStatus,
                this.condition.accountName,
                offset,
                size)
            .then(res => {
                let totalItems = res.headers()['x-record-count'];
                let emergencyCounts = res.headers()['emergency-counts'];
                let undoCounts = res.headers()['undo-counts'];
                let doneCounts = res.headers()['done-counts'];
                callback(res.data, totalItems, emergencyCounts, undoCounts, doneCounts)
            });
    }

    getMoreSearch() {
        this.ngDialog.open({
            closeByDocument: false,
            className: 'bdp layer_fixed',
            template: require('../../../../components/search/search.html'),
            plain: true,
            controller: 'moreSearchCtrl',
            controllerAs: 'moreSearch',
            scope: this.$scope,
            onOpenCallback: () => {
                this.condition.keywords = '';
                this.$scope.$broadcast("parentCondition", this.condition);
            }
        })
    }

    /**
     * 查询数据方法
     */
    goSearch(event) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
        }
        this.isDefaultSearch = false;
    }

    /*
     * 删除搜索条件
     * */
    deleteCondition() {
        this.condition = {};
        this.condition.sideBarCode = this.$stateParams.sideBarCode;
        this.isShowCancel = false;
        this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
    }

    /**
     * 发布跳转
     */
    publishNotice(id) {
        this.$state.go("logistics.warn.publishAdd",{id:id,sideBarCode:this.$stateParams.sideBarCode});
    }

    /**
     * 撤回发布的通知
     */
    recallNotice(noticeId, $event) {
        $event.stopPropagation();
        this.dialogsManager.confirm({
            title: '撤回提示',
            btn: ['是','否'],
            callback:[()=>{
                this.logisticsInterface.recallNotice(noticeId).then(res => {
                    this.dialogsManager.showMessage("撤回成功", {
                        className: 'success'
                    });
                    this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
                })
            }]
        });

    }

    deleteNotice(noticeId,$event){
        $event.stopPropagation();
        this.dialogsManager.confirm({
            title: '删除提示',
            content: '确定要删除此通知吗?',
            btn: ['是','否'],
            callback:[()=>{
                this.logisticsInterface.deleteNotice(noticeId).then(res => {
                    this.dialogsManager.showMessage("删除成功", {
                        className: 'success'
                    });
                    this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
                });
            }]
        });

    }

    clearKeywords(){
        this.condition.keywords = '';
        this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
    }

    toChartList(){
        this.$state.go("logistics.warn.allStatistic",{sideBarCode:this.$stateParams.sideBarCode});
    }
}
lisCtrl.$inject = ['$scope', 'ngDialog', 'logisticsInterface', '$sessionStorage', 'logisticsService', '$stateParams', '$state', 'dialogsManager','lwGardenService','SelectGarden'];
