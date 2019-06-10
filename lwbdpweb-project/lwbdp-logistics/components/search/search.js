export default class moreSearchCtrl {
    constructor(logisticsInterface, $sessionStorage, $scope, SelectGarden) {
        this.logisticsInterface = logisticsInterface;
        this.$sessionStorage = $sessionStorage;
        this.$scope = $scope;
        this.SelectGarden = SelectGarden;
        this.init();
    }

    init() {
        this.initParams();
        this.initWarningType();
        this.initNoticeUrgencyLevel();
    }

    initParams() {
        this.garden = this.$sessionStorage.get("currentGarden");
        // copy传来的数据.用于回显
        this.$scope.$on("parentCondition", (scope, data) => {
            this.condition = angular.copy(data);
        });
        this.$scope.$on("hideType", (scope, data) => {
            this.hideType = angular.copy(data);
        });

        this.publishStatus = [
            {value:1,name:'已发布'},
            {value:2,name:'撤回'}
        ];
        this.dealStatus = [
            {value:0,name:'待处理'},
            {value:1,name:'已处理'}
        ];
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

    /**
     * 验证时间段
     * @return {boolean|*}
     */
    validTime() {
        this.validStartTime = !this.condition.startTime && this.condition.endTime;
        this.validEndTime = this.condition.startTime && !this.condition.endTime;
        return this.validStartTime || this.validEndTime;
    }

    /**
     * 确认按钮 closeThisDialog是ngDialog创建后作用域默认就有的
     */
    clickSure() {
        if (!this.validTime()) {
            let tempCondition = this.condition;
            if (this.condition.urgencyLevel) {
                this.noticeUrgencyLevelList.forEach(function (e) {
                    if (e.itemValue == tempCondition.urgencyLevel) {
                        tempCondition.urgencyLevelName = e.itemName;
                    }
                });
            }
            if (this.condition.type) {
                this.warningTypeList.forEach(function (e) {
                    if (e.id == tempCondition.type) {
                        tempCondition.typeName = e.name;
                    }
                });
            }
            if (this.condition.dealStatus) {
                if (this.condition.dealStatus == "0") {
                    this.condition.dealStatusName = "待处理";
                } else {
                    this.condition.dealStatusName = "已处理";
                }
            }
            if (this.condition.publishStatus) {
                if (this.condition.publishStatus == "1") {
                    this.condition.publishStatusName = "已发布";
                } else {
                    this.condition.publishStatusName = "撤回";
                }
            }
            this.$scope.$emit("childCondition", this.condition);
            this.$scope.closeThisDialog();
        }
    }
}
moreSearchCtrl.$inject = ['logisticsInterface', '$sessionStorage', '$scope', 'SelectGarden'];
