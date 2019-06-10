/**
 * @Author hejialin
 * @Description 描述
 */
export default class purchaseLibraryCtrl {
    constructor($state, $stateParams, $rootScope, $sessionStorage, ProjectInterface, dialogsManager, purchaseService, purchaseInterface, SelectGarden, lwGardenService,ProjectService) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.session = $sessionStorage;
        this.$rootScope = $rootScope;
        this.ProjectInterface = ProjectInterface;
        this.dialogsManager = dialogsManager;
        this.purchaseService = purchaseService;
        this.purchaseInterface = purchaseInterface;
        this.SelectGarden = SelectGarden;
        this.gardenService = lwGardenService;
        this.ProjectService = ProjectService;
        this.init();
    }
    init() {
        this.paramInit();
        this.pageConfig();
        this.getVisibleGarden();
        this.getStageName();
    }

    /**
     * 初始化参数  
     */
    paramInit() {
        this.showSearch = false;
        this.account = this.session.get('account');
        this.garden = this.session.get('currentGarden');
        this.gardenList = [this.garden];
        // 流程配置ID
        this.processConfigId = this.$stateParams.processConfigId;
        this.stageId = this.$stateParams.stage;
        // 侧边ID
        this.sideBar = this.$rootScope.sideBar || {
            id: this.$stateParams.sideBarId
        };
        this.condition = {};
        this.stage = {};
        this.condition.keywords = "";
    }

    /**
     * 查询分页数据
     */
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList, totalItems,passCount,notPassCount,ingCount) => {
                    this.pageList = pageList;
                    this.paginationConf.totalItems = totalItems || 0;
                    this.stage.passCount = passCount || 0;
                    this.stage.notPassCount = notPassCount || 0;
                    this.stage.ingCount = ingCount || 0;
                })
            }
        }
    }


    /**
     * 查询数据
     */
    getList(offset, size, callback) {
        this.ProjectInterface.getProjectLibrary(
            moduleAlias.PURCHASE,
            this.processConfigId,
            this.condition.status,
            this.$stateParams.stage,
            this.condition.stage,
            this.condition.gardenIds,
            this.condition.categoryList,
            this.condition.keywords,
            offset,size,
            this.accountId,
            null,null,this.condition.stageCompleteStart,
            this.condition.stageCompleteEnd,
            this.condition.createTimeStart,
            this.condition.createTimeEnd,
            this.condition.applyAccount
        ).then(res => {
            let totalItems = res.headers()['x-record-count'];
            let passCount = res.headers()['stage-pass-count'];
            let notPassCount = res.headers()['stage-notpass-count'];
            let ingCount = res.headers()['stage-ing-count'];
            callback(res.data, totalItems,passCount,notPassCount,ingCount)
        });
    }

    /**
     * 进详情页
     * @param id
     * @param taskId
     */
    goPage(data){
        this.$state.go('purchase.detail',{id:data.projectId,taskId:data.taskId,sidebarId:this.$rootScope.sidebar.id});
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
     * 获取我的项目
     */
    getMyProject(flag){
        this.accountId = flag?this.account.accountId:null;
        this.paginationConf.onChange(0,this.paginationConf.itemsPerPage);
    }
    
    /**
     * 搜索数据
     */
    goSearch(event) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.showSearch = true;
            this.keywords = this.condition.keywords;
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage)
        }
    }

    /**
     * 清空关键字
     */
    cleanKeywords(){
        this.condition.keywords = '';
        this.keywords = '';
        this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
    }

    /*
     * 更多条件搜索弹窗
     * */
    getMoreSearch(module) {
        this.condition.keywords = '';
        this.purchaseService.getMoreSearch(this.condition, (data) => {
            this.condition = data;
            // 当条件的值不为空且条件不是'关键字'时,出现小叉
            for (let key in data) {
                if (data[key] != '' && key != 'keywords') {
                    this.isShowCancel = true;
                }
            }
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
        },null,this.stageName);
    }

    /*
     * 删除搜索条件
     * */
    deleteCondition() {
        this.condition = {};
        this.isShowCancel = false;
        this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
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
     * 选择园区
     */
    chooseGarden() {
        if(!this.onlyMine) {
            this.SelectGarden.dialog({
                ids: this.condition.gardenIds
            }, garden => {
                if (garden.ids && garden.ids.length !== 0) {
                    this.condition.gardenIds = garden.ids.toString();
                    this.gardenList = garden.gardenList;
                    this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
                } else {
                    this.dialogsManager.showMessage('参统学校(机关)不能为空！', {
                        className: 'warning'
                    })
                }
            })
        }
    }

    /**
     * 导出excel
     */
    exportExcel() {
        this.ProjectInterface.exportLibraryExcel(
            moduleAlias.PURCHASE,
            this.processConfigId,
            this.condition.categoryListName,
            this.keywords,
            this.$stateParams.stage,
            this.condition.statusName,
            this.condition.stageName,
            null,
            this.gardenIds,
            this.searchCondition()
        )
    }

    /**
     * 判断查询条件
     */
    searchCondition() {
        let condition = '';
        if (this.condition.applyYearStart && this.condition.applyYearEnd) {
            condition += "项目申报年份:" + this.condition.applyYearStart + "-" + this.condition.applyYearEnd + "；";
        }
        if (this.condition.gardenList && this.condition.gardenList.length > 0) {
            let name = "";
            this.condition.gardenList.forEach(v => {
                name += v.name + "；";
            });
            condition += "项目申报单位:" + name;
        } 
        if (this.condition.categoryListName) {
            condition += "项目所属类别:" + this.condition.categoryListName + "；";
        }
        if (this.condition.kindName) {
            condition += "项目配标类别:" + this.condition.kindName + "；";
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
purchaseLibraryCtrl.$inject = ['$state', '$stateParams', '$rootScope', '$sessionStorage', 'ProjectInterface', 'dialogsManager', 'purchaseService', 'purchaseInterface', 'SelectGarden', 'lwGardenService','ProjectService'];
