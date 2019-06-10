/**
 * @Author hejialin
 * @Description 描述
 */
import './audit.css'

export default class repairFormCtrl{
    constructor($stateParams,ProjectInterface,$compile,$scope,$sessionStorage,$config,dialogsManager,ngDialog,$controller,$state,$location){
        this.$state = $state;
        this.$scope = $scope;
        this.$location = $location;
        this.$config = $config;
        this.ngDialog = ngDialog;
        this.$controller = $controller;
        this.$compile = $compile;
        this.dialogsManager = dialogsManager;
        this.session = $sessionStorage;
        this.$stateParams = $stateParams;
        this.ProjectInterface = ProjectInterface;
        this.init();
    }

    init(){
        this.paramsInit();
        this.getTaskInfoById(this.$stateParams.id);
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
     * @param id
     */
    getTaskInfoById(id) {
        //如果是审核页或者处置页面，进行数据初始化(并且是待办状态)
        this.ProjectInterface.getTaskInfoById(id).then(res => {
            this.currentTaskId = res.data.id;
            this.currentTask = res.data;
            this.getAuditForm(res.data);
        });
    }
    
    /**
     * 是否需要获取审核表单
     * @param currentTask
     */
    getAuditForm(currentTask){
        //当办理人是当前用户并且是第一次办理时,请求表单
        if (this.isAudit&&currentTask.assignee == this.account.accountId && !currentTask.isRedo) {
            this.editForm = {};
            this.getTaskForm(this.currentTaskId,form=>{
                form.prototype.findAttachmentHTMLNode = this.findAttachmentHTMLNode;
                this.getNextAuditInfo(data=>{
                    this.nextAuditInfo = data;
                    this.formCtrl = form;
                });
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
                null,
                this.currentTaskId,
                this.garden.gardenId,
                'approved',true
            ).then(res => {
                let nextTaskInfoList = res.data.nextTaskInfoList[0];
                let nextAuditInfo = nextTaskInfoList||{};
                nextAuditInfo.dueDate = res.data.dueDate;
                nextAuditInfo.statusDescription = res.data.statusDescription;
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
            let formHtml = this.$config.bdp.isUseExternalForm?eval(res.data.form):require('../../../formsjs/'+res.data.formKey+'.js');
            callback1&&callback1(formHtml.default||formHtml);
        });
    }

    /**
     * 表单审核
     */
    auditTask(data){
        if(data.attachments){
            data.attachments.forEach(attachment=>{
                attachment.persistentState = null;
                attachment.time = null;
            });
        }
        data.taskId = this.currentTaskId;
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
     * 审核不通过 编辑/查看
     */
    showTaskInfo(isEdit,taskId){
        this.isEdit = isEdit;
        this.getTaskForm(taskId,(formCtrl)=>{
            formCtrl.prototype.isEdit = isEdit;
            this.editFormCtrl = angular.copy(formCtrl);
            if(isEdit===true&&!this.formData||isEdit===false){
                if(!this.editFormCtrl.prototype.getNextAuditInfo){
                    this.getNextAuditInfo(data=>{
                        this.editFormCtrl.prototype.nextAuditInfo = data;
                    });
                }
                this.getFormData(taskId,data=>{
                    if(data.properties){
                        this.editFormCtrl.prototype[!isEdit?'detailForm':'editForm'] = data.properties;
                    }else{
                        this.editFormCtrl.prototype[!isEdit?'detailForm':'editForm'] = angular.copy(data);
                    }
                    if(data.attachments){
                        this.editFormCtrl.prototype[!isEdit?'detailForm':'editForm'].attachments = data.attachments;
                    }
                    this.openDialog(this.editFormCtrl,isEdit);
                });
            }else{
                formCtrl.prototype.editForm = angular.copy(this.formData);
                this.openDialog(formCtrl,isEdit);
            }
        });
    }

    /**
     * 查看审批内容
     * @param id
     */
    findAttachmentHTMLNode(ids){
        if(angular.isString(ids)){
            let top = $('#'+ids).offset().top;
            $('.main_content').animate({'scrollTop': top},200);
            $('#'+ids).addClass('border_red');
        }else{
            for(let id of ids){
                let dom = $('#'+id);
                if(dom&&dom.length>0){
                    let top = $('#'+id).offset().top;
                    $('.main_content').animate({'scrollTop': top},200);
                    $('#'+id).addClass('border_red');
                    break;
                }
            }
        }


    }
    
    /**
     * 打开弹窗查看或者编辑
     * @param form
     */
    openDialog(formCtrl,isEdit) {
        let controller = {};
        controller.controller = formCtrl;
        controller.controllerAs = 'repairForm'
        controller.onOpenCallback = ()=>{
            if(!this.formData){
                this.getEditFormData();
            }
        };
        let html = `<div class="dialog-header">
                        ${isEdit?'编辑':'查看'}
                    </div>
                    <div class="exit_content overflow_box">
                        <div class="review" id="externalForm" compile-html="repairForm.getTemplate()"></div>
                    </div>`;
        let opts = {
            closeByDocument: false,
            className: 'lw-bdp repair',
            template: html,
            scope: this.$scope,
            plain: true,
        };
        angular.extend(opts, controller);
        let dia = this.ngDialog.open(opts);
    };

    /**
     * 获取外置表单数据
     * @param taskId
     * @param callback
     */
    getFormData(taskId,callback){
        this.ProjectInterface.getTaskFormData(taskId).then(res => {
            typeof callback==='function'&&callback(res.data);
        });
    }

    /**
     * 放弃/重新提交外置表单数据
     */
    saveAuditData(flag,taskId){
        if(flag&&this.formData){
            this.formData.approved = flag;
            if(this.editFormCtrl.prototype.auditSaveTask){
                this.editFormCtrl.prototype.backUrl = this.backUrl;
                this.editFormCtrl.prototype.auditCancel = this.auditCancel;
                this.formData.taskId = this.currentTaskId;
                let ctrlInit = this.$controller(this.editFormCtrl,{$scope:this.$scope},true);
                ctrlInit().auditSaveTask(this.formData);
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
     * 获取编辑后的数据
     */
    getEditFormData(){
        this.$scope.$on('formData',(event,data)=>{
            this.formData = data;
            this.$scope.$apply();
        })
    }
    
    /**
     * 取消
     */
    auditCancel(flag){
        if(flag!==undefined){
            this.ngDialog.closeAll();
        }else{
            this.$location.path(this.backUrl);
        }
    }
    
    /**
     * 返回上一页
     */
    goBack(){
        this.$location.path(this.backUrl);
    }
}
repairFormCtrl.$inject = ['$stateParams','ProjectInterface','$compile','$scope','$sessionStorage','$config','dialogsManager','ngDialog','$controller','$state','$location'];
