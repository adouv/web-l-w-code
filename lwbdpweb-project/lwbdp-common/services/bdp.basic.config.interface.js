/**
 * Created by wuhao on 2017/7/1.
 */
export default class BaseConfigInterface {
    constructor(DaoService, $config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     * 添加资产列表
     * @param []
     * @param id  id   N
     * @param name   名称    N
     * @param isHidden   是否隐藏,‘1’为隐藏    Y
     * @param isDelete   是否删除,‘1’为已删除    N
     * @param lastUpdateUser   更新人    N
     * @param parentId   父id    Y
     * @param createTime   创建时间    N
     * @param lastUpdateTime 修改时间 N
     */
    addBaseConfig(arr) {
        return this.DaoService.post(this.modules.ASSET, '/base_config', {
            baseConfigVoList: arr
        })
    }

    /**
     * 基础设置列表
     * @param offset 分页初始位置 Y
     * @param size   分页大小    Y
     * @return []
     */
    getBaseConfig(json) {
        return this.DaoService.get(this.modules.ASSET, '/base_config', json)
    }

    /**
     * 查询资产列表
     * @param offset 分页初始位置 Y
     * @param size   分页大小    Y
     * @param keywords   关键字    N
     * @return []
     */
    getMinlifecycleList(json) {
        return this.DaoService.get(this.modules.ASSET, '/asset/minlifecycle', json)
    }
    /**
     * 添加资产列表
     * @param name 资产小类名称 Y
     * @param minLifecycle   最低使用年限    Y
     * @param description   备注    N
     */
    addMinlifecycle(json) {
        return this.DaoService.post(this.modules.ASSET, '/asset/minlifecycle', json)
    }

    /**
     * 查看流程配置更新日志
     * @param 流程配置id
     * @return {}
     */
    getProcessConfiglog(params){
        return this.DaoService.get(this.modules.ASSET,'/base_config/operationlog/process',params);
    }

    /**
     * 查看模板字典更新日志
     * @param 流程配置id
     * @return {}
     */
    getBaseConfiglog(params){
        return this.DaoService.get(this.modules.ASSET,'/base_config/operationlog',params);
    }

    /**
     * 资产根据审批单号查询审批单
     */
    getApprovalSheet(param){
        return this.DaoService.get(this.modules.ASSET,'/project/asset/approvalForm/' + param);
    }
}

BaseConfigInterface.$inject = ['DaoService', '$config'];