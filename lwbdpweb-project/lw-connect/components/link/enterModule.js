/**
 * Created by lw-yf-011 on 2017/7/18.
 */
export default class enterModuleController {
    constructor($scope, $state, $location, authService) {
        this.$scope = $scope;
        this.$location = $location;
        this.$state = $state;
        this.authService = authService;
        this.authService.authCookie(this.$state);
        this.init()
    }
    init() {
        let path = this.$scope.$parent.link.toPath
        console.log(path)
    }
}
enterModuleController.$inject = ['$scope', '$state', '$location', 'authService'];