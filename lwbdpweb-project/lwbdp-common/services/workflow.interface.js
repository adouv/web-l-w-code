/**
 * Created by wuhao on 2017/6/30.
 */
export default class workFlowInterface{
    constructor(DaoService, ProcessAlias, $config,$q){
        this.$q = $q;
        this.modules = $config.modules;
        this.DaoService = DaoService;
        this.ProcessAlias = ProcessAlias;
    }
    /**
     *查询全部流程配置
     */
    getProcessConfig(moduleCode){
        return this.DaoService.get(this.modules.ASSET, '/processConfig/simple',{module: this.ProcessAlias.getProcessAliasByKey(moduleCode)});
    }
    /**
     *查询当前用户所有流程配置
     */
    getUserProcessConfig(moduleCode){
        return this.DaoService.get(this.modules.ASSET, '/processConfig/simple',{
            module: this.ProcessAlias.getProcessAliasByKey(moduleCode),
            isMyParticipate: true
        });
    }
    /**
     *设置默认流程配置
     * @param ids 流程配置的id串
     *        moduleCode 模块名
     */
    setProcessConfig(ids,moduleCode){
        return this.DaoService.put(this.modules.ASSET, '/processConfig/default',{
            ids:ids,
            module: this.ProcessAlias.getProcessAliasByKey(moduleCode)
        });
    }

    /**
     * 查询生效的流程配置
     */
    getValidProcessConfig(moduleCode){
        return this.DaoService.get(this.modules.ASSET, '/processConfig/valid/simple',{module: this.ProcessAlias.getProcessAliasByKey(moduleCode)});
    }

    /**
     * 获取侧边栏
     * @param processConfigIds 模块ID
     */
    getSidebarList(moduleId,processConfigIds){
        return this.DaoService.get(this.modules.REPAIR, '/processConfig/stage',{
            module:moduleId,
            processConfigIds:processConfigIds
        });
    }

    /**
     * 获取流程图
     * @param applyOrderId 申请单id
     * getDiagramFlow
     */
    getWorkflowChart(projectId) {
        return this.DaoService.get(this.modules.ASSET, '/diagramFlow/diagram/' + projectId)
    }

    /**
     * 获取被审核节点信息
     * @param taskId
     */
    getAuditedTaskInfo(taskId){
        return this.DaoService.get(this.modules.REPAIR,'/activiti/extend/auditedNode/'+taskId);
    }
    
    /**
     * 获取流程图详情
     * @param applyOrderId 申请单id
     * getDiagramFlowInfo
     */
    getWorkflowInfo(projectId) {
        return this.DaoService.get(this.modules.ASSET, '/diagramFlow/flowInfo/' + projectId)
    }

    /**
     * 获取通知方式
     */
    getNoticeMethods(callback) {
        let method = {
            list:[
                {itemName: '系统通知', itemValue: '1'},
                {itemName: '短信', itemValue: '2'},
                {itemName: '微信', itemValue: '3'},
                {itemName: '邮件', itemValue: '4'}
            ],
            default:'1'
        };
        callback&&callback(method);
    }
    /******    相对原型用户  */
    //     有关园区：
    //     id 园区ID；
    //     pId 园区父级id;
    //     name 名称;
    getGardenTypeList(){
        return this.DaoService.get(this.modules.GARDEN,"/dictionary/gardenTypes");
    }

    getFormByTaskKey(processConfigId,taskKey){
        return this.DaoService.get(this.modules.PURCHASE,'/bdp/activiti/taskForm',{processConfigId:processConfigId,taskKey:taskKey})
    }

}
workFlowInterface.$inject = ['DaoService', 'ProcessAlias', '$config','$q'];