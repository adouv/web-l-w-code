export default class flowPhaseConfigCtrl {
    constructor ($scope, dialogsManager,$rootScope,$sessionStorage){
        this.$scope = $scope;
        this.isShowChild = false;
        this.dialogsManager = dialogsManager;
        this.$rootScope = $rootScope;
        this.$sessionStorage = $sessionStorage;
        this.stageConfigData = this.initStage();
    }

    initStage(){
        return {
            name:'',
            stageItemList:[
                {
                    name:'我的项目',
                    code:'apply',
                    itemOrder:1
                },
                {
                    name:'我的审批',
                    code:'audit',
                    itemOrder:2
                },{
                    name:'阶段项目库',
                    code:'library',
                    itemOrder:3
                }
            ]
        };
    }

    /*确定按钮*/
    confirmSuccess (){
        if(this.stageConfigData.name === '') return;
        this.$scope.$emit('stageConfigData', {status:'save', stageData:this.stageConfigData});
        this.$scope.closeThisDialog();
    }

    /*取消按钮*/                                                                                                                                                                                                                                                                            
    confirmCancel (){
        this.$scope.$emit('stageConfigData', {status:'cancel'});
        this.$scope.closeThisDialog();
    }

}
flowPhaseConfigCtrl.$inject = ['$scope', 'dialogsManager','$rootScope','$sessionStorage'];
