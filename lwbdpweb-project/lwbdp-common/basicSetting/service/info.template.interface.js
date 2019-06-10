export default class BaseInfoTemplateInterface {
    constructor(DaoService,$config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     *查询所有模块
     */
    getModules(){
        return this.DaoService.get(this.modules.LOGISTICS, '/dictionary/item/BASE_INFO_MODULE');
    }


    /**
     *查询头
     */
    getTitles(module){
        return this.DaoService.get(this.modules.LOGISTICS, '/baseInfo/template/'+module);
    }

    saveTitle(module,names){
        return this.DaoService.post(this.modules.LOGISTICS, '/baseInfo/template',{moduleCode:module, names:names});
    }

    editTitle(id,module,name){
        return this.DaoService.put(this.modules.LOGISTICS, '/baseInfo/template',{id:id,moduleCode:module, name:name});
    }


    exchange(id1,id2){
        return this.DaoService.put(this.modules.LOGISTICS, '/baseInfo/template/exchange',{id1:id1,id2:id2});
    }


    changeVisible(titles,visible){
        return this.DaoService.put(this.modules.LOGISTICS, '/baseInfo/template/visible',{
            ids:titles.map((title)=> title.id).join(','),
            visible:visible
        });
    }
}

BaseInfoTemplateInterface.$inject = ['DaoService','$config'];