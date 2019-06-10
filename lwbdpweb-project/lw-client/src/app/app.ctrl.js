/**
 * Created by lw-yf-025 on 2017/3/15.
 */
import '../../../lwbdp-common/components/laydate'
export default class AppCtrl {
    constructor($rootScope, $state, $sessionStorage, clientService, ngDialog, $location, $timeout) {
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.clientService = clientService;
        this.$sessionStorage = $sessionStorage;
        this.$timeout = $timeout;
        this.$location = $location;
        this.ngDialog = ngDialog;
        this.init();
    }

    init() {
        this.controlResize();
        this.isClient = this.clientService.isClient();
        this.account = this.$sessionStorage.get('account');
        this.isDetail = this.$location.search().isDetails;
        this.isConnect = this.$location.url().indexOf('connect');
        if (!this.$location.url() || this.$location.url().indexOf('login') == 1) {
            this.isConnect = 0;
        }
        // let path = this.$location.url().split('/')[1];
        // if(path=='login'||path=='entry'||path=='connect'||!path){
        //     this.$timeout(()=>{
        //         this.clientService.setPosition('center');
        //     },40);
        // }
        if (!this.account) {
            this.$state.go('login');
        } else {
            if (!this.$location.$$path) {
                this.clientService.setWindowSize(1000, 600);
                this.clientService.setPosition('center');
                this.$state.go('connect.look');
            }
            this.$timeout(() => this.clientService.show(), 100);
        }
        this.$rootScope.$on('$stateChangeSuccess', (event, toState) => {
            this.isLogin = toState.name.indexOf('login') !== -1 || toState.name.indexOf('entry') !== -1 || toState.name.indexOf('userEdit') !== -1;
            //页面头部显示title
            this.nameString = toState.name.split(".")[0];
            this.isShowBack = true;
            if (toState.name === "query.home" || this.nameString === 'connect') {
                this.isShowBack = false;
            }
            let nameObj = {
                'bill': '项目财务管理',
                'repair': '修缮项目管理',
                'asset': '资产管理',
                'connect': '优课场域',
                'query': '项目审批表查询'
            };
            this.name = nameObj[this.nameString] ? nameObj[this.nameString] : '';
        });
        this.addBrowserEvent();
    }

    logout() {
        this.$sessionStorage.clear();
        this.clientService.hide();
        this.clientService.setWindowSize(360, 480);
        this.clientService.setPosition('center');
        this.$state.go('login');
    }

    /**
     * 控制窗口拖拽大小
     */
    controlResize() {
        this.clientService.resize((width, height) => {
            if (width < 1020 || height < 620) this.clientService.setResizable(false);
        })
    }

    /**
     * 关闭窗口
     */
    close() {
        try {
            Object.keys(window.localStorage).forEach(element => {
                if (element.indexOf('win_') > -1) {
                    let winID = parseInt(window.localStorage.getItem(element));
                    if (window.winList !== undefined && window.winList.length > 0) {
                        let find = window.winList.find(i => i.frameId === winID);
                        find.window.close();
                        window.winList.splice(
                            window.winList.findIndex(i => i.frameId === winID), 1
                        );
                        window.localStorage.removeItem(element);
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }
        this.clientService.close();
    }

    /**
     * 最小化窗口
     */
    minimize() {
        this.clientService.minimize();
    }

    // 浏览器回退事件
    addBrowserEvent() {
        window.addEventListener('popstate', () => {
            this.ngDialog.closeAll();
            let laydate = document.querySelectorAll('.layui-laydate');
            let confirm = document.querySelectorAll('.nspop_megcontainer');
            laydate && angular.element(laydate).remove();
            confirm && angular.element(confirm).remove();
        }, false);
    }
}
AppCtrl.$inject = ['$rootScope', '$state', '$sessionStorage', 'clientService', 'ngDialog', '$location', '$timeout'];