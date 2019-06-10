/**
 * @Author hejialin
 * @Description 描述
 */

export default class purchaseService {
    constructor(ngDialog,$rootScope,dialogsManager,purchaseInterface,$config) {
        this.ngDialog = ngDialog;
        this.$config = $config;
        this.$rootScope = $rootScope;
        this.dialogsManager = dialogsManager;
        this.purchaseInterface = purchaseInterface;
    }

    /*
    * 更多条件搜索弹窗
    * */
    getMoreSearch(condition,callback,allunits,isLibrary,isChar){
        let scope = this.$rootScope.$new();
        scope.callback = callback;
        scope.condition = condition;
        scope.isAllunits = allunits;
        scope.isLibrary = isLibrary;
        scope.isChar = isChar;
        this.ngDialog.open({
            closeByDocument: false,
            className: 'bdp layer_fixed',
            template: require('../components/search/search.html'),
            plain: true,
            controller: 'purchaseSearchCtrl',
            controllerAs: 'purchaseSearch',
            scope:scope
        })
    }

    /**
     * 采购导入出错
     * @param message
     * @param file
     * @param callback
     */
    importError(message,file,callback){
        // 状态：1->成功
        if (message.status === 1) {
            this.dialogsManager.showMessage('导入成功!', {
                className: 'success',
                callback: () => {
                    callback&&callback(message.data);
                }
            })
        }
        // 状态：0->失败
        if (message.status === 0) {
            let data = message.data;
            let errorMsg = '',
                line = '',
                html = '';
            html += `<tr>
                    <td rowspan="${data.length}">${file.name} </td>
                    <td>${data[0].line}</td>
                    <td>${data[0].errorMsg}</td>
                </tr>`;
            for (var i = 1; i < data.length; i++) {
                html += `<tr>
                        <td>${data[i].line}</td>
                        <td>${data[i].errorMsg}</td>
                    </tr>`
            }
            this.ngDialog.open({
                closeByDocument: false,
                className: 'purchase prompt_fixed',
                template: `<div class="prompt_errorinfo">
                    <div class="dialog-hd">
                        提示
                        <span class="iconfont icon-close del_btn dialog-close" ng-click="closeThisDialog()"></span>
                    </div>
                    <div class="promptDialog_content">
                        <p>系统检测到您导入的数据格式和要求的格式不符，数据格式校验出错：</p>
                        <table class="prompt_table">
                            <thead>
                                <th width="250">文件名称</th>
                                <th>位置</th>
                                <th>错误消息</th>
                            </thead>
                            <tbody>
                                ${html}
                            </tbody>
                        </table>
                    </div>
                    <div class="diglog_btn">
                        <span class="btn_bd" ng-click="closeThisDialog()">关闭</span>
                    </div>
                </div>`,
                plain: true
            })
        }
    }

    /**
     * 设置保存的字段及值
     * @param data
     * @param name
     * @param value
     */
    setPurchaseCacheField(data,name,value){
        if(data&&name&&value){
            data.usefulVars = data.usefulVars||[];
            for(let usefulVar of data.usefulVars){
                if(usefulVar.name==name){
                    usefulVar.value = JSON.stringify(value);
                    return;
                }
            }
            data.usefulVars.push({name:name,value:JSON.stringify(value)});
        }
    }

    getAuditConfig(id,callback){
        this.purchaseInterface.getAuditConfig(id).then(res=>{
            let auditConfig = this.$config.bdp.isUseExternalForm?eval(res.data.form):require('../formsjs/'+res.data.formKey).default;
            let templateField = {},cacheField = {},attachmentType = {};
            for (let configKey in auditConfig){
                for(let fieldKey in auditConfig[configKey]){
                    if(fieldKey!='attachments'){
                        cacheField[fieldKey] = auditConfig[configKey][fieldKey];
                    }else{
                        angular.extend(attachmentType,auditConfig[configKey][fieldKey]);
                    }
                }
                if(auditConfig[configKey].taskKey){
                    let taskKeys = auditConfig[configKey].taskKey;
                    taskKeys.forEach(key=>{
                        templateField[key] = auditConfig[configKey].template;
                    })
                }
            }
            callback&&callback({cacheField:cacheField,templateField:templateField,attachmentType:attachmentType});
        });
    }
}
purchaseService.$inject = ['ngDialog','$rootScope','dialogsManager','purchaseInterface','$config'];