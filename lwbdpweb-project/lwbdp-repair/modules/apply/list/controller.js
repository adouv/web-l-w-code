export default class repairApplyListCtrl {
    constructor($state, $stateParams, repairInterface, $sessionStorage, SelectGarden, dialogsManager, repairListService, RepairWorkFlowInterface, $rootScope, repairDictionaryInterface, ProjectInterface) {
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.$stateParams = $stateParams;
        this.repairInterface = repairInterface;
        this.session = $sessionStorage;
        this.SelectGarden = SelectGarden;
        this.dialogsManager = dialogsManager;
        this.repairListService = repairListService;
        this.RepairWorkFlowInterface = RepairWorkFlowInterface;
        this.repairDictionaryInterface = repairDictionaryInterface;
        this.ProjectInterface = ProjectInterface;
        this.init();
    }
    
    init() {
        this.paramsInit();
        this.pageConfig();
        this.getStageName();
    }

    /**
     * 参数初始化
     */
    paramsInit(){
        this.account = this.session.get('account');
        this.garden = this.session.get('currentGarden');
        this.isApply = this.getIsApply();
        this.condition = {};
        this.condition.keywords = '';
        // 流程配置Id
        this.processConfigId = this.$stateParams.processConfigId;
    }

    /**
     * 获取项目阶段
     */
    getStageName() {
        this.ProjectInterface.getStageName(this.$stateParams.stage).then(res => {
            this.stageOrder = res.data.stageOrder;
            this.stageName = res.data.stageName;
        })
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
                this.gardenName = $garden.gardenList;
                this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
            } else {
                this.dialogsManager.showMessage('参统学校（机关)不能为空！', {
                    className: 'warning'
                });
            }
        });
    }
    
    /**
     * 分页参数配置
     */
    pageConfig() {
        this.pageConfig = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList, totalItems, waitdealcount, finishcount) => {
                    this.pageList = pageList;
                    this.pageConfig.totalItems = totalItems||0;
                    this.finishcount = finishcount||0;
                    this.waitdealcount = waitdealcount||0;
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
        this.ProjectInterface.getApplication(
            moduleAlias.REPAIR,
            this.$stateParams.processConfigId,
            this.condition.status,
            this.$stateParams.stage,
            this.getTaskType(),
            this.condition.stage,
            null,
            this.condition.gardenIds,
            this.condition.categoryList,
            this.condition.keywords,
            this.condition.applyAccount,
            offset, size,
            null,null,
            this.condition.createTimeStart,
            this.condition.createTimeEnd,
            this.condition.taskTimeStart,
            this.condition.taskTimeEnd
        ).then(res => {
            let totalItems = res.headers()['x-record-count'];
            let waitdealcount = res.headers()['waitdealcount'];
            let finishcount = res.headers()['finishcount'];
            callback(res.data, totalItems, waitdealcount, finishcount);
        });
    }

    goDetail(id,projectStatus,taskStatus){
        if(projectStatus===0&&taskStatus===0){
            this.$state.go('repair.form',{id:id,sidebarId:this.$rootScope.sidebar.id});
        }else{
            this.$state.go('repair.detail',{id:id,sidebarId:this.$rootScope.sidebar.id});
        }
    }
    
    /*
     * 更多条件搜索弹窗
     * */
    getMoreSearch() {
        this.condition.keywords = '';
        this.repairListService.getMoreSearch(this.condition, (data) => {
            this.condition = data;
            this.keywords = null;
            this.condition.keywords = '';
            // 当条件的值不为空且条件不是'关键字'时,出现小叉
            for (let key in data) {
                if (data[key] != ''&& key != 'keywords') {
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
     * 搜索查询 
     * condition = {
     *     keywords:keywords,
     *     taskStatus:taskStatus,
     *     categoryIds:categoryIds,
     *     projectStage:projectStage,
     *     projectStatus:projectStatus
     * }
     * @param event
     */
    goSearch(event) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.keywords = this.condition.keywords;
            this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
        }
    }

    cleanKeywords(){
        this.condition.keywords = ''
        this.keywords = this.condition.keywords;
        this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
    }


    /**
     * 是否是我的项目
     * @return {boolean}
     */
    getIsApply(){
        let name = this.$state.current.name.split('.')[1];
        return name == 'apply';
    }
    
    /**
     * 获取任务类型
     * @return {number}
     */
    getTaskType(){
        return this.isApply*1;
    }

    /**
     * 导出Excel
     */
    exportExcel() {
        this.ProjectInterface.exportExcel(
            moduleAlias.REPAIR,
            this.$stateParams.processConfigId,
            this.condition.categoryList,
            this.keywords,
            this.$stateParams.stage,
            this.condition.status,
            this.condition.stage,
            this.getTaskType(),
            this.taskStatus,
            this.condition.gardenIds,
            this.getExcelCondition()
        );
    }

    /**
     * 获取excel条件
     * @return {string}
     */
    getExcelCondition(){
        let condition = '';
        if (this.condition.gardenList && this.condition.gardenList.length > 0) {
            let name = "";
            this.condition.gardenList.forEach(v => {
                console.log(v);
                name += v.name + "；";
            });
            condition += "项目申报单位:" + name;
        }
        if (this.condition.categoryListName) {
            condition += "项目所属类别:" + this.condition.categoryListName + "；";
        }
        if (this.condition.stageName) {
            condition += "项目所处阶段:" + this.condition.stageName + "；";
        }
        if (this.condition.statusName) {
            condition += "项目所处状态:" + this.condition.statusName + "；";
        }
        if (this.condition.applyAccount) {
            condition += "项目申报人:" + this.condition.applyAccount + "；";
        }
        if (this.condition.createTimeStart && this.condition.createTimeEnd) {
            condition += "项目提交时间段:" + this.condition.createTimeStart + "-" + this.condition.createTimeEnd + "；";
        }
        if (this.condition.taskTimeStart && this.condition.taskTimeEnd) {
            condition += "任务生成时间段:" + this.condition.taskTimeStart + "-" + this.condition.taskTimeEnd + "；";
        }
        if (this.keywords) {
            condition += "关键字:" + this.keywords + "；";
        }
        return condition;
    }

}
repairApplyListCtrl.$inject = ['$state', '$stateParams', 'repairInterface', '$sessionStorage', 'SelectGarden', 'dialogsManager', 'repairListService', 'RepairWorkFlowInterface', '$rootScope', 'RepairDictionaryInterface', 'ProjectInterface']