/**
 * @Author 
 * @Description 修缮接口
 */
export default class repairInterface {
    constructor(DaoService, $config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
        this.config = $config;
    }

    /**
     * 获取立项材料
     * wuh：不合理(需要重构)
     */
    getMaterial(id, taskKey) {
        return this.DaoService.get(this.modules.REPAIR, '/activiti/extend/history/task', {
            businessKey: id,
            taskKey: taskKey
        })
    }

    /**
     * 获取手机号
     */
    getPersonPhone(accoundId) {
        return this.DaoService.get(this.modules.GARDEN, '/contact/' + accoundId)
    }

    //校验申请单名称
    validateName(projectId, projectName) {
        return this.DaoService.get(this.modules.REPAIR, '/project/repair/name', {
                id: projectId,
                name: projectName
        })
    }

    getCapitalNumber(){
        return this.DaoService.get(this.modules.BILL,'/capital',)
    }
    
    /**
     * 导出excel
     * @param params
     */
    exportExcel(params){
        this.DaoService.export(this.modules.REPAIR, '/repair/excel',params)
    }

}

repairInterface.$inject = ['DaoService', '$config'];