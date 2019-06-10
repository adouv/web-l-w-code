/**
 * @Author hejialin
 * @Description 字典模块服务
 */
export default class dictionaryService{
    constructor(DaoService,$config){
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     * 获取园区类型
     * @param callback
     */
    getGardenTypeList(callback){
        this.DaoService.get(this.modules.GARDEN,'/dictionary/gardenTypes').then(res=>{
            callback&&callback(res);
        });
    }
}
dictionaryService.$inject = ['DaoService','$config'];