export default class assetAllListCtrl {
    constructor(AssetDictionaryInterface, $stateParams, dialogsManager, $sessionStorage, SelectGarden, ProjectInterface, $rootScope, lwGardenService,AssetApplyService) {
        this.AssetDictionaryInterface = AssetDictionaryInterface;
        this.$stateParams = $stateParams;
        this.ProjectInterface = ProjectInterface;
        this.$rootScope = $rootScope;
        this.session = $sessionStorage;
        this.SelectGarden = SelectGarden;
        this.dialogsManager = dialogsManager;
        this.gardenService = lwGardenService;
        this.AssetApplyService = AssetApplyService;
        this.init();
    }

    init() {
        this.paramsInit();
        this.pageConfig();
        this.getVisibleGarden();
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        this.account = this.session.get('account');
        this.garden = this.session.get('currentGarden');
        this.gardenList = [this.garden];
        this.gardenIds = this.garden.gardenId;
        this.sidebar = this.$rootScope.sidebar || {id: this.$stateParams.sidebarId}; // 侧边栏ID
        this.condition = {};
        this.condition.keywords = "";
        // this.condition.accountId = this.account.accountId;
    }

    /**
     * 分页参数配置
     */
    pageConfig() {
        this.pageConfig = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList, totalItems) => {
                    this.pageList = pageList;
                    this.pageConfig.totalItems = totalItems || 0;
                });
            }
        };
    }

    /**
     * 查询分页列表
     * @param offset 从第几页开始查
     * @param size 每页查询的条数
     * @param callback 回调
     */
    getList(offset, size, callback) {
        this.ProjectInterface.getAllApplication(
            moduleAlias.ASSET,
            this.condition.accountId,
            this.condition.status,
            this.condition.stage,
            this.condition.gardenIds,
            this.condition.categoryList,
            this.condition.keywords,
            offset,
            size,
            this.condition.createTimeStart,
            this.condition.createTimeEnd,
            this.condition.applyAccount).then(res => {
            let totalItems = res.headers()['x-record-count'];
            callback(res.data, totalItems);
        });
    }


    /**
     * 查询
     */
    goSearch(event) {
         if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.keywords = this.condition.keywords;
            this.pageConfig.onChange(0,this.pageConfig.itemsPerPage);
        }
    }

    cleanKeywords(){
        this.condition.keywords = '';
        this.keywords = this.condition.keywords;
        this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
    }

    /*
     * 更多条件搜索弹窗
     * */
    getMoreSearch(allunits) {
        this.condition.keywords = '';
        this.AssetApplyService.getMoreSearch(this.condition, (data) => {
            this.condition = data;
            this.condition.keywords = '';
            // 当条件的值不为空且条件不是'关键字'时,出现小叉
            for (let key in data) {
                if (data[key] != '' && key != 'keywords') {
                    this.isShowCancel = true;
                }
            }
            this.pageConfig.onChange(0,this.pageConfig.itemsPerPage);
        },allunits,null);
    }

    /*
     * 删除搜索条件
     * */
    deleteCondition() {
        this.condition = {};
        this.isShowCancel = false;
        this.pageConfig.onChange(0,this.pageConfig.itemsPerPage);
    }

    //选择默认园区(多选)
    chooseGarden() {
        this.SelectGarden.dialog({
            ids: this.condition.gardenIds
        }, $garden => {
            if ($garden.ids && $garden.ids[0]) {
                this.condition.gardenIds = $garden.ids.toString();
                this.gardenList = $garden.gardenList;
                this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
            } else {
                this.dialogsManager.showMessage('参统学校（机关)不能为空！', {
                    className: 'warning'
                });
            }
        });
    }

    /**
     * 我参与的
     */
    getMyProject(checked){
        this.condition.accountId = checked?this.account.accountId:null;
        this.pageConfig.onChange(0,this.pageConfig.itemsPerPage);
    }
    
    /**
     * 获取用户可见园区
     */
    getVisibleGarden() {
        this.gardenService.getVisualGardenList(false, res => {
            this.visibleGardens = res.data;
            console.log(this.visibleGardens.length)
        })
    }

}
assetAllListCtrl.$inject = ['AssetDictionaryInterface', '$stateParams', 'dialogsManager', '$sessionStorage', 'SelectGarden', 'ProjectInterface', '$rootScope', 'lwGardenService','AssetApplyService']
