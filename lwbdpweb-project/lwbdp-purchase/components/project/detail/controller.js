/**
 * @Author hejialin
 * @Description 描述
 */
import './detail.css';

class purchaseProjectDetailCtrl {
    constructor(sidebarService, $stateParams, ProjectInterface, $location, purchaseInterface, $state, $config, purchaseService, $scope, ngDialog,WorkflowInterface,$controller) {
        this.$state = $state;
        this.$scope = $scope;
        this.$config = $config;
        this.$location = $location;
        this.$controller = $controller;
        this.$stateParams = $stateParams;
        this.sidebarService = sidebarService;
        this.purchaseService = purchaseService;
        this.purchaseInterface = purchaseInterface;
        this.ProjectInterface = ProjectInterface;
        this.WorkflowInterface = WorkflowInterface;
        this.ngDialog = ngDialog;
        this.init();
    }

    init() {
        this.paramsInit();
        this.getCrumbList();
        this.getApplyProject();
        this.getProjectStructure();
        this.getAuditConfig();
        this.getPurchaseDetailData();
        this.getStageTask(stages => {
            this.configTemplate(stages);
        });
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        this.projectId = this.$stateParams.id;
        this.formData = {};
        // 判断是否是详情页
        this.isDetail = this.$state.current.name.indexOf('detail') > 0
    }

    /**
     * 获取面包屑导航
     */
    getCrumbList() {
        this.sidebarService.getCrumbList(
            moduleAlias.PURCHASE,
            this.$stateParams.sidebarId,
            data => {
                this.crumbList = data;
                let urlSplit = data[data.length-1].url.split('/');
                this.currentStageId = urlSplit[urlSplit.length-1];
                this.isApply = urlSplit.indexOf('apply')>-1;
                this.$scope.backUrl = data[data.length-1].url;
            });
    }

    /**
     * 项目结构
     */
    getProjectStructure() {
        this.purchaseInterface.getProjectStructure(this.$stateParams.id).then(res => {
            this.treeData = res.data;
        });
    }

    /**
     * 页面跳转
     * @param id   taskType 0审核,1处置
     */
    goOtherForm(data) {
        if(data.stage==this.currentStageId&&data.taskType==this.isApply*1){
            this.$state.go("purchase.form", {
                taskId: data.taskId,
                id: data.id,
                sidebarId: this.$stateParams.sidebarId
            });
        }else{
            this.$state.go("purchase.detail", {
                taskId: data.taskId,
                id: data.id,
                sidebarId: this.$stateParams.sidebarId
            });
        }
    }

    /**
     * 获取阶段和节点的关系
     */
    getStageTask(callback) {
        this.purchaseInterface.getStageTask(this.$stateParams.id).then(res => {
            this.stage = res.data;
            callback && callback(res.data);
        });
    }

    /**
     * 获取详情页表单数据
     */
    getPurchaseDetailData() {
        this.purchaseInterface.getPurchaseDetail(this.$stateParams.id).then(res => {
            this.formData = this.handleFormData(res.data);
            if(this.formData.projectApproval){
                this.getPurchaseMethod();
            }
        });
    }

    configTemplate(stages){
        this.$scope.$watch('auditConfig',auditConfig=>{
            if(auditConfig){
                stages.forEach((data,index) => {
                    if(index==0){
                        data.template = require('./detail.html');
                        data.template += this.getTaskFormTemplate(data.taskKeyList,this.detailData);
                    }else{
                        data.template = this.getTaskFormTemplate(data.taskKeyList,this.detailData);
                    }
                });
            }
        })
    }

    /**
     * 获取所有采购方式
     */
    getPurchaseMethod(){
        this.purchaseInterface.getPurchaseMethod().then(res=>{
            this.purchaseMethods = res.data;
        });
    }

    handleFormData(detailData){
        let formData = {},detailFieldList=[];
        formData.capitalMaterialList = [{}];
        for (let key in detailData){
            detailFieldList.push(...detailData[key]);
        }
        for (let data of detailFieldList){
            if(angular.isString(data.value)){
                formData[data.fieldName] = JSON.parse(data.value);
            }else{
                formData[data.fieldName] = data.value;
            }
            if(angular.isArray(formData[data.fieldName])){
                formData[data.fieldName+'TaskKey'] = data.taskKey;
            }else if(angular.isObject(formData[data.fieldName])){
                formData[data.fieldName].taskKey = data.taskKey;
            }else {
                formData[data.fieldName+'TaskKey'] = data.taskKey;
            }
        }
        return formData;
    }

    /**
     * 获取节点表单对应的模板
     * @param taskKeyList
     * @returns {string}
     */
    getTaskFormTemplate(taskKeyList) {
        let template = '';
        taskKeyList.forEach(key=>{
            if(template.indexOf(this.$scope.auditConfig.templateField[key]||'')<0){
                template += this.$scope.auditConfig.templateField[key]||'';
            }
        });
        return template;
    }

