/**
 * @Author hejialin
 * @Description 基础数据平台公用模块
 */
import routes from './routes';

// 拖动模块
import 'ngdraggable'

import changeNumber from './directives/useNumber/changeNumber.directive';
import updateLog from './directives/updatelog/updatelog.directive';
import allGardenType from './directives/allGardenType/allGardenType.directive'
import allProjectType from './directives/allProjectType/allProjectType.directive'

//基础设置
import basicSettingCtrl from './pages/basicSetting/basicSetting';
import sysTypeInfoCtrl from './pages/sysTypeInfo/sysTypeInfo';
import setApproverCtrl from './pages/setApprover/setApprover';
import addApprovalProcessCtrl from './pages/addApprovalProcess/addApprovalProcess';
import lookApprovalProcessCtrl from './pages/lookApprovalProcess/lookApprovalProcess';
import auditAgeLimitCtrl from './pages/auditAgeLimit/auditAgeLimit';

// 默认流程配置弹窗对应的控制器
import defaultProcessCtrl from '../components/defaultProcess/defaultProcess'
// 信息采集模版对应的控制器
import  baseInfoTemplateCtrl from './pages/baseInfo/controller'
// 添加工资项弹窗
import addBaseInfoCtrl from './directives/baseInfo/addBaseInfo/addBaseInfo'
// 编辑工资项弹窗
import editBaseInfoCtrl from './directives/baseInfo/editBaseInfo/editBaseInfo'
// 批量管理弹窗
import batchManageCtrl from './directives/baseInfo/batchManage/batchManage'
//Ztree数据的获取，加载；
import solidTreeDirective from '../directive/dialog/solidTree'


// 服务
import baseInfoTemplateInterface from '../services/base.info.template.interface';
import baseConfigInterface from '../services/bdp.basic.config.interface'
export default angular.module('bdp.basicSetting',['ngDraggable'])
    .config(routes)
    .directive('changeNumber', changeNumber)
    .directive('updateLog', updateLog)
    .directive('allGardenType',allGardenType)
    .directive('allProjectType',allProjectType)
    // zTree数据指令的引入与获取
    .directive('solidTreeDirective',solidTreeDirective)
    .controller('basicSettingController', basicSettingCtrl)
    .controller('sysTypeInfoController', sysTypeInfoCtrl)
    .controller('setApproverController', setApproverCtrl)
    .controller('addApprovalProcessController', addApprovalProcessCtrl)
    .controller('lookApprovalProcessController', lookApprovalProcessCtrl)
    .controller('auditAgeLimitController', auditAgeLimitCtrl)
    .controller('defaultProcessCtrl', defaultProcessCtrl)
    .controller('baseInfoTemplateCtrl',baseInfoTemplateCtrl)
    .controller('addBaseInfoCtrl',addBaseInfoCtrl)
    .controller('editBaseInfoCtrl',editBaseInfoCtrl)
    .controller('batchManageCtrl',batchManageCtrl)


    .service('BaseInfoTemplateInterface',baseInfoTemplateInterface)
    .service('BaseConfigInterface',baseConfigInterface)
    .name
