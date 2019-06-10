export default class moveMoreSearchCtrl {
    constructor($scope,$sessionStorage,SelectGarden) {
        this.$scope = $scope;
        this.$sessionStorage =$sessionStorage;
        this.SelectGarden = SelectGarden;
        this.init();
    }
    init() {
        this.gardenId = this.$sessionStorage.get('currentGarden').gardenId;
        this.$scope.$on('userTitles',(event,data)=>{
            this.titles = data.titles;
            this.condition = angular.copy(data.condition)||{};
            if(this.condition.gardenIds){
                this.gardenId = this.condition.gardenIds;
            }
            this.condition.list = this.condition.list||[];
            this.condition.startTime = this.condition.startTime||null;
            this.condition.endTime = this.condition.endTime||null;
            this.initConditionId(data.titles);
        })

    }


    initConditionId(titles){
        let i = 0;
        for(let title of titles){
            this.condition.list[i] = this.condition.list[i]||{};
            this.condition.list[i].name = title.id;
            this.condition.list[i++].viewName = title.name;
        }
    }

    /**
     * 验证时间段
     * @return {boolean|*}
     */
    validTime(){
        this.validStartTime = !this.condition.startTime&&this.condition.endTime;
        this.validEndTime = this.condition.startTime&&!this.condition.endTime;
        return this.validStartTime||this.validEndTime;
    }

    toSearch(closeThisDialog){
        if(!this.validTime()){
            this.$scope.$emit('conditions',this.condition);
            closeThisDialog();
        }
    }

    /**
     * 选择默认园区(多选)
     */
    chooseGarden() {
        this.SelectGarden.dialog({
            ids: this.gardenId,
            single:false
        }, $garden => {
            this.condition.gardenName= $garden.gardenList.map(garden=>garden.name).join(";")+";";
            this.condition.gardenIds = $garden.gardenList.map(garden=>garden.id);
            this.gardenId = this.condition.gardenIds;
        });
    }
}

moveMoreSearchCtrl.$inject = ['$scope','$sessionStorage','SelectGarden'];
