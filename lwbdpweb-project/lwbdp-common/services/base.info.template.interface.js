export default class BaseInfoTemplateInterface {

    constructor(DaoService,$config) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }

    /**
     *查询所有模块
     */
    getModules(){
        return this.DaoService.get(this.modules.BASEINFO, '/dictionary/item/BASE_INFO_MODULE');
    }

    /**
     *查询头
     */
    getTitles(module){
        return this.DaoService.get(this.modules.BASEINFO, '/baseInfo/template/'+module);
    }

    saveTitle(module,names){
        return this.DaoService.post(this.modules.BASEINFO, '/baseInfo/template',{moduleCode:module, names:names});
    }

    editTitle(id,module,name){
        return this.DaoService.put(this.modules.BASEINFO, '/baseInfo/template',{id:id,moduleCode:module, name:name});
    }


    exchange(id1,id2){
        return this.DaoService.put(this.modules.BASEINFO, '/baseInfo/template/exchange',{id1:id1,id2:id2});
    }


    changeVisible(titles,visible){
        return this.DaoService.put(this.modules.BASEINFO, '/baseInfo/template/visible',{
            ids:titles.map((title)=> title.id).join(','),
            visible:visible
        });
    }

    downloadTemplate(moduleCode){
        return this.DaoService.export(this.modules.BASEINFO, '/baseInfo/template/export/'+moduleCode);
    }


    setMax(moduleCode,id){
        return this.DaoService.put(this.modules.BASEINFO, '/baseInfo/template/max',{
            moduleCode:moduleCode,
            id:id
        });
    }

    setMin(moduleCode,id){
        return this.DaoService.put(this.modules.BASEINFO, '/baseInfo/template/min',{
            moduleCode:moduleCode,
            id:id
        });
    }

    getUploadTemplateUrl(moduleCode){
        return this.modules.BASEINFO+ '/baseInfo/template/import/'+moduleCode;
    }

    /* uploadTemplate(moduleCode,file){
        return this.DaoService.post(this.modules.BASEINFO, '/baseInfo/template/import/'+moduleCode,{
            filedata:file
        });
    }*/


}

BaseInfoTemplateInterface.$inject = ['DaoService', '$config'];