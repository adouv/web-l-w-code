/**
 * @Author xuhongbo
 * @Description 申请审核处置接口
 */

export default class AssetInterface {
    constructor(DaoService, $config,ProcessAlias) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
        this.ProcessAlias = ProcessAlias
    }

    /**
     * 获取申请单审核情况
     * @param id 申请单id
     * 返回值：
     * taskKey： 任务key
     * taskName： 任务名称
     * isApproved： 是否通过(true/false)
     * commentList：意见列表{id：意见id， fullMessage 意见信息  }
     * accountId： 处理人
     * displayName： 处理人显示名称
     * auditDate： 审核日期
     * signLabel： 签字标签（‘签字’或者是‘负责人签字’）
     * stampLabel： 盖章标签（‘（公章）’或者是‘（财务章）’）
     */
    getAssetAudit(id) {
        return this.DaoService.get(this.modules.ASSET, '/project/asset/auditCondition/' + id)
    }

    /**
     * 页面功能：资产基本库的导出
     * 资产基本库列表
     * @param offset 分页初始位置 Y
     * @param size   分页大小    Y
     * @param keywords   关键字   N
     * @param assetType   资产类型   N
     * @param acquireWay    取得方式   N
     * @param gardenId   园区id   N
     * @param params
     */
    exportExcel(params) {
        return this.daoService.export(this.modules.ASSET, "/asset/library/excel", params);
    }

    /**
     * 获取附件
     * @param {申请单id} taskid
     */
    getAttachment(id) {
        return this.DaoService.get(this.modules.ASSET, '/activiti/attachment/' + id)
    }

    /**
     * 根据申请单id集合查询申请单列表
     * @param taskKey  申请单id  Y
     * @param offset 开始条数  Y
     * @param size   条数    Y
     * @return []
     */
    getApplyList(moduleCode,processConfigId,stage,taskKey,gardenIds,accountId,categoryList,offset,size) {
        return this.DaoService.get(this.modules.ASSET, '/project/library', {
            type: this.ProcessAlias.getProcessAliasByKey(moduleCode),
            processConfigId: processConfigId,
            stage: stage,
            taskKey: taskKey,
            gardenIds: gardenIds,
            accountId:accountId,
            categoryList: categoryList,
            offset: offset,
            size: size
        });
    }

    /**
        校验资产编号是否可用
        * @param assetNo 需要校验的资产编号
        * @return @number 资产数量（资产编号分隔后的数量）
    */
    validateAssetNo(assetNo) {
        return this.DaoService.get(this.modules.ASSET, '/project/asset/validation/assetNo', {assetNo:assetNo})
    }

    /*
        校验中小学办学条件达标系统编号是否可用
        * @param systemNo 需要校验的达标系统编号
        * @return @number 资产数量（资产编号分隔后的数量）
    */
    validateSystemNo(systemNo) {
        return this.DaoService.get(this.modules.ASSET, '/project/asset/validation/systemNo', {systemNo:systemNo})
    }

}

AssetInterface.$inject = ['DaoService', '$config','ProcessAlias',];