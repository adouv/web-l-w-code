import './link.css'
export default class linkController {
    constructor($state, linkDataService, $config, dialogsManager, $location, $scope, ngDialog, Base64Service, authService) {
        this.$state = $state;
        this.$config = $config;
        this.Base64Service = Base64Service;
        this.linkDataService = linkDataService;
        this.dialogsManager = dialogsManager;
        this.$location = $location;
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.authService = authService;
        this.authService.authCookie(this.$state);
        this.init();
    }
    init() {
            this.getList(() => {
                this.changeView('garden');
            });
            this.selectedId = null;
            this.selectedTop = null;
            this.timer = null;
            this.filePath = this.$config.file.SHOWIMG;
            this.typeNum = 2;
        }
        /**
         * 获取已连接数据
         */
    getList(callback) {
            this.linkDataService.getConnection().then(res => {
                this.originData = res.data;
                this.gardenList = res.data.gardensCategory;
                this.moduleList = res.data.modulesCategory;
                this.sceneList = res.data.scenesCategory;
                this.eventList = res.data.eventsCategory;
            }).then(callback)
        }
        /**
         * 切换页面
         * @param {*} type 园区/模块/场景/事件
         */
    changeView(type, goBack) {
            this.type = type;
            this.isShowSearch = false;
            switch (this.type) {
                case 'garden':
                    this.typeNum = 1;
                    break;
                case 'module':
                    this.typeNum = 2;
                    break;
                case 'scene':
                    this.typeNum = 3;
                    break;
                case 'event':
                    this.typeNum = 4;
                    break;
            }
            // 点击返回,则清空,并重新请求已连接的数据
            if (goBack) {
                this.cleanAll(type);
                this.getList();
            } else {
                // 切换页面后,清空条件,并显示已连接的数据
                this.cleanAll(type);
            }
        }
        /**
         * 置顶或取消置顶
         */
    toTop() {
            this.showMask = false;
            this.linkDataService.setItTop({
                categoryId: this.selectedId,
                categoryType: 2,
                onTop: !this.selectedTop
            }).then(res => {
                this.getList();
                this.selectedId = null;
                this.dialogsManager.showMessage('操作成功', { className: 'success' });
            })
        }
        /**
         * 取消连接
         */
    cancelLink() {
            this.showMask = false;
            this.linkDataService.cancelLink({
                id: this.selectedId,
                type: 2
            }).then(res => {
                this.selectedId = null;
                this.dialogsManager.showMessage('操作成功', { className: 'success' });
                this.getList();
            })
        }
        /**
         * 右键动作设置选中
         * @param {*} id 选中id
         */
    setUpConnection(id, index) {
            this.linkDataService.setUpConnection({
                id: id,
                type: 2
            }).then(res => {
                this.dialogsManager.showMessage('操作成功', { className: 'success' });
                this.searchData.splice(index, 1);
                // 如果剩余的搜索条数<1时,跳转
                if (this.searchData.length >= 1) {
                    return false;
                } else {
                    this.cleanAll();
                    this.getList();
                    this.isShowSearch = false;
                }
            })
        }
        /**
         * 右键动作设置选中
         * @param {*} id 选中id
         * @param {*} top 选中元素的是否置顶(true,false)
         */
    rightClick(id, top) {
        this.showMask = true;
        this.selectedId = id;
        this.selectedTop = top;
    }
    showSearch() {
        this.isShowSearch = true;
        this.getModuleList();
    }
    searchList(type) {
        this[type + 'List'] = null;
        let data = this.originData[type + 'sCategory'];
        let arr = [];
        for (let item of data) {
            if (item.categoryName.indexOf(this.listKeywords) !== -1) {
                arr.push(item);
            }
        }
        this[type + 'List'] = arr;
    }

    getModuleList() {
        this.linkDataService.searchByType({
            type: 2
        }).then(res => {
            this.searchData = res.data;
            this.cacheData = res.data;
        })
    }

    search() {
        this.searchData = this.cacheData.filter(item => item.name.includes(this.keywords));
    }
    cleanAll(type) {
            this.keywords = null;
            this.searchData = angular.copy(this.cacheData);
            if (type) {
                this[type + 'List'] = this.originData[type + 'sCategory'];
            }
        }
        /**
         * 进入具体模块
         * @param {*} url  模块链接
         */
    enterModule(item, url) {
        if (item.routeType === 0) {
            if (url) {
                let allPath = this.$location.absUrl();
                let path = this.$location.path();
                if (url.startsWith('http')) {
                    let urlCode = this.Base64Service.encode(url);
                    //let urlCode = this.Base64Service.encode('http://localhost:4600/login');
                    let toPath = allPath.replace(path, '') + '/frame/' + urlCode;
                    window.openWindow(toPath, { 'min_width': 1366, 'min_height': 771, 'width': 1366, 'height': 771, 'position': 'center' })
                } else {
                    let toPath = url.indexOf('http') > -1 ? url : allPath.replace(path, '') + url;
                    //let toPath = 'http://localhost:4600/login'.indexOf('http') > -1 ? 'http://localhost:4600/login' : allPath.replace(path, '') + 'http://localhost:4600/login';
                    window.openWindow(toPath, { 'min_width': 1366, 'min_height': 771, 'width': 1366, 'height': 771, 'position': 'center' })
                }
            } else {
                this.dialogsManager.showMessage('功能开发中', { className: 'warning' });
            }
        } else {
            //外部访问
            window.shell.openExternal(url);
        }
    }
}
linkController.$inject = ['$state', 'linkDataService', '$config', 'dialogsManager', '$location', '$scope', 'ngDialog', 'Base64Service', 'authService']