/**
 * @Author hejialin
 * @Description 描述
 */
import './declare.css'
export default class declareCtrl {

    constructor(purchaseInterface,$stateParams,ngDialog,$scope,sidebarService,$location) {
        this.ngDialog = ngDialog;
        this.$scope = $scope;
        this.purchaseInterface = purchaseInterface;
        this.$stateParams = $stateParams;
        this.sidebarService = sidebarService;
        this.$location = $location;
        this.init();
    }

    init() {
        this.getCrumbList();
        this.allYear = true;
        this.year = '';
        this.processConfigId = this.$stateParams.processConfigId;
        this.getCounts();
        this.$scope.$watch('purchaseDeclare.year',(newVal,oldVal)=>{
            if(!newVal || (newVal && newVal != oldVal)){
                this.getCounts();
            }
        });
    }

    resetYear(){
        if(!this.allYear) {
            this.year = '';
        }
    }

    getCounts(){
        console.log(111)
        this.purchaseInterface.getStatisticsCount(this.processConfigId,!this.allYear?'':this.year).then(res=>{
            this.numbers = res.data;
            this.statisticsTime = this.numbers.createTime;
        })
    }

    /**
     * 获取面包屑导航
     */
    getCrumbList() {
        this.sidebarService.getCrumbList(moduleAlias.PURCHASE,this.$stateParams.sidebarId, data => {
            this.crumbList = data;
        });
    }

    goJump(url){
        this.$location.path(url);
    }


    /*
    * 点击数字展示弹窗
    * */
    declareDialog(kind,category=null,result=null,reason=null){
        this.ngDialog.open({
            closeByDocument: false,
            className: 'bdp layer_fixed_w1024',
            template: require('../../components/declareDialog/declareDialog.html'),
            plain: true,
            controller: 'purchaseDeclareDialogCtrl',
            controllerAs: 'purchaseDeclareDialog',
            scope:this.$scope,
            onOpenCallback: () => {
                this.$scope.$broadcast('condition',{
                    kind,
                    result,
                    reason,
                    category,
                    year:this.allYear?'':this.year,
                    processConfigId:this.processConfigId
                });
            }
        })
    }
}
declareCtrl.$inject = ['purchaseInterface','$stateParams','ngDialog','$scope','sidebarService','$location'];
