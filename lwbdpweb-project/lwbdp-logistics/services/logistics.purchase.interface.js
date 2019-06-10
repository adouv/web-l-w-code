/**
 * @Author quanfeihu
 * @Description 后勤月采购单相关接口
 */
export default class logisticsPurchaseInterface {

    constructor(DaoService,$config){
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    getList(condition){
        return this.DaoService.get(this.modules.LOGISTICS,'/purchase',condition);
    }

    getById(id){
        return this.DaoService.get(this.modules.LOGISTICS,'/purchase/'+id);
    }

    getPurchaseCategory(){
        return this.DaoService.get(this.modules.BASEINFO, '/base_config/item/valid/simple/PURCHASE_CATEGORY');
    }

    getSatisfiedLevel(){
        return this.DaoService.get(this.modules.BASEINFO, '/dictionary/item/SATISFY_DEGREE');
    }

    getSuppliers(){
        return this.DaoService.get(this.modules.BASEINFO, '/base_config/item/valid/simple/FOOD_SUPPLY_UNIT');
    }


    submit(model){

        if(model.id){
            return this.DaoService.put(this.modules.LOGISTICS,'/purchase',model);
        }else{
            return this.DaoService.post(this.modules.LOGISTICS,'/purchase',model);
        }
    }

    export(conditions){
        return this.DaoService.export(this.modules.LOGISTICS,'/purchase/import',conditions);
    }

    deletePurchaseOrder(id){
        return this.DaoService.delete(this.modules.LOGISTICS,'/purchase/'+id);
    }

    validateReportTime(id,gardenId,reportTime){
        return this.DaoService.get(this.modules.LOGISTICS,'/purchase/validate',{id:id,gardenId:gardenId,reportTime:reportTime});
    }



}
logisticsPurchaseInterface.$inject= ['DaoService', '$config']
