/**
 * @Author hejialin
 * @Description 导入Excel
 */
class importFileCtrl{
    constructor($sessionStorage,dialogsManager,$scope,$filter){
        this.$sessionStorage = $sessionStorage;
        this.dialogsManager = dialogsManager;
        this.$filter = $filter;
        this.$scope = $scope;
    }
    
    /**
     * 上传文件验证
     * @param $file ngFlow的文件对象
     * @return {boolean}
     */
    validFile($file, exts,size) {
        exts = exts.split(',');
        let validExt = {};
        exts.forEach(ext => {
            validExt[ext] = 1;
        });
        if (!validExt[$file.getExtension()]) {
            this.dialogsManager.showMessage('所选附件格式系统不支持上传！', {
                className: 'warning'
            });
            return false;
        } else if ($file.size > (size)) {
            let formatSize = this.$filter('formatFileSize')(size);
            formatSize = formatSize.replace('.00','');
            this.dialogsManager.showMessage('附件大小不允许超过'+formatSize+'！', {
                className: 'warning'
            });
            return false;
        }
        return true;
    }

    /**
     * 上传成功
     * @param message
     */
    uploadSuccess(message,file){
        message = eval('('+message+')');
        this.$scope.callbackSuccess&&this.$scope.callbackSuccess({$importData:message,$importFile:file})
    }

    uploadError(message,file){
        message = eval('('+message+')');
        this.dialogsManager.showMessage(message.error_description,{className:'warning'});
    }
}
importFileCtrl.$inject = ['$sessionStorage','dialogsManager','$scope','$filter'];

export default class importFile{
    constructor($compile,$sessionStorage,$config){
        this.$compile = $compile;
        this.host = $config.HOST?$config.PROTOCOL+$config.HOST:'';
        this.$sessionStorage = $sessionStorage;
        this.rescrict = 'EA';
        this.replace = true;
        this.transclude = true;
        this.scope = {
            url:'=',
            callbackSuccess:'&',
            callbackError:'&',
            reUploadFile:'@'
        };
        this.template = `
            <div ng-transclude=""></div>
        `;
        this.controller = importFileCtrl;
        this.controllerAs = 'import';
    }
    link(scope,elem,attrs){
        scope.$watch('url',(newUrl)=>{
            if(newUrl){
                let token = '';
                if(scope.url.indexOf('?')>-1){
                    token = "&TOKEN="+this.$sessionStorage.get('access_token');
                }else{
                    token = "?TOKEN="+this.$sessionStorage.get('access_token');
                }
                let template = `<div flow-init="{target:'${this.host+scope.url+token}'${scope.reUploadFile=='true'?',allowDuplicateUploads:true':''}}" flow-files-submitted="$flow.upload()" 
                        flow-file-success="import.uploadSuccess($message,$file)" 
                        flow-file-error="import.uploadError($message,$file)"
                        flow-file-added="import.validFile($file,'xls,xlsx,csv',${attrs.size})">
                        <span class="btn_bd flow-btn" flow-btn>${attrs.fileName||'导入'}</span>
                    </div> `;
                elem.append(this.$compile(template)(scope));
            }
        });
    }
}
