/**
 * Created by wuhao on 2017/6/30.
 */
import audioFlowService from './chart/audioFlow.service';
import flowChartService from './config/flowChartService';
import activityService from './config/activityService';
import auditFlow from './chart/audioFlow.directive';
import approvalFlowchart from './config/flowConfigDirective';
import canvasPluginsService from './canvas.plugins.service';
import switchFlow from './flowDialog/switchFlowDialog';
import currentFlow from './flowDialog/currentFlowDialog';
import previewFullscreen from './fullscreen/fullscreen.directive';
import todoTaskListCtrl from '../todoTask/todoTaskDialog';

export default angular.module('bdp.workflow',[])
    .service('audioFlowService', audioFlowService)
    .service('flowChartService', flowChartService)
    .service('activityService', activityService)
    .service('canvasPluginsService', canvasPluginsService)
    .directive('auditFlow', auditFlow)
    .directive('approvalFlowchart', approvalFlowchart)
    .directive('previewFullscreen', previewFullscreen)
    .controller('switchFlow', switchFlow)
    .controller('currentFlow', currentFlow)
    .controller('todoTaskListCtrl', todoTaskListCtrl)
    .name