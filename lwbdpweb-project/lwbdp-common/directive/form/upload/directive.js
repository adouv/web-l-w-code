

class formUploadCtrl{
    constructor(dialogsManager,$scope,$filter){
        this.$scope = $scope;
        this.$filter =$filter;
        this.dialogsManager = dialogsManager;
    }

    /**
     * 上传文件验证
     * @param $file ngFlow的文件对象
     * @return {boolean}
     */
    validFile($file) {
        this.$scope.submitAdded({$file:$file});
        let exts = this.$scope.format.split(',');
        let size = this.$scope.size;
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

    beforeUpload($flow){
        this.$scope.beforeSubmit({$params:$flow.opts.query});
        $flow.upload();

    }

    /**
     * 上传成功
     * @param message
     */
    uploadSuccess(message,files){
        message = eval('('+message+')');
        let $flow = {msg:message,files:files};
        //let $flow = {files:files};
        this.$scope.submitSuccess({$flow:$flow})
    }

    removeFile($flow){
        if ($flow){
            $flow.files[0].cancel();
        }
    }

    uploadProcess(files){
        this.$scope.uploadProcess({$files:files});
    }
}
formUploadCtrl.$inject = ['dialogsManager','$scope','$filter'];

export class fileBtn{
    constructor(){
        this.require = '^formUpload';
    }

    link(scope,elem){
        elem.on('click',()=>{
            document.querySelector('#flow-upload-btn').click();;
        });
    }
}

export class fileSure{
    constructor(){
        this.require = '^formUpload';
        this.scope = {
            fileSure:'&'
        };
    }

    link(scope,elem){
        elem.on('click',()=>{
            if(scope.fileSure()){
                document.querySelector('#flow-sure-btn').click();
            }
        });
    }
}
/*
* 删除上传文件指令(点击时,先触发指令=后的function(),若方法返回ture,则执行flow-remove-btn的点击事件,因为flow-remove-btn存在于指令中,故可以获得$flow)
* */
export class fileRemove{
    constructor(){
        this.require = '^formUpload';
        this.scope = {
            fileRemove:'&'
        };
    }

    link(scope,elem){
        elem.on('click',()=>{
            if(scope.fileRemove()) {
                document.querySelector('#flow-remove-btn').click();
            }
        });
    }
}

export class formUpload{
    constructor($compile,$sessionStorage,$config,OAuth2Token){
        this.$compile = $compile;
        this.$sessionStorage = $sessionStorage;
        this.host = $config.HOST?$config.PROTOCOL+$config.HOST:'';
        this.rescrict = 'EA';
        this.replace = true;
        this.transclude = true;
        this.OAuth2Token = OAuth2Token;
        this.scope = {
            submitUrl:'=',
            single:'@',
            format:'@',
            size:'@',
            submitAdded:'&',
            beforeSubmit:'&',
            submitSuccess:'&',
            uploadProcess:'&'
        };
        this.template = `<div ng-transclude=""></div>`;
        this.controller = formUploadCtrl;
        this.controllerAs = 'upload';
    }
    link(scope,elem,attrs){
        scope.$watch('submitUrl',(url)=>{
            if(url){
                let token = "?TOKEN="+this.OAuth2Token.getAccessToken();
                let template = `<div flow-init="{target:'${this.host+url+token}'${scope.single==='true'?',singleFile:true':''},allowDuplicateUploads:true}" 
                        flow-file-success="upload.uploadSuccess($message,$files)" 
                        flow-file-progress="upload.uploadProcess($file)"
                        flow-file-added="upload.validFile($file)">
                        <span flow-btn="" style="display: none" id="flow-upload-btn"></span>
                        <span style="display: none" ng-click="upload.beforeUpload($flow)" id="flow-sure-btn"></span>
                        <span style="display: none" ng-click="upload.removeFile($flow)" id="flow-remove-btn"></span>
                    </div> `;
                elem.append(this.$compile(template)(scope));
            }
        });
    }
};
