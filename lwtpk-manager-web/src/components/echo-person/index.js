/**
 * @Author hejialin
 * @Description 选择人插件
 */
import angular from 'angular';
import ngDialog from 'ng-dialog';
import echoGardenList from './garden/garden';
import echoPersonList from './person/person';
class EchoPerson {
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
            <select-person single="${opts.single}" person-ids="personIds">
            </select-person>`,
            plain: true
        })
    }
}
EchoPerson.$inject = ['ngDialog','$rootScope'];

class echoPerson{
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
                <div class="select-wrap" style="width: 680px;">
                    <select-garden-type style="width: 220px;"></select-garden-type>
                    <echo-garden-list style="width: 220px;"></echo-garden-list>
                    <select-department-tree style="width: 220px;"></select-department-tree>
                </div>
                <echo-person-list style="width: 170px;"></echo-person-list>
            </div>
            <div class="garden-footer">
                <button class="garden-btn sure" ng-click="closeThisDialog()">确定</button>
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
        scope.closeThisDialog = scope.$parent.closeThisDialog;
    }
}

export default angular.module('lw.echo.person',[ngDialog])
    .service('EchoPerson',EchoPerson)
    .directive('echoPerson',() => new echoPerson())
    .directive('echoPersonList',() => new echoPersonList())
    .directive('echoGardenList',() => new echoGardenList())
    .name