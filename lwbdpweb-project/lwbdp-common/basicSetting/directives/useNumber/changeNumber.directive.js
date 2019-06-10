import changeNumber from './changeNumber.html';
export default function updateLogDirective(WorkflowConfigInterface) {
    return {
        restrict: "AE",
        replace: true,
        template: changeNumber,
        scope: {
            change: "=",
            closeClick: "&",
            data : "="
        },
        link($scope) {
            $scope.id = $scope.data.id;
            $scope.name = $scope.data.name;
            $scope.keyWord = '';
            WorkflowConfigInterface.getConfigGardens($scope.id).then(res=>{
                $scope.isSearch = false;
                 $scope.gardens= res.data;   
                 $scope.showGardens = res.data;
            })
            $scope.clickEvent = function() {
                $scope.closeClick();
            }
            $scope.search = function(){
                if($scope.keyWord && $scope.keyWord !=''){
                    $scope.isSearch= true;
                    let arr = [];
                    for(var item of $scope.gardens){
                        if(item.gardenName.indexOf($scope.keyWord) != -1){
                            arr.push(item);
                        }
                    }
                    $scope.showGardens = arr;
                }else{
                     $scope.isSearch= false;
                    $scope.showGardens = $scope.gardens;
                }
            }
        }
    }
}
updateLogDirective.$inject=['WorkflowConfigInterface'];