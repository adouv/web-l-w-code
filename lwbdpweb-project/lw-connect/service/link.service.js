export default class linkDataService {
    constructor(DaoService, $config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

     /**
      * 获取连接内容
      */
      getConnection(){
          return this.DaoService.get(this.modules.CONNECTION, '/categoryAccount')
      }
      /**
       * 置顶
       */
      setItTop(param){
          return this.DaoService.put(this.modules.CONNECTION, '/categoryAccount',param)
      }
      /**
       * 取消连接
       */
      cancelLink(param){
          return this.DaoService.delete(this.modules.CONNECTION, '/categoryAccount',param)
      }
      /**
       * 按类型搜索连接内容
       */
      searchByType(param){
        return this.DaoService.get(this.modules.CONNECTION, '/category/'+param.type,{keywords:param.keywords})
      }
      /**
       * 建立连接
       */
      setUpConnection(param){
        return this.DaoService.post(this.modules.CONNECTION, '/categoryAccount',param)
      }
}
linkDataService.$inject = ['DaoService', '$config'];