import './addBasic.css'
export default class addBasicCtrl {
    constructor($scope,baseInfoInterface,dialogsManager) {
        this.$scope = $scope;
        this.baseInfoInterface = baseInfoInterface;
        this.dialogsManager = dialogsManager;
        this.init();
    }

    init() {
        this.name = '';
        this.uploadTemplateUrl = this.baseInfoInterface.getImportBaseInfoUrl();
        this.validName = false;
        this.$scope.$on('module',(event,data)=>{
            this.moduleCode = data.moduleCode;
            this.couldDownloadTemplate = data.couldDownloadTemplate
        })
    }

    downloadTemplate(){
        if(this.couldDownloadTemplate){
            this.baseInfoInterface.downloadTemplate(this.moduleCode);
        }else{
            this.dialogsManager.showMessage('当前模板项字段为空，不支持下载；请在基础配置处配置后再试！',{className:'warning'});
        }
    }

    fileAdded(file){
        this.fileName = file.name;
        if(this.fileName && (this.fileName.indexOf('xls')>1 || this.fileName.indexOf('xlsx')>1)){
            this.showFileName = true; // 控制格式不符合的文件不能显示
            this.showFileErr = false; // 控制此项不能为空
        }
    }
    removeFile(){
        this.fileName='';
        this.showFileName=false;
        return true;
    }
    /*
    * 提示信息
    * */
    verify(msg){
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this[msg] = true;
    }
    /*
    * 清除提示信息
    * */
    clearMsg(){
        if(this.showErrWarnMsg){
            this.showErrWarnMsg = false
        }
    }

    uploadSuccess(files){
        this.dams = this.dialogsManager.showMessage('数据写入中…',{className:'loading'});
    }

    submit(){
        if(!this.name){
            this.nameErr = true;
            this.dialogsManager.showMessage('存在必填项未填写,请填写后再提交!',{className:'warning'});
            return;
        }
        if(!this.fileName){
            this.showFileErr = true;
            this.dialogsManager.showMessage('上传文件不能为空',{className:'warning'});
            return;
        }
        return this.fileName||this.name||this.validName;
    }

    validateName(name){
        if(name){
            this.baseInfoInterface.validateName({
                name:name,
                moduleCode:this.moduleCode
            }).then(res=>{
                this.validName = !res.data;
                if(this.validName){
                    this.dialogsManager.showMessage('数据格式错误！',{className:'warning'});
                }
            })
        };
    }



    beforeUpload(params){
        angular.extend(params,{moduleCode:this.moduleCode,name:this.name});
    }

    submitSuccess($flow,closeThisDialog){
        let msg = $flow.msg;
        this.dams&&this.dams.close();
        if(msg.status==0){
            this.$scope.$emit('dataChange');
            this.dialogsManager.showMessage('操作成功',{className:'success'});
            closeThisDialog();
        }else{
            this.dialogsManager.showMessage(msg.msg,{className:'warning'});// 消息类型有:成功success 错误error 警告warning
        }

    }

}
addBasicCtrl.$inject = ['$scope','baseInfoInterface','dialogsManager'];