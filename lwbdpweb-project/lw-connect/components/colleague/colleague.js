import './colleague.css';
export default class colleagueController {
    constructor($sessionStorage, $scope, $state, colleagueService, authService, dialogsManager, $config, $stateParams, cookie) {
        this.$sessionStorage = $sessionStorage;
        this.$scope = $scope;
        this.colleagueService = colleagueService;
        this.authService = authService;
        this.$config = $config;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.filePath = this.$config.file.SHOWIMG;
        this.dialogsManager = dialogsManager;
        this.$scope.treeData = null;
        console.log(window.winList);
        this.authService.authCookie(this.$state);
        console.log('这个是新的');
        this.init();
    }
    init() {
            this.setTreeDataTimes = 0;
            this.setTreeData();
            this.showDetail();
            if (this.$stateParams.d_id) {
                this.$scope.selectedDepartment = this.$stateParams.d_id;
            }
        }
        /**
         * 右侧显示组/人员详情
         */
    showDetail() {
            this.$scope.showDetail = (item, name) => {
                this.showType = item.type == 'group' ? 'group' : 'account';
                if (item.type && item.type === 'group') {
                    this[name] = item;
                } else {
                    this.colleagueService.getAccountDetail(item.id).then(res => {
                        let dataObj = {};
                        dataObj = res.data;
                        if (!dataObj.imgUrl || dataObj.imgUrl === '') {
                            dataObj.imgUrl = '/common/images/toux.png';
                        }
                        dataObj.parentsArr = item.parentsArr;
                        this[name] = dataObj;
                    })
                }
            };
        }
        /**
         * 组装ztree数据
         */
    setTreeData() {
        let treeDataArr = [];
        this.gardens = this.$sessionStorage.get('account').gardens;
        for (let key in this.gardens) {
            let garden = this.gardens[key];
            let gardenObj = {
                pId: "",
                id: garden.gardenId,
                name: garden.gardenName,
                isParent: true
            };
            treeDataArr.push(gardenObj);
            //单个园区直接展开
            if (this.gardens.length === 1) {
                gardenObj.open = true;
            }
            this.colleagueService.getPersonList(garden.gardenId).then(res => {
                let accountList = res.data;
                let repeatItem = [];
                //处理人员多个部门
                for (let item of accountList) {
                    if (item.pId == '') {
                        item.pId = garden.gardenId;
                    }
                    let pIdArr = item.pId.split(",");
                    if (pIdArr.length > 1) {
                        item.pId = pIdArr[0];
                        item.pIdArr = pIdArr;
                        for (let i = 1, len = pIdArr.length; i < len; i++) {
                            let id = pIdArr[i];
                            let newItem = {
                                name: item.name,
                                id: item.id,
                                pId: id,
                                pIdArr: pIdArr,
                                imgUrl: item.imgUrl,
                                displayName: item.displayName
                            };
                            repeatItem.push(newItem);
                        }
                    } else {
                        item.pIdArr = [item.pId];
                    }
                }
                accountList = accountList.concat(repeatItem);
                treeDataArr = treeDataArr.concat(accountList);
                this.setTreeDataTimes++;
            })
            this.colleagueService.getDepartmentList(garden.gardenId).then(res => {
                let departmentList = res.data;
                for (let item of departmentList) {
                    if (item.pId == '') {
                        item.pId = garden.gardenId;
                    }
                    item.isParent = true;
                }
                this.setTreeDataTimes++;
                treeDataArr = treeDataArr.concat(departmentList);
            })
        }
        /**
         * 多个园区数据拼装完毕后,销毁watch,数据传递到指令
         */
        let watcher = this.$scope.$watch('colleague.setTreeDataTimes', res => {
            if (res === this.gardens.length * 2) {
                this.$scope.treeData = treeDataArr;

                watcher();
            }
        })
    }
    cleanAll() {
        this.keywords = null;
        this.result_detail = null;
    }
    msg(num) {
        if (num < 1) {
            return false;
        }
        this.dialogsManager.showMessage('功能开发中...', { className: 'warning' });
    }
}
colleagueController.$inject = ['$sessionStorage', '$scope', '$state', 'colleagueService', 'authService', 'dialogsManager', '$config', '$stateParams', 'cookie']