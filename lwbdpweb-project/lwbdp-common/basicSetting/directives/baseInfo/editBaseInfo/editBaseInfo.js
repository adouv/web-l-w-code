import './editBaseInfo.css'
export default class editBaseInfoCtrl {
    constructor(BaseInfoTemplateInterface,$scope,dialogsManager) {
        this.$scope = $scope;
        this.dialogsManager = dialogsManager;
        this.BaseInfoTemplateInterface = BaseInfoTemplateInterface;
        this.init();

    }
    init() {
        this.name = '';
        this.$scope.$on('module', (event,data)=> {
            this.id = data.id;
            this.moduleCode = data.moduleCode;
            this.name = data.name;
            this.titles = data.titles;
        })
    }

    editTitle(closeThisDialog){
       if(this.validExist()){
           this.dialogsManager.showMessage(this.name+'系统中已存在!',{className:'warning'});
           return;
       }
       this.BaseInfoTemplateInterface.editTitle(this.id,this.moduleCode,this.name).then((res,data)=>{
           this.$scope.$emit('names');
           closeThisDialog();
       })
    }

    validExist(){
        let flag = false;
        for(let title of this.titles){
            if(title.name==this.name&&title.id!=this.id){
                flag = true;
                break;
            }
        }
        return flag;
    }
}
editBaseInfoCtrl.$inject = ['BaseInfoTemplateInterface','$scope','dialogsManager'];