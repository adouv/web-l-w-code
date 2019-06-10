export default class authService {
    constructor(DaoService, $config, $cookies) {
            this.DaoService = DaoService;
            this.modules = $config.modules;
            this.$cookies = $cookies;

        }
        /**
         * 验证cookie失效
         * @param {*} $state 
         */
    authCookie($state) {
        if (this.$cookies.get('lwCookie') === undefined) {
            try {
                // Object.keys(window.localStorage).forEach(element => {
                //     if (element.indexOf('win_') > -1) {
                //         let winID = parseInt(window.localStorage.getItem(element));
                //         if (window.winList !== undefined && window.winList.length > 0) {
                //             let find = window.winList.find(i => i.frameId === winID);
                //             find.window.close();
                //             window.winList.splice(
                //                 window.winList.findIndex(i => i.frameId === winID), 1
                //             );
                //             window.localStorage.removeItem(element);
                //         }
                //     }
                // });
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('account');
                window.localStorage.removeItem('currentGarden');
                window.localStorage.removeItem('permissionList');
                $state.go('login');
            } catch (error) {
                console.log(error);
            }
        }
    }
}
authService.$inject = ['DaoService', '$config', '$cookies'];