/**
 * Created by wuhao on 2017/7/1.
 */
import '../styles/search.css';
import '../directive/dialog/dialog.css'
export default class projectService{
    constructor($config,ProjectInterface,ngDialog,$rootScope){
        this.modules = $config.modules;
        this.projectInterface = ProjectInterface;
        this.ngDialog = ngDialog;
        this.$rootScope = $rootScope;
    }

    /**
     * 获取项目库
     */
    getProjectLibrary(moduleCode, processConfigId, projectStatus, stage, taskKey, gardenIds, categoryList, keywords, offset, size,callback){
        return this.projectInterface.getProjectLibrary(moduleCode, processConfigId, projectStatus, stage, taskKey, gardenIds, categoryList, keywords, offset, size).then(res=>{
            callback&&callback(res.data,res.headers()['x-record-count']);
        })
    }
 

    /*
     *  项目配标类别弹窗
     * */
    getKindType(typeName,param,list,listName,listId,callback){
       /* let echoData = { typeId:param,list:list };
         let setParams = (scope)=>{
         scope.echoData = {};
         scope.echoData = echoData
         };
         let options={
         title:'请选择项目标配类别',
         directive:'<solid-tree list="echoData.list" type-name="echoData.typeName" type-id="echoData.typeId"></solid-tree>',
         setParams:setParams,
         callback:callback
         };
         this.createDialog(options);*/
        let echoData = {
            typeName:typeName,
            typeId:param,
            list:list,
            listName:listName,
            listId:listId
        };
        let setParams = (scope)=>{
            scope.echoData = {};
            scope.echoData = echoData
        };
        let options={
            title:'请选择项目配标类别',
            directive:'<flat-tree list="echoData.list" type-name="echoData.typeName" type-id="echoData.typeId" list-name="echoData.listName" list-id="echoData.listId"></flat-tree>',
            setParams:setParams,
            callback:callback
        };
        this.createDialog(options);
    }

    /*
     *  项目所属类别弹窗
     * */
    getProjectType(typeName,param,list,callback,single,title){
        let echoData = {
            typeName:typeName,
            typeId:param,
            list:list,
            single:single
        };
        let setParams = (scope)=>{
            scope.echoData = {};
            scope.echoData = echoData
        };
        let options={
            title: title ||'请选择项目所属类别',
            directive:'<solid-tree list="echoData.list" single="echoData.single"  type-name="echoData.typeName" type-id="echoData.typeId"></solid-tree>',
            setParams:setParams,
            callback:callback
        };
        this.createDialog(options);
    }

    /*
     *  项目阶段弹窗
     * */
    getProjectStage(paramName,param,list,listName,listId,callback){
        let echoData = {
            typeName:paramName,
            typeId:param,
            list:list,
            listName:listName,
            listId:listId
        };
        let setParams = (scope)=>{
            scope.echoData = {};
            scope.echoData = echoData
        };
        let options={
            title:'请选择项目所属阶段',
            directive:'<flat-tree list="echoData.list" type-name="echoData.typeName" type-id="echoData.typeId" list-name="echoData.listName" list-id="echoData.listId"></flat-tree>',
            setParams:setParams,
            callback:callback
        };
        this.createDialog(options);
    }

    /*
     *  项目状态弹窗
     * */
    getProjectStatus(paramName,param,list,listName,listId,callback){
        let echoData = {
            typeName:paramName,
            typeId:param,
            list:list,
            listName:listName,
            listId:listId
        };
        let setParams = (scope)=>{
            scope.echoData = {};
            scope.echoData = echoData
        };
        let options={
            title:'请选择项目所处状态',
            directive:'<flat-tree list="echoData.list"  type-name="echoData.typeName" type-id="echoData.typeId" list-name="echoData.listName" list-id="echoData.listId"></flat-tree>',
            setParams:setParams,
            callback:callback
        };
        this.createDialog(options);
    }

    /*
    * 创建弹窗
    * @params echoData 再次点击弹窗回显的数据
    *         options{
    *            title 弹窗标题
    *            directive 弹窗指令
    *            setParams 设置的参数
    *            callback 回调
    *         }
    * */
    createDialog(options){
        let scope = this.$rootScope.$new();
        options.setParams(scope);
        this.ngDialog.open({
            disableAnimation:true,
            closeByDocument: false,
            className: 'bdp layer_fixed_small',
            template: `<div class="basicDialog ui-popup-middle">
                            <div class="addConfig">
                                <div class="addConfig_tit">
                                    ${options.title}
                                <span class="iconfont icon-close del_btn" ng-click="closeThisDialog()"></span>
                            </div>
                            ${options.directive}
                            <div class="btn_poab">
                                <span class="btn_bd" ng-click="closeThisDialog()">取消</span>
                                <span class="btn_bg" ng-click="clickSure(closeThisDialog)">确定</span>
                            </div>
                        </div>`,
            plain: true,
            scope:scope
        });
        scope.clickSure = (closeThisDialog)=>{
            options.callback(scope.echoData);
            closeThisDialog();
        }
    }

    formatCacheData(cacheData){
        let bufferData = {};
        for(let keys in cacheData){
            let cache = {},arrIndex=-1;
            let keyList = keys.split('.');
            cache = this.getBufferObject(keyList,0,cacheData[keys]);
            this.extend(bufferData,cache);
        };
        return bufferData;
    }

    getBufferObject(keys,i,value){
        let key = keys[i],cache = {};
        let val = keys.length>i+1?this.getBufferObject(keys,i+1,value):value;
        if(/\[\d*\]$/.test(key)){
            let attr = key.substring(0,key.indexOf('[')),
                index = this.getContainString(key,'[',']')*1;
            cache[attr] = [];
            cache[attr][index] = val;
        }else{
            cache[key] = val;
        }
        return cache;
    }

    getContainString(str,startStr,endStr){
        let startIndex = str.indexOf(startStr)+1;
        let endIndex = str.indexOf(endStr);
        return str.substring(startIndex,endIndex);
    }

    extend(target,origin){
        let targetType = typeof target,originType = typeof origin;
        if(targetType =='object'&&originType == 'object'){
            for(let key in origin){
                let typeTarget = typeof target[key],typeOrigin = typeof origin[key];
                if(typeOrigin=='object'&&typeTarget=='object'
                    ||typeOrigin=='array'&&typeTarget=='array'){
                    this.extend(target[key],origin[key])
                }else{
                    target[key] = origin[key];
                }
            }
        }else if(targetType == 'array'&&originType == 'array'){
            origin.forEach((data,i)=>{
                target[i] = data;
                let typeTarget = typeof target[i],typeOrigin = typeof origin[i];
                if(typeOrigin=='object'&&typeTarget=='object'
                    ||typeOrigin=='array'&&typeTarget=='array'){
                    this.extend(target[i],origin[i])
                }else{
                    target[i] = origin[i];
                }
            });
        }else{
            target = origin;
        }
    }
}

    
projectService.$inject = ['$config','ProjectInterface','ngDialog','$rootScope'];
