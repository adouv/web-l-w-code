export default class assetApplyListCtrl {
    constructor($state, AssetDictionaryInterface, $stateParams, dialogsManager, $sessionStorage, SelectGarden, ProjectInterface, $rootScope, lwGardenService, AssetApplyService) {
        this.$state = $state;
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
        this.isApply = this.getIsApply();
        this.gardenList = [this.garden];
        this.processConfigId = this.$stateParams.processConfigId;
        this.sidebar = this.$rootScope.sidebar || {
            id: this.$stateParams.sidebarId
        }; // 侧边栏ID
        this.condition = {};
        this.condition.keywords = "";
    }

    /**
     * 分页参数配置
     */
    pageConfig() {
        this.pageConfig = {
            onChange: (offset, size) => {
                this.offset = offset;
                this.size = size;
                this.getList(offset, size, (pageList, totalItems) => {
                    this.pageList = pageList;
                    this.pageConfig.totalItems = totalItems || 0;
                });
            }
        };
    }

    goDetail(projectStatus, taskStatus, id) {
        if (taskStatus === 0 && projectStatus === 0) {
            this.$state.go('asset.form', {id: id, sidebarId: this.$rootScope.sidebar.id});
        } else {
            this.$state.go('asset.detail', {id: id, sidebarId: this.$rootScope.sidebar.id});
        }
    }

    /*
     * 更多条件搜索弹窗 
     * */
    getMoreSearch() {
        this.condition.keywords = "";
        this.keywords = ""
        this.AssetApplyService.getMoreSearch(this.condition, (data) => {
            this.condition = data;
            // 当条件的值不为空且条件不是'关键字'时,出现小叉
            for (let key in data) {
                if (data[key] != '' && key != 'keywords') {
                    this.isShowCancel = true;
                }
            }
            this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
        });
    }

    /*
     * 删除搜索条件
     * */
    deleteCondition() {
        this.condition = {};
        this.isShowCancel = false;
        this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
    }

    /**
     * 查询分页列表
     * @param offset 从第几页开始查
     * @param size 每页查询的条数
     * @param callback 回调
     */
    getList(offset, size, callback) {
        this.ProjectInterface.getApplication(
            moduleAlias.ASSET,
            this.$stateParams.processConfigId,
            this.condition.status,
            this.$stateParams.stage,
            this.getTaskType(),
            this.condition.stage,
            null,
            this.condition.gardenIds,
            this.condition.categoryList,
            this.keywords,
            null,
            offset, size,
            null, null,
            this.condition.createTimeStart,
            this.condition.createTimeEnd,
            this.condition.taskTimeStart,
            this.condition.taskTimeEnd
        ).then(res => {
            let totalItems = res.headers()['x-record-count'];
            callback(res.data, totalItems);
        });
    }

    /**
     * 获取任务类型
     * @return {number}
     */
    getTaskType() {
        return this.isApply * 1;
    }

    /**
     * 获取任务类型是否是申请
     * @return {boolean}
     */
    getIsApply() {
        let type = this.$state.current.name.split('.')[1];
        return type == 'apply';
    }

    /**
     * 查询
     * @param event
     */
    goSearch(event) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.keywords = this.condition.keywords;
            this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
        }
    }

    cleanKeywords(){
        this.condition.keywords = '';
        this.keywords = this.condition.keywords;
        this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
    }

    /**
     * 选择默认园区(多选)
     */
    chooseGarden() {
        this.SelectGarden.dialog({
            ids: this.gardenIds
        }, $garden => {
            if ($garden.ids && $garden.ids[0]) {
                this.gardenIds = $garden.ids.toString();
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
     * 获取用户可见园区
     */
    getVisibleGarden() {
        this.gardenService.getVisualGardenList(false, res => {
            this.visibleGardens = res.data;
        })
    }
}
assetApplyListCtrl.$inject = ['$state', 'AssetDictionaryInterface', '$stateParams', 'dialogsManager', '$sessionStorage', 'SelectGarden', 'ProjectInterface', '$rootScope', 'lwGardenService', 'AssetApplyService']