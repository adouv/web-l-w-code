export default class assetDraftListCtrl {
    constructor(AssetDictionaryInterface, $stateParams,dialogsManager, $sessionStorage, SelectGarden, ProjectInterface,$rootScope,lwGardenService,$state) {
        this.AssetDictionaryInterface = AssetDictionaryInterface;
        this.$stateParams = $stateParams;
        this.ProjectInterface = ProjectInterface;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.session = $sessionStorage;
        this.SelectGarden = SelectGarden;
        this.dialogsManager = dialogsManager;
        this.gardenService = lwGardenService;
        this.init();
    }
    
    init() {
        this.paramsInit();
        this.pageConfig();
        this.getVisibleGarden();
        this.getConditionData();
    }

    /**
     * 参数初始化
     */
    paramsInit(){
        this.condition = {};
        this.isCheckedIds = [];
        this.account = this.session.get('account');
        this.garden = this.session.get('currentGarden');
        this.gardenList = [this.garden];
        this.gardenIds = this.garden.gardenId;
        this.sidebar = this.$rootScope.sidebar||{id:this.$stateParams.sidebarId}; // 侧边栏ID
        this.processConfigId = this.$stateParams.processConfigId;
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

    goDetail(id){
        this.$state.go('asset.editor',{id:id,sidebarId:this.$stateParams.sidebarId});
    }
    
    /**
     * 获取条件数据
     */
    getConditionData(){
        //控制最上面的处置方式状态栏的显示
        this.AssetDictionaryInterface.getDisposeType().then(res => {
            this.disposeDirection = res.data;
        })
    }
    
    /**
     * 查询分页列表
     * @param offset 从第几页开始查
     * @param size 每页查询的条数
     * @param callback 回调
     */
    getList(offset, size, callback) {
        this.ProjectInterface.getDraftList(
            moduleAlias.ASSET,
            this.$stateParams.processConfigId,
            this.disposeTypeList,
            this.keywords,
            offset, size).then(res => {
            let totalItems = res.headers()['x-record-count'];
            callback(res.data, totalItems);
        });
    }

    /**
     * 查询
     * @param event
     */
    goSearch(event) {
        if (!event || event.charCode === 13 || 
            event.keyCode === 13 || event.which === 13) {
            this.keywords = this.condition.keywords;
            this.disposeTypeList = this.condition.disposeTypeList;
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
        this.dialogsManager.confirm({
            title: '提示',
            content: '删除后将不可恢复，是否继续?',
            callback: () => {
                this.ProjectInterface.deleteAllDraft(moduleAlias.ASSET).then(res => {
                    this.pageList = [];
                    this.dialogsManager.showMessage('操作成功', {
                        className: 'success'
                    });
                    this.isCheckedIds = [];
                })
            }
        });
    }

    /**
     * 全选
     */
    allChecked() {
        if (this.isChecked) {
            for (let item of this.pageList) {
                let id = item.id;
                item.checked = true;
                if (this.isCheckedIds.indexOf(id)) {
                    this.isCheckedIds.push(id);
                }
            }

        } else {
            this.isCheckedIds = [];
        }
    }

    /**
     * 选择园区(多选)
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
     * 获取可见园区
     */
    getVisibleGarden() {
        this.gardenService.getVisualGardenList(false,res => {
            this.visibleGardens = res.data;
        })
    }

    /**
     * 删除选中的草稿
     */
    delete() {
        this.dialogsManager.confirm({
            title: '删除提示',
            content: '确定要删除下部所有选中项吗',
            callback: () => {
                this.deleteDraft();
            }
        });
    }

    /**
     * 删除选中草稿
     */
    deleteDraft(){
        this.ProjectInterface.deleteDraft(
            moduleAlias.ASSET,
            this.isCheckedIds.toString()
        ).then(res => {
            this.isCheckedIds = [];
            this.dialogsManager.showMessage('操作成功', {
                className: 'success'
            });
            this.pageConfig.onChange(0,this.pageConfig.itemsPerPage);
        })
    }

    /**
     * 点击复选框选中
     * @param e
     * @param id
     */
    inputChecked(e, id) {
        window.event.cancelBubble = window.event?true : e.stopPropagation();
        let isChecked = e.target.checked;
        let idx = this.isCheckedIds.indexOf(id);
        if (isChecked && idx == -1) {
            this.isCheckedIds.push(id);
        }
        if (!isChecked && idx != -1) {
            this.isCheckedIds.splice(idx, 1);
        }
    }

    /**
     * 返回申请列表
     */
    goBack(){
        history.back();
    }
}
assetDraftListCtrl.$inject = ['AssetDictionaryInterface', '$stateParams', 'dialogsManager', '$sessionStorage', 'SelectGarden', 'ProjectInterface', '$rootScope','lwGardenService','$state']
