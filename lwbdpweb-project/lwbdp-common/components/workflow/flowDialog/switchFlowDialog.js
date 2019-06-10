/* 切换流程 */
import previewFlowHTML from "./previewFlowDialog.html";
import "./switchFlowDialog.css";
export default class switchFLow {
    constructor(WorkflowInterface, $config, DaoService, ProcessAlias, dialogsManager, ngDialog, sidebarService, $sessionStorage, $window, $rootScope, WorkflowConfigInterface, $location,$state) {
        this.getUserProcessConfig = WorkflowInterface.getUserProcessConfig;
        this.getWorkflowInfo = WorkflowInterface.getWorkflowInfo;
        this.getSidebarList = WorkflowInterface.getSidebarList;
        this.WorkflowConfigInterface = WorkflowConfigInterface;
        this.DaoService = DaoService;
        this.sidebarService = sidebarService;
        this.modules = $config.modules;
        this.ProcessAlias = ProcessAlias;
        this.dialogsManager = dialogsManager;
        this.ngDialog = ngDialog;
        this.$sessionStorage = $sessionStorage;
        this.currentModule = $rootScope.currentModule;
        this.$window = $window;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.checkedFlow = [];
        this.$state = $state;
        this.init();
    }
    init() {
        this.getUserProcessConfig(this.currentModule).then(res => {
            let flowStates = JSON.parse(this.$sessionStorage.get("flowStates")) || {};
            let flowIds = flowStates[this.currentModule];
            this.allWorkflow = res.data;
            if (flowIds) {
                flowIds = flowIds.split(",");
                flowIds.map((flowId)=>{
                    this.allWorkflow.map((item) => {    
                        if(flowId == item.id){
                            this.checkedFlow.push(item);
                        }            
                    })
                })
                
            } else {
                this.allWorkflow.map((item) => {
                    if (item.isDefault) {
                        this.checkedFlow.push(item);
                    }
                })
            }
        });
    }
    /* 选择流程 */
    selectWorkflow(flowItem) {
        let flowIdx = this.checkedFlow.indexOf(flowItem);
        if (flowIdx < 0) {
            this.checkedFlow.push(flowItem);
        } else {
            this.checkedFlow.splice(flowIdx, 1);
        }
    }
    /* 点击确定按钮 */
    confirmCallBack(closeThisDialog) {
        if (this.checkedFlow.length === 0) {
            this.dialogsManager.showMessage('请选择流程!', {
                className: 'warning'
            });
        } else {
            let flowIds = this.checkedFlow.map((item) => item.id).join(",");
            let flowStates = JSON.parse(this.$sessionStorage.get("flowStates")) || {};
            flowStates[this.currentModule] = flowIds;
            this.$sessionStorage.set("flowStates", JSON.stringify(flowStates));
            closeThisDialog();
            this.$state.go(this.currentModule);
            this.$window.location.reload();
        }
    }
    /* 预览流程图 */
    previewFlowChart(flowName, id, $event) {
        this.WorkflowConfigInterface.previewFlowChart(flowName, id, $event, previewFlowHTML);
    }
}
switchFLow.$inject = ['WorkflowInterface', '$config', 'DaoService', 'ProcessAlias', 'dialogsManager', 'ngDialog', 'sidebarService', '$sessionStorage', '$window', '$rootScope', 'WorkflowConfigInterface', '$location', '$state'];