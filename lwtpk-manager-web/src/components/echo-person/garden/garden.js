/**
 * @author hejialin
 * @desc 园区选择指令
 */
class gardenCtrl {
    constructor(gardenService, departmentService, accountService,$scope) {
        this.$scope = $scope;
        this.gardenService = gardenService;
        this.departmentService = departmentService;
        this.accountService = accountService;
        this.gardenList();
        this.echoIds = [];
        this.searchSelectedIds = [];
        this.initWatch();//searchSelectedIds[0]
    }

    /**
     * 监听选中变化
     */
    initWatch(){
        this.$scope.$watch('garden.selectedGardenId',gardenId=>{
            if(gardenId){
                this.getDepartmentList(null,gardenId);
            }else{
                this.$scope.department.departmentList = [];
                this.personList = [];
            }
        });
    }

    /**
     * 清空搜索框
     */
    removeKeywords() {
        this.keywords = '';
    }

    /**
     * 筛选园区
     */
    filterGarden(data, address, type) {
        let provinceIds = address.provinceIds;
        let echoIds = this.echoIds;
        let cityIds = address.cityIds;
        let districtIds = address.districtIds;
        let typeIds = type.ids, flag = false;
        flag = !(!echoIds[0]&&!provinceIds[0]&&!typeIds[0])&&
            (!echoIds[0]||echoIds.indexOf(data.id)>-1)&&
            (!districtIds[0]||districtIds.indexOf(data.districtId) > -1) &&
            (!cityIds[0]||cityIds.indexOf(data.cityId) > -1 )&&
            (!provinceIds[0]||provinceIds.indexOf(data.provinceId) > -1)&&
            (!typeIds[0]||typeIds.indexOf(data.gardenTypeId) > -1) &&
            (!this.keywords || data.name.indexOf(this.keywords) > -1);
        let index = this.searchSelectedIds.indexOf(data.id);
        if(echoIds[0]&&!this.selectedGardenId&&this.searchSelectedIds[0]){
            this.selectedGardenId=this.searchSelectedIds[0];
        }
        if (flag && index < 0) {
            this.searchSelectedIds.push(data.id);
        } else if (!flag && index > -1) {
            this.searchSelectedIds.splice(index, 1);
            if(data.id==this.selectedGardenId){
                this.selectedGardenId = null;
            }
        }
        return flag;
    }

    /**
     * 获取所有园区
     */
    gardenList() {
        this.gardenService.getSelectGardenList(false,res => {
            this.gardenList = res.data;
        })
    }
    
    /**
     * 获取对应组织结构
     * @param event
     * @param id
     */
    getDepartmentList(event, id) {
        this.selectedGardenId = id;
        if (id&&(!event||event.target.checked)) {
            this.departmentService.getDepartmentByGardenId(id, res => {
                if(!event){
                    this.echoDepartment(res.data);
                }else{
                    this.$scope.department.departmentList = res.data;
                }
            });
            this.accountService.getAccountByGardenId(id, res => {
                this.personList = res.data;
            });
        }
    }

    /**
     * 回显部门
     * @param departmentList
     */
    echoDepartment(departmentList){
        this.$scope.$watch('person.departmentIds',departmentIds=>{
            if(departmentIds&&departmentIds[0]){
                let echoIds = departmentIds;
                departmentList.forEach(department=>{
                    if(echoIds.indexOf(department.id)>-1){
                        department.checked = true;
                    }
                });
                this.$scope.department.departmentList = departmentList;
            }
        });
    }
}
gardenCtrl.$inject = ['lwGardenService', 'lwDepartmentService', 'lwAccountService','$scope'];

export default class selectGardenList {
    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.template = `
            <div class="select-garden garden-content-middle">
                <div class="content-bar">
                    <input class="garden-input" type="text" placeholder="搜索" ng-model="garden.keywords">
                    <span class="garden-delete personIconfont icon-remove" ng-show="garden.keywords" ng-click="garden.removeKeywords()"></span>
                    <span class="garden-search personIconfont icon-search" ng-show="!garden.keywords"></span>
                </div>
                <!--<span ng-init="garden.getDepartmentList(null,garden.searchSelectedIds[0])" ng-if="garden.searchSelectedIds[0]"></span>-->
                <div class="garden-list" style="height: 393px;margin-top: 0">
                    <ul>
                        <li ng-repeat="data in garden.gardenList" ng-show="garden.filterGarden(data,address,type)">
                            <label>
                                <input class="garden-check" type="radio" name="gardenList" ng-checked="data.id == garden.echoIds[0]"
                                       ng-click="garden.getDepartmentList($event,data.id)">
                                <span>{{data.name}}</span>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        `;
        this.controller = gardenCtrl;
        this.controllerAs = 'garden';
    }
}
