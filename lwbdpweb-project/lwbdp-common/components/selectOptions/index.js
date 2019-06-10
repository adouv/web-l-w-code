import './style.css';

export class selectOptions {
    constructor($compile) {
        this.$compile = $compile;
        this.replace = true;
        this.transclude = true;
        this.required = '^ngModel';
        this.scope = {
            ngModel: '=',
            repeatItems: '@',
            change: '&',
            itemKey:'@',
            required: '=',
            defaultItem:'@',
            name:'@',
            disabled:'@',
            ngDisabled:'=',
            isBoolean:'@'
        };
        this.template = `
        <div class="select-options" ng-class="{'disabled':itemDisabled}">
            <input type="text" style="display: none" ng-required="itemRequired" name="{{name}}" ng-model="ngModel">
            <a class="select-header" href="javascript:void(0);" ng-click="toggleList()">{{defaultItem||'请选择'}}</a>
            <ul class="options-wrapper" ng-show="itemShow"></ul>
        </div>`;
    }

    link(scope, elem, attrs,$controller,$transclude) {
        let selectOptions = elem.children();
        let optsWrapper = selectOptions.eq(2);
        if (attrs.$attr.hasOwnProperty('required')) {
            if (!attrs.required || attrs.required === 'true') {
                scope.itemRequired = true;
            } else if (attrs.required !== 'false' && attrs.required) {
                scope.itemRequired = scope.required;
            }
        }

        if(attrs.$attr.hasOwnProperty('disabled')){
            scope.itemDisabled = true;
        }else if(scope.ngDisabled){
            scope.itemDisabled = true;
        }

        let contain = (wrapElem, targetElem)=>{
            while (targetElem.parentElement) {
                if (wrapElem==targetElem.parentElement) {
                    return true;
                }
                targetElem = targetElem.parentElement;
            }
            return false;
        };

        let close = event => {
            let target = event.target;
            if (!contain(elem[0],target)) {
                scope.itemShow = false;
                scope.$apply();
                angular.element(document.body).unbind('click', close);
            }
        };

        scope.toggleList = () => {
            if(!scope.itemDisabled){
                scope.itemShow = !scope.itemShow;
                selectOptions.eq(0).removeClass('error');
                angular.element(document.body).bind('click', close);
            }
        };

        let echoItemHtml = (echoItemElem)=>{
            let header = selectOptions.eq(1);
            header.empty();
            header.append(angular.copy(echoItemElem.firstElementChild));
            if(scope.isBoolean==='true'){
                scope.ngModel = echoItemElem.dataset.value==='true';
            }else{
                scope.ngModel = echoItemElem.dataset.value;
            }
            scope.itemShow = false;
            scope.$apply();
        };

        optsWrapper.bind('click', event => {
            let target = event.target,itemElems = optsWrapper.children();
            for (let i=0,len=itemElems.length;i<len;i++) {
                let targetItem = itemElems[i];
                if (contain(targetItem,target)) {
                    echoItemHtml(targetItem);
                    scope.change && scope.change({$item:scope.itemList,index:i});
                }
            }

        });

        let selectedItemKey = (echoKey)=>{
            let itemElemList = optsWrapper.children();
            for(let i=0,len=itemElemList.length;i<len;i++){
                let itemKey = itemElemList[i].dataset.value;

                if(itemKey==echoKey){
                    echoItemHtml(itemElemList[i]);
                }
            }
        };

        let watchModel = ()=>{
            scope.$watch('ngModel',echoKey=>{
                if(echoKey){
                    let itemElemList = null;
                    let itemInter = setInterval(()=>{
                        itemElemList = optsWrapper.children();
                        if(itemElemList[0]){
                            clearInterval(itemInter);
                            selectedItemKey(echoKey);
                        }
                    },50)
                }
            })
        };

        $transclude((transuldElem,$scope)=>{
            let transcludeHtml='';
            for(let i=0,len=transuldElem.length;i<len;i++){
                let item = transuldElem.eq(i);
                if(item[0].outerHTML){
                    transcludeHtml += item[0].outerHTML;
                }else if(item.text()){
                    transcludeHtml += item.text();
                }
            }
            let itemAs = scope.repeatItems.split(' ')[0];
            const repeatHtml = `<li ng-repeat="${scope.repeatItems}" data-value="{{${itemAs+'.'+scope.itemKey}}}">
                                    <a href="javascript:void(0);" ng-class="{'selected':${itemAs+'.'+scope.itemKey}==${attrs.ngModel}}">${transcludeHtml}</a>
                                </li>`;
            let itemElem = this.$compile(repeatHtml)($scope);
            optsWrapper.append(itemElem);
            watchModel();
        });


    }
}
