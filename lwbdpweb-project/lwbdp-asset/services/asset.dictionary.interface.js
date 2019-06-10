/**
 * Created by wuhao on 2017/5/5.
 */

export default class AssetDictionaryInterface {
    constructor(DaoService, $config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     *获取处置方向
     */
    getValidDisposeDirection(){
        return this.DaoService.get(this.modules.ASSET, '/base_config/item/valid/simple/DISPOSE_DIRECTION');
    }

    /**
     * 获取申请原因
     */
    getValidAssetApplyReason(){
        return this.DaoService.get(this.modules.ASSET, '/base_config/item/valid/simple/ASSET_APPLY_REASON');
    }

    /**
     * 获取资产处置类型
     *@return []
     * id：字典项ID
     * name：字典项名称
     */
    getDisposeType() {
        return this.DaoService.get(this.modules.ASSET, '/base_config/item/simple/DISPOSE_TYPE');
    }

    /**
     *获取处置方式
     */
    getValidDisposeType(){
        return this.DaoService.get(this.modules.ASSET, '/base_config/item/valid/simple/DISPOSE_TYPE');
    }

    /**
     * 获取资产大类
     *@return []
     * id：字典项ID
     * name：字典项名称
     */
    getAssetType() {
        return this.DaoService.get(this.modules.ASSET, '/base_config/item/simple/ASSET_TYPE');
    }

    /**
     * 获取资产类型
     */
    getValidAssetType(){
        return this.DaoService.get(this.modules.ASSET, '/base_config/item/valid/simple/ASSET_TYPE');
    }

    /**
     * 获取资产取得方式
     *@return []
     * id：字典项ID
     * name：字典项名称
     */
    getAcquireway() {
        return this.DaoService.get(this.modules.ASSET, '/base_config/item/simple/ACQUIRE_WAY');
    }

    /**
     * 获取取得方式
     */
    getValidAcquireWay(){
        return this.DaoService.get(this.modules.ASSET, '/base_config/item/valid/simple/ACQUIRE_WAY');
    }

    /**
     *查询任务处置状态
     */
    getTaskDisposeStatus(item){
        return this.DaoService.get(this.modules.ASSET, '/dictionary/item/'+(item||'TASK_DISPOSE_STATUS'));
    }

    /**
     *查询项目状态
     */
    getProjectStatus(){
        return this.DaoService.get(this.modules.ASSET, '/dictionary/item/PROJECT_STATUS');
    }

}


AssetDictionaryInterface.$inject = ['DaoService', '$config'];