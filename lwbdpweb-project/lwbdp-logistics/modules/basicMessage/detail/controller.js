import './detail.css'
export default class basicDetailCtrl {
    constructor(baseInfoInterface,baseInfoReadInterface,$stateParams,dialogsManager,$sessionStorage) {
        this.baseInfoInterface = baseInfoInterface;
        this.baseInfoReadInterface = baseInfoReadInterface;
        this.$stateParams = $stateParams;
        this.dialogsManager = dialogsManager;
        this.$sessionStorage = $sessionStorage;
        this.init();
    }

    init() {
        this.userTitles = [];
        this.systemTitles = [];
        this.model = {};
        this.tempModel = {};
        this.id =  this.$stateParams.id;
        this.moduleCode =  this.$stateParams.moduleCode;
        this.accountId = this.$sessionStorage.get('account').accountId;
        this.condition = {
            moduleCode:this.moduleCode
        };
        this.datas = [];
        this.isEdit = false;
        this.getInfo();
        this.getTitles();
        this.pageConfig();


    }

    updateReadStatus(){
        this.baseInfoReadInterface.updateReadStatus(this.id);
    }



    cancelEdit(){
        this.tempModel = angular.copy(this.model);
        this.isEdit = false;

    }


    toDelete(){
        this.dialogsManager.confirm({
            title: '删除提示',
            content: '确定要删除吗?',
            btn: ['是','否'],
            callback:[()=>{
                this.baseInfoInterface.delete(this.moduleCode,this.id).then(res=>{
                    this.dialogsManager.showMessage('删除成功',{className:'success'}); //消息类型有:成功success 错误error 警告warning
                    history.go(-1);
                })
            }]
        })
    }





    getTitles(){
        return this.baseInfoInterface.getTitles(this.moduleCode).then(res=>{
            this.titles = res.data;
            for(let title of res.data){
                if(!title.isSystem){
                    this.userTitles.push(title);
                }else{
                    this.systemTitles.push(title);
                }
            }
            this.tempTitles = angular.copy(this.userTitles);
        });

    }

    getInfo(){
        this.baseInfoInterface.getInfo(this.moduleCode,this.id).then((res)=>{
            this.model = res.data;
            console.log(this.model);
            if(!this.model.hasRead){
                this.updateReadStatus();
            }
            this.dataList = [];
            if(this.model.userTitleDataList){
                this.dataList.push(...this.model.userTitleDataList);
            }else{
                this.dataList.push(this.model);
            }
            this.tempModel = angular.copy(this.model);
            this.condition.gardenIds = this.model.gardenId;
            this.paginationConf.onChange(0, this.paginationConf.itemsPerPage);

        });
    }

    edit(){
        this.baseInfoInterface.edit(this.getSubmitData()).then((res)=>{
            this.model = angular.copy(this.tempModel);
            this.isEdit = false;
            this.dialogsManager.showMessage('修改成功!',{className:'success'});
        });
    }

    getSubmitData(){
        let submitData = {
            id:this.id,
            moduleCode:this.moduleCode,
            gardenId:this.condition.gardenIds
        }
        let i = 0;
        let list = []
        for(let name in this.tempModel){
            let data = {};
            data.name = name;
            data.value =this.tempModel[name];
            list.push(data);
        }
        submitData.list = list;
        return submitData;

    }


    pageConfig() {
        this.paginationConf = {
            onChange: (offset, size) => {
                this.getList(offset, size,this.condition, (datas,total) => {
                    this.datas = datas;
                    this.total = total || 0;
                    this.paginationConf.totalItems = total || 0;
                    this.systemTitleData = this.constructeSystemTitleData();
                    this.dataValueList = this.constructeDataTable();
                    console.log(this.dataValueList);
                })
            }
        }
    }

    constructeDataTable(){
        let dataValueList1 = [];
        this.datas.forEach((outerTrData)=>{
            if(!outerTrData.userTitleDataList){
                dataValueList1.push(outerTrData);
            }else{
                dataValueList1.push(...outerTrData.userTitleDataList);
            }
        });
        return dataValueList1;
    }

    constructeSystemTitleData(){
        let dataValueList2 = [];
        this.datas.forEach((outerTrData,index)=>{
            outerTrData.index = index;
            dataValueList2.push(outerTrData);
            if(outerTrData.userTitleDataList){
                let dataArr = new Array(outerTrData.userTitleDataList.length-1);
                for(let i= 0; i<outerTrData.userTitleDataList.length-1;i++){
                    dataArr[i] = {};
                    dataArr[i].id=outerTrData.id;
                }
                dataValueList2.push(...dataArr);
            }
        });
        return dataValueList2;
    }


    getList(offset,size,params,callback){
        let conditions = angular.copy(params);
        conditions.offset = offset;
        conditions.size = size;
        return this.baseInfoInterface.getList(conditions).then(res=>{
            let totalItems = res.headers()['x-record-count'];
            callback(res.data,totalItems);
        });
    }

    toEditList(data){
        if(data.pid){
            this.systemTitleData.forEach((e)=>{
                if(e && (e.id == data.pid) && e.name){
                    this.model = e;
                }
            });
        } else {
            this.model = data;
        }
        this.dataList = [];
        if(this.model.userTitleDataList){
            this.dataList.push(...this.model.userTitleDataList);
        }else{
            this.dataList.push(this.model);
        }
        this.id = this.model.id;
        this.tempModel = angular.copy(this.model);
    }

    export(){
        let conditionCopy = angular.copy(this.condition);
        conditionCopy.isDetailList = true;
        this.baseInfoInterface.export(conditionCopy);
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
basicDetailCtrl.$inject = ['baseInfoInterface','baseInfoReadInterface','$stateParams','dialogsManager','$sessionStorage'];
