/**
 * @Author hejialin
 * @Description 选择数据
 */
import './style.css';
class selectItemCtrl{
    constructor($scope){
        this.$scope = $scope;
        this.selected = {
            ids:this.$scope.eachIds||[]
        };
    }

    checked(event,id){
        let checked = event.target.checked;
        let index = this.selected.ids.indexOf(id);
        if(checked&&index<0){
            this.selected.ids.push(id);
        }else if(!checked&&index>-1){
            this.selected.ids.splice(index,1);
        }
    }
    
    remove(id){
        let index = this.selected.ids.indexOf(id);
        this.selected.ids.splice(index,1);
    }
    
    sure(){
        let selectedList = [],selectedNames = [];
        this.$scope.itemList.forEach(item=>{
            if(this.selected.ids.indexOf(item[this.$scope.idField])>-1){
                selectedNames.push(item[this.$scope.nameField]);
                selectedList.push(item);
            }
        });
        this.selected.names = selectedNames;
        this.selected.list = selectedList;
        this.$scope.sureSuccess({$selected:this.selected});
        this.$scope.$parent.closeThisDialog();
    }
}
selectItemCtrl.$inject = ['$scope'];

class selectItem{
    constructor(){
        this.restrict = "EA";
        this.replace = true;
        this.scope = {
            eachIds:'=',
            itemList:'=',
            sureSuccess:'&'
        };
        this.template = require('./index.html');
        this.controller = selectItemCtrl;
        this.controllerAs = 'item';
    }
    link(scope,elem,attrs){
        scope.title = attrs.title;
        scope.idField = attrs.idField;
        scope.nameField = attrs.nameField;
        scope.selectItemTitle = attrs.selectItemTitle;
    }
}
class SelectItemService{
    constructor(ngDialog,$rootScope){
        this.ngDialog = ngDialog;
        this.$rootScope = $rootScope;
    }
    
    open(params){
        let scope = this.$rootScope.$new();
        params = angular.copy(params);
        scope.eachIds = angular.isString(params.eachIds)?params.eachIds.split(','):params.eachIds||[];
        scope.itemList = params.itemList;
        scope.callback = params.callback;
        this.ngDialog.open({
            closeByDocument: false,
            className: 'lw-bdp select-item purchase '+(params.className||''),
            template: `<select-item item-list="itemList" each-ids="eachIds"
                            sure-success="callback($selected)" title="${params.title}" 
                            select-item-title="${params.selectItemTitle}"
                            id-field="${params.idField}" name-field="${params.nameField}">
                       </select-item>`,
            plain: true,
            scope:scope
        })
    }
}
SelectItemService.$inject = ['ngDialog','$rootScope'];
export default angular.module('selectItem',[])
    .directive('selectItem',()=>new selectItem())
    .service('SelectItemService',SelectItemService)
    .name;