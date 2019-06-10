/**
 * Created by wuhao on 2017/7/1.
 */
export default class AssetLibraryInterface {
    constructor(DaoService, $config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     * 获取资产库列表
     * @param gardenId 园区id   N
     * @param acquireWay 取得方式   N
     * @param assetType 资产类型   N
     * @param keywords 关键字   N
     * @param offset 分页初始位置 Y
     * @param size 分页大小    Y
     */
    getList(gardenId, acquireWay, assetType, keywords, offset, size){
        return this.daoService.get(this.modules.ASSET, "/asset/library", {
            gardenId: gardenId,
            acquireWay: acquireWay,
            assetType: assetType,
            keywords: keywords,
            offset: offset,
            size: size
        });
    }

    /**
     * 导出资产库列表
     * @param gardenId 园区id   N
     * @param acquireWay 取得方式   N
     * @param assetType 资产类型   N
     * @param keywords 关键字   N
     * @param offset 分页初始位置 Y
     * @param size 分页大小    Y
     */
    exportExcel(gardenId, acquireWay, assetType, keywords, offset, size) {
        return this.daoService.export(this.modules.ASSET, "/asset/library/excel", {
            gardenId: gardenId,
            acquireWay: acquireWay,
            assetType: assetType,
            keywords: keywords,
            offset: offset,
            size: size
        });
    }

    /**
     * 查询资产库详情
     */
    getDetail(id){
        return this.daoService.get(this.modules.ASSET, "/asset/library/"+ id);
    }
}

AssetLibraryInterface.$inject = ['DaoService', '$config'];