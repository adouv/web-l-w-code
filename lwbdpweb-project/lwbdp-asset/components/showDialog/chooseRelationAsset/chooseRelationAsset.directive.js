import chooseRelationAsset from "./chooseRelationAsset.html";
export default function chooseRelationAssetDirective() {
    return {
        restrict: "AE",
        replace: true,
        scope: {
            show:"=",
            list: "=",
            echoIds:'=',
            selectedIds:'@',
            echoNames: "=",
            echoNamesArr:"="
        },
        template: chooseRelationAsset,
        link(scope){
            scope.selectedIds = eval(scope.selectedIds);
            scope.echoIds = scope.echoIds || [];
            scope.filteredList = [];
            filterHasSelectedIds();
            if(angular.isString(scope.echoIds)){
                scope.echoIds = scope.echoIds.split(',')
            }
            function filterHasSelectedIds(){
                scope.list.forEach((data)=>{
                    if(scope.selectedIds.indexOf(data.assetNo)<0||scope.echoIds.indexOf(data.assetNo)>-1){
                        scope.filteredList.push(data);
                    }
                })
            }



            const oldEchoIds = scope.echoIds || [];
            let paramsInit = (echoIds)=>{
                echoIds = angular.copy(echoIds)||[];
                if(angular.isString(echoIds)){
                    return echoIds.split(',');
                }
                return echoIds;
            };
            let echoIds = paramsInit(scope.echoIds);
            scope.clickCheckbox = function ($event, id) {
                let checked = $event.target.checked;
                let index = echoIds.indexOf(id);
                if (checked && index < 0) {
                    echoIds.push(id);
                    scope.echoIds.push(id);
                } else if (!checked && index > -1) {
                    echoIds.splice(index,1);
                    scope.echoIds.splice(index,1);
                }
            };
            scope.selectAll = function($event){
                let checked = $event.target.checked;
                if(checked){
                    scope.filteredList.forEach((asset)=>{
                        if(!scope.echoIds){
                            scope.echoIds = [];
                        }
                        if(scope.echoIds.indexOf(asset.assetNo)<0){
                            scope.echoIds.push(asset.assetNo);
                            echoIds.push(asset.assetNo);
                        }
                    })
                }else {
                    scope.echoIds = [];
                    echoIds = [];
                }
            };

            scope.cancel = function () {
                scope.show = false;
                scope.echoIds = oldEchoIds;
            };
            
            scope.sure = function () {
                let echoNames = [];
                for(let data of scope.list){
                    if(echoIds.indexOf(data.assetNo)>-1){
                        echoNames.push(data.assetName);    
                    }
                }
                scope.echoIds = echoIds.toString();
                scope.echoNames = echoNames.length>0?echoNames.join(';')+';':'';
                scope.echoNamesArr = echoNames;
                scope.show = false;
            }
        }
    }
}
