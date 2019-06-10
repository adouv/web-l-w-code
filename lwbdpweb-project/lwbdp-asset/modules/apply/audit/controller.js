export default class assetAuditFormCtrl{

    constructor($state, $stateParams, AssetInterface, $config, $compile, $scope, $sessionStorage, dialogsManager, ngDialog, $filter, $timeout, AssetApplyService, ProjectInterface, $rootScope,$controller,$location) {
        this.$state = $state;
        this.$filter = $filter;
        this.$timeout = $timeout;
        this.$controller = $controller;
        this.$location = $location;
        this.$stateParams = $stateParams;
        this.AssetInterface = AssetInterface;
        this.file = $config.file.SHOWIMG;
        this.$compile = $compile;
        this.$scope = $scope;
        this.$config = $config;
        this.session = $sessionStorage;
        this.dialogsManager = dialogsManager;
        this.ngDialog = ngDialog;
        this.AssetApplyService = AssetApplyService;
        this.ProjectInterface = ProjectInterface;
        this.init();
    }
    
    init() {
        this.paramsInit();
        this.getTaskInfoById(this.$stateParams.id);
    }

    /**
     * 参数初始化
     */
    paramsInit(){
        this.auditDisable = true;
        this.account = this.session.get('account');
        this.garden = this.session.get('currentGarden');
        this.isAudit = this.getIsAudit();
    }
    
    /**
     * 通过申请单ID获取任务节点信息
     * @param id
     */
    getTaskInfoById(id) {
        //如果是审核页或者处置页面，进行数据初始化(并且是待办状态)
        this.ProjectInterface.getTaskInfoById(id).then(res => {
            this.currentTaskId = res.data.id;
            this.currentTask = res.data;
            this.isGetAuditForm(res.data);
        });
    }

    /**
     * 是否事审核
     * @return {boolean}
     */
    getIsAudit(){
        return this.$state.current.name.split('.')[1]=='form';
    }
    
    /**
     * 是否需要获取审核表单
     * @param currentTask
     */
    isGetAuditForm(currentTask){
        //当办理人是当前用户并且是第一次办理时,请求表单
        if (this.isAudit && currentTask.assignee == this.account.accountId && !currentTask.isRedo) {
            this.getTaskForm(this.currentTaskId,form=>{
                this.formCtrl = form;
                form.prototype.findAuditedNodeArea = this.findAuditedNodeArea;
                this.getNextAuditInfo(data=>{
                    this.nextAuditInfo = data;
                });
            });
        }
    }


    /**
     * 获取上面的审核状态外置表单
     * @param taskId 任务ID（默认当前任务ID）
     * @param callback 回调
     */
    getTaskForm(taskId,callback) {
        this.ProjectInterface.getTaskForm(taskId || this.currentTaskId).then(res => {
            // 表单类型--> 外置和动态
            if (res.data.formType !== 'external') return false;
            let formCtrl = this.$config.bdp.isUseExternalForm?res.data.form:require('../../../forms/'+res.data.formKey+'.js');
            callback&&callback(formCtrl.default);
        })
    }

    /**
     * 获取下一节点审核信息（审核名称、及截止时间等）
     * @param key
     */
    getNextAuditInfo(callback) {
        if(this.currentTaskId){
            this.ProjectInterface.getNextTaskAudit(
                null,this.currentTaskId,
                this.garden.gardenId,
                'approved', true)
                .then(res => {
                    let nextTaskInfoList = res.data.nextTaskInfoList[0];
                    let nextAuditInfo = nextTaskInfoList||{};
                    nextAuditInfo.dueDate = res.data.dueDate;
                    nextAuditInfo.statusDescription = res.data.statusDescription;
                    callback&&callback(nextAuditInfo);
            })
        }
    }

    /**
     * 取消
     */
    auditCancel(flag,backUrl){
        if(flag!==undefined){
            this.ngDialog.closeAll();
        }else{
            this.$location.path(this.$scope.backUrl||backUrl);
        }
    }
    
    /**
     * 外置表单打回编辑取消
     */
    formEditCancel(){
        this.editForm = this.formData;
        this.ngDialog.closeAll();
    }
    
    /**
     * 外置表单确定
     */
    auditTask(data) {
        if(data.attachments){
            data.attachments.forEach(attachment=>{
                attachment.persistentState = null;
                attachment.time = null;
            });
        }
        data.taskId = this.currentTaskId;
        this.ProjectInterface.transactTask(data).then(res => {
            this.dialogsManager.showMessage('操作成功', {
                className: 'success',
                callback: () => {
                    this.auditCancel();
                }
            })
        })
    }

    /**
     * 重新申报
     */
    reapplyOrder(flag, taskId) {
        if(flag&&this.formData){
            this.formData.approved = flag;
            if(this.editFormCtrl.prototype.auditSaveTask){
                this.editFormCtrl.prototype.backUrl = this.$scope.backUrl;
                this.editFormCtrl.prototype.auditCancel = this.auditCancel;
                this.formData.taskId = this.currentTaskId;
                let ctrlInit = this.$controller(this.editFormCtrl,{$scope:this.$scope},true);
                ctrlInit().auditSaveTask(this.formData);
            }else {
                this.formData.taskId = this.currentTaskId;
                this.auditTask(this.formData);
            }
        }else if(!flag){
            this.dialogsManager.confirm({
                title: "确认提示",
                btn: ['否', '是'],
                content: '提交后，本项目将直接结束，不能再次编辑和更改！是否确定要放弃并结束本项目？',
                callback: () => {
                    this.auditTask({approved:flag});
                }
            })
        }
    }

    /**
     * 处理申请单中的日期
     */
    dealApplyDate(){
        this.formData.assetDisposeDetailList.forEach(data=>{
            data.createTime = null;
            data.lastUpdateTime = null;
            data.acquireDate = this.$filter('date')(data.acquireDate,'yyyy-MM-dd');
        });
    }
    
    /**
     * 返回上一级
     */
    goBack() {
        history.back();
    }

    /**
     * 查看或编辑不通过的节点数据
     * @param isEdit 是否是编辑
     * @param taskId 
     */
    showTaskInfo(isEdit, taskId) {
        this.isEdit = isEdit;
        this.getTaskForm(taskId,(form)=>{
            this.editFormCtrl = form;
            form.prototype.isEdit = isEdit;
            form.prototype.currentTaskId = this.currentTaskId;
            if(!this.formData||!isEdit){
                this.getFormData(taskId,data=>{
                    form.prototype[isEdit?'editForm':'detailForm'] = data;
                    this.openDialog(form, taskId,isEdit);
                });
                this.getNextAuditInfo(data=>{
                    form.prototype.nextAuditInfo = data;
                })
            }else{
                form.prototype.editForm = angular.copy(this.formData);
                this.openDialog(form, taskId,isEdit);
            }
        })
    }

    /**
     * 打开弹窗查看或者编辑
     * @param form
     */
    openDialog(form, taskId,isEdit) {
        let controller = {};
        if (isEdit!==undefined) {
            controller.controller = form;
            controller.controllerAs = 'assetForm';
            controller.onOpenCallback = ()=>{
                if(!this.formData){
                    this.getEditFormData();
                }
            };
        }
        let html = `<div class="dialog-header">
                        ${isEdit?'编辑':'查看'}
                    </div>
                    <div class="exit_content overflow_box">
                        <div class="review" id="disposeForm" compile-html="assetForm.getTemplate()"></div>
                    </div>`;
        let opts = {
            closeByDocument: false,
            className: 'asset lw-bdp',
            template: html,
            scope: this.$scope,
            plain: true
        };
        angular.extend(opts, controller);
        this.ngDialog.open(opts);
    };

    /**
     * 获取编辑后的数据
     */
    getEditFormData(){
        this.$scope.$on('formData',(event,data)=>{
            this.formData = data;
            this.$scope.$apply();
        })
    }
    
    /**
     * 获取外置表单数据
     * @param taskId
     */
    getFormData(taskId, callback) {
        this.ProjectInterface.getTaskFormData(taskId).then(res => {
            let formData = {};
            if(res.data.properties){
                formData = res.data.properties;
                formData.attachments = res.data.attachments;
            }else{
                formData = res.data;
            }
            callback&&callback(formData);
        });
    }

    /**
     * 获取最新的材料附件对象
     * @param attachments
     * @return {{}}
     */
    getNewAttachments(attachments) {
        let fileTypeMaxTime = {},
            attachmentList = {};
        for (let attachment of attachments) {
            if (!fileTypeMaxTime[attachment.type] ||
                fileTypeMaxTime[attachment.type] < attachment.time) {
                fileTypeMaxTime[attachment.type] = attachment.time;
            }
        }
        for (let attachment of attachments) {
            if (attachment.time == fileTypeMaxTime[attachment.type]) {
                attachmentList[attachment.type] = attachmentList[attachment.type] || [];
                attachmentList[attachment.type].push(attachment);
            }
        }
        return attachmentList;
    }

    /**
     * 提交处置材料
     */
    auditPostDispose() {
        this.auditDisable = false;
        if (this.isEdit === true) {
            this.ngDialog.closeAll();
        } else {
            this.editForm.taskId = this.currentTaskId;
            this.auditTask(this.editForm);
        }
    }

    /**
     * 获取通知方式
     * @param param
     */
    getAllNotice(param) {
        let isHave = false,
            index = 0;
        this.editForm.noticeTypeList.map((v, idx) => {
            if (param === v) {
                isHave = true;
                index = idx;
            }
        });
        if (isHave) {
            this.editForm.noticeTypeList.splice(index, 1);
        } else {
            this.editForm.noticeTypeList.push(param);
        }
    }

    findAuditedNodeArea(id){
        let targetElement = angular.element(document.querySelector(id));
        if(!targetElement[0]){
            targetElement = angular.element(document.querySelector('#approvalAttachment'));
        }
        targetElement.addClass('bor_dashed');
        let main_content = document.querySelector('.main_content');
        main_content.scrollTop = getAbsPoint(targetElement[0]).y;
        function getAbsPoint(e)
        {
            let x = e.offsetLeft;
            let y = e.offsetTop;
            while(e = e.offsetParent)
            {
                x += e.offsetLeft;
                y += e.offsetTop;
            }
            return {'x': x, 'y': y};
        };
    }
}

assetAuditFormCtrl.$inject = ['$state', '$stateParams', 'AssetInterface', '$config', '$compile', '$scope', '$sessionStorage', 'dialogsManager', 'ngDialog', '$filter', '$timeout', 'AssetApplyService', 'ProjectInterface', '$rootScope','$controller','$location']
