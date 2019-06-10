/**
 * @Author hejialin
 * @Description 描述
 */
export default class purchaseAllCtrl {
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
    }
    /**
     * 初始化参数
     */
    paramInit() {
        this.account = this.session.get('account');
        this.garden = this.session.get('currentGarden');
        this.gardenList = [this.garden];
        // 侧边ID
        this.sidebar = this.$rootScope.sidebar || {
            id: this.$stateParams.sidebarId
        };
        // 流程配置Id
        this.processConfigId = this.$stateParams.processConfigId;
        this.condition = {};
        this.condition.keywords = "";
    }

    /**
     * 分页数据
     */
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList, totalItems, finishCount, notPassNum, ingCount) => {
                    this.pageList = pageList;
                    this.paginationConf.totalItems = totalItems || 0;
                    this.paginationConf.finishCount = finishCount || 0;
                    this.paginationConf.notPassNum = notPassNum || 0;
                    this.paginationConf.ingCount = ingCount || 0;
                })
            }
        }
    }

    getDetail(data){
        this.$state.go('purchase.detail',{id:data.projectId,sidebarId:this.$rootScope.sidebar.id});
    }

    /**
     * 查询数据
     */
    getList(offset, size, callback) {
        this.ProjectInterface.getAllApplication(
            moduleAlias.PURCHASE,
            this.accountId,
            this.condition.status,
            this.condition.stage,
            this.condition.gardenIds,
            this.condition.categoryList,
            this.condition.keywords,
            offset,
            size,
            this.condition.createTimeStart,
            this.condition.createTimeEnd,
            this.condition.applyAccount
        ).then(res => {
            let totalItems = res.headers()['x-record-count'];
            let finishCount = res.headers()['normal-finished-count'];
            let notPassNum = res.headers()['abnormal-finished-count'];
            let ingCount = res.headers()['ing-count'];
            callback(res.data, totalItems, finishCount, notPassNum, ingCount)
        })
    }

    /**
     * 搜索数据
     */
    goSearch(event) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.keywords = this.condition.keywords;
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage)
        }
    }

    /**
     * 删除关键字
     */
    cleanKeywords(){
        this.condition.keywords = '';
        this.keywords = '';
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
     * 获取我的项目
     */
    getMyProject(flag){
        this.accountId = flag?this.account.accountId:null;
        this.paginationConf.onChange(0,this.paginationConf.itemsPerPage);
    }
    
    /**
     * 选择园区
     */
    chooseGarden() {
        this.SelectGarden.dialog({
            ids: this.condition.gardenIds
        }, garden => {
            console.log(garden);
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

    /*
     * 更多条件搜索弹窗
     * */
    getMoreSearch(allunits,module) {
        this.condition.keywords = '';
        this.purchaseService.getMoreSearch(this.condition, (data) => {
            this.condition = data;
            // 当条件的值不为空且条件不是'关键字'时,出现小叉
            for (let key in data) {
                if (data[key] != ''&& key != 'keywords') {
                    this.isShowCancel = true;
                }
            }
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage)
        },true,null);
    }

    /*
     * 删除搜索条件
     * */
    deleteCondition() {
        this.condition = {};
        this.isShowCancel = false;
        this.paginationConf.onChange(0, this.paginationConf.itemsPerPage)
    }

    /**
     * 导出excel
     */
    exportExcel() {
        this.ProjectInterface.exportAllExcel(
            moduleAlias.PURCHASE,
            this.keywords,
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
            })
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
        if (this.keywords) {
            condition += "关键字:" + this.keywords + "；";
        }
        return condition;
    }
}

purchaseAllCtrl.$inject = ['$state', '$stateParams', '$rootScope', '$sessionStorage', 'ProjectInterface', 'dialogsManager', 'purchaseService', 'purchaseInterface', 'SelectGarden', 'lwGardenService','ProjectService']
