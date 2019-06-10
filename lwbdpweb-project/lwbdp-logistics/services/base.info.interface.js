export default class baseInfoInterface {

    constructor(DaoService,$config){
        this.DaoService = DaoService;
        this.modules = $config.modules;
    }


    getTitles(moduleCode){
        return this.DaoService.get(this.modules.LOGISTICS,'/baseInfo/template/title/'+moduleCode);
    }

    getList(conditions){
        return this.DaoService.get(this.modules.LOGISTICS,'/baseInfo',conditions);
    }

    getInfo(moduleCode,id){
        return this.DaoService.get(this.modules.LOGISTICS,'/baseInfo/'+moduleCode+"/"+id);
    }

    delete(moduleCode,id){
        return this.DaoService.delete(this.modules.LOGISTICS,'/baseInfo/'+moduleCode+"/"+id);
    }


    edit(params){
        return this.DaoService.put(this.modules.LOGISTICS,'/baseInfo',params);
    }

    export(condition){
        return this.DaoService.export(this.modules.LOGISTICS,'/baseInfo/export',condition);
    }

    downloadTemplate(moduleCode){
        return this.DaoService.export(this.modules.LOGISTICS,`/baseInfo/${moduleCode}/template`);
    }

    getImportBaseInfoUrl(){
        return this.modules.LOGISTICS+'/baseInfo/import';
    }

    validateName(data){
        return this.DaoService.get(this.modules.LOGISTICS,`/baseInfo/validate`,{
            moduleCode:data.moduleCode,
            name:data.name
        });
    }



}
baseInfoInterface.$inject= ['DaoService', '$config'];
