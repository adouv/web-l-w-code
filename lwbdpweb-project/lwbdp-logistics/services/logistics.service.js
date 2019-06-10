/**
 * @Author guoyaru
 * @Description 后勤运维模块 服务
 */

export default class logisticsService {

    constructor(ngDialog, $rootScope, dialogsManager) {
        this.ngDialog = ngDialog;
        this.$rootScope = $rootScope;
        this.dialogsManager = dialogsManager;
    }

}
logisticsService.$inject = ['ngDialog', '$rootScope', 'dialogsManager'];
