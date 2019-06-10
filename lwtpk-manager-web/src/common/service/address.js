/**
 * @Author hejialin
 * @Description 省市区服务
 */

export default class addressService{
    constructor(DaoService,$config){
        this.modules = $config.modules;
        this.DaoService = DaoService;
    }

    /**
     * 获取省份列表
     */
    getProvinceList(callback){
        return this.DaoService.get(this.modules.GARDEN,'/address/province').then(res=>{
            callback&&callback(res);
        });
    }

    /**
     * 获取城市列表
     * @param provinceId
     */
    getCityListByProvince(provinceIds,callback){
        if(provinceIds.toString()){
            return this.DaoService.get(this.modules.GARDEN,'/address/city',{provinceIds:provinceIds.toString()}).then(res=>{
                callback&&callback(res);
            });
        }else{
            callback&&callback({data:[]});
        }
    }

    /**
     * 获取区县列表
     * @param cityId
     */
    getDistrictByCity(cityIds,callback){
        if(cityIds.toString()){
            return this.DaoService.get(this.modules.GARDEN,'/address/district',{cityIds:cityIds.toString()}).then(res=>{
                callback&&callback(res);
            });
        }else{
            callback&&callback({data:[]});
        }
    }
}
addressService.$inject = ['DaoService','$config'];