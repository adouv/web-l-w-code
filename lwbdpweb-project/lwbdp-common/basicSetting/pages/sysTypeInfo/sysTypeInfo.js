export default class sysTypeInfoCtrl {
    constructor($state, BasicConfigInterface, $scope) {
        this.basicConfigInterface = BasicConfigInterface;
        this.$state = $state;
        this.init();
    }

    init() {
        this.pageConfig();
        this.module = this.$state.current.name.split('.')[0];
    }
    // 分页配置
    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.clickPage(offset, size);
            }
        };
    }

    /**
     * 点击分页操作
     */
    clickPage(offset, size) {
        this.getList(offset, size, (pageList, totalItems) => {
            this.menuList = pageList;
            this.paginationConf.totalItems = totalItems;
        });
    }

    /**
     * 查询分页列表
     * @param offset 从第几页开始查
     * @param size 每页查询的条数
     * @param callback 回调
     */
    getList(offset, size, callback) {
        this.basicConfigInterface.getBaseConfig({ offset: offset, size: size,module:this.module}).then(res => {
            let totalItems = res.headers()['x-record-count'];
            callback && callback(res.data, totalItems)
        });
    }

    // 编辑按钮-->显示弹窗
    showPopup(name, index, parent) {
        this.configList = this.menuList[index];
        this.selectedItem = this.menuList[index];
        this['update_' + name] = true;
        this.parentId = parent;
    }

    // 保存数据-->添加到数组中
    saveBaseConfig() {
        this.basicConfigInterface.addBaseConfig(this.configList.qoList).then(res => {
            this.clickPage(0, 15)
        });
    }
    closeDialog(){
        this.update_log = false;
    }
}

sysTypeInfoCtrl.$inject = ['$state', 'BasicConfigInterface', '$scope'];