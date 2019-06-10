/**
 * @Author hejialin
 * @Description 审核失败指令
 */
class auditFailCtrl{
    constructor($scope,$stateParams,ProjectInterface,$sessionStorage,$state){
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.session = $sessionStorage;
        this.ProjectInterface = ProjectInterface;
        this.init();
    }

    init(){
        this.getAuditInfo(this.$stateParams.id);
        this.account = this.session.get('account');
        this.isAudit = this.getIsAudit();
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
     * 是否是审核页面
     * @return {boolean}
     */
    getIsAudit(){
        return this.$state.current.name.indexOf('form')>-1;
    }
    
    toggleAuditList(flag){
        this.isAllShow = flag;
    }

    showTaskInfo(isEdit,taskId){
        this.$scope.taskInfo({isEdit:isEdit,taskId:taskId});
    }
}
auditFailCtrl.$inject = ['$scope','$stateParams','ProjectInterface','$sessionStorage','$state'];

export default class assetAuditFail{
    constructor(){
        this.restrict = 'E';
        this.scope = {
            auditInfo:'=',
            currentTask:'=',
            formData:'=',
            reapplyOrder:'&',
            taskInfo:'&'
        };
        this.replace = true;
        this.template = require('./audit.fail.html');
        this.controller = auditFailCtrl;
        this.controllerAs = 'auditFail';
    }
}