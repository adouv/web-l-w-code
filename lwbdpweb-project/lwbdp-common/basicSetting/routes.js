/**
 * @Author hejialin
 * @Description 基础设置
 */
let referenceModule = ['asset','repair','purchase','logistics'];

export default function routes($stateProvider) {
    referenceModule.forEach(module=>{
        $stateProvider
        // 基础设置-->系统字典值设置 //TODO bar
            .state(module+'.dictionary', {
                url: "/settings/dictionary",
                template: require('./pages/sysTypeInfo/sysTypeInfo.html'),
                controller: "sysTypeInfoController",
                controllerAs: "sysTypeInfo"
            })
            // 基础设置-->信息采集模版
            .state(module+'.baseInfoTemplate', {
                url: "/settings/baseInfoTemplate",
                template: require('./pages/baseInfo/baseInfoTemplate.html'),
                controller: "baseInfoTemplateCtrl",
                controllerAs: "baseInfoTemplate"
            })
            // 基础设置-->审批流程设置 //TODO bar
            .state(module+'.process', {
                url: "/settings/process",
                template: require('./pages/setApprover/setApprover.html'),
                controller: "setApproverController",
                controllerAs: "setApprover"
            })
            // 基础设置-->固定资产最低使用年限标准置配置 //TODO bar
            .state(module+'.time', {
                url: '/settings/time',
                template: require('./pages/auditAgeLimit/auditAgeLimit.html'),
                controller: 'auditAgeLimitController',
                controllerAs: 'auditAgeLimit'
            })
    })
    // 基础设置
    $stateProvider
        .state('setting', {
            url: "/:module/setting",
            template: require('./pages/basicSetting/basicSetting.html'),
            controller: "basicSettingController",
            controllerAs: "basicSetting"
        })
        // 基础设置-->添加审批流程设置
        .state('setting.process', {
            url: "/process",
            template: '<ui-view></ui-view>'
        })
        // 基础设置-->添加审批流程设置
        .state('setting.process.append', {
            url: "/append/:sidebarId",
            template: require('./pages/addApprovalProcess/addApprovalProcess.html'),
            controller: "addApprovalProcessController",
            controllerAs: "addApprovalProcess"
        })
        // 基础设置-->添加审批流程设置
        .state('setting.process.edit', {
            url: "/edit/:id/:sidebarId",
            template: require('./pages/addApprovalProcess/addApprovalProcess.html'),
            controller: "addApprovalProcessController",
            controllerAs: "addApprovalProcess"
        })
        // 基础设置-->查看审批流程设置
        .state('setting.process.detail', {
            url: "/detail/:id/:sidebarId",
            template: require('./pages/lookApprovalProcess/lookApprovalProcess.html'),
            controller: "lookApprovalProcessController",
            controllerAs: "lookApprovalProcess"
        });
        
};

