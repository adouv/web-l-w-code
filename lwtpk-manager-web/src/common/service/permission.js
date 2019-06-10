/**
 * @Author hejialin
 * @Description 组织结构服务
 */

export default class permissionService{
    constructor(DaoService,$config){
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     * 获取指定园区下的权限
     * @param gardenId
     */
    getPermissionByGardenId(gardenId,callback){
        this.DaoService.get(this.modules.GARDEN,'/permission/simple/garden/'+gardenId).then(res=>{
            callback&&callback(res);
        });
    }
}
permissionService.$inject = ['DaoService','$config'];