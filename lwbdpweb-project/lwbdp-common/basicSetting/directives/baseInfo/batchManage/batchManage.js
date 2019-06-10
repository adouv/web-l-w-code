import './batchManage.css'
export default class batchManageCtrl {
    constructor($scope,BaseInfoTemplateInterface,$http,$sessionStorage,dialogsManager) {
        this.$scope = $scope;
        this.$http = $http;
        this.$sessionStorage = $sessionStorage;
        this.BaseInfoTemplateInterface = BaseInfoTemplateInterface;
        this.dialogsManager = dialogsManager;
        this.init();

    }
    init() {
        this.file = null;
        this.uploadTemplateUrl = '';
        this.disabled = false;
        this.$scope.fileChanged = this.fileChanged;
        this.$scope.$on('module',(event,data)=>{
            this.moduleCode = data.moduleCode;
            this.moduleName = data.moduleName;
            this.uploadTemplateUrl = this.BaseInfoTemplateInterface.getUploadTemplateUrl(this.moduleCode);
            console.log(this.uploadTemplateUrl);

        });
    }

    downloadTemplate(){
        this.BaseInfoTemplateInterface.downloadTemplate(this.moduleCode);
    }

    fileAdded(file){
       this.fileName = file.name;
        this.disabled = false;
        if(this.fileName && (this.fileName.indexOf('xls')>1 || this.fileName.indexOf('xlsx')>1)){
            this.showFileName = true; // 控制格式不符合的文件不能显示
            this.showFileErr = false; // 控制此项不能为空
        }
    }
    removeFile(){
        this.fileName='';
        this.showFileName=false;
        this.disabled = false;
        return true;
    }

    submit(){
        if(!this.fileName){
            this.showFileErr = true;
            this.dialogsManager.showMessage('上传文件不能为空',{className:'warning'});
            return;
        }
        return this.fileName;
    }

    uploadSuccess(files){
        this.dams = this.dialogsManager.showMessage('数据写入中…',{className:'loading'});
    }

    beforeUpload(params){

        return false;
    }

    submitSuccess($flow,closeThisDialog){
        this.dams&&this.dams.close();
        let msg = $flow.msg;
        this.disabled = true;
        if(msg.status==0) {
            this.$scope.$emit('names');
            this.dialogsManager.showMessage('操作成功',{className:'success'});
            closeThisDialog();
        }else{

            this.dialogsManager.showMessage(msg.msg,{className:'warning'});// 消息类型有:成功success 错误error 警告warning
        }
    }






}
batchManageCtrl.$inject = ['$scope','BaseInfoTemplateInterface','$http','$sessionStorage','dialogsManager'];