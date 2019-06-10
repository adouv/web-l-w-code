import './add.css'
export default class addCtrl {
    constructor($scope, ngDialog, logisticsInterface, $sessionStorage, logisticsService, $stateParams, $state, SelectPerson, dialogsManager) {
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.logisticsInterface = logisticsInterface;
        this.$sessionStorage = $sessionStorage;
        this.logisticsService = logisticsService;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.SelectPerson = SelectPerson;
        this.dialogsManager = dialogsManager;
        this.init();
    }

    init() {
        this.initParams();
        this.initWarningType();
        this.initNoticeUrgencyLevel();
    }

    initParams() {
        this.allowUpload = false;
        this.accountIds = [];
        this.notice = {};
        this.initNoticeInfo();
        this.isNeedReplies = [
            {value:false,name:'否'},
            {value:true,name:'是'}
        ]
    }

    initWarningType() {
        this.logisticsInterface.getWarningType().then(data => {
            this.warningTypeList = data.data;
        });
    }

    initNoticeUrgencyLevel() {
        this.logisticsInterface.getNoticeUrgencyLevel().then(data => {
            this.noticeUrgencyLevelList = data.data;
        });
    }

    initNoticeInfo() {
        this.$stateParams.id ? this.initUpdateParams() : this.initCreateParams();
    }

    initCreateParams() {
        this.notice.publishStatus = 1;
        this.notice.attachmentList = [];
        this.notice.noticeAccountIdList = [];
        this.notice.isNeedReply = 'false';
        this.notice.noticeMethod = 'system';
        this.noticeMethod = ['system'];
    }

    initUpdateParams() {
        this.logisticsInterface.getNoticeInfo(this.$stateParams.id, 'send').then(res => {
            this.notice = res.data.notice;
            this.notice.isNeedReply = this.notice.isNeedReply ? this.notice.isNeedReply.toString() : "false";
            this.notice.noticeAccountIdList = [];
            this.notice.publishStatus = 1;
        })
    }

    uploadSubmit($flow) {
        if (!this.allowUpload) {
            $flow.files.pop($flow.files.length - 1);
            return;
        }
        $flow.upload();
    }

    uploadSuccess(message) {
        let file = eval("(" + message + ")");
        let url = file.path;
        let name = file.name;
        this.notice.attachmentList.push({name: name, url: url});

    }

    validFile($flow) {
        let allowFileExtendName = 'jpg,png,gif,doc,docx,xls,xlsx,ppt,pptx,pdf';
        let name = $flow.name;
        let size = $flow.size;
        let index = name.indexOf(".");
        let suffixStr = name.substring(index + 1, name.length);
        if (size > 1024 * 1024 * 5) {
            this.dialogsManager.showMessage("所选附件格式系统不支持上传！", {
                className: 'error'
            });
            this.allowUpload = false;
            return;
        }
        if (allowFileExtendName.indexOf(suffixStr) < 0) {
            this.dialogsManager.showMessage("格式只能上传jpg,png,gif,doc,docx,xls,xlsx,ppt,pptx,pdf格式文件", {
                className: 'error'
            });
            this.allowUpload = false;
            return;
        }
        this.allowUpload = true;
    }

    cancel(sideBarCode) {
        this.dialogsManager.confirm({
            title: '发布提示',
            content: '取消后本页面所有操作结果将丢失，是否继续？',
            btn: ['是', '否'],
            callback: [() => {
                this.$state.go("logistics.warn.list", {sideBarCode: sideBarCode});
            }]
        })
    }

    publish() {
        if (!this.validateList(this.notice.attachmentList)) {
            this.dialogsManager.showMessage("通知附件不能为空", {
                className: 'error'
            });
            return;
        }
        if (!this.validateList(this.notice.noticeAccountIdList)) {
            this.showNoticeErr = true;
            this.dialogsManager.showMessage("通知人员不能为空", {
                className: 'error'
            });
            return;
        }
        this.dialogsManager.confirm({
            title: '发布提示',
            content: '确定发布本通知吗？',
            btn: ['是', '否'],
            callback: [() => {
                this.notice.moduleCode = "logistics";
                console.log(this.notice);
                this.logisticsInterface.addNotice(this.notice).then(res => {
                    this.dialogsManager.showMessage("发布成功", {
                        className: 'success'
                    });
                    this.$state.go("logistics.warn.list", {sideBarCode: this.$stateParams.sideBarCode});
                })
            }]
        })
    }

    validateList(obj) {
        if (obj && obj.length == 0) {
            return false;
        }
        return true;
    }


    getNoticeMethod(name, $event) {
        let checked = $event.target.checked;
        if (checked) {
            this.noticeMethod.push(name);
        } else {
            let index = this.noticeMethod.indexOf(name);
            this.noticeMethod.splice(index, 1);
        }
        this.notice.noticeMethod = this.noticeMethod.toString();
    }

    selectPersonDialog() {
        this.SelectPerson.dialog({
            ids: this.accountIds
        }, ($person) => {
            this.accountIds = $person.ids;
            this.notice.noticeAccountIdList = this.accountIds;
            this.selectedPersons = $person.personList;
        });
    }

    setTypeName(type) {
        if (type) {
            this.warningTypeList.forEach((e) => {
                if (type == e.id) {
                    this.notice.typeName = e.name;
                }
            });
        }
    }

    setUrgencyLevelName(urgencyLevel) {
        if (urgencyLevel) {
            this.noticeUrgencyLevelList.forEach((e) => {
                if (urgencyLevel == e.itemValue) {
                    this.notice.urgencyLevelName = e.itemName;
                }
            });
        }
    }
}
addCtrl.$inject = ['$scope', 'ngDialog', 'logisticsInterface', '$sessionStorage', 'logisticsService', '$stateParams', '$state', 'SelectPerson', 'dialogsManager'];
