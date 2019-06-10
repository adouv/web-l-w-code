/**
 * @Author hejialin
 * @Description 选择人插件
 */
import './style.css';
import '../fonts/iconfont.css';
import angular from 'angular';
import ngDialog from 'ng-dialog';
import 'jquery/jquery';
import 'ztree/js/jquery.ztree.all.min';
import {addressList,multipleSelect} from './address/address';
import selectGardenType from './type/type';
import selectGardenList from './garden/garden';
import selectDepartmentTree from './department/department';
import selectPersonList from './person/person';
import echoPerson from '../echo-person';

class SelectPerson {
    constructor(ngDialog,$rootScope) {
        this.ngDialog = ngDialog;
        this.$scope = $rootScope.$new();
    }

    /**
     * 初始化参数
     * @param options
     * @param callback
     * @return {{multiple: boolean, scope: (*|Object)}}
     */
    initParams(options,callback){
        let opts = {
            single:false, //默认是多选
            scope:this.$scope,
            ids:null //人员回显
        };
        angular.extend(opts,options);
        this.sanitizeEchoIds(opts);
        opts.scope.callback = callback;
        return opts;
    }

    /**
     * 处理回显ids
     * @param opts
     */
    sanitizeEchoIds(opts){
        if(opts.ids&&(angular.isArray(opts.ids)||angular.isString(opts.ids)||angular.isNumber(opts.ids))){
            opts.scope.personIds = opts.ids.toString();
        }
    }
    
    /**
     * 打开选人弹窗
     */
    dialog(options,callback) {
        let opts = this.initParams(options,callback);
        this.$scope.personSuccess = this.personSuccess;
        this.ngDialog.open({
            scope:opts.scope,
            className: "lw-select-person",
            template: `
            <div class="garden-header">
                <h5>请选择人员</h5>
            </div>
            <select-person single="${opts.single}" person-ids="personIds" person-cancel="closeThisDialog()" person-success="personSuccess($person)">
            </select-person>`,
            plain: true
        })
    }

    /**
     * 执行回调
     * @param callback
     */
    personSuccess(person){
        this.callback&&this.callback(person);
        this.closeThisDialog();
    }
}
SelectPerson.$inject = ['ngDialog','$rootScope'];

class selectPerson{
    constructor(){
        this.restrict = 'E';
        this.replace = true;
        this.scope = {
            personIds:'=',
            personSuccess:'&',
            personCancel:'&'
        };
        this.template = `
        <div class="select-person-content">
            <select-address-list></select-address-list>
            <div class="garden-content">
                <div class="select-wrap">
                    <select-garden-type></select-garden-type>
                    <select-garden-list></select-garden-list>
                    <select-department-tree></select-department-tree>
                </div>
                <select-person-list></select-person-list>
            </div>
            <div class="garden-footer">
                <button class="garden-btn cancel" ng-click="personCancel()">取消</button>
                <button class="garden-btn sure" ng-click="sure()">确定</button>
            </div>
        </div>`;
    }

    controller(){}

    link(scope,elem,attrs){
        let person = scope.person;
        scope.multiple = !(attrs.single=='true');
        scope.$watch('personIds',ids=>{
            if(ids){
                if(angular.isString(ids)){
                    ids = ids.split(',');
                }
                if(ids.length > 0){
                    person.getAccountList(ids);
                    person.getGardenEchoIds(ids);
                }
            }
        });
        scope.sure = () => {
            let parentScope = scope.$parent;
            parentScope.$person = parentScope.$person||{};
            parentScope.$person.ids = person.selectedIds;
            parentScope.$person.personList = person.selectedPersonList;
            scope.personSuccess();
        }
    }
}

export default angular.module('lw.select.person',[ngDialog,echoPerson])
    .service('SelectPerson',SelectPerson)
    .directive('selectPerson',() => new selectPerson())
    .directive('selectAddressList',() => new addressList())
    .directive('multipleSelect',() => new multipleSelect())
    .directive('selectGardenType',(lwDictionaryService) => new selectGardenType(lwDictionaryService))
    .directive('selectGardenList',() => new selectGardenList())
    .directive('selectDepartmentTree',($timeout) => new selectDepartmentTree($timeout))
    .directive('selectPersonList',() => new selectPersonList())
    .name