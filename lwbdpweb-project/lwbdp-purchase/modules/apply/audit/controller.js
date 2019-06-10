/**
 * @Author hejialin
 * @Description 描述
 */
import './audit.css'
import '../../../styles/purchaseProject.css';
export default class purchaseFormCtrl{
    constructor($stateParams,ProjectInterface,$compile,$scope,$sessionStorage,$config,dialogsManager,ngDialog,$controller,$state,purchaseService,$location){
        this.$scope = $scope;
        this.$state = $state;
        this.$config = $config;
        this.$location = $location;
        this.ngDialog = ngDialog;
        this.$controller = $controller;
        this.$compile = $compile;
        this.dialogsManager = dialogsManager;
        this.session = $sessionStorage;
        this.$stateParams = $stateParams;
        this.ProjectInterface = ProjectInterface;
        this.purchaseService = purchaseService;
        this.init();
    }

    init(){
        this.paramsInit();
        this.getAuditInfo(this.$stateParams.id);
        this.getTaskInfo(this.$stateParams.taskId);
    }

    /**
     * 参数初始化
     */
    paramsInit(){
        this.account = this.session.get('account');
        this.garden = this.session.get('currentGarden');
        this.isAudit = this.isAudit();
    }

    /**
     * 是否是审核页面
     * @return {boolean}
     */
    isAudit(){
        return this.$state.current.name.indexOf('form')>-1;
    }
    
    /**
     * 通过申请单ID获取任务节点信息
     * @param taskId
     */
    getTaskInfo(taskId) {
        if(this.isAudit&&taskId){
            //如果是审核页或者处置页面，进行数据初始化(并且是待办状态)
            this.ProjectInterface.getTaskInfoById(null,taskId).then(res => {
                this.currentTaskId = res.data.id;
                this.currentTask = res.data;
                this.getAuditForm(res.data);
            });
        }
    }

    /**
     * 是否需要获取审核表单
     * @param currentTask
     */
    getAuditForm(currentTask){
        //当办理人是当前用户并且是第一次办理时,请求表单
        if (currentTask.assignee == this.account.accountId && !currentTask.isRedo) {
            this.editForm = {};
            this.getTaskForm(this.currentTaskId,form=>{
                if(!form.prototype.getNextAuditInfo){
                    this.getNextAuditInfo(data=>{
                        this.nextAuditInfo = data;
                    });
                }
                form.prototype.lookAuditedTask = this.lookAuditedTask;
                this.auditFormCtrl = form;
            });
        }
    }

    /**
     * 获取下一节点审核信息（审核名称、及截止时间等）
     * @param key
     */
    getNextAuditInfo(callback) {
        if(this.currentTaskId){
            this.ProjectInterface.getNextTaskAudit(
                null, this.currentTaskId,
                this.garden.gardenId, 
                'approved', true
            ).then(res => {
                let nextAuditInfo = {};
                let nextTaskInfoList = res.data.nextTaskInfoList;
                nextAuditInfo.taskInfoList = nextTaskInfoList||[];
                nextAuditInfo.dueDate = res.data.dueDate;
                nextAuditInfo.statusName = res.data.statusDescription;
                callback&&callback(nextAuditInfo);
            })
        }
    }

    /**
     * 获取上面的审核状态外置表单
     * @param taskId 任务ID（默认当前任务ID）
     * @param callback 回调
     */
    getTaskForm(taskId,callback1) {
        this.ProjectInterface.getTaskForm(taskId || this.currentTaskId).then(res => {
            if (res.data.formType !== 'external') return false;
            let formHtml = this.$config.bdp.isUseExternalForm?eval(res.data.form):require('../../../formsjs/'+res.data.formKey).default;
            formHtml.prototype.taskName = res.data.taskName;
            callback1&&callback1(formHtml);
        });
    }

    /**
     * 表单审核
     */
    auditTask(data){
        data.taskId = this.currentTaskId;
        if(data.attachments&&data.attachments[0]){
            data.attachments.forEach(attachment=>{
                attachment.time = null;
            })
        }
        this.ProjectInterface.transactTask(data).then(res=>{
            this.dialogsManager.showMessage('操作成功！',{
                className:'success',
                callback:()=>{
                    this.auditCancel();
                }
            })
        });
    }

