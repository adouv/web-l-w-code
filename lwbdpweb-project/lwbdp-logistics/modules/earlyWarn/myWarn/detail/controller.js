export default class myWarnDetailCtrl {
    constructor($scope, ngDialog, logisticsInterface, $sessionStorage, logisticsService, $stateParams, $state, dialogsManager) {
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.logisticsInterface = logisticsInterface;
        this.$sessionStorage = $sessionStorage;
        this.logisticsService = logisticsService;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.dialogsManager = dialogsManager;
        this.init();
    }

    init() {
        this.initParams();
        this.getNoticeInfo();
    }

    initParams() {
        this.garden = this.$sessionStorage.get("currentGarden");
        this.account = this.$sessionStorage.get("account");
        this.reply = {};
        this.reply.attachmentList = [];
        this.reply.replyContent = "";
    }


    getNoticeInfo() {
        this.logisticsInterface.getNoticeInfo(this.$stateParams.id, this.$stateParams.sideBarCode).then(res => {
            this.notice = res.data.notice;
            this.noticeAccount = res.data.noticeAccount;
        })
    }



    saveReply() {
        this.reply.noticeId = this.$stateParams.id;
        this.dialogsManager.confirm({
            title: '提示',
            content: '回复操作提交后将不能再编辑和删除，您确定要继续提交上部回复内容吗？',
            btn: ['是','否'],
            callback:[()=>{
                this.logisticsInterface.replyNotice(this.reply).then(res => {
                    this.dialogsManager.showMessage('回复成功', {
                        className: 'success',
                        callback: () => {
                            this.toRouter();
                        }
                    });
                });
            }]
        })
    }

    uploadSuccess(message, $file, $index) {
        let file = eval("(" + message + ")");
        let url = file.path;
        let name = file.name;
        this.reply.attachmentList.push({name: name, url: url});

    }

    validFile($flow) {
        let allowFileExtendName = 'jpg,png,gif,doc,docx,xls,xlsx,ppt,pptx,pdf';
        let name = $flow.name;
        let size = $flow.size;
        let index = name.indexOf(".");
        let suffixStr = name.substring(index + 1, name.length);
        if (size > 1024 * 1024 * 5) {
            alert("所选附件格式系统不支持上传！");
            return;
        }
        console.log(allowFileExtendName.indexOf(suffixStr));
        if (allowFileExtendName.indexOf(suffixStr) < 0) {
            alert("格式只能上传jpg,png,gif,doc,docx,xls,xlsx,ppt,pptx,pdf格式文件");
            return;
        }
    }

    goBack() {
        this.dialogsManager.confirm({
            title: '提示',
            content: '取消后本页面所有操作结果将丢失，是否继续？',
            btn: ['是','否'],
            callback:[()=> {
                this.toRouter();
            }]
        })
    }

    toRouter(){
        this.$state.go('logistics.warn.list',{sideBarCode: this.$stateParams.sideBarCode});
    }
    checkArea(text){
        console.log(text,text.length)
    }
}
myWarnDetailCtrl.$inject = ['$scope', 'ngDialog', 'logisticsInterface', '$sessionStorage', 'logisticsService', '$stateParams', '$state', 'dialogsManager'];
