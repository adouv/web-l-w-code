export default class connectController {
    constructor(OAuth2, $state, $stateParams, $rootScope, connectService, authService, $sessionStorage, dialogsManager, clientService, $config, $scope, $location, cookie) {
        this.OAuth2 = OAuth2;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.connectService = connectService;
        this.$sessionStorage = $sessionStorage;
        this.dialogsManager = dialogsManager;
        this.clientService = clientService;
        this.$stateParams = $stateParams;
        this.$config = $config;
        this.authService = authService;
        this.cookie = cookie;
        this.authService.authCookie(this.$state);
        this.toggleActive();
        this.init();
        this.timer = null;
        this.scope = $scope;
        this.$location = $location;
    }

    init() {
        this.currentTab = this.$state.current.name.split(".")[1] ? this.$state.current.name.split(".")[1] : 'look';
        this.filePath = this.$config.file.SHOWIMG;
        let imgUrl = this.$sessionStorage.get("account").imgUrl;
        this.userImg = imgUrl ? imgUrl : '/common/images/toux.png';
        if (this.$stateParams.id) {
            this.showPersonalInfo();
        }
        this.retypePassword = false;
    }

    /**
     * 更新用户头像
     */
    saveUserImg(base64) {
        this.scope.initCrop = true;
        if (this.timer) {
            clearTimeout(this.timer)
        };
        this.timer = setTimeout(res => {
            let param = {
                'base64': this.result,
                'folder': 'lw-client',
                'fileName': this.selectedImgName
            };

            this.connectService.saveUserImg(param).then(res => {
                let path = res.data.path;
                this.connectService.updateUserImgUserImg({
                    imagePath: path
                }).then(res => {
                    this.userImg = this.userInfo.imgUrl = path;
                    let account = this.$sessionStorage.get("account");
                    account.imgUrl = path;
                    this.$sessionStorage.set("account", account);
                    this.dialogsManager.showMessage('操作成功', {
                        className: 'success'
                    });
                    this.editUserImg = false;
                    this.selectedImg = null;
                    this.scope.initCrop = false;
                })
            })
        }, 500);
    }

    toggleActive() {
        this.$rootScope.$on('$stateChangeSuccess', (event, toState) => {
            this.currentTab = toState.name.split('.')[1];
        });
    }

    /**
     * 显示退出框
     */
    showExit(e) {
        e.stopPropagation();
        this.isShowExit = !this.isShowExit;
        if (document.querySelector(".operation")) {
            document.querySelector(".operation").style.display = 'none'
        }
    }

    /**
     * 切换账号
     */
    swicthNumber() {
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

        this.clientService.hide();
        this.clientService.setWindowSize(360, 480);
        this.clientService.setPosition('center');
        this.cookie.remove('lwCookie');
        this.$sessionStorage.clear();
        this.$state.go("login");
    }

    /**
     * 关闭客户端
     */
    closeClient() {
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

        if (this.clientService.isClient()) {
            this.clientService.close();
        } else {
            this.$state.go("login");
        }
        this.cookie.remove('lwCookie');
        this.$sessionStorage.clear();
    }

    /**
     * 点击客户端收起退出和用户信息
     */
    clickClient() {
        this.isShowExit = false;
        this.isShowUser = false;
        this.editUserImg = false;
        if (this.selectedImg) {
            this.selectedImg = null;
        }
    }

    /**
     *点击 显示用户信息
     * @param {*} e 事件对象
     */
    showPersonalInfo(e) {
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
        if (document.querySelector('.operation')) {
            document.querySelector('.operation').style.display = "none";
        }
        if (document.querySelector('.search_result')) {
            document.querySelector('.search_result').style.display = "none";
        }
        // 点击切换用户信息弹窗
        this.isShowUser = !this.isShowUser;
        let accountId = this.$sessionStorage.get('account').accountId;
        this.connectService.getUserDetail(accountId).then(res => {
            if (!res.data.imgUrl) {
                res.data.imgUrl = '/common/images/toux.png';
            }
            this.user = res.data;
            this.userInfo = res.data;
            this.selectedImg = this.filePath + res.data.imgUrl;
            this.selectedImgName = "toux1.png";
            if (this.userInfo.signatureImgUrl) {
                this.attachment = [{
                    url: this.userInfo.signatureImgUrl
                }]; //用于存储上传图片
            } else {
                this.attachment = [];
            }
        });
    }

    /**
     * 编辑用户信息（浏览器显示弹窗；客户端打开新窗口）
     */
    editUserInfo() {
        this.errorOuterNum = false;
        this.errorInterNum = false;
        this.errorCellNum = false;
        this.errorEmailNum = false;
        this.errorWeChatNum = false;
        this.errorQQNum = false;
        let isClient = this.clientService.isClient();
        this.isShowUser = false;
        // if(!isClient){
        this.showEdit = true;
        // }else{
        //     let allPath = this.$location.absUrl(),
        //         path = this.$location.path();
        //     let toPath = allPath.replace(path,'')+'/userEdit/'+this.$sessionStorage.get('account').accountId;
        //     window.open(toPath);
        // }
    }


    /*
     * 限制名称输入长度
     * */
    limitNameLength(name) {
        if (name.length >= 20) {
            this.userInfo.displayName = this.userInfo.displayName.replace(/(.{20}).*/, "$1");
            return false;
        }
    }

    /**
     * 电话号码校验
     * @param phone
     */
    checkPhone(phone, num) {
        let re = /^1\d{10}$/;
        let re2 = /^0\d{2,3}-?\d{7,8}$/;
        let re3 = /^[1-9][0-9]{5,8}$/;
        if (!(re.test(phone) || re2.test(phone) || re3.test(phone))) {
            this[num] = true;
            return false;
        } else {
            this[num] = false;
        }
    }

    /*
     * 手机号校验
     * */
    checkCellPhone(phone) {
        let re = /^1\d{10}$/;
        if (!(re.test(phone))) {
            this.errorCellNum = true;
        } else {
            this.errorCellNum = false;
            this.connectService.validationCellphone({
                'cellphone': phone
            }).then(res => {
                if (res.data != true) {
                    this.dialogsManager.showMessage('手机号已存在', {
                        className: 'warning'
                    });
                    this.phoneExist = true;
                    return false;
                }
            });
        }
    }

    /*
     * 邮箱校验
     * */
    checkEmail(email) {
        let re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!(re.test(email))) {
            this.errorEmailNum = true;
        } else {
            this.errorEmailNum = false;
        }
    }

    /*
     * 微信号校验
     * */
    checkWeChat(vx) {
        let re = /^[a-zA-Z\d_]{5,}$/;
        if (!(re.test(vx))) {
            this.errorWeChatNum = true;
        } else {
            this.errorWeChatNum = false;
        }
    }

    /*
     * QQ号校验
     * */
    checkQQ(vx) {
        let re = /[1-9][0-9]{4,14}/;
        if (!(re.test(vx))) {
            this.errorQQNum = true;
        } else {
            this.errorQQNum = false;
        }
    }

    /*
     * 提示信息
     * */
    verify(msg) {
        window.event ? window.event.cancelBubble = true : event.stopPropagation();
        this[msg] = true;
    }

    /*
     * 清空提示信息
     * */
    clearMsg() {
        if (this.errorOuter || this.errorInter || this.errorCell || this.errorEmail || this.errorWeChat || this.errorQQ) {
            this.errorOuter = false;
            this.errorInter = false;
            this.errorCell = false;
            this.errorEmail = false;
            this.errorWeChat = false;
            this.errorQQ = false;
            return false;
        }
    }

    /**
     * 确认修改上传数据
     */
    updateUserInfo() {
        this.connectService.validationCellphone({
            'cellphone': this.userInfo.cellphone
        }).then(res => {
            if (res.data != true) {
                this.dialogsManager.showMessage('手机号已存在', {
                    className: 'warning'
                });
            } else {
                if (this.errorOuterNum || this.errorInterNum || this.errorCellNum || this.errorEmailNum || this.errorWeChatNum || this.errorQQNum) {
                    this.dialogsManager.showMessage('不符合数据格式要求', {
                        className: 'warning'
                    });
                    return;
                }
                let param = angular.copy(this.userInfo);
                delete param.createTime;
                delete param.lastUpdateTime;
                delete param.departments;
                this.connectService.saveUserInfo(param).then(res => {
                    this.dialogsManager.showMessage('操作成功', {
                        className: 'success'
                    });
                    // if (this.clientService.isClient()) {
                    //     this.clientService.close();
                    //     return false;
                    // }
                    this.showEdit = false;
                }, err => {
                    this.dialogsManager.showMessage(err.data.error_description, {
                        className: 'error'
                    });
                });
            }
        });
    }


    /**
     * 取消编辑个人信息
     */
    cancelEdit() {
        // if(this.clientService.isClient()){
        //     this.clientService.close();
        //     return false;
        // }
        this.showEdit = false;
        this.userInfo = this.user;
        this.retypePassword = false;
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

    showEditImg(e) {
        e.stopPropagation();
        if (!this.selectedImg) {
            this.selectedImg = this.filePath + this.$sessionStorage.get('account').imgUrl;
        }
        this.editUserImg = true;
    }

    /**
     * 取消编辑头像
     */
    cancelCutImg() {
        this.editUserImg = false;
        this.selectedImg = null;
    }

    /**
     *
     */
    toDepartment(id) {
        this.isShowUser = false;
        let d_id = 'd_' + id;
        this.$state.go('connect.colleague', {
            'd_id': d_id
        });
        // if(this.currentTab !=='colleague'){
        // }else{
        // }
    }

    /**
     * 点击上传输入密码
     */
    enterPassword(e) {
            window.event ? window.event.cancelBubble = true : e.stopPropagation();
            this.clickTarget = e.target;
            this.retypePassword = true;
        }
        /**
         * 输入密码后取消、确定
         */
    cancelHandle() {
        this.retypePassword = false;
        this.confirmPassword = "";
    }
    confirmHandle() {
            if (!this.confirmPassword) {
                this.dialogsManager.showMessage('密码不能为空！', {
                    className: 'warning'
                });
                return;
            }
            let userInfo = {};
            userInfo.username = this.$sessionStorage.get("account").accountName;
            userInfo.password = this.confirmPassword;
            this.OAuth2.getAccessToken(userInfo).then((res) => {
                this.retypePassword = false;
                this.confirmPassword = "";
                if (this.clickTarget.id !== 'delAutograph') {
                    this.isShowNeedToKnow = true;
                    this.confirmPassword = "";
                } else {
                    this.userInfo.signatureImgUrl = null;
                    this.attachment = [];
                }
            }, (err) => {
                this.dialogsManager.showMessage('密码有误，请输入正确密码', {
                    className: 'warning'
                });
            })
        }
        /**
         * 点击弹窗区域外关闭弹窗
         */
    closeInfoDialog(type, evt) {
        window.event ? window.event.cancelBubble = true : evt.stopPropagation();
        if (type === 'password') {
            this.retypePassword = false;
            this.confirmPassword = "";
        } else if (type === 'userInfo') {
            this.isShowUser = false;
        }
    }
}
connectController.$inject = ['OAuth2', '$state', '$stateParams', '$rootScope', 'connectService', 'authService', '$sessionStorage', 'dialogsManager', 'clientService', '$config', '$scope', '$location', 'cookie'];