    /**
     * 查询审核不通过信息
     * @param id
     */
    getAuditInfo(id) {
        this.ProjectInterface.getTaskTransactInfo(id,true).then(res => {
            this.auditInfo = res.data;
        })
    }

    /**
     * 审核不通过 编辑/查看
     */
    showTaskInfo(isEdit,taskId){
        this.isEdit = isEdit;
        this.getTaskForm(taskId,(formCtrl)=>{
            formCtrl.prototype.isEdit = isEdit;
            formCtrl.prototype.taskId = taskId;
            formCtrl.prototype.auditCancel = this.auditCancel;
            formCtrl.prototype.currentTaskId = this.currentTaskId;
            this.editFormCtrl = formCtrl;
            formCtrl.prototype.attachmentType = this.auditConfig.attachmentType;
            formCtrl.prototype.configCache = this.auditConfig.cacheField;
            formCtrl.prototype.project = this.$scope.project;
            formCtrl.prototype.isDetail = false;
            if(this.formData && this.hasNewValue){
                formCtrl.prototype.editForm = angular.copy(this.formData);
            }
            if(isEdit&&!formCtrl.prototype.getNextAuditInfo){
                this.getNextAuditInfo(data=>{
                    formCtrl.prototype.nextAuditInfo = data;
                });
            }
            this.openDialog(formCtrl,taskId,isEdit);
        });
    }

    /**
     * 打开弹窗查看或者编辑
     * @param form
     */
    openDialog(formCtrl,taskId,isEdit) {
        let controller = {};
        let html = `<div class="dialog-header">${isEdit?'编辑':'查看'}</div>
                    <div class="review overflow_box" id="externalForm" 
                        compile-html="purchaseForm.getTemplate()">    
                    </div>`;
        let opts = {
            closeByDocument: false,
            className: 'lw-bdp purchase',
            template: html,
            scope: this.$scope,
            plain: true
        };
        controller.controller = formCtrl;
        controller.controllerAs = 'purchaseForm';
        controller.onOpenCallback = ()=>{
            if(isEdit){
                this.getFormCtrlData();
            }
        };
        angular.extend(opts, controller);
        this.ngDialog.open(opts);
    };

    /**
     * 放弃/重新提交外置表单数据
     */
    saveAuditData(flag,taskId){
        this.auditing = true;
        if(this.formData&&this.editFormCtrl){
            this.formData.approved = flag;
            if(this.editFormCtrl.prototype.saveAuditData){
                this.editFormCtrl.prototype.backUrl = this.backUrl;
                this.editFormCtrl.prototype.auditCancel = this.auditCancel;
                this.formData.taskId = this.currentTaskId;
                let ctrlInit = this.$controller(this.editFormCtrl,{$scope:this.$scope},true);
                ctrlInit().saveAuditData(this.formData);
            }else{
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
     * 获取外置表单里面处理的数据
     */
    getFormCtrlData(){
        this.$scope.$on('formData',(event,data)=>{
            this.formData = data;
            this.hasNewValue = true;
            data.uuid===undefined&&this.$scope.$apply();
        })
    }
    
    /**
     * 取消
     */
    auditCancel(isDialog){
        if(isDialog){
            this.$scope.closeThisDialog();
        }else{
            this.$location.path(this.backUrl);
        }
    }

    lookAuditedTask(taskKey){
        let taskID = document.querySelector('#'+taskKey),taskedID = document.getElementsByName(taskKey+'audit')[0];
        angular.element(taskID).addClass('red_bord');
        let scrpllTop = getAbsPoint(taskID).y;
        let main_content = document.querySelector('.main_content');
        main_content.scrollTop = scrpllTop;
        function getAbsPoint(e)
        {
            var x = e.offsetLeft;
            var y = e.offsetTop;
            while(e = e.offsetParent)
            {
                x += e.offsetLeft;
                y += e.offsetTop;
            }
            return {'x': x, 'y': y};
        };
    }


}
purchaseFormCtrl.$inject = ['$stateParams','ProjectInterface','$compile','$scope','$sessionStorage','$config','dialogsManager','ngDialog','$controller','$state','purchaseService','$location'];