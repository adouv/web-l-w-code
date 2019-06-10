/**
 * @Author hejialin
 * @Description 基础数据平台公共接口
 */
export default class bdpInterface{
    constructor(DaoService,$config){
        this.modules = $config.modules;
        this.DaoService = DaoService;
    }

    /**
     * 保存通讯录
     */
    saveContact(contact) {
        contact.lastUpdateTime = null;
        return this.DaoService.put(this.modules.GARDEN, '/contact',contact)
    }
}
bdpInterface.$inject = ['DaoService','$config'];