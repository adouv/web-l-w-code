import '../addApprovalProcess/conflict.css';
import confilt from '../addApprovalProcess/conflict.html';
// 定义tab页的值
let process = 'process';
let object = 'object';
export default class setApproverCtrl {
    constructor($state,$scope, WorkflowConfigInterface,dialogsManager,ngDialog,$location,$rootScope) {
        console.log(12123321)
        this.dictionaryData = null;
        this.WorkflowConfigInterface = WorkflowConfigInterface;
        this.dialogsManager = dialogsManager;
        this.ngDialog = ngDialog;
        this.$location = $location;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.init();
    }
    init() {
        this.paramsInit();
        this.pageConfig();
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        // 设置tab默认值
        this.currentTab = process;
        this.selectedItem = [];
        this.saveNew = true;
        this.module = this.$state.current.name.split('.')[0];
        this.keywords = '';
    }

    //配置分页
    pageConfig(){//currentPage
        this.paginationConfProcess = {
            onChange: (offset,size) => {
                this.getList(offset,size,(dataList,totalItems)=>{
                    this.dataList = dataList;
                    this.paginationConfProcess.totalItems = totalItems;
                });
            }
        };
        this.paginationConfObject = {
            onChange: (offset,size) => {
                this.getGardenConfig(offset,size,(dataList,totalItems)=>{
                    this.dataList = dataList;
                    this.paginationConfObject.totalItems = totalItems;
                });
            }
        };
    }
    /*
    *  审批流程视图列表
    * */
    getList(offset,size,callback){
        this.WorkflowConfigInterface.getWorkflowConfigs(this.module, this.keywords, offset, size).then(res=>{
            let totalItems = res.headers()['x-record-count'];
            callback && callback(res.data,totalItems);
        })
    }
    /*
   *  使用对象视图列表
   * */
    getGardenConfig(offset,size,callback){
        this.WorkflowConfigInterface.getGardenView(this.module, this.keywords, offset, size).then(res=>{
            let totalItems = res.headers()['x-record-count'];
            callback && callback(res.data,totalItems);
        })
    }
    checkAll(event){
        let isChecked = event.target.checked;
        if(isChecked){
            for(let item of this.dataList){
                let id = item.id;
                item.checked = true;
                if(this.selectedItem.indexOf(id)){
                    this.selectedItem.push(id);
                }
            }
        }else{
            for(let item of this.dataList){
                item.checked = false;
            }
            this.selectedItem = [];
        }

    }
    checkItem(event,id){
        let isChecked = event.target.checked;
        let idx = this.selectedItem.indexOf(id);
        if(isChecked && idx==-1){
            this.selectedItem.push(id);
        }
        if(!isChecked && idx!=-1){
            this.selectedItem.splice(idx,1);
            if(this.checkedAll){
            }
        }
    }

    /**
     * 进详情页
     * @param id
     */
    goLookApproval(id){
        this.$location.path('/'+this.module+'/setting/process/detail/'+id+'/'+this.$rootScope.sidebar.id);
    }

    /**
     * 进编辑/添加页
     * @param id
     */
    goAddApproval(id){
        if(id){
            this.$location.path('/'+this.module+'/setting/process/edit/'+id+'/'+this.$rootScope.sidebar.id);
        }else{
            this.$location.path('/'+this.module+'/setting/process/append'+'/'+this.$rootScope.sidebar.id);
        }
    }
    
