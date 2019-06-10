//使用了我的审核的样式、
export default class auditAgeLimitCtrl {
    constructor($state, BasicConfigInterface,$scope,dialogsManager) {
        this.$scope = $scope;
        this.$state = $state;
        this.dialogsManager = dialogsManager;
        this.basicConfigInterface =BasicConfigInterface;
        this.init();
    }
    init() {
        this.new = {};
        this.pageConfig();
        this.module = this.$state.current.name.split('.')[0];
    }

    pageConfig(){
        this.paginationConf = {
            onChange: (offset,size) => {
                this.getList(offset,size,(pageList,totalItems)=>{
                    this.pageList = pageList;
                    this.paginationConf.totalItems = totalItems;
                    this.isSearch = this.keywords && this.keywords !=='' ? true : false;
                });
            }
        };
    }
    
    /**
     * 查询分页列表
     * @param offset 从第几页开始查
     * @param size 每页查询的条数
     * @param callback 回调
     */
    getList (offset,size,callback){
        this.basicConfigInterface.
        getMinlifecycleList({offset:offset,size:size,keywords:this.keywords}).then(res=>{
            let totalItems = res.headers()['x-record-count'];
            callback(res.data,totalItems);
        });
    }
    search (){
           this.paginationConf.onChange();
    }
    //回车查询
    enterSearch(event){
        if(event.charCode ===13 || event.keyCode ===13 || event.which ===13){
            this.search();
        }
    }

    //删除清空input
    removeKeywords(){
        this.keywords = "";
    }

    showDialog() {
        this.addLimit = true;
    }
    closeDialog() {
        this.addLimit = false;
        this.new = {};
    }
    addAssetConfig(){
        this.basicConfigInterface.addMinlifecycle(this.new).then(res=> {
            this.dialogsManager.showMessage('添加成功', {
                    className: 'success',
                    callback: () => {
                        this.paginationConf.onChange(0,15);
                        this.closeDialog();
                    }
                });
        })
    }
}
auditAgeLimitCtrl.$inject = ['$state', 'BasicConfigInterface','$scope','dialogsManager'];