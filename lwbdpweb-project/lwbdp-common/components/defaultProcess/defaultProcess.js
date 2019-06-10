import './defaultProcess.css'

export default class defaultProcessCtrl {
    constructor(WorkflowInterface, $state,$scope,sidebarService) {
        this.WorkflowInterface = WorkflowInterface;
        this.$state = $state;
        this.$scope = $scope;
        this.sidebarService = sidebarService;
        this.init();
    }

    init() {
        this.paramsInit();
        this.getProcessConfig();
    }

    /**
     * 参数初始化
     */
    paramsInit() {
        this.keyWord = '';
        this.showProcess = [];
        this.configProcess = [];
        this.module = this.$state.current.name.split('.')[0];
    }

    /*
   * 查询所有流程配置
   * */
    getProcessConfig() {
        this.WorkflowInterface.getProcessConfig(this.module).then((res) => {
            for (let item of res.data) {
                // 为每个流程都添加一个字段 isSearch 是否是搜索结果
                item.isSearch = true;
                if (item.isDefault == 0) {
                    // 可选的流程
                    this.showProcess.push(item);
                } else {
                    // 已配置的流程
                    this.configProcess.push(item);
                }
            }
        })
    }

    /*
    * 关键字搜索
    * */
    goSearch() {
        if (this.keyWord && this.keyWord != '') {
            for (let item of this.showProcess) {
                // 若可选流程中不包含关键字搜索结果,则置为false
                if (item.name.indexOf(this.keyWord) == -1) {
                    item.isSearch = false;
                }
            }
        }else{
            for (let item of this.showProcess) {
                item.isSearch = true;
            }
        }
    }

    /*
    * 设为默认
    * */
    setDefault(data) {
        for (let item of this.showProcess) {
            if (item.name.indexOf(data.name) != -1) {
                this.configProcess.push(item);
            }
        }
        this.showProcess.splice(this.showProcess.indexOf(data), 1);
    }

    /*
    * 删除选中的流程配置
    * */
    deleteProcess(data) {
        for (let item of this.configProcess) {
            if (item.name.indexOf(data.name) != -1) {
                this.showProcess.push(item);
            }
        }
        this.configProcess.splice(this.configProcess.indexOf(data), 1);
    }

    /*
    * 确定
    * */
    clickSure(closeThisDialog) {
        let ids = [];
        for (let item of this.configProcess) {
            ids.push(item.id)
        }
        this.WorkflowInterface.setProcessConfig(ids.toString(), this.module).then(() => {
            closeThisDialog();
        })
    }

    /** 拖拽成功触发方法
     *   index 拖拽后落下时的元素的序号（下标）
     *   obj被拖动数据对象
     */
    dropComplete (index, obj){
        //重新排序
        let idx =this.configProcess.indexOf(obj);
        this.configProcess.splice(idx,1);
        this.configProcess.splice(index,0,obj);
    };
}
defaultProcessCtrl.$inject = ['WorkflowInterface', '$state','$scope','sidebarService'];