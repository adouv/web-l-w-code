export default class clientLoginCtrl {
    constructor(OAuth2, $state, $cookies, loginService, $sessionStorage, lwPermissionService, dialogsManager, clientService, $timeout) {
        this.OAuth2 = OAuth2;
        this.$state = $state;
        this.loginService = loginService;
        this.$timeout = $timeout;
        this.clientService = clientService;
        this.$sessionStorage = $sessionStorage;
        this.dialogsManager = dialogsManager;
        this.lwPermission = lwPermissionService;
        this.$cookies = $cookies;
        this.user = {};
        this.password = {};
        this.isClient = clientService.isClient();
        this.clientService.setWindowSize(360, 480);
        this.clientService.setPosition('center');
        this.$timeout(() => this.clientService.show(), 10);

        //console.log(this.$sessionStorage);
        // console.log(this.$sessionStorage.session);

        // this.sessions = JSON.parse(JSON.stringify(this.$sessionStorage.session));
        // this.sessionArr = [];

        // if (this.sessions) {
        //     for (var item in this.sessions) {
        //         if (item != "loglevel:webpack-dev-server") {
        //             this.sessionArr.push(item);
        //         }
        //     }
        // }

        // //console.log(this.sessionArr);

        // if (this.sessionArr && this.sessionArr.length > 0) {
        //     this.getUser();
        //     this.lwPermission.setPermissions();
        // } else {
        //     clientService.closeListener();
        // }

        console.log('load');

    }

    login() {
        this.$cookies.remove('lwCookie');
        this.$sessionStorage.clear(); //在登录之前先将浏览器缓存清楚，（避免直接叉掉TAB页面，重新登陆之后原来的缓存还存在）
        if (!this.user.username || !this.user.password) {
            this.dialogsManager.showMessage('用户名或密码不能为空！', {
                className: 'warning'
            });
            return;
        }
        this.isLonging = true;
        this.OAuth2.getAccessToken(this.user).then((res) => {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 1.5 * 60 * 60 * 1000); // cookies1个半小时有效期
            this.$cookies.put("lwCookie", 'oatmeal', { expires: new Date(expireDate) });

            this.getUser();
            this.lwPermission.setPermissions();
        }, err => {
            this.isLonging = false;
            this.dialogsManager.showMessage('用户名或密码错误！', {
                className: 'warning'
            });
        })
    }

    /**
     * 登录页关闭
     */
    close() {
            this.clientService.close();
        }
        /**
         * enter键登录
         */
    keyPress(e, isNew) {
            if (e.which === 13) {
                if (isNew) {
                    this.changePassword();
                    return false;
                }
                this.login();
            }
        }
        /**
         * 缓存用户信息
         */
    cacheUser(data) {
        this.$sessionStorage.set('account', data);
    }


    /**
     * 获取用户信息
     */
    getUser() {
            this.loginService.getUserInfo().then(data => {
                this.$sessionStorage.set('lwppp', this.user.password);
                this.cacheUser(data.data);
                this.isLonging = false;
                if (data.data.gardens.length === 2 && data.data.gardens.length > 2) {
                    this.$state.go('entry');
                } else {
                    this.$sessionStorage.set('currentGarden', data.data.gardens[0]);
                    if (data.data.isNeedModifyPassword) {
                        this.first = true;
                        return false;
                    }
                    this.clientService.hide();
                    this.$state.go('connect.look');
                    this.setWindow()
                }
            });
        }
        /*
         * 改变屏幕大小
         * */
    setWindow() {
            this.clientService.setWindowSize(1000, 600);
            this.clientService.setPosition('center');
            this.$timeout(() => {
                this.clientService.show();
            }, 50)
        }
        /**
         * 设置新密码
         */
    changePassword() {
        if (!this.password.new || !this.password.new_2) {
            this.dialogsManager.showMessage('新密码不能为空', {
                className: 'warning'
            });
            return;
        }
        if (this.password.new !== this.password.new_2) {
            this.dialogsManager.showMessage('两次密码完全一致才能提交', {
                className: 'warning'
            });
            return;
        }
        this.isLonging = true;
        let param = {
            'oldPassword': '000000',
            'newPassword': this.password.new
        };
        this.loginService.changePassword(param).then(res => {
            this.isLonging = false;
            this.$state.go('connect.look');
            this.setWindow()
        }, err => {
            this.isLonging = false;
            console.log(err)
                // this.dialogsManager.showMessage('用户名或密码错误',{className:'error'});
        });
    }
    losePassword() {
        this.dialogsManager.showMessage('功能开发中...', {
            className: 'warning'
        });
    }
    TDCode() {
        this.dialogsManager.showMessage('功能开发中...', {
            className: 'warning'
        });
    }
}
clientLoginCtrl.$inject = ['OAuth2', '$state', '$cookies', 'loginService', '$sessionStorage', 'lwPermissionService', 'dialogsManager', 'clientService', '$timeout'];