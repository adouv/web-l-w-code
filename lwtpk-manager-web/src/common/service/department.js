/**
 * @Author hejialin
 * @Description 组织结构服务
 */

export default class departmentService{
    constructor(DaoService,$config){
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     * 获取指定园区下的组织结构
     * @param gardenId
     */
    getDepartmentByGardenId(gardenId,callback){
        this.DaoService.get(this.modules.GARDEN,'/department/tree/garden/'+gardenId).then(res=>{
            callback&&callback(res);
        });
    }
}
departmentService.$inject = ['DaoService','$config'];