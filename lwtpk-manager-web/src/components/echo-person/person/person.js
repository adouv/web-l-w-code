/**
 * @author hejialin
 * @desc 人员操作指令
 */
import './person.css';

class echoPersonCtrl{
    constructor($scope,lwAccountService,lwGardenService){
        this.$scope = $scope;
        this.selectedIds = [];
        this.searchSelectedIds = [];
        this.selectedPersonList = [];
        this.departmentIds = [];
        this.searchSelectedPersonList = [];
        this.accountService = lwAccountService;
        this.gardenService = lwGardenService;
    }

    /**
     * 清空未选人员搜索框
     */
    removeKeywords(){
        this.keywords = '';
    }

    /**
     * 清空选中人员搜索框
     */
    removeSelectedKeyword(){
        this.selectedKeywords = '';
    }

    /**
     * 回显用户
     */
    getAccountList(ids){
        if(ids&&ids[0]){
            this.accountService.getAccountByIds(ids,res=>{
                this.personList = res.data;
                res.data.forEach(account=>{
                    this.selectedIds.push(account.id);
                });
            })
        }
    }

    /**
     * 回显部门
     * @param account
     */
    getDepartmentIds(){
        let departmentIds = [];
        let personList = this.searchSelectedPersonList;
        if(personList){
            personList.forEach(account=>{
                let departmentId = account.pId.split(',');
                departmentId.forEach(id=>{
                    if(departmentIds.indexOf(id)<0){
                        departmentIds.push(id);
                    }
                })
            });
            this.departmentIds = departmentIds;
        }
    }
    
    /**
     * 筛选人员
     * @param data
     * @param department
     * @return {boolean}
     */
    filterPerson(data,department){
        let departmentIds = department.ids;
        if(data.pId){
            let ids = data.pId.split(','),
                flag=!this.keywords||data.name.indexOf(this.keywords)>-1;
            if(flag&&departmentIds&&departmentIds[0]){
                let deptFlag = false;
                let lg = ids.forEach(id=>{
                    if(departmentIds.indexOf(id)>-1){
                        deptFlag = true;
                        return;
                    }
                });
                this.isShow(flag&&deptFlag,data);
                return flag&&deptFlag;
            }
            this.isShow(flag,data);
            return flag;
        }
        return true;
    }

    /**
     * 构造显示人员ID列表
     * @param flag
     * @param id
     */
    isShow(flag,data){
        let index = this.searchSelectedIds.indexOf(data.id);
        if(flag&&index<0){
            this.searchSelectedIds.push(data.id);
            this.searchSelectedPersonList.push(data);
            this.getDepartmentIds();
        }else if(!flag&&index>-1){
            this.searchSelectedIds.splice(index,1);
            this.searchSelectedPersonList.splice(index,1);
        }
    }

    /**
     * 
     * @param event
     * @param id
     */
    checked(event,data){
        if(this.$scope.multiple){
            let checked = event.target.checked;
            this.selectedIds = this.selectedIds||[]
            let index = this.selectedIds.indexOf(data.id);
            if(checked&&index<0){
                this.selectedIds.push(data.id);
                this.selectedPersonList.push(data);
            }else if(!checked&&index>-1){
                this.selectedIds.splice(index,1);
                this.selectedPersonList.splice(index,1);
            }
        }else{
            this.selectedIds = [data.id];
            this.selectedPersonList = [data];
        }
    }

    /**
     * 选中所有人员
     */
    selectedAll(){
        if(this.$scope.multiple){
            this.selectedIds = angular.copy(this.searchSelectedIds);
            this.selectedPersonList = angular.copy(this.searchSelectedPersonList);
        }
    }

    /**
     * 移除指定的人员
     * @param id
     */
    removeById(id){
        let index = this.selectedIds.indexOf(id);
        this.selectedIds.splice(index,1);
        this.selectedPersonList.splice(index,1);
    };

    /**
     * 移除所有人员
     */
    removeAll(){
        if(this.$scope.multiple){
            this.selectedIds = [];
            this.selectedPersonList = [];
        }
    }

    /**
     * 通过账户ID回显对应园区
     * @param ids
     */
    getGardenEchoIds(ids){
        this.gardenService.getGardenListByAccount(ids,res=>{
            let gardenIds = [],typeIds = [];
            res.data.forEach(garden=>{
                gardenIds.push(garden.gardenId);
                garden.gardenTypeId&&typeIds.push(garden.gardenTypeId);
            });
            this.$scope.garden.echoIds = gardenIds;
            this.setGardenTypeChecked(typeIds);
        });
    }

    /**
     * 设置园区类型选中（回显园区类型）
     */
    setGardenTypeChecked(typeIds){
        this.$scope.$watch('gardenTypeList',newTypes=>{
            if(newTypes&&newTypes[0]){
                let typeList = angular.copy(newTypes);
                typeList.forEach(type=>{
                    if(typeIds.indexOf(type.id)>-1){
                        type.checked = true;
                    }
                });
                this.$scope.type.ids = typeIds;
                this.$scope.type.typeList = typeList;
            } 
        });
    }
    
    filterResult(data){
        return !this.selectedKeywords||data.name.indexOf(this.selectedKeywords)>-1;
    }
}
echoPersonCtrl.$inject = ['$scope','lwAccountService','lwGardenService'];

export default class echoPersonList {
    
    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.require = '^echoPerson';
        this.template = require('./person.html');
        this.controller = echoPersonCtrl;
        this.controllerAs = 'person';
    }
}
