import './list.css'
export default class listCtrl {
    constructor(ngDialog,$scope,$stateParams,baseInfoInterface,$state,$sessionStorage,lwGardenService,$compile){
        this.ngDialog = ngDialog;
        this.$scope = $scope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.baseInfoInterface = baseInfoInterface;
        this.$sessionStorage = $sessionStorage;
        this.gardenService = lwGardenService;
        this.$compile = $compile;
        this.init();
    }
    init(){
        this.hasSearch = false;
        this.moduleCode = this.$stateParams.module;
        this.initCreatePermissionCode(this.$stateParams.module);
        this.systemTitles = [];
        this.userTitles = [];
        this.datas = [];
        this.total = 0;
        this.gardenCount = 0;
        this.garden = this.$sessionStorage.get("currentGarden");
        this.isShowCancel = false;
        this.getTitles();
        this.condition = {moduleCode:this.moduleCode,keywords:''};
        this.pageConfig();
        this.receiveChild();

    }

    initCreatePermissionCode(moduleCode) {
        this.createPermissionCode = "";
        if(moduleCode == "operation_repair"){
            this.createPermissionCode = "logistics:basicOperation:create";
        } else if (moduleCode =="flood_prevention"){
            this.createPermissionCode = "logistics:floodPrevention:create";
        } else if (moduleCode =="dining_room"){
            this.createPermissionCode = "logistics:canteen:create";
        } else if (moduleCode =="fire_protection"){
            this.createPermissionCode = "logistics:firePrevention:create";
        } else if (moduleCode =="energy_consumption"){
            this.createPermissionCode = "logistics:energyConsumption:create";
        }
        console.log(this.createPermissionCode);
    }

    receiveChild(){
        this.$scope.$on('conditions',(res,data)=>{
            this.hasSearch = true;
            this.condition = angular.copy(data);
            loop: for (let key in data) {
                if (data[key] !== '' && key != 'moduleCode') {
                    if(key != 'list'){
                        if(data[key]){
                            this.isShowCancel = true;
                            break loop;
                        }
                    }else{
                        for(let title of data[key]){
                            if(title.value){
                                this.isShowCancel = true;
                                break loop;
                            }
                        }
                    }

                }
            }
          this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
        })

        this.$scope.$on('dataChange',(res,data)=>{
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
        })
    }

    goSearch(event){
        if (!event || event.charCode === 13 || event.keyCode === 13 || event.which === 13) {
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
        }
        this.hasSearch = true;
    }

    removeKeywords(){
        this.condition.keywords = '';
        this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
    }



