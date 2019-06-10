export default class baseInfoReadInterface {
    constructor(DaoService,$config){
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    updateReadStatus(id){
        return this.DaoService.post(this.modules.LOGISTICS,'/baseInfoRead',{
            baseInfoId:id
        });
    }




}
baseInfoReadInterface.$inject= ['DaoService', '$config'];
