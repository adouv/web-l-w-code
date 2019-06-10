import './detail.css'
export default class editCtrl {
    constructor($scope, ngDialog, logisticsInterface, $sessionStorage, logisticsService, $stateParams, $state, SelectPerson, $config) {
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.logisticsInterface = logisticsInterface;
        this.$sessionStorage = $sessionStorage;
        this.logisticsService = logisticsService;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.SelectPerson = SelectPerson;
        this.$config = $config;
        this.init();
    }

    init() {
        this.initParams();
        this.getNoticeInfo();
        this.getReadStatistics();
        this.pageConfig();
    }

    initParams() {
        this.filePath = this.$config.file.SHOWIMG;
        this.keywords = "";
        this.isShowStatistics = true;
        this.readFlag = 1;
        this.replyFlag = 1;
    }

    getReadStatistics() {
        this.logisticsInterface.getReadStatistics(this.$stateParams.id, this.readFlag, null, null).then(res => {
            this.allReadStatistics = res.data;
            if(res.data.length && res.data.length > 20){
                this.showMoreRead = true;
                this.readStatistics = res.data.slice(0,20);
            }else{
                this.showMoreRead = false;
                this.readStatistics = res.data;
            }
            this.unreadCounts = res.headers()['unread-account-counts'];
            this.readCounts = res.headers()['read-account-counts'];
        });
    }

    loadMoreReadPeople(){
        this.showMoreRead = false;
        this.readStatistics = this.allReadStatistics;
    }

    /**
     * 调取分页数据
     */
    pageConfig() {
        this.pageConf = {
            onChange: (offset, size) => {
                this.getList(offset, size, (pageList, totalItems, undoCounts, doneCounts) => {
                    if(!offset && !size){
                        this.allUnDealPeople = pageList;
                        if(pageList.length && pageList.length > 20){
                            this.showMoreDeal = true;
                            this.pageList = this.allUnDealPeople.slice(0,20);
                        }else{
                            this.showMoreDeal = false;
                            this.pageList = this.allUnDealPeople;
                        }
                    }else{
                        this.pageList = pageList;
                    }
                    this.pageConf.totalItems = totalItems*1 || 0;
                    this.pageConf.undoCounts = undoCounts*1 || 0;
                    this.pageConf.doneCounts = doneCounts*1 || 0;
                })
            }
        }
    }

    loadMoreDealPeople(){
        this.showMoreDeal = false;
        this.pageList = this.allUnDealPeople;
    }

    getList(offset, size, callback) {
        this.logisticsInterface.getDealStatistics(this.$stateParams.id, this.replyFlag, this.keywords, offset, size)
            .then(res => {
                let totalItems = res.headers()['x-record-count'];
                let undoCounts = res.headers()['undo-account-counts'];
                let doneCounts = res.headers()['done-account-counts'];
                callback(res.data, totalItems, undoCounts, doneCounts)
            });
    }

    getNoticeInfo() {
        this.logisticsInterface.getNoticeInfo(this.$stateParams.id, this.$stateParams.sideBarCode).then(res => {
            this.notice = res.data.notice;
            this.noticeAccountList = res.data.noticeAccountList;
        })
    }

    goSearch(event) {
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.pageConf.onChange(0, this.pageConf.itemsPerPage);
        }
    }

    goBack() {
        this.$state.go('logistics.warn.list', {sideBarCode: this.$stateParams.sideBarCode});
    }

    templateRepublish() {
        this.$state.go('logistics.warn.publishAdd', {id: this.$stateParams.id, sideBarCode: this.$stateParams.sideBarCode})
    }

    changeStatistics(flag) {
        this.isShowStatistics = flag;
        if (this.isShowStatistics) {
            this.getReadStatistics();
        } else {
            this.pageConf.onChange(0,this.pageConf.itemsPerPage);
        }
    }

    changeReadFlag(flag) {
        this.readFlag = flag;
        this.getReadStatistics();
    }

    changeReplyFlag(flag) {
        this.replyFlag = flag;
        if(!this.replyFlag){
            this.pageConf.onChange(null,null);
        }else{
            this.pageConf.onChange(0,this.pageConf.itemsPerPage);
        }
    }

    exportReply(){
        this.logisticsInterface.exportNoticeReply(this.$stateParams.id, this.replyFlag);
    }
}
editCtrl.$inject = ['$scope', 'ngDialog', 'logisticsInterface', '$sessionStorage', 'logisticsService', '$stateParams', '$state', 'SelectPerson', '$config'];
