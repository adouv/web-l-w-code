import './basicLibrary.css';
export default class basicLibraryCtrl {
    constructor($scope, AssetDictionaryInterface, SelectGarden, $sessionStorage,dialogsManager, AssetLibraryInterface) {
        this.AssetDictionaryInterface = AssetDictionaryInterface;
        this.SelectGarden = SelectGarden;
        this.dialogsManager = dialogsManager;
        this.$scope = $scope;
        this.$sessionStorage = $sessionStorage;
        this.AssetLibraryInterface = AssetLibraryInterface;
        this.init();
    }
    init() {
        this.getAssetType();
        this.getAcquireway();
        this.pageConfig();
        this.showGardens = [];
         //关键字筛选
        this.keywords = '';
        //资产大类
        this.selectedType = '';
        //取得方式
        this.selectedWay = '';
        let currentGarden = this.$sessionStorage.get('currentGarden');
        this.gardenList = [currentGarden];
        this.gardenIds = currentGarden.gardenId;
    }

    // 获取资产处置类型
    getAssetType() {
        this.AssetDictionaryInterface.getAssetType().then(res => {
            this.assetType = res.data;
        })
    }

    // 获取资产取得方式
    getAcquireway() {
        this.AssetDictionaryInterface.getAcquireway().then(res => {
            this.acquireway = res.data;
        })
    }

    // 调取分页方法数据
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.offset = offset;
                this.size = size;
                this.getList(this.offset, this.size, (pageList, totalItems) => {
                    this.pageList = pageList;
                    this.paginationConf.totalItems = totalItems;
                });
            }
        };
    }

    getList(offset, size, callback) {
        this.AssetLibraryInterface.getList(this.gardenIds.toString(), this.selectedWay, this.selectedType, this.keywords, offset, size).then(res => {
            let totalItems = res.headers()['x-record-count'];
            callback(res.data, totalItems);
        })
    }

    //点击查询按钮之后进行筛选
    getAssetLibraryList() {
        this.getList(this.offset, this.size, (pageList, totalItems) => {
            this.isSearch = this.keywords && this.keywords !== '' ? true : false;
            this.pageList = pageList;
            this.paginationConf.totalItems = totalItems;
        });
    }

    //回车查询
    enterSearch(event){
        if(event.charCode ===13 || event.keyCode ===13 || event.which ===13){
            this.getAssetLibraryList();
        }
    }

    //删除清空input
    removeKeywords(){
        this.keywords = "";
    }

    // 选择园区
    chooseGarden() {
        this.SelectGarden.dialog({
            ids:this.gardenIds
        }, $garden => {
            this.gardenList = $garden.gardenList;
            this.gardenIds = $garden.ids;
            this.paginationConf.onChange(0,15);
        });
    }

    // 导出excel表格
    getExcel() {
        this.AssetLibraryInterface.exportExcel(this.gardenIds.toString(), this.selectedWay, this.selectedType, this.keywords, this.offset, this.size)
    };

}
basicLibraryCtrl.$inject = [ '$scope', 'AssetDictionaryInterface', 'SelectGarden', '$sessionStorage','dialogsManager', 'AssetLibraryInterface'];