/**
 * Created by lw-yf-025 on 2017/3/15.
 */

export default class AppCtrl {
    constructor($rootScope, $state, SelectGarden, SelectPerson, $sessionStorage, dialogsManager,$location) {
        this.$state = $state;
        this.$location = $location;
        this.$rootScope = $rootScope;
        this.$sessionStorage = $sessionStorage;
        this.toggleActive();
        this.init();
    }

    init() {
        this.currentTab = 'repair';
        this.account = this.$sessionStorage.get('account');
        if (!this.account) {
            this.$state.go('login');
        }
    }

    goModule(name) {
        if (this.currentTab != name) {
            this.$state.go(name);
        }
    }

    logout() {
        this.$sessionStorage.clear();
        this.$state.go('login')
    }

    /**
     * 控制切换菜单栏选中效果
     */
    toggleActive() {
        this.$rootScope.$on('$locationChangeSuccess', (event, url, oldUrl, state, oldState) => {
            this.currentTab = url.split('/')[3];
        });
    }

}
AppCtrl.$inject = ['$rootScope', '$state', 'SelectGarden', 'SelectPerson', '$sessionStorage', 'dialogsManager','$location'];

