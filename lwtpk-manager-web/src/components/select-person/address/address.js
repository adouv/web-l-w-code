/**
 * @Author hejialin
 * @Description 省市区下拉列表指令
 */
import './address.css';

class addressCtrl{
    constructor(addressService,$scope){
        this.$scope = $scope;
        this.address = addressService;
        this.provinceIds = [];
        this.provinceList = [];
        this.cityIds = [];
        this.cityList = [];
        this.districtIds = [];
        this.districtList = [];
        this.getProvinceList();
    }
    
    /**
     * 获取省份列表
     */
    getProvinceList(){
        this.address.getProvinceList(res=>{
            this.provinceList = res.data;
        })
    }

    /**
     * 获取城市列表
     */
    getCityList(){
        this.address.getCityListByProvince(this.provinceIds,res=>{
            this.cityList = res.data;
        })
    }

    /**
     * 获取区县列表
     */
    getDistrict(){
        this.address.getDistrictByCity(this.cityIds,res=>{
            this.districtList = res.data;
        })
    }

}
addressCtrl.$inject = ['lwAddressService','$scope'];



export class addressList{
    constructor(){
        this.restrict = 'E';
        this.replace = true;
        this.controller = addressCtrl;
        this.controllerAs = 'address';
        this.template = `
            <div class="address-wrap">
                <span class="address-title">园区所在行政区域：</span>
                <multiple-select ng-model="address.provinceIds" 
                    loop-key="name" 
                    loop-value="id" 
                    loop-change="address.getCityList()"
                    loop-list="address.provinceList"
                    show-title="请选择省份">
                </multiple-select>
                <multiple-select ng-model="address.cityIds" 
                    loop-key="name" 
                    loop-value="id" 
                    loop-change="address.getDistrict()"
                    loop-list="address.cityList"
                    show-title="请选择城市">
                </multiple-select>
                <multiple-select ng-model="address.districtIds" 
                    loop-key="name" 
                    loop-value="id" 
                    loop-list="address.districtList"
                    show-title="请选择区县">
                </multiple-select>
            </div>
        `;
    }
}

export class multipleSelect{
    constructor(){
        this.restrict = 'E';
        this.replace = true;
        this.require = 'ngModel';
        this.scope = {
            loopList:'=',
            loopChange:'&',
            ngModel:'='
        };
        this.template = `
            <div class="multiple-select">
                <div class="echo-wrap" title="{{keyList}}">{{keyList||showTitle||'请选择'}}</div>
                <div class="multiple-wrap" ng-show="isShowList">
                    <ul class="drop-down-wrap garden-auto">
                        <li ng-if="!loopList||!loopList[0]">请选择</li>
                        <li ng-repeat="data in loopList">
                            <label>
                                <input class="checkbox-class" type="checkbox" ng-click="checked($event,$index)" ng-checked="selectedList.indexOf(data[loopValue])>-1">
                                <span>{{data[loopKey]}}</span>
                            </label>
                        </li>
                    </ul>
                    <div class="sure-wrap">
                        <a href="javascript:void(0);" class="iconfont icon-error" ng-class="{'active':selectedList.length}" ng-click="cancelAllCheckBox()"></a>
                        <a href="javascript:void(0);" class="iconfont icon-success active" ng-click="sureSelected()"></a>
                    </div>
                </div>
            </div>`;
    }

    link(scope,elem,attrs,ngModel){
        scope.loopKey = attrs.loopKey;
        scope.loopValue = attrs.loopValue;
        scope.selectedList = [];
        scope.showTitle = attrs.showTitle;
        /**
         * 点击其他
         */
        angular.element(document).bind('click',(e)=>{
            if(scope.selectShow){
                scope.selectShow = false;
                scope.isShowList = true;
            }else if(scope.isShowList){
                scope.isShowList = false;
                scope.selectedList = angular.copy(ngModel.$modelValue);
            }
            scope.$apply();
        });

        scope.$watch('loopList',(newList,oldList)=>{
            let selecteds = [];
            if(oldList&&oldList[0]){
                newList.forEach(data=>{
                    if(scope.selectedList.indexOf(data[scope.loopValue])>-1){
                        selecteds.push(data[scope.loopValue]);
                    }
                });
                setModelValue(selecteds);
                if(attrs.loopChange){
                    scope.loopChange();
                }
            }
        });
        /**
         * 点击回显条触发的事件
         */
        elem.children().eq(0).on('click',(e)=>{
            scope.selectShow = !scope.isShowList;
        });

        /**
         * 点击多选下拉列表触发的事件
         */
        elem.children().eq(1).on('click',(e)=>{
            e = e || window.event;
            let target = e.target || e.srcElement;
            scope.selectShow = target.className.indexOf('success')<0;
        });
        
        /**
         * 复选框操作
         * @param event
         * @param index
         */
        scope.checked = (event,index)=>{
            let isChecked = event.target.checked;
            let value = scope.loopList[index][scope.loopValue];
            index = scope.selectedList.indexOf(value);
            if(isChecked&&index<0){
                scope.selectedList.push(value);
            }else if(!isChecked&&index>-1){
                scope.selectedList.splice(index,1);
            }
        };

        /**
         * 确认选中操作
         */
        scope.sureSelected = () => {
            setModelValue(scope.selectedList);
            scope.selectedList = [];
            if(attrs.loopChange){
                scope.loopChange();
            }
        };

        /**
         * 取消复选框
         */
        scope.cancelAllCheckBox = () => {
            if(scope.selectedList&&scope.selectedList[0]){
                scope.selectedList = [];
            }
        };

        /**
         * 模型设值
         * @param value
         */
        let setModelValue = value=>{
            let keyList = [];
            scope.loopList = scope.loopList||[];
            scope.loopList.forEach(data=>{
                if(scope.selectedList.indexOf(data[scope.loopValue])>-1){
                    keyList.push(data[scope.loopKey]);
                }
            });
            scope.keyList = keyList.join('；');
            let model = ngModel.$modelValue;
            if(angular.isString(model)){
                ngModel.$$ngModelSet(scope.$parent,value.toString());
            }else{
                ngModel.$$ngModelSet(scope.$parent,angular.copy(value));
            }
        }
    }
}
