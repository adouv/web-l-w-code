/**
 * @Author hejialin
 * @Description 描述
 */
export default class draftCtrl {
    constructor($stateParams, $rootScope, ProjectInterface, dialogsManager, purchaseInterface,$state,sidebarService,$location) {
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.ProjectInterface = ProjectInterface;
        this.dialogsManager = dialogsManager;
        this.purchaseInterface = purchaseInterface;
        this.sidebarService = sidebarService;
        this.$location = $location;
        this.init();
    }

    init() {
        this.paramInit();
        this.pageConfig();
        this.getSidebarList();
    }

    /**
     * 获取初始化参数
     */
    paramInit() {
        this.isfirstSearch = true;
        // 侧边ID
        this.sideBar = this.$rootScope.sideBar || {
            id: this.$stateParams.sidebarId
        };
        // 流程ID
        this.processConfigId = this.$stateParams.processConfigId;
        this.condition = {}
        this.condition.keywords = "";
        this.checkedIds = [];
        this.isDelete = false;
    }

    // 请求侧边栏
    getSidebarList(){
        this.sidebarService.getSidebarList('purchase',null,(data)=>{
            for(let key in data.urls){
                if(key.indexOf('/purchase/apply') === 0){
                    this.goBackUrl = data.urls[key].url;
                    return;
                }
            }
    })
    }

    /**
     *  返回
     */
    goBack(){
        this.$location.path(this.goBackUrl);
    }

    /**
     * 进入详情页
     */
    goPage(data){
        console.log(data);
        this.$state.go('purchase.edit',{id:data.projectId,sidebarId:this.$stateParams.sidebarId});
    }

    /**
     * 调取分页数据
     */
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList, totalItems) => {
                    this.pageList = pageList;
                    this.paginationConf.totalItems = totalItems || 0;
                })
            }
        }
    }
    /**
     * 查询分页列表数据
     */
    getList(offset, size, callback) {
        this.ProjectInterface.getDraftList(
            moduleAlias.PURCHASE,
            this.processConfigId,
            null,
            this.keywords,
            offset,
            size).then(res => {
            let totalItems = res.headers()['x-record-count'];
            callback(res.data, totalItems)
        }, err => {
            let msg = err.data.error_description;
            this.dialogsManager.showMessage(msg, {
                className: 'error'
            });
        })
    }

    /**
     * 查询数据
     */
    goSearch(event) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.isfirstSearch = false;
            this.keywords = this.condition.keywords;
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage)
        }
    }

    cleanKeywords(){
        this.condition.keywords = '';
        this.keywords = '';
        this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
    }

    /**
     * 删除选中的草稿申请单
     */
    deleteCheckedDraft() {
        if (this.isDelete) {
            if (this.checkedIds.length === 0) {
                return false;
            }
            this.dialogsManager.confirm({
                title: '删除提示',
                content: '确定要删除下部所有选中项吗',
                callback: () => {
                    this.ProjectInterface.deleteDraft(
                        moduleAlias.PURCHASE,
                        this.checkedIds.toString()
                    ).then(res => {
                        this.dialogsManager.showMessage('删除成功', {
                            className: "success"
                        });
                        this.paginationConf.onChange(0,this.paginationConf.itemsPerPage);
                        this.isCheckedIds = [];
                        this.checkedIds = [];
                    }, err => {
                        let msg = err.data.error_description;
                        this.dialogsManager.showMessage(msg, {
                            className: 'error'
                        });
                    })
                }
            })
        }
        this.isDelete = false;
    }

    /**
     * 清空所有的草稿申请单
     */
    emptyAllDraft() {
        if (this.pageList.length !== 0) {
            this.dialogsManager.confirm({
                title: '提示',
                content: '清空后将不可恢复，是否继续？',
                callback: () => {
                    this.cleanAllDraft();
                }
            })
        }
    }

    /**
     * 清空草稿箱
     */
    cleanAllDraft(){
        this.purchaseInterface.cleanAllDraft().then(res => {
            this.dialogsManager.showMessage('已清空', {
                className: "success"
            });
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
        })

    }

    /**
     * 全选
     */
    checkedAll() {
        if (this.checked_all) {
            this.checkedIds = [];
            this.pageList.forEach(v => {
                this.checkedIds.push(v.projectId)
            });
            this.isDelete = true;
        } else {
            this.checkedIds = [];
            this.isDelete = false;
        }
    }

    /**
     * 反选
     */
    checkedItem(event, id) {
        event.stopPropagation();
        let checked = event.target.checked;
        let index = this.checkedIds.indexOf(id);
        if (index === -1) {
            this.checkedIds.push(id);
        } else if (!checked && index !== -1) {
            this.checkedIds.splice(index, 1);
        }
        if (this.checkedIds.length !== 0) {
            this.isDelete = true;
        } else {
            this.isDelete = false;
        }
        if (this.checkedIds.length === this.pageList.length) {
            this.checked_all = true;

        } else {
            this.checked_all = false;
        }
    }
}
draftCtrl.$inject = ['$stateParams', '$rootScope', 'ProjectInterface', 'dialogsManager', 'purchaseInterface','$state','sidebarService','$location'];
