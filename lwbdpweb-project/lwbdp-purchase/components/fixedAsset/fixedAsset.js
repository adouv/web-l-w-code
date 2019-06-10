/**
 * @Author guoyaru
 * @Description 特殊节点弹窗
 */
import './fixedAsset.css'
export default class purchaseFixedAssetCtrl{
    constructor(BasicConfigInterface,$scope){
        this.BasicConfigInterface = BasicConfigInterface;
        this.$scope = $scope;
        this.init();
    }

    init(){
        this.pageConfig();
        // 接收弹窗传来的值,如果存在,则是'相关政策标准查看'弹窗
        this.$scope.$on('data',(scope,data)=>{
            this.dialogName = data.data;
        })
    }
    /**
     * 调取分页数据
     */
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList,totalItems) => {
                    this.pageList = pageList;
                    this.paginationConf.totalItems = totalItems
                })
            }
        }
    }

    /**
     * 获取列表数据
     */
    getList(offset,size,callback){
        if(this.dialogName){
            //TODO 缺少相关政策标准查看接口
        }else{
            this.BasicConfigInterface.getMinlifecycleList({offset:offset,size:size,keywords:this.keywords}).then(res=>{
                let totalItems = res.headers()['x-record-count'];
                callback(res.data, totalItems)
            });
        }

    }

    /**
     * 查询数据
     */
    goSearch(event) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.showSearch = true;
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage)
        }
    }


    /**
     * 清空查询数据
     */
    cleanKeywords(){
        this.keywords = '';
        this.showSearch = false;
        this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
    }

}
purchaseFixedAssetCtrl.$inject = ['BasicConfigInterface','$scope'];