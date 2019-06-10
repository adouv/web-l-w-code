export default class repairDraftListCtrl {
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

    init(){
        this.paramsInit();
        this.pageConfig();
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        this.account = this.session.get('account');
        this.garden = this.session.get('currentGarden');
        this.gardenIds = this.garden.gardenId;
        this.processConfigId = this.$stateParams.processConfigId;
        this.checkedIds = [];
        this.condition = {};
        // this.condition.categoryIds = [];
        // this.condition.categoryNames = [];
        this.sidebar = this.$rootScope.sidebar || {id: this.$stateParams.sidebarId}; // 侧边栏ID
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
     * 分页参数配置
     */
    pageConfig() {
        this.pageConfig = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList, totalItems) => {
                    this.pageList = pageList;
                    this.pageConfig.totalItems = totalItems;
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
        this.ProjectInterface.getDraftList(
            moduleAlias.REPAIR,
            this.$stateParams.processConfigId,
            this.categoryIds,
            this.keywords,
            offset, size).then(res => {
            let totalItems = res.headers()['x-record-count'];
            callback(res.data, totalItems);
        });
    }
    
    /**
     * 搜索查询
     * @param event
     */
    goSearch(event) {
        if(!event ||event.charCode === 13 || event.keyCode === 13 || event.which === 13){
            this.categoryIds = this.condition.categoryIds;
            this.categoryNames = this.condition.categoryNames;
            this.keywords = this.condition.keywords;
            this.pageConfig.onChange(0,this.pageConfig.itemsPerPage);
        }
    }

    cleanKeywords(){
        this.condition.keywords = '';
        this.keywords = this.condition.keywords;
        this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
    }
    
    /**
     * 删除所有处于草稿状态的所有的申请单
     */
    deleteAllDraft() {
        if (this.pageList.length !== 0) {
            this.dialogsManager.confirm({
                title: '提示',
                content: '删除后将不可恢复，是否继续?',
                callback: () => {
                    this.cleanDraft();
                }
            });
        }
    }

    /**
     * 清空草稿
     */
    cleanDraft(){
        this.ProjectInterface.deleteAllDraft(moduleAlias.REPAIR).then(res => {
            this.dialogsManager.showMessage('操作成功', {className: 'success'});
            this.checkedIds = [];
            this.pageConfig.onChange(0,this.pageConfig.itemsPerPage);
        })
    }

    /**
     * 全选所有的复选框
     * @param $event
     */
    allChecked($event) {
        this.checkedIds = [];
        if ($event.target.checked) {
            for (let item of this.pageList) {
                this.checkedIds.push(item.projectId);
            }
        }
    }

    // 组织默认事件
    checked(e, id) {
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        let isChecked = e.target.checked;
        let idx = this.checkedIds.indexOf(id);
        if (isChecked && idx == -1) {
            this.checkedIds.push(id);
        }else if (!isChecked && idx != -1) {
            this.checkedIds.splice(idx, 1);
        }
    }

    /**
     * 删除选中的草稿
     */
    deleteCheckedDraft() {
        if (this.checkedIds.length>0) {
            this.dialogsManager.confirm({
                title: '删除提示',
                content: '确定要删除下部所有选中项吗',
                callback: () => {
                    this.ProjectInterface.deleteDraft(
                        moduleAlias.REPAIR,
                        this.checkedIds.toString()
                    ).then(res => {
                        this.checkedIds = [];
                        this.dialogsManager.showMessage('操作成功', {
                            className: 'success'
                        });
                        this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
                    });
                }
            });
        }
    }

    goBack(){
        history.back();
    }
    
    /**
     * 导出Excel
     */
    exportExcel() {
        this.repairInterface.exportExcel({
            stage: this.stage,
            repository: this.repository,
            taskType: this.taskType,
            taskStatus: this.appData.taskSta,
            projectStatus: this.appData.proSta,
            node: this.appData.proNode,
            type: this.appData.type,
            keyWord: this.appData.keywords,
            gardenIds: this.gardenIds,
            onlyMine: this.onlyMine,
            condition: condition
        });
    }

    /**
     * 获取excel携带条件
     * @return {string}
     */
    getExcelCondition() {
        let condition = '';
        if (this.appData.sortName) {
            condition += "修缮类别:" + this.appData.sortName + "；";
        }
        if (this.proNodes[this.appData.proNode]) {
            condition += "项目阶段:" + this.proNodes[this.appData.proNode] + "；";
        }
        if (this.proStas.data[this.appData.proSta]) {
            condition += "项目状态:" + this.proStas.data[this.appData.proSta].itemName + "；";
        }
        if (this.taskDisStas.data[this.appData.taskSta]) {
            condition += "任务状态:" + this.taskDisStas.data[this.appData.taskSta].itemName + "；";
        }
        if (this.appData.keywords) {
            condition += "关键字:" + this.appData.keywords + "；";
        }
        return condition;
    }
    
}
repairDraftListCtrl.$inject = ['$state', '$stateParams', 'repairInterface', '$sessionStorage', 'SelectGarden', 'dialogsManager', 'repairListService', 'RepairWorkFlowInterface', '$rootScope', 'RepairDictionaryInterface', 'ProjectInterface']