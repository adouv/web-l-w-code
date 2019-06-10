import './input.css';

export default class repairDraftCtrl {
    constructor($state, $stateParams, repairInterface, $sessionStorage, SelectGarden, dialogsManager, lwGardenService, RepairDictionaryInterface, WorkflowInterface, ProjectInterface,sidebarService,$location,bdpInterface) {
        this.$state = $state;
        this.$location = $location;
        this.$stateParams = $stateParams;
        this.repairInterface = repairInterface;
        this.gardenService = lwGardenService;
        this.session = $sessionStorage;
        this.bdpInterface = bdpInterface;
        this.SelectGarden = SelectGarden;
        this.sidebarService = sidebarService;
        this.dialogsManager = dialogsManager;
        this.RepairDictionaryInterface = RepairDictionaryInterface;
        this.WorkflowInterface = WorkflowInterface;
        this.ProjectInterface = ProjectInterface;
        this.init();
    }

    init() {
        this.account = this.session.get('account');
        this.getConditionItems();
        this.getVisibleGarden();
        if(this.$stateParams.id){
            this.isEdit = (this.$state.current.name.split('.')[1]=='edit');
            this.getApplyProject();
        }else{
            this.appendParamsInit();
            this.getNextAuditInfo();
        }
        this.getCrumbList();
    }

    /**
     * 添加参数初始化
     * @param garden
     */
    appendParamsInit(){
        let garden = this.session.get('currentGarden');
        this.apply = {};
        this.apply.gardenId = garden.gardenId;
        this.apply.gardenName = garden.gardenName;
        this.apply.processConfigId = this.$stateParams.processConfigId;
        this.getAccountPhone(this.account.accountId);
        if(this.nextAuditInfo){
            this.apply.nextOperator = this.nextAuditInfo.nextAuditorQoList[0].accountId;
        }    
        if(this.phone){
            this.apply.creatorName = this.phone.displayName;
            this.apply.cellphone = this.phone.cellphone;
        }
    }

    /**
     * 获取面包屑导航
     */
    getCrumbList() {
        this.sidebarService.getFirstCrumb(moduleAlias.REPAIR,this.$stateParams.sidebarId, data => {
            this.crumbList = data;
        });
    }
    
    /**
     * 获取申请项目详情
     */
    getApplyProject(){
        this.ProjectInterface.getApplicationDetail(moduleAlias.REPAIR, this.$stateParams.id).then(res => {
            this.apply = res.data;
            this.apply.gardenName = res.data.projectGarden;
            this.apply.name = res.data.projectName;
            this.getNextAuditInfo();
            this.getAccountPhone(this.account.accountId);
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
     * 获取联系人手机号
     */
    getAccountPhone(accountId) {
        this.repairInterface.getPersonPhone(accountId).then(res => {
            this.phone = res.data;
            this.apply.creatorName = this.phone.displayName;
            this.apply.cellphone = this.phone.cellphone;
            this.phoneInputShow = !res.data.cellphone;
        });
    }

    //选择默认园区
    chooseGarden() {
        this.SelectGarden.dialog({
            single: true,
            ids: this.apply.gardenId
        }, $garden => {
            if ($garden.gardenList[0]) {
                this.apply.gardenId = $garden.gardenList[0].id;
                this.apply.gardenName = $garden.gardenList[0].name;
                this.getNextAuditInfo();
            } else {
                this.apply.gardenId = '';
                this.apply.gardenName = '';
            }
        });
    }

    /**
     * 下一步审核人信息 添加
     */
    getNextAuditInfo() {
        this.ProjectInterface.getNextTaskAudit(this.apply.processConfigId, null, this.apply.gardenId).then(res => {
            this.nextAuditInfo = res.data.nextTaskInfoList[0];
            this.apply.nextOperator = this.nextAuditInfo.nextAuditorQoList[0].accountId;
        })
    }

    //校验项目名称c
    verificationProjectName(name) {
        this.ProjectInterface.validateName('repair',name,this.apply.projectId).then(res=>{});
    }

    /**
     * 保存项目
     * @param {-1:草稿,0:申报单} status
     * @param {true:返回,false:不返回} back
     */
    saveProject(status, isBack) {
        if (this.verificationProjectName()) return false;
        this.apply.status = status;
        if(!status){
            this.dialogsManager.confirm({
                title: '确认提示',
                btn: ['是', '否'],
                content: '提交申报后，该记录将不能再修改，是否继续？',
                callback: [() => {
                    this.saveApplyProject(status,isBack);
                }]
            })
        }else{
            this.saveApplyProject(status,isBack);
        }
    }

    /**
     * 获取对应属性的名称
     */
    getAttrName(list,id,key){
        for(let data of list){
            if(data.id == id){
                this.apply[key] = data.name;
                break;
            }
        }
    }
    
    /**
     * 返回
     */
    goBack() {
        history.back();
    }

    /**
     * 编辑联系电话
     */
    editPhone(){
        if(this.apply.cellphone){
            this.phoneInputShow = !this.phoneInputShow;
        }
    }
    
    /**
     * 保存申请项目
     */
    saveApplyProject(status,isBack) {
        if(this.apply.cellphone != this.phone.cellphone){
            this.phone.createTime = null;
            this.bdpInterface.saveContact(this.phone).then(res=>{
                this.submitProject(status,isBack);
            });
        }else{
            this.submitProject(status,isBack);
        }
    }

    /**
     * 提交申请单
     * @param status
     * @param isBack
     */
    submitProject(status,isBack){
        if(!this.isEdit)this.apply.id=null;
        let method = this.isEdit?'updateApplication':'addApplication';
        this.ProjectInterface[method](moduleAlias.REPAIR, this.apply).then(res => {
            this.dialogsManager.showMessage('保存成功', {
                className: 'success',
                callback: () => {
                    if(!status){
                        isBack&&this.$location.path(this.crumbList[this.crumbList.length-1].url);
                        this.appendParamsInit();
                    }else{
                        this.$location.path(this.crumbList[this.crumbList.length-1].url);
                    }
                }
            });
        })
    }
    
    /**
     * 获取条件选项
     */
    getConditionItems() {
        // 项目大类
        this.RepairDictionaryInterface.getProjectCategory().then(res => {
            this.types = res.data;
        });
        // 优先级
        this.RepairDictionaryInterface.getPriority().then(res => {
            this.prioritys = res.data;
        })
    }

    goJump(url){
        this.$location.path(url);
    }
}
repairDraftCtrl.$inject = ['$state', '$stateParams', 'repairInterface', '$sessionStorage', 'SelectGarden', 'dialogsManager', 'lwGardenService', 'RepairDictionaryInterface', 'WorkflowInterface', 'ProjectInterface','sidebarService','$location','bdpInterface']
