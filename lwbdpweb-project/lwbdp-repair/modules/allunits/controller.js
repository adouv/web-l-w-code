export default class repairAllListCtrl {
    constructor($state, $stateParams, repairInterface, $sessionStorage, SelectGarden, dialogsManager, repairListService, RepairWorkFlowInterface, $rootScope, repairDictionaryInterface, ProjectInterface,ProjectService,gardenService) {
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.$stateParams = $stateParams;
        this.repairInterface = repairInterface;
        this.session = $sessionStorage;
        this.gardenService = gardenService;
        this.SelectGarden = SelectGarden;
        this.dialogsManager = dialogsManager;
        this.repairListService = repairListService;
        this.RepairWorkFlowInterface = RepairWorkFlowInterface;
        this.repairDictionaryInterface = repairDictionaryInterface;
        this.ProjectInterface = ProjectInterface;
        this.ProjectService = ProjectService;
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
        let garden = this.garden = this.session.get('currentGarden');
        this.gardenList = [garden];
        this.gardenIds = garden.gardenId;
        this.isApply = this.getIsApply();
        this.condition = {};
        this.condition.keywords = '';
    }

    /**
     * 选择申报单位条件
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
     * 可见园区
     */
    getVisibleGarden() {
        this.gardenService.getVisualGardenList(false, res => {
            this.visibleGardens = res.data;
        })
    }
    
    /**
     * 分页参数配置
     */
    pageConfig() {
        this.pageConfig = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList, totalItems, waitdealcount, finishcount) => {
                    this.pageList = pageList;
                    this.pageConfig.totalItems = totalItems || 0;
                    this.finishcount = finishcount || 0;
                    this.waitdealcount = waitdealcount || 0;
                });
            }
        };
    }

    /**
     * 获取我的项目
     */
    getMyProject(flag){
        this.accountId = flag?this.account.accountId:null;
        this.pageConfig.onChange(0,this.pageConfig.itemsPerPage);
    }
    
    /**
     * 查询分页列表
     * @param offset 从第几页开始查
     * @param size 每页查询的条数
     * @param callback 回调
     */
    getList(offset, size, callback) {//moduleCode, status, taskKey, gardenIds, categoryList, keywords, offset, size
        this.ProjectInterface.getAllApplication(
            moduleAlias.REPAIR,
            this.accountId,
            this.projectStatus,
            this.taskKey,
            this.gardenIds,
            this.categoryIds,
            this.keywords,
            offset,
            size,
            this.condition.createTimeStart,
            this.condition.createTimeEnd,
            this.condition.applyAccount).then(res => {
            let totalItems = res.headers()['x-record-count'];
            let waitdealcount = res.headers()['waitdealcount'];
            let finishcount = res.headers()['finishcount'];
            callback(res.data, totalItems, waitdealcount, finishcount);
        });
    }

    /**
     * 搜索查询
     * @param event
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
    getMoreSearch(all) {
        this.condition.keywords = '';
        this.repairListService.getMoreSearch(this.condition, (data) => {
            this.condition = data;
            this.condition.keywords = '';
            this.keywords = '';
            // 当条件的值不为空且条件不是'关键字'时,出现小叉
            for (let key in data) {
                if (data[key] != ''&& key != 'keywords') {
                    this.isShowCancel = true;
                }
            }
            this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
        },all);
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
     * 是否是我的项目
     * @return {boolean}
     */
    getIsApply() {
        let name = this.$state.current.name.split('.')[1];
        return name == 'apply';
    }

    /**
     * 获取任务类型
     * @return {number}
     */
    getTaskType() {
        return this.isApply * 1;
    }

    /**
     * 修缮类别弹窗
     */
    showType() {
        this.isRepairTypeShow = true;
        this.list = 'repairShowList'
    }

    /**
     * 导出Excel
     */
    exportExcel() {
        this.ProjectInterface.exportExcel(
            this.$stateParams.processConfigId,
            moduleAlias.REPAIR,
            this.categoryIds,
            this.keywords,
            this.$stateParams.stage,
            this.projectStatus,
            this.taskKey,
            this.getTaskType(),
            this.taskStatus,
            this.gardenIds,
            this.getExcelCondition()
        );
    }

    /**
     * 获取excel条件
     * @return {string}
     */
    getExcelCondition() {
        let condition = '';
        if (this.categoryIds) {
            condition += "修缮类别:" + this.condition.categoryNames + "；";
        }
        if (this.projectStatusList[this.projectStatus]) {
            condition += "项目阶段:" + this.projectStatusList[this.projectStatus] + "；";
        }
        if (this.projectStatusList[this.projectStatus]) {
            condition += "项目状态:" + this.projectStatusList[this.projectStatus].itemName + "；";
        }
        if (this.taskStatusList[this.taskStatus]) {
            condition += "任务状态:" + this.taskStatusList[this.taskStatus].itemName + "；";
        }
        if (this.condition.createTimeStart && this.condition.createTimeEnd) {
            condition += "项目提交时间段:" + this.condition.createTimeStart + "-" + this.condition.createTimeEnd + "；";
        }
        if (this.keywords) {
            condition += "关键字:" + this.keywords + "；";
        }
        return condition;
    }
}
repairAllListCtrl.$inject = ['$state', '$stateParams', 'repairInterface', '$sessionStorage', 'SelectGarden', 'dialogsManager', 'repairListService', 'RepairWorkFlowInterface', '$rootScope', 'RepairDictionaryInterface', 'ProjectInterface','ProjectService','lwGardenService']
