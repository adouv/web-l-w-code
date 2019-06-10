/**
 * @Author hejialin
 * @Description 流程配置接口
 */

export default class RepairWorkflowInterface{
    constructor(DaoService,$config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }


    //TODO:wuh 智朋提供接口后，把下面的四个方法替换成getStageTasks
    /**
     * 获取修缮中储备的流程节点
     */
    getRepairProcessNodesReserve (stageId){
        return this.DaoService.get(this.modules.REPAIR, '/processConfig/stage/task/'+stageId)
    }

    /**
     * 获取修缮中前期的流程节点
     */
    getRepairProcessNodesEarly (){
        return this.DaoService.get(this.modules.REPAIR, '/process/activities/repair/early')
    }

    /**
     * 获取修缮中立项的流程节点
     */
    getRepairProcessNodesEstablish (){
        return this.DaoService.get(this.modules.REPAIR, '/process/activities/repair/establish')
    }

    /**
     * 获取修缮中后期的流程节点
     */
    getRepairProcessNodesLate (){
        return this.DaoService.get(this.modules.REPAIR, '/process/activities/repair/late')
    }

}

RepairWorkflowInterface.$inject = ['DaoService','$config'];
