/**
 * @Author hejialin
 * @Description 流程别名配置
 */
export default class ProcessAlias{
    constructor(){
        this.processAlias = {
            asset:'asset',
            repair:'repair',
            purchase: 'purchase'
        };
        angular.extend(this,this.processAlias);
    }

    /**
     * 通过模块key获取流程别名
     * @param moduleKey
     * @return {*}
     */
    getProcessAliasByKey(moduleKey){
        return this.processAlias[moduleKey];
    }
}
