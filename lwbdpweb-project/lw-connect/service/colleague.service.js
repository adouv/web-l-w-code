export default class colleagueService {
    constructor(DaoService, $config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }
    /**
     * 获取人员列表
     */
     getPersonList(gardenId){
        return this.DaoService.get(this.modules.GARDEN, '/account/garden/'+gardenId)
     }
      /**
     * 获取组织列表
     */
     getDepartmentList(gardenId){
        return this.DaoService.get(this.modules.GARDEN, '/department/tree/garden/'+gardenId)
     }
     /**
     * 获取园区列表
     */
     getTreeData(param){
        // return this.DaoService.get(this.modules.GARDEN, '/as/accountSelector/buildJsonData',param)
        return this.DaoService.get(this.modules.GARDEN, '/account/buildJsonData',param)
     }
     /**
      * 获取人员信息
      * @param {*} id 
      */
     getAccountDetail(id){
        return this.DaoService.get(this.modules.GARDEN, '/contact/'+id);
     }
     /**
      * 获取连接内容
      */
      getConnection(){
          return this.DaoService.get(this.modules.CONNECTION, '/categoryAccount')
      }
}
colleagueService.$inject = ['DaoService', '$config'];