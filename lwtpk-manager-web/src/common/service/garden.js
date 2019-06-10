/**
 * @Author hejialin
 * @Description 园区模块服务
 */
export default class gardenService{
    constructor(DaoService,$config){
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }
    
    /**
     * 获取所有园区列表
     * @param gardenTypeId
     * @param isUserControlStrategy
     */
    getSelectGardenList(isUserControlStrategy,callback){
        this.DaoService.get(this.modules.GARDEN,'/garden/garden-district',{
            isUserControlStrategy:isUserControlStrategy
        }).then(res=>{
            callback&&callback(res);
        });
    }
    
    /**
     * 获取所有园区列表
     * @param gardenTypeId
     * @param isUserControlStrategy
     */
    getVisualGardenList(gardenTypeId,isUserControlStrategy,callback){
        let params = {},response;
        params.isUserControlStrategy = isUserControlStrategy;
        if(gardenTypeId && gardenTypeId != null &&  gardenTypeId != ''){
            params.gardenTypeId = gardenTypeId;
        }
        this.DaoService.get(this.modules.GARDEN,'/garden/simple/group-strategy',params).then(res=>{
            let results = new Array();
            for(let item of res.data){
                results.push({id:item.gardenId, name:item.gardenName});
            }
            callback&&callback({data:results});
        });
    }

    /**
     * 根据账户ID查询园区信息
     * @param accountIds
     * @param callback
     */
    getGardenListByAccount(accountIds,callback){
        this.DaoService.get(this.modules.GARDEN,'/garden/account',{accountIds:accountIds.join(',')}).then(res=>{
            callback&&callback(res);
        });
    }


    getGardenInfo(gardenId, callBack){
        this.DaoService.get(this.modules.GARDEN,'/garden/simple',{gardenIds:gardenId}).then(res=>{
            if(res && res.data){
                callBack&&callBack(res.data[0]);
            }
        });
    }


}
gardenService.$inject = ['DaoService','$config'];