    delItem(type,idx){
        if(type=='multi' && this.selectedItem.length<1){
            return false;
        }
        let msg = type=='multi'? '确定要删除下部所有选中项吗?' : '确定要删除该条记录吗?';
        this.dialogsManager.confirm(
            {
                title:'删除提示',
                content: msg,
                callback:()=>{
                    if(type=='multi' && this.selectedItem.length>0){
                        param = this.selectedItem.toString();
                    }else{
                        let item = this.dataList[idx];
                        param = item.id;
                    }
                    this.WorkflowConfigInterface.deleteWorkflowConfigs({ids:param}).then(res=>{
                        this.dialogsManager.showMessage('删除成功', {
                            className: 'success',
                            callback: () => {
                                this.selectedItem = [];
                                this.paginationConf.onChange();
                            }
                        });
                    })
                }
            }
        );
        let param = null;

    }
    showDialog(name,item) {
        this['change_' + name] = true;
        this.selectedItem = item;
    }
    closeDialog(name) {
        this['change_' + name] = false;
    }
    setConflitClick(index,item){
        this.setConflit = true;
        this.$scope.saveNew = res=>{
            this.saveNew = res;
            this.ngDialog.closeAll();
            this.changeStatusRequest(index,item);
        };
        this.$scope.close = res=>{
            this.ngDialog.closeAll();
        };
    }
    changeStatus(index,item) {
        let status = item.status;
        //冲突检测
        if(!status){
            let validateObj = {
                processConfigId : item.id,
                processDefinitionId:item.processDefinitionId
            };
            this.WorkflowConfigInterface.validateConflict(validateObj).then(res=>{
                if(res.data.length>0){
                    this.setConflitClick(index,item);
                    this.$scope.confiltData = res.data;
                    this.$scope.firstName = item.name;
                    this.WorkflowConfigInterface.getConfigGardens(item.id).then(res=>{
                        this.$scope.confilt_gardens= res.data;
                        this.validateDialog(res.data);
                    })
                }else{
                    this.changeStatusRequest(index,item);
                }
            },res=>{});
            return false;
        };
        this.changeStatusRequest(index,item)
    }

    /**
     * 校验冲突弹窗
     * @param valist
     */
    validateDialog(valist){
        if (!this.setConflit) {
            this.setConflitClick();
        }
        let itemList = [],gardenIds = this.dataObj.gardenIds;
        for (let item of valist) {
            itemList = itemList.concat(item.gardenList);
        }
        let idArr = [];
        for (let item of itemList) {
            if (idArr.indexOf(item.id) < 0)
                idArr.push(item.id);
        }
        for (let garden of this.$scope.confilt_gardens) {
            if (idArr.indexOf(garden.id) > -1) {
                garden.isConfilct = true;
            }
        }
        for (let garden of itemList) {
            if (gardenIds.indexOf(garden.id) > -1) {
                garden.isConfilct = true;
            }
        }
        this.ngDialog.open({
            closeByDocument: false,
            className: 'lw-select-garden approvalProcess_confilt',
            template: confilt,//模式对话框内容为test.html
            scope: this.$scope,
            plain: true
        })
    }
    
    changeStatusRequest(index,item){
        let obj = {
            id : item.id,
            status : !item.status,
            saveNew : this.saveNew
        };
        this.WorkflowConfigInterface.updateWorkflowConfigStatus(obj).then(res=>{
            this.dataList[index].status = !item.status;
            let conf = this.paginationConf;
            let offset = (conf.currentPage-1)*conf.itemsPerPage||0;
            let size = conf.itemsPerPage;
            conf.onChange(offset,size);
        },res =>{
            let msg = res.data.error_description;
            this.dialogsManager.showMessage( msg, {
                className: 'error',
                callback: () => {
                    this.selectedItem = [];
                }
            });
        })
    }

     /*
     * tab页切换
     * */
    setCurrentTab(tabName){
        if (this.currentTab !== tabName) {
            this.currentTab = tabName;
            this.pageConfig();
        }
    }
    /**
     * 查询
     */
    goSearch(event) {
        if (!event || event.charCode === 13 ||
            event.keyCode === 13 || event.which === 13) {
            if(this.currentTab === process){
                this.paginationConfProcess.onChange(0,15);
            }else{
                this.paginationConfObject.onChange(0,15);
            }
        }
    }

    /*
    * 默认流程管理
    * */
    defaultProcess(){
        this.ngDialog.open({
            closeByDocument: false,
            className: 'bdp layer_fixed',
            template: require('../../../components/defaultProcess/defaultProcess.html'),
            plain: true,
            scope:this.$scope,
            controller: 'defaultProcessCtrl',
            controllerAs: 'defaultProcess',
        })
    }
}
setApproverCtrl.$inject = ['$state', '$scope','WorkflowConfigInterface','dialogsManager','ngDialog','$location','$rootScope'];