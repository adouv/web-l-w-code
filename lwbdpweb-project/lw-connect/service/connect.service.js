export default class connectService {
    constructor(DaoService, $config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
        this.filepath = $config.file.PATH;
    }
     /**
      * 获取人员信息
      *@param accountId
      */
      getUserDetail(accountId){
          return this.DaoService.get(this.modules.GARDEN, '/contact/'+accountId);
      }
      /**
      * 更新人员信息
      *@param {} 人员信息
      */
      saveUserInfo(param){
          return this.DaoService.put(this.modules.GARDEN, '/contact',param);
      }
      /**
      * 保存新头像
      *@param {} 头像图片信息
     */
      saveUserImg(param){
          return this.DaoService.post(this.modules.FILESERVER, '/fs/file/upload64Bit',param);
      }
      /**
      * 更新用户头像
      *@param 头像图片路径
     */
      updateUserImgUserImg(param){
          return this.DaoService.put(this.modules.GARDEN, '/account/image',param);
      }
      /*
      * 校验手机号唯一
      * @param 手机号
      * */
      validationCellphone(param){
          return this.DaoService.get(this.modules.GARDEN, '/contact/validation/cellphone',param);
      }

}
connectService.$inject = ['DaoService', '$config'];