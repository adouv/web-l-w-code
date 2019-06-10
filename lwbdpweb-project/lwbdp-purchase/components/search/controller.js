/**
 * @Author hejialin
 * @Description 描述
 */

export default class purchaseSearchCtrl {
    constructor(dialogsManager, SelectGarden, $scope, ngDialog, ProjectInterface, ProjectService,$stateParams) {
        this.dialogsManager = dialogsManager;
        this.SelectGarden = SelectGarden;
        this.$scope = $scope;
        this.ngDialog = ngDialog;
        this.ProjectInterface = ProjectInterface;
        this.ProjectService = ProjectService;
        this.$stateParams = $stateParams;
        this.initParamData();
    }

    initParamData() {
        let scope = this.$scope.$parent;
        this.callback = scope.callback;
        // copy传来的数据.用于回显
        this.condition = angular.copy(scope.condition);
        this.isAllunits = scope.isAllunits;
        this.isLibrary = scope.isLibrary;
        this.isChar = scope.isChar;
    }

    /*
     * 选择园区
     * */
    chooseGarden() {
        this.SelectGarden.dialog({
            ids: this.condition.gardenIds
        }, garden => {
            this.sanitizeGarden(garden);
        });
    }

    /**
     * 处理园区条件参数
     * @param garden
     */
    sanitizeGarden(garden) {
        this.condition.gardenIds = garden.ids.toString();
        this.condition.gardenList = garden.gardenList;
        // 用于在页面的输入框中回显
        let gardenListArr = [];
        for (let key in garden.gardenList) {
            gardenListArr.push(garden.gardenList[key].name);
        }
        if(gardenListArr.length > 1){
            this.condition.gardenListName = gardenListArr.join('；')+"；";
        }else if(gardenListArr.length === 1){
            this.condition.gardenListName = gardenListArr.join('')+'；';
        }else if(gardenListArr.length === 0){
            this.condition.gardenListName = gardenListArr.join('')
        }
    }

    /*
     * 配标类别弹窗
     * */
    getKindType() {
        // 请求弹窗中的数据
        this.ProjectInterface.getKindType().then(data => {
            // 调起弹窗
            this.ProjectService.getKindType(this.condition.kindName,this.condition.kind,
                data.data,
                'itemName',
                'itemValue',
                res => {
                this.condition.kindName = res.typeName;
                this.condition.kind = res.typeId;
            });
        });
    }



    /*
     * 所属类别弹窗
     * */
    getProjectType() {
        // 请求弹窗中的数据
        this.ProjectInterface.getProjectType('PURCHASE_PROJECT_CATEGORY').then(data => {
            // 调起弹窗
            this.ProjectService.getProjectType(this.condition.categoryListName,this.condition.categoryList, data.data, res => {
                this.condition.categoryListName = res.typeName;
                this.condition.categoryList = res.typeId;
            },false);
        })
    }

    /*
     * 所属阶段弹窗
     * */
    getProjectStage() {
        // 请求弹窗中的数据
        this.ProjectInterface.getProjectStage(this.$stateParams.stage).then(data => {
            // 调起弹窗
            this.ProjectService.getProjectStage(this.condition.stageName,
                this.condition.stage,
                data.data,
                'taskName',
                'taskKey',
                res => {
                    this.condition.stageName = res.typeName;
                    this.condition.stage = res.typeId.join(",");
                });
        });
    }

    /*
     * 所属状态弹窗
     * */
    getProjectStatus() {
        // 请求弹窗中的数据
        this.ProjectInterface.getProjectStatus().then(data => {
            // 调起弹窗
            this.ProjectService.getProjectStatus(this.condition.statusName,
                this.condition.status,
                data.data,
                'itemName',
                'itemValue',
                res => {
                    this.condition.statusName = res.typeName;
                    this.condition.status = res.typeId;
                });
        });
    }

    /**
     * 验证时间段
     * @return {boolean|*}
     */
    validTime(){
        this.validCreateTimeStart = !this.condition.createTimeStart&&this.condition.createTimeEnd;
        this.validCreateTimeEnd = this.condition.createTimeStart&&!this.condition.createTimeEnd;
        this.validTaskTimeStart = !this.condition.taskTimeStart&&this.condition.taskTimeEnd;
        this.validTaskTimeEnd = this.condition.taskTimeStart&&!this.condition.taskTimeEnd;
        this.validStageCompleteStart = !this.condition.stageCompleteStart&&this.condition.stageCompleteEnd;
        this.validStageCompleteEnd = this.condition.stageCompleteStart&&!this.condition.stageCompleteEnd;
        return this.validCreateTimeStart||this.validCreateTimeEnd||this.validTaskTimeStart||
            this.validTaskTimeEnd||this.validStageCompleteEnd||this.validStageCompleteStart;
    }
    
    /**
     * 确认按钮 closeThisDialog是ngDialog创建后作用域默认就有的
     */
    clickSure() {
        if(!this.validTime()){
            this.callback(this.condition);
            this.$scope.closeThisDialog();
        }
    }
}
purchaseSearchCtrl.$inject = ['dialogsManager', 'SelectGarden', '$scope', 'ngDialog', 'ProjectInterface', 'ProjectService','$stateParams'];