    /**
     * 面包屑跳转
     * @param url
     */
    goCrumb(url) {
        this.$location.path(url);
    }

    /**
     * 本次节点的表单详细信息
     */
    getApplyProject() {
        this.ProjectInterface.getApplicationDetail(
            moduleAlias.PURCHASE,
            this.$stateParams.id
        ).then(res => {
            this.$scope.project = this.apply = res.data;
            this.handlePurchaseList(this.apply, this.apply.projectPurchaseItemList);
            //获取用户电话信息
            this.getAccountPhone(res.data.applyAccountId);
        })
    }

    handlePurchaseList(apply, list) {
        apply.orderList = [];
        apply.uploadList = [];
        list.forEach(data => {
            if (data.reUpload) {
                apply.uploadList.push(data);
            } else {
                apply.orderList.push(data);
            }
        });
    }

    /**
     * 获取详情页表单配置
     */
    getAuditConfig() {
        this.purchaseService.getAuditConfig(this.$stateParams.id, data => {
            this.$scope.auditConfig = data;
        });
    }

    /**
     * 获取联系人手机号
     * @param creatorId
     */
    getAccountPhone(creatorId) {
        this.ProjectInterface.getPersonPhone(creatorId).then(res => {
            let data = res.data;
            this.apply.creatorName = data.displayName;
            this.apply.cellphone = data.cellphone;
        })
    }

    goBack() {
        this.$location.path(this.$scope.backUrl);
    }

    goEdit() {
        this.$state.go('purchase.fromEdit', {id: this.$stateParams.id, sidebarId: this.$stateParams.sidebarId});
    }

    /**
     *  政府立项采购表弹窗
     */
    showProjectApprovalForm(name,taskKey) {
        this.openExternalFormDialog(name,taskKey);
    }

    openExternalFormDialog(name,data,attrName,taskKey){
        this.WorkflowInterface.getFormByTaskKey(this.apply.processConfigId,data.taskKey||taskKey).then(res=>{
            let form = this.$config.bdp.isUseExternalForm?eval(res.data.form):require('../../../formsjs/'+res.data.formKey).default;
            this.openDialog(name,data,form,attrName,true);
        });
    }

    openDialog(name,data,template,attrName,isExternalForm){
        let scope = this.$scope.$new();
        scope.template = template;
        if(isExternalForm){
            if(attrName){
                template.prototype.isDetail = true;
                template.prototype.editForm = {};
                template.prototype.editForm[attrName] = data;
            }else{
                template.prototype.editForm = data;
            }
            template.prototype.project = this.apply;
            template.prototype.isEdit = false;
            template.prototype.isDetail = true;
            template.prototype.configCache = this.$scope.auditConfig.cacheField;
        }else {
            scope.formData = data;
        }
        this.ngDialog.open({
            closeByDocument: false,
            disableAnimation: true,
            className: 'bdp layer_fixed purchase',
            template: `<div class="dialog-content-box">
                            <div class="title-box">
                                ${name}
                                <span class="iconfont icon-close del_btn" ng-click="closeThisDialog()"></span>
                            </div>
                            <div compile-html="purchaseForm.getTemplate()" class="h560-main-box"></div>
                        </div>`,
            controller:template,
            controllerAs:'purchaseForm',
            plain: true,
        })
    }

    goBackAudit(taskKey){
        let taskID = null,taskedID = null;
        if(Array.isArray(taskKey)){
            for(let key of taskKey){
                if(!taskID){
                    taskID = document.querySelector('#'+key);
                }
                if(!taskedID){
                    taskedID = document.getElementsByName(key+'audit')[0];
                }
                if(taskID&&taskedID)break;
            }
        }else{
            taskID = document.querySelector('#'+taskKey);
            taskedID = document.getElementsByName(taskKey+'audit')[0];
        }
        angular.element(taskID).removeClass('red_bord').children().eq(0).removeClass('red_bord');
        let main_content = document.querySelector('.main_content');
        let scrollTop = getAbsPoint(taskedID).y;
        main_content.scrollTop = scrollTop;
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

purchaseProjectDetailCtrl.$inject = ['sidebarService', '$stateParams', 'ProjectInterface', '$location', 'purchaseInterface', '$state', '$config', 'purchaseService', '$scope', 'ngDialog','WorkflowInterface','$controller'];

export default class purchaseProjectDetail {
    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.transclude = true;
        this.scope = {
            project: '=',
            auditConfig: '=',
            backUrl:'='
        };
        this.template = require('./project.html');
        this.controller = purchaseProjectDetailCtrl;
        this.controllerAs = 'purchaseDetail';
    }
}
