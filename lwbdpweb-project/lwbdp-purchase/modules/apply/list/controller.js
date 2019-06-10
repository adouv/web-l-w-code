/**
 * @Author hejialin
 * @Description 描述
 */
export default class listCtrl {
    constructor($state, $stateParams, $rootScope, $sessionStorage, ProjectInterface, dialogsManager, purchaseService, purchaseInterface,sidebarService) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.session = $sessionStorage;
        this.$rootScope = $rootScope;
        this.ProjectInterface = ProjectInterface;
        this.dialogsManager = dialogsManager;
        this.purchaseService = purchaseService;
        this.purchaseInterface = purchaseInterface;
        this.sidebarService = sidebarService;
        this.init();
    }
    init() {
        this.paramInit();
        this.isApply = this.getIsApply();
        this.pageConfig();
        this.taskType = this.getTaskType();
        this.getStageName();
        this.getFirstStageId();
    }
    /**
     * 获取初始化参数
     */
    paramInit() {
        this.account = this.session.get('account');
        this.garden = this.session.get('currentGarden');
        // 侧边栏ID
        this.sidebar = this.$rootScope.sidebar || {
            id: this.$stateParams.sidebarId
        };
        // 流程配置ID
        this.processConfigId = this.$stateParams.processConfigId;
        this.checkedIds = [];
        this.condition = {};
        this.condition.keywords = "";
    }

    /**
     * 获取项目阶段
     */
    getStageName() {
        this.ProjectInterface.getStageName(this.$stateParams.stage).then(res => {
            this.stageId = res.data.stageId;
            this.stageName = res.data.stageName;
        })
    }

    getFirstStageId(){
        this.sidebarService.getFirstStageId(moduleAlias.PURCHASE,this.$stateParams.processConfigId,(id)=>{
            this.firstStageId = id;
        });
    }

    /**
     * 调取分页数据
     */
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList, totalItems, waitDealCount, finishCount) => {
                    this.pageList = pageList;
                    this.paginationConf.totalItems = totalItems || 0;
                    this.paginationConf.waitDealCount = waitDealCount || 0;
                    this.paginationConf.finishCount = finishCount || 0;
                })
            }
        }
    }

    /**
     * 进详情页
     * @param id
     * @param taskId
     */
    goPage(data){
        if(data.projectStatus==0&&data.taskStatus==0){
            this.$state.go('purchase.form',{id:data.projectId,taskId:data.taskId,sidebarId:this.$rootScope.sidebar.id});
        }else{
            this.$state.go('purchase.detail',{id:data.projectId,taskId:data.taskId,sidebarId:this.$rootScope.sidebar.id});
        }
    }
    
    /**
     * 查询分页列表
     * @param offset 从第几页开始查
     * @param size 每页查询的条数
     * @param callback 回调
     */
    getList(offset, size, callback) {
        this.ProjectInterface.getApplication(
            moduleAlias.PURCHASE,
            this.processConfigId,
            this.condition.status,
            this.$stateParams.stage,
            this.getTaskType(),
            this.condition.stage,
            null,
            this.condition.gardenIds,
            this.condition.categoryList,
            this.condition.keywords,
            this.condition.applyAccount,
            offset,
            size,
            this.condition.applyYearStart,
            this.condition.applyYearEnd,
            this.condition.createTimeStart,
            this.condition.createTimeEnd,
            this.condition.taskTimeStart,
            this.condition.taskTimeEnd
        ).then(res => {
            let totalItems = res.headers()['x-record-count'];
            let waitDealCount = res.headers()['waitDealCount'];
            let finishCount = res.headers()['finishCount'];
            callback(res.data, totalItems, waitDealCount, finishCount)
        }, err => {
            let msg = err.data.error_description
            this.dialogsManager.showMessage(msg, {
                className: 'error'
            });
        });
    }
    /**
     * 查询数据方法 
     */
    goSearch(event) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.showSearch = true; // 控制展示哪一个缺省页
            this.keywords = this.condition.keywords;
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
        }
    }

    /**
     * 判断任务类型
     */
    getTaskType() {
        return this.isApply * 1;
    }

    /**
     * 判断任务类型是不是申请
     */
    getIsApply() {
        let type = this.$state.current.name.split('.')[1];
        return type === "apply";
    }

    /**
     * 全选
     */
    checkedAll() {
        if (this.checked_all) {
            this.checkedIds = [];
            this.pageList.forEach(v => {
                this.checkedIds.push(v.id);
            })
        } else {
            this.checkedIds = [];
        }
    }

    /**
     * 反选
     */
    checkedOne(event, id) {
        let isChecked = event.target.checked;
        let idx = this.checkedIds.indexOf(id);
        if (idx === -1) {
            this.checkedIds.push(id);
        } else if (!isChecked && idx !== -1) {
            this.checkedIds.splice(idx, 1)
        }
        if (this.pageList.length === this.checkedIds.length) {
            this.checked_all = true;
        } else {
            this.checked_all = false;
        }
    }


    /*
     * 更多条件搜索弹窗
     * */
    getMoreSearch(module) {
        this.condition.keywords = ''; // 点击高级搜索时,清空关键字
        this.purchaseService.getMoreSearch(this.condition, (data) => {
            this.condition = data;
            // 当条件的值不为空且条件不是'关键字'时,出现小叉
            for (let key in data) {
                if (data[key] != '' && key != 'keywords') {
                    this.isShowCancel = true; // 控制高级搜索删除图标
                    this.showSearch = true;   // 控制展示哪一个缺省页
                }
            }
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
        },null,null);
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
     * 导出
     */
    exportExcel() {
        this.ProjectInterface.exportExcel(
            moduleAlias.PURCHASE,
            this.processConfigId,
            this.condition.categoryListName,
            this.keywords,
            this.$stateParams.stage,
            this.condition.statusName,
            this.condition.stageName,
            this.getTaskType(),
            null,
            this.gardenIds,
            this.searchCondition()
        )
    }

    cleanKeywords(){
        this.condition.keywords = '';
        this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
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
        if (this.condition.taskTimeStart && this.condition.taskTimeEnd) {
            condition += "任务生成时间段:" + this.condition.taskTimeStart + "-" + this.condition.taskTimeEnd + "；";
        }
        if (this.keywords) {
            condition += "关键字:" + this.keywords + "；";
        }
        return condition;
    }

}
listCtrl.$inject = ['$state', '$stateParams', '$rootScope', '$sessionStorage', 'ProjectInterface', 'dialogsManager', 'purchaseService', 'purchaseInterface','sidebarService'];
