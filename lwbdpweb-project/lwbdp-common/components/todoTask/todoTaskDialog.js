/**
 * 待办任务
 */
import './todoTask.css';
export default class todoTaskListCtr {
    constructor(DaoService, $config, ProjectInterface, $sessionStorage, $rootScope, $state, $timeout) {
        this.DaoService = DaoService;
        this.modules = $config.modules;
        this.ProjectInterface = ProjectInterface;
        this.$sessionStorage = $sessionStorage;
        this.currentModule = $rootScope.currentModule;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$timeout = $timeout;
        this.init();
    }
    init() {
        this.searchKeyword = "";
        this.pageConfig();
    }
    /**
     * 根据生成时间对所有待办任务数据排序
     */
    formatByCreateTime(taskData) {
        return taskData.sort((taskA, taskB) => {
            return taskA.createTime - taskB.createTime;
        })
    }
    /**
     * 分页参数配置
     */
    pageConfig() {
        this.pageConfig = {
            onChange: (offset, size) => {
                this.getList(offset, size, (todoTaskList, totalItems) => {
                    this.todoTaskList = this.formatByCreateTime(todoTaskList);
                    this.pageConfig.totalItems = totalItems || 0;
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
    getList(offset, size, callback) {
        this.ProjectInterface.getAllTodoTaskList(
            this.currentModule,
            this.searchKeyword,
            offset,
            size
        ).then(res => {
            let totalItems = res.headers()['x-record-count'];
            callback(res.data, totalItems);
        });
    }
    /**
     * 搜索查询 
     * @param event
     */
    goSearch(event) {
        this.$timeout.cancel(this.timer);
        this.timer = this.$timeout(() => {
            this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
        }, 1000)
    }
    cleanKeywords() {
        this.searchKeyword = '';
        this.pageConfig.onChange(0, this.pageConfig.itemsPerPage);
    }

    /**
     * 进详情页
     * @param id
     * @param taskId
     */
    goPage(data, closeThisDialog) {
        if (data.projectStatus == 0 && data.taskStatus == 0) {
            this.$state.go(this.currentModule + '.form', {
                id: data.projectId,
                taskId: data.taskId,
                sidebarId: this.$rootScope.sidebar && this.$rootScope.sidebar.id || this.$sessionStorage.get('sidebarId')
            });
        } else {
            this.$state.go(this.currentModule + '.detail', {
                id: data.projectId,
                taskId: data.taskId,
                sidebarId: this.$rootScope.sidebar && this.$rootScope.sidebar.id || this.$sessionStorage.get('sidebarId')
            });
        }
        closeThisDialog();
    }
}
todoTaskListCtr.$inject = ['DaoService', '$config', 'ProjectInterface', '$sessionStorage', '$rootScope', '$state', '$timeout'];