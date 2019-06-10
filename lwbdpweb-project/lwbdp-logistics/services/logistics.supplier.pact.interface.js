/**
 * @Author quanfeihu
 * @Description 后勤月采购单相关接口
 */
export default class logisticsSupplierPactInterface {

    constructor(DaoService,$config){
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    getList(condition){
        return this.DaoService.get(this.modules.LOGISTICS,'/supplierPact',condition)
    }

    /**
     * 食品供应单位
     */
    getFoodSupplyUnit() {
        return this.DaoService.get(this.modules.LOGISTICS, "/base_config/item/valid/simple/FOOD_SUPPLY_UNIT");
    }

    /**
     * 添加视频采购合同
     * @param params
     */
    addSupplierContract(params){
        return this.DaoService.post(this.modules.LOGISTICS, '/supplierPact',params);
    }

    /**
     * 更新采购合同
     * @param params
     */
    updateSupplierContract(params){
        return this.DaoService.put(this.modules.LOGISTICS, '/supplierPact',params);
    }

    /**
     * 删除采购合同
     */
    deleteSupplierContract(ids){
        return this.DaoService.delete(this.modules.LOGISTICS, '/supplierPact',{ids:ids});
    }

    /**
     * 查看合同详情
     */
    getSupplierContractInfo(id){
        return this.DaoService.get(this.modules.LOGISTICS, '/supplierPact/' + id);
    }

    export(condition){
        return this.DaoService.export(this.modules.LOGISTICS, '/supplierPact/import',condition);
    }

    validateName(name,id){
        return this.DaoService.get(this.modules.LOGISTICS, '/supplierPact/validate',{
            name:name,
            id:id
        });
    }

}
logisticsSupplierPactInterface.$inject= ['DaoService', '$config']
