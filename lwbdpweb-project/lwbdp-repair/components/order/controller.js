/**
 * @Author hejialin
 * @Description 项目申请详情
 */
class repairProjectDetailCtrl{
    constructor(ProjectInterface,sidebarService,$stateParams,repairInterface,ngDialog,$scope,$location,$state,$rootScope,$sessionStorage){
        this.$scope = $scope;
        this.$state = $state;
        this.ngDialog = ngDialog;
        this.$rootScope = $rootScope;
        this.$stateParams = $stateParams;
        this.sidebarService = sidebarService;
        this.$sessionStorage = $sessionStorage;
        this.ProjectInterface = ProjectInterface;
        this.repairInterface = repairInterface;
        this.$location = $location;
        this.init();
    }

    init(){
        this.paramsInit();
        this.getCrumbList();
        this.getApplyProject();
        this.getAttachment();
        this.getAuditInfo(this.$stateParams.id);
    }

    /**
     * 参数初始化
     */
    paramsInit(){
        this.projectId = this.$stateParams.id;
        this.isAll = this.getIsAll();
        this.isAudit = this.getIsAudit();
        this.account = this.$sessionStorage.get('account');
    }
    
    /**
     * 获取面包屑导航
     */
    getCrumbList() {
        this.sidebarService.getCrumbList(
            moduleAlias.REPAIR,
            this.$stateParams.sidebarId,
            data => {
            this.crumbList = data;
            this.$scope.backUrl = data[data.length-1].url;
        });
    }

    /**
     * 查询审核不通过信息
     * @param id
     */
    getAuditInfo(id) {
        this.ProjectInterface.getTaskTransactInfo(id).then(res => {
            this.auditInfo = res.data;
        })
    }
    
    /**
     * 是否是全单位收文
     * @return {boolean}
     */
    getIsAll(){
        return this.$stateParams.sidebarId.indexOf('all')>-1;
    }
    
    /**
     * 是否是审核页面
     * @return {boolean}
     */
    getIsAudit(){
        return this.$state.current.name.indexOf('form')>-1;
    }
    
    /**
     * 本次节点的表单详细信息
     */
    getApplyProject() {
        this.ProjectInterface.getApplicationDetail(
            moduleAlias.REPAIR,
            this.$stateParams.id
        ).then(res => {
            this.$scope.detail = res.data;
            this.apply = res.data;
            //获取用户电话信息
            this.getAccountPhone(res.data.applyAccountId);
        })
    }

    /**
     * 获取详情附件
     */
    getAttachment(){
        this.ProjectInterface.getAttachment(this.$stateParams.id).then(res=>{
            this.hasProject = res.data.hasProject === 'true';
            if(res.data.attachments&&res.data.attachments[0]){
                let attachments = this.getTypeAttachments(res.data.attachments);
                this.attachments = this.getNewAttachments(attachments);
                this.$scope.auditedTaskKey = res.data.taskKeyAttachmentShip[res.data.auditedNode.taskKey]||this.hasProject;
            }
            if(this.hasProject){
                this.getUsefulData();
            }
        });
    }

    /**
     * 获取使用的数据
     */
    getUsefulData(){
        this.ProjectInterface.getUsefulData(this.$stateParams.id).then(res => {
            if(res.data['projectApproval']){
                this.$scope.project = JSON.parse(res.data['projectApproval'].value);
            }
        });
    }
    
    againToApply(id){
        this.$state.go('repair.formEdit',{id:id,sidebarId:this.$stateParams.sidebarId});
    }
    
    /**
     * 获取带文件类型的附件
     * @param attachments
     * @return {{}}
     */
    getTypeAttachments(attachments){
       let attachment = {};
        attachments.forEach(att=>{
            attachment[att.type] = attachment[att.type]||[];
            attachment[att.type].push(att);
        });
       return attachment;
    }

    /**
     * 获取最新附件
     * @param attachments
     * @return {*}
     */
    getNewAttachments(attachments){
        for(let type in attachments){
            let timeAttachment = {},maxTime=0;
            attachments[type].forEach(attachment=>{
                if(timeAttachment[attachment.time]){
                    timeAttachment[attachment.time].push(attachment);
                }else{
                    timeAttachment[attachment.time] = [attachment];
                }
                if(maxTime<attachment.time){
                    maxTime = attachment.time;
                }
            });
            attachments[type] = timeAttachment[maxTime];
        }
        return attachments;
    }

    backAuditForm(id){
        let review = document.querySelector('#review');
        $('.main_content').animate({'scrollTop': review.offsetTop},200);
        $('#'+id).removeClass('border_red');
    }
    
    /**
     * 打开立项材料弹窗
     */
    openProject(showArea){
        this.$scope.showArea = showArea;
        console.log(this.$scope);
        this.ngDialog.open({
            closeByDocument: false,
            className: 'lw-bdp repair',
            template: require('./hadProject.html'),
            scope: this.$scope,
            plain: true
        })
    }
    
    /**
     * 获取联系人手机号
     * @param creatorId
     */
    getAccountPhone(creatorId) {
        this.repairInterface.getPersonPhone(creatorId).then(res => {
            let data = res.data;
            this.apply.creatorName = data.displayName;
            this.apply.cellphone = data.cellphone;
        })
    }

    goJump(url){
        this.$location.path(url);
    }

    goBack(){
        history.back();
    }

    downloadDoc(filename){
        this.ProjectInterface.downloadFile('repair',filename);
        /*console.log(filename);
        window.location.href = '/assets/'+filename;*/
    }
}
repairProjectDetailCtrl.$inject = ['ProjectInterface','sidebarService','$stateParams','repairInterface','ngDialog','$scope','$location','$state','$rootScope','$sessionStorage'];

export default class repairProjectDetail{
    constructor(){
        this.restrict = 'EA';
        this.replace = true;
        this.transclude = true;
        this.scope = {
            currentTask:'=',
            showTaskInfo:'&',
            saveAuditData:'&',
            formData:'=',
            backUrl:'=',
            auditedTaskKey:'=',
            detail:'=projectDetail'
        };
        this.template = require('./project.html');
        this.controller = repairProjectDetailCtrl;
        this.controllerAs = 'projectDetail';
    }
    link(scope,elem,attrs){
    }
}
