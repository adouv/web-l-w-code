/**
 * @Author hejialin
 * @Description 项目库控制器
 */
export default class libraryCtrl {
    constructor(repairListService, $stateParams, $sessionStorage, ProjectInterface, repairDictionaryInterface, ngDialog,$rootScope,$state,gardenService,SelectGarden,dialogsManager) {
        this.$sessionStorage = $sessionStorage;
        this.gardenService = gardenService;
        this.repairListService = repairListService;
        this.repairDictionaryInterface = repairDictionaryInterface;
        this.ProjectInterface = ProjectInterface;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.SelectGarden = SelectGarden;
        this.dialogsManager = dialogsManager;
        this.ngDialog = ngDialog;
        this.$rootScope = $rootScope;
        this.init();
    }

    init() {
        // 当前路由
        this.getStageName();
        this.pageInit();
        this.paramsInit();
        this.getVisibleGarden();
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        this.garden = this.$sessionStorage.get('currentGarden');
        this.gardenList = [this.garden];
        this.condition = {};
        this.condition.keywords = '';
        this.sidebar=this.$rootScope.sidebar;
        this.processConfigId = this.$stateParams.processConfigId;
        this.stage = this.$stateParams.stage;
    }

    goDetail(id){
        this.$state.go('repair.detail',{id:id,sidebarId:this.$rootScope.sidebar.id});
    }
    
    /**
     * 分页初始化
     */
    pageInit() {
        this.pageConfig = {
            onChange: (offset, size) => {
                this.getPageList(offset, size, (data, count) => {
                    this.pageList = data;
                    this.pageConfig.totalItems = count;
                });
            }
        };
    }

    /**
     * 获取侧边阶段的名称
     */
    getStageName() {
        this.ProjectInterface.getStageName(this.$stateParams.stage).then(res => {
            this.stageName = res.data.stageName;
        })
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
     * 获取分页列表数据
     * @param offset
     * @param size
     * @param callback
     */
    //moduleCode, processConfigId, projectStatus, stage, taskKey, gardenIds, categoryList, keywords, offset, size , accountId,applyYearStart,applyYearEnd,stageCompleteStart,stageCompleteEnd
    getPageList(offset, size, callback) {
        this.ProjectInterface.getProjectLibrary(
            moduleAlias.REPAIR,
            this.$stateParams.processConfigId,
            this.condition.status,
            this.$stateParams.stage,
            this.condition.stage,
            this.condition.gardenIds,
            this.condition.categoryList,
            this.condition.keywords,
            offset, size,this.accountId,
            null,null,this.condition.stageCompleteStart,
            this.condition.stageCompleteEnd,
            this.condition.createTimeStart,
            this.condition.createTimeEnd)
            .then(res => {
                let totalItems = res.headers()['x-record-count'];
                callback & callback(res.data,totalItems);
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
                    this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
                } else {
                    this.dialogsManager.showMessage('参统学校（机关)不能为空！', {
                        className: 'warning'
                    });
                }
            });
        }
    }
    
    /**
     * 我参与的
     */
    getMyProject(checked){
        this.accountId = checked?this.$sessionStorage.get('account').accountId:null;
        this.pageConfig.onChange(0,this.pageConfig.itemsPerPage);
    }
    
    /*
     * 更多条件搜索弹窗
     * */
    getMoreSearch() {
        this.condition.keywords = '';
        this.repairListService.getMoreSearch(this.condition, (data) => {
            console.log(data)
            this.condition = data;
            this.condition.keywords = '';
            this.keywords = '';
            // 当条件的值不为空且条件不是'关键字'时,出现小叉
            for (let key in data) {
                if (data[key] != '' && key != 'keywords') {
                    this.isShowCancel = true;
                }
            }
            this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
        },null,this.stageName);
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
     * 打开类型弹窗
     */
    openTypeDialog() {
        this.ngDialog.open({
            closeByDocument: false,
            className: 'lw-select-garden',
            template: `<div></div>`,
            controller: '',
            plain: true
        });
    }

    /**
     * 导出excel
     */
    exportExcel() {
        this.ProjectInterface.exportLibraryExcel(
            moduleAlias.REPAIR,
            this.$stateParams.processConfigId,
            this.condition.categoryList,
            this.keywords,
            this.$stateParams.stage,
            this.condition.status,
            this.condition.stage,
            this.taskStatus,
            this.condition.gardenIds,
            this.getExcelCondition()
        )
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
        if (this.condition.stageCompleteStart && this.condition.stageCompleteEnd) {
            condition += this.stageName+"完成时间段:" + this.condition.stageCompleteStart + "-" + this.condition.stageCompleteEnd + "；";
        }
        if (this.keywords) {
            condition += "关键字:" + this.keywords + "；";
        }
        return condition;
    }
}
libraryCtrl.$inject = ['repairListService', '$stateParams', '$sessionStorage', 'ProjectInterface', 'RepairDictionaryInterface', 'ngDialog','$rootScope','$state','lwGardenService','SelectGarden','dialogsManager'];
