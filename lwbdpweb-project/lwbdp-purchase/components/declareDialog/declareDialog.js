/**
 * @Author hejialin
 * @Description 描述
 */
import './declareDialog.css'
export default class declareDialogCtrl {
    constructor(purchaseInterface,$scope) {
        this.purchaseInterface = purchaseInterface;
        this.$scope = $scope;
        this.init();
    }

    init() {

        this.$scope.$on('condition',(event,data)=>{
            this.condition = data;
            this.pageConfig();
        })
    }

    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getStatisticsList(offset, size,this.condition, (datas,total) => {
                    this.datas = datas;
                    this.total = total || 0;
                    this.paginationConf.totalItems = total || 0;
                })
            }
        }
    }

    getStatisticsList(offset,size,condition,callback){
        condition.offset = 0;
        condition.size = 15;
        this.purchaseInterface.getStatisticsList(condition).then(res=>{
            let totalItems = res.headers()['x-record-count'];
            callback&&callback(res.data,totalItems);
        })
    }
    export(){
        this.purchaseInterface.export(this.condition);
    }
}
declareDialogCtrl.$inject = ['purchaseInterface','$scope'];