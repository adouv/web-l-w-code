routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('asset', {
            url: '/asset',
            template: require('./index.html'),
            controller: 'AssetController',
            controllerAs: 'asset'
        })
        //我的申请
        .state('asset.apply', {
            url: '/apply/:processConfigId/:stage',
            template: require('./modules/apply/list/apply.html'),
            controller: 'assetApplyCtrl',
            controllerAs: 'assetApply'
        })
        //我的申请
        .state('asset.audit', {
            url: '/audit/:processConfigId/:stage',
            template: require('./modules/apply/list/apply.html'),
            controller: 'assetApplyCtrl',
            controllerAs: 'assetApply'
        })
        //我的项目库
        .state('asset.library', {
            url: '/library/:processConfigId/:stage',
            template: require('./modules/library/library.html'),
            controller: 'assetLibraryCtrl',
            controllerAs: 'assetLibrary' 
        })
        //我的申请-->添加申请
        .state('asset.append', {
            url: '/append/:processConfigId/:sidebarId',
            template: require('./modules/apply/input/input.html'),
            controller: 'assetInputCtrl',
            controllerAs: 'assetInput'
        })
        //我的申请-->编辑申请
        .state('asset.edit', {
            url: '/edit/:id/:sidebarId',
            template: require('./modules/apply/input/input.html'),
            controller: 'assetInputCtrl',
            controllerAs: 'assetInput'
        })
        //我的申请-->草稿箱
        .state('asset.draft', {
            url: '/draft/:processConfigId/:sidebarId',
            template: require('./modules/draft/draft.html'),
            controller: 'assetDraftCtrl',
            controllerAs: 'assetDraft'
        })
        //我的申请-->编辑申请
        .state('asset.formEdit', {
            url: '/formEdit/:id/:sidebarId',
            template: require('./modules/apply/input/input.html'),
            controller: 'assetInputCtrl',
            controllerAs: 'assetInput'
        })
        //我的申请-->全单位所有收件箱
        .state('asset.all', {
            url: '/all',
            template: require('./modules/allunits/allunits.html'),
            controller: 'assetAllCtrl',
            controllerAs: 'assetAll'
        })
        .state('asset.form', {
            url: '/form/:id/:sidebarId',
            template: `<asset-project-detail>
                        <asset-audit-fail audit-info="assetAuditForm.auditInfo" form-data="assetAuditForm.formData" current-task="assetAuditForm.currentTask" 
                            task-info="assetAuditForm.showTaskInfo(isEdit, taskId)"
                            reapply-order="assetAuditForm.reapplyOrder(flag, taskKey, taskId)">
                        </asset-audit-fail>
                        <audit-form ng-if="assetAuditForm.formCtrl"
                            ctrl-as="assetForm"
                            form-data="assetAuditForm.formData"
                            ctrl="assetAuditForm.formCtrl"
                            current-task-id="assetAuditForm.currentTaskId"
                            next-audit-info="assetAuditForm.nextAuditInfo"
                            audit-task="assetAuditForm.auditTask(formData)"
                            audit-cancel="assetAuditForm.auditCancel(isEdit)">
                        </audit-form>
                       </asset-project-detail>`,
            controller: 'assetAuditFormCtrl',
            controllerAs: 'assetAuditForm'
        })
        //我的申请-->申请详情页
        .state('asset.detail', {
            url: '/detail/:id/:sidebarId',
            template: `<asset-project-detail>
                        <asset-audit-fail audit-info="assetAuditForm.auditInfo" current-task="assetAuditForm.currentTask" 
                            task-info="assetAuditForm.showTaskInfo(isEdit, taskId)"
                            reapply-order="assetAuditForm.reapplyOrder(flag, taskKey, taskId)">
                        </asset-audit-fail>
                       </asset-project-detail>`,
            controller: 'assetAuditFormCtrl',
            controllerAs: 'assetAuditForm'
        })
        //我的申请-->申请详情页
        .state('asset.editor', {
            url: '/editor/:id/:sidebarId',
            template: `<asset-project-detail></asset-project-detail>`
        })
        //处置统计 
        .state('asset.statistic', {
            url: '/statistic/:processConfigId/:stage/:sidebarId',
            template: require('./modules/statistic/statistic.html'),
            controller: 'assetStatisticCtrl',
            controllerAs: 'assetStatistic'
        })
       /* //处置统计 
        .state('asset.dispose.count', {
            url: '/count',
            template: require('./pages/disposeStatics/disposeStatics/disposeStatics.html'),
            controller: 'disposeStaticsController',
            controllerAs: 'disposeStatics'
        })
        // 资产库-->资产库基本信息
        .state('asset.library', {
            url: "/library",
            template:'<ui-view></ui-view>'
        })
        // 资产库-->资产库基本信息
        .state('asset.library.basic', {
            url: "/basic",
            template: require('./pages/assetRepository/basicLibrary.html'),
            controller: "basicLibraryController",
            controllerAs: 'basicLibrary'
        })
        // 资产库-->资产库基本信息详情
        .state('asset.library.detail', {
            url: "/basic/:id",
            template: require('./pages/assetRepository/info/basicLibraryInfo.html'),
            controller: "basicLibraryInfoController",
            controllerAs: 'basicLibraryInfo'
        })*/
}