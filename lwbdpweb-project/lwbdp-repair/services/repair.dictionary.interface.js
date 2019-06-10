/**
 * Created by wuhao on 2017/6/29.
 */
/**
 * @Author
 * @Description 修缮接口
 */
export default class repairDictionaryInterface {
    constructor(DaoService, $config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     * 查询修缮的项目大类
     */
    getProjectCategory() {
        return this.DaoService.get(this.modules.REPAIR, '/base_config/item/valid/simple/REPAIR_PROJECT_CATEGORY');
    }

    /**
     * 查询项目优先级
     */
    getPriority() {
        return this.DaoService.get(this.modules.REPAIR, '/base_config/item/valid/simple/REPAIR_PRIORITY');
    }

    /**
     * 查询项目状态
     * @return []
     */
    getProjectStatus() {
        return this.DaoService.get(this.modules.REPAIR, '/dictionary/item/PROJECT_STATUS');
    }

    /**
     * 查询处置任务状态
     * @return []
     */
    getDisposeStatus() {
        return this.DaoService.get(this.modules.REPAIR, '/dictionary/item/TASK_DISPOSE_STATUS');
    }

    /**
     * 查询审核任务状态
     * @return []
     */
    getAuditStatus() {
        return this.DaoService.get(this.modules.REPAIR, '/dictionary/item/TASK_AUDIT_STATUS');
    }
}

repairDictionaryInterface.$inject = ['DaoService', '$config'];