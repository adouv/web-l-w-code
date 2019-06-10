import './addBaseInfo.css'
export default class addBaseInfoCtrl {
    constructor(BaseInfoTemplateInterface,$scope,dialogsManager) {
        this.BaseInfoTemplateInterface= BaseInfoTemplateInterface;
        this.$scope = $scope;
        this.dialogsManager = dialogsManager;
        this.init();

    }
    init() {
        this.names = '';
        this.$scope.$on('module', (event,data)=> {
            this.module = data;
        });

    }

    replaceSymbol(){
        console.log(this.names);
        this.names = this.names.replace(/\s+/g, "");

    }

    saveTitle(closeThisDialog){
        if(this.validate()){
            this.BaseInfoTemplateInterface.saveTitle(this.module, this.names).then(res=>{
                this.$scope.$emit('names');
                closeThisDialog();
            })
        }
    }
     validate(){
         let nameAry = this.names.toString().split(",");
         let flag = true;
         for(let name of nameAry){
            for(let n of name.split(";")) {
                if (n.length > 10) {
                    flag = false;
                    this.dialogsManager.showMessage('单个内容不能超过10个汉字!', {className: 'warning'})
                    break;
                }
            }
         }
         return flag;
     }
}
addBaseInfoCtrl.$inject = ['BaseInfoTemplateInterface','$scope','dialogsManager'];