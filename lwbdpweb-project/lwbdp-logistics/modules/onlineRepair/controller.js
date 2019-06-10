export default class repairCtrl {
    constructor($scope, ngDialog, logisticsInterface, $sessionStorage, logisticsService, $stateParams, $state, dialogsManager,lwGardenService,logisticsOnlineRepairInterface,$compile) {
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.logisticsInterface = logisticsInterface;
        this.$sessionStorage = $sessionStorage;
        this.logisticsService = logisticsService;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.dialogsManager = dialogsManager;
        this.gardenService = lwGardenService;
        this.logisticsOnlineRepairInterface = logisticsOnlineRepairInterface;
        this.$compile = $compile;
        this.init();
    }

    init() {
        this.loadJspIndex();
    }

    loadJspIndex(){
        this.logisticsOnlineRepairInterface.getJspIndex().then(res=>{
            $('#repairIndex').html(res.data);
        })
    }
}
repairCtrl.$inject = ['$scope', 'ngDialog', 'logisticsInterface', '$sessionStorage', 'logisticsService', '$stateParams', '$state', 'dialogsManager','lwGardenService','logisticsOnlineRepairInterface','$compile'];