    deleteCondition(){
        this.condition = {moduleCode:this.moduleCode};
        this.condition.keywords = this.condition.keywords||'';
        this.isShowCancel = false;
        this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);
    }




    getTitles(){
        return this.baseInfoInterface.getTitles(this.moduleCode).then(res=>{
            this.titles = res.data;
            this.getSystemTitles(this.titles);
            this.getUserTitles(this.titles);
        });
    }



    getSystemTitles(titles){
        for(let title of titles){
            if(title.isSystem){
                this.systemTitles.push(title);
            }
        }
    }

    getUserTitles(titles){
        for(let title of titles){
            if(!title.isSystem){
                this.userTitles.push(title);
            }
        }
        if(this.userTitles&&this.userTitles.length>0){
            this.couldDownloadTemplate = true;
        }
    }

    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getList(offset, size,this.condition, (datas,total,gardenCount) => {
                    this.datas = datas;

                    this.total = total || 0;
                    this.gardenCount = gardenCount || 0;
                    this.paginationConf.totalItems = total || 0;
                    this.systemTitleData = this.constructeSystemTitleData();
                    this.dataValueList = this.constructeDataTable();
                })
            }
        }
    }

    constructeDataTable(){
        let dataValueList = [];
        this.datas.forEach((outerTrData)=>{
            if(!outerTrData.userTitleDataList){
                dataValueList.push(outerTrData);
            }else{
                outerTrData.userTitleDataList.forEach(data=>{
                    data.hasRead = outerTrData.hasRead;
                    dataValueList.push(data);
                })

            }
        });
        return dataValueList;
    }

    constructeSystemTitleData(){
        let dataValueList = [];
        this.datas.forEach((outerTrData,index)=>{
            outerTrData.index = index;
            dataValueList.push(outerTrData);
            if(outerTrData.userTitleDataList){
                let dataArr = new Array(outerTrData.userTitleDataList.length-1);
                for(let i= 0; i<outerTrData.userTitleDataList.length-1;i++){
                    dataArr[i] = {};
                    dataArr[i].id=outerTrData.id;
                }
                dataValueList.push(...dataArr);
            }
        });
        return dataValueList;
    }

   /* getParams(){
        this.condition.gardenIds = 1;
        return this.condition;
    }*/

    getList(offset,size,params,callback){
        let conditions = angular.copy(params);
        conditions.offset = offset;
        conditions.size = size;
        if(!this.condition.gardenIds){
            this.gardenService.getVisualGardenList(false, res => {
                conditions.gardenIds = res.data.map((g)=>g.gardenId);
                return this.baseInfoInterface.getList(conditions).then(res=>{
                    let totalItems = res.headers()['x-record-count'];
                    let gardenCount = res.headers()['garden-count'];
                    callback(res.data,totalItems,gardenCount);
                });
            })
        }else{
            delete conditions.gardenName;
            return this.baseInfoInterface.getList(conditions).then(res=>{
                let totalItems = res.headers()['x-record-count'];
                let gardenCount = res.headers()['garden-count'];
                callback(res.data,totalItems,gardenCount);
            });
        }
    }





    getMoreSearch() {
        this.ngDialog.open({
            closeByDocument: false,
            className: 'bdp layer_fixed',
            template: require('../../../components/moveSearch/moveSearch.html'),
            plain: true,
            controller: 'moveMoreSearchCtrl',
            controllerAs: 'moveMoreSearch',
            scope: this.$scope,
            onOpenCallback: () => {
                this.condition.keywords = '';
                this.$scope.$broadcast('userTitles',{
                    titles:this.userTitles,
                    condition:this.condition
                });
            }
        })
    }
    addBasic(){
        this.ngDialog.open({
            disableAnimation: true,
            closeByDocument: false,
            className: 'bdp layer_fixed_small',
            template: require('../../../components/addBasic/addBasic.html'),
            plain: true,
            controller: 'addBasicCtrl',
            controllerAs: 'addBasic',
            scope: this.$scope,
            onOpenCallback: () => {
                this.$scope.$broadcast('module',{
                    moduleCode:this.moduleCode,
                    couldDownloadTemplate : this.couldDownloadTemplate
                });
            }
        })
    }

    export(){
        this.baseInfoInterface.export(this.condition);
    }


    goDetailPage(id){
        this.$state.go('logistics.basicInfo',{moduleCode:this.moduleCode,id:id});
    }

    rightTrMouseOver(id){
        let trLeft = $('tr[data-id='+id+']');
        trLeft.addClass('selectTrClass');
        let trRightArr = $('tr[pid='+id+']');
        trRightArr.addClass('selectTrClass')
    }
    rightTrMouseLeave(id){
        let trLeft = $('tr[data-id='+id+']');
        trLeft.removeClass('selectTrClass');
        let trRightArr = $('tr[pid='+id+']');
        trRightArr.removeClass('selectTrClass')
    }

    leftTrMouseOver(id){
        let trLeft = $('tr[data-id='+id+']');
        trLeft.addClass('selectTrClass');
        let trRightArr = $('tr[pid='+id+']');
        trRightArr.addClass('selectTrClass')
    }

    leftTrMouseLeave(id){
        let trLeft = $('tr[data-id='+id+']');
        trLeft.removeClass('selectTrClass');
        let trRightArr = $('tr[pid='+id+']');
        trRightArr.removeClass('selectTrClass')
    }
}
listCtrl.$inject = ['ngDialog','$scope','$stateParams','baseInfoInterface','$state','$sessionStorage','lwGardenService','$compile'];
