import previewFlowHTML from "./previewFlowDialog.html";
export default class currentFlowDialog {
    constructor($sessionStorage, WorkflowInterface, WorkflowConfigInterface, ngDialog, $rootScope, DaoService, $config, ProcessAlias) {
        this.$sessionStorage = $sessionStorage;
        this.getUserProcessConfig = WorkflowInterface.getUserProcessConfig;
        this.DaoService = DaoService;
        this.modules = $config.modules;
        this.ProcessAlias = ProcessAlias;
        this.WorkflowConfigInterface = WorkflowConfigInterface;
        this.ngDialog = ngDialog;
        this.$rootScope = $rootScope;
        this.currentFlows = [];
        this.init();
    }
    init() {
        this.getCurrentFlow();
    }
    /*查看当前审批流程*/
    getCurrentFlow() {
        let currentModule = this.$rootScope.currentModule;
        let currentFlows = [];
        let currentFlowIds = this.$rootScope.currentFlows;
        this.getUserProcessConfig(currentModule).then(res => {
            res.data.map((item) => {
                if (currentFlowIds.indexOf(item.id) > -1) currentFlows.push(item);
            })
            this.currentFlows = currentFlows; //当前审批流程
        });
    }
    /* 预览流程图 */
    previewFlowChart(flowName, id, $event) {
        this.WorkflowConfigInterface.previewFlowChart(flowName, id, $event, previewFlowHTML);
    }
}
currentFlowDialog.$inject = ['$sessionStorage', 'WorkflowInterface', 'WorkflowConfigInterface', 'ngDialog', '$rootScope', 'DaoService', '$config', 'ProcessAlias